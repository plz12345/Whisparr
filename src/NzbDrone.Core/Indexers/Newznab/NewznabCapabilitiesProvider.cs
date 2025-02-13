using System;
using System.Collections.Generic;
using System.Xml;
using System.Xml.Linq;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Indexers.Exceptions;

namespace NzbDrone.Core.Indexers.Newznab
{
    public interface INewznabCapabilitiesProvider
    {
        NewznabCapabilities GetCapabilities(NewznabSettings settings);
    }

    public class NewznabCapabilitiesProvider : INewznabCapabilitiesProvider
    {
        private readonly ICached<NewznabCapabilities> _capabilitiesCache;
        private readonly IHttpClient _httpClient;
        private readonly Logger _logger;

        public NewznabCapabilitiesProvider(ICacheManager cacheManager, IHttpClient httpClient, Logger logger)
        {
            _capabilitiesCache = cacheManager.GetCache<NewznabCapabilities>(GetType());
            _httpClient = httpClient;
            _logger = logger;
        }

        public NewznabCapabilities GetCapabilities(NewznabSettings indexerSettings)
        {
            var key = indexerSettings.ToJson();
            var capabilities = _capabilitiesCache.Get(key, () => FetchCapabilities(indexerSettings), TimeSpan.FromDays(7));

            return capabilities;
        }

        private NewznabCapabilities FetchCapabilities(NewznabSettings indexerSettings)
        {
            var capabilities = new NewznabCapabilities();

            if (indexerSettings.BaseUrl.IsNullOrWhiteSpace())
            {
                return capabilities;
            }

            var url = string.Format("{0}{1}?t=caps", indexerSettings.BaseUrl.TrimEnd('/'), indexerSettings.ApiPath.TrimEnd('/'));

            if (indexerSettings.ApiKey.IsNotNullOrWhiteSpace())
            {
                url += "&apikey=" + indexerSettings.ApiKey;
            }

            var request = new HttpRequest(url, HttpAccept.Rss);
            request.AllowAutoRedirect = true;

            HttpResponse response;

            try
            {
                response = _httpClient.Get(request);
            }
            catch (Exception ex)
            {
                _logger.Debug(ex, "Failed to get Newznab API capabilities from {0}", indexerSettings.BaseUrl);
                throw;
            }

            try
            {
                capabilities = ParseCapabilities(response);
            }
            catch (XmlException ex)
            {
                ex.WithData(response, 128 * 1024);
                _logger.Trace("Unexpected Response content ({0} bytes): {1}", response.ResponseData.Length, response.Content);
                _logger.Debug(ex, "Failed to parse newznab api capabilities for {0}", indexerSettings.BaseUrl);
                throw;
            }
            catch (ApiKeyException ex)
            {
                ex.WithData(response, 128 * 1024);
                _logger.Trace("Unexpected Response content ({0} bytes): {1}", response.ResponseData.Length, response.Content);
                _logger.Debug(ex, "Failed to parse newznab api capabilities for {0}, invalid API key", indexerSettings.BaseUrl);
                throw;
            }
            catch (Exception ex)
            {
                ex.WithData(response, 128 * 1024);
                _logger.Trace("Unexpected Response content ({0} bytes): {1}", response.ResponseData.Length, response.Content);
                _logger.Error(ex, "Failed to determine newznab api capabilities for {0}, using the defaults instead till Whisparr restarts", indexerSettings.BaseUrl);
            }

            return capabilities;
        }

        private NewznabCapabilities ParseCapabilities(HttpResponse response)
        {
            var capabilities = new NewznabCapabilities();

            var xDoc = XDocument.Parse(response.Content);

            if (xDoc == null)
            {
                throw new XmlException("Invalid XML").WithData(response);
            }

            NewznabRssParser.CheckError(xDoc, new IndexerResponse(new IndexerRequest(response.Request), response));

            var xmlRoot = xDoc.Element("caps");

            if (xmlRoot == null)
            {
                throw new XmlException("Unexpected XML").WithData(response);
            }

            var xmlLimits = xmlRoot.Element("limits");
            if (xmlLimits != null)
            {
                capabilities.DefaultPageSize = int.Parse(xmlLimits.Attribute("default").Value);
                capabilities.MaxPageSize = int.Parse(xmlLimits.Attribute("max").Value);
            }

            var xmlSearching = xmlRoot.Element("searching");
            if (xmlSearching != null)
            {
                var xmlBasicSearch = xmlSearching.Element("search");
                if (xmlBasicSearch == null || xmlBasicSearch.Attribute("available").Value != "yes")
                {
                    capabilities.SupportedSearchParameters = null;
                }
                else
                {
                    if (xmlBasicSearch.Attribute("supportedParams") != null)
                    {
                        capabilities.SupportedSearchParameters = xmlBasicSearch.Attribute("supportedParams").Value.Split(',');
                    }

                    capabilities.TextSearchEngine = xmlBasicSearch.Attribute("searchEngine")?.Value ?? capabilities.TextSearchEngine;
                }

                var xmlMovieSearch = xmlSearching.Element("movie-search");
                if (xmlMovieSearch == null || xmlMovieSearch.Attribute("available").Value != "yes")
                {
                    capabilities.SupportedMovieSearchParameters = null;
                }
                else
                {
                    if (xmlMovieSearch.Attribute("supportedParams") != null)
                    {
                        capabilities.SupportedMovieSearchParameters = xmlMovieSearch.Attribute("supportedParams").Value.Split(',');
                        capabilities.SupportsAggregateIdSearch = true;
                    }

                    capabilities.MovieTextSearchEngine = xmlMovieSearch.Attribute("searchEngine")?.Value ?? capabilities.MovieTextSearchEngine;
                }
            }

            var xmlCategories = xmlRoot.Element("categories");
            if (xmlCategories != null)
            {
                foreach (var xmlCategory in xmlCategories.Elements("category"))
                {
                    var cat = new NewznabCategory
                    {
                        Id = int.Parse(xmlCategory.Attribute("id").Value),
                        Name = xmlCategory.Attribute("name").Value,
                        Description = xmlCategory.Attribute("description") != null ? xmlCategory.Attribute("description").Value : string.Empty,
                        Subcategories = new List<NewznabCategory>()
                    };

                    foreach (var xmlSubcat in xmlCategory.Elements("subcat"))
                    {
                        cat.Subcategories.Add(new NewznabCategory
                        {
                            Id = int.Parse(xmlSubcat.Attribute("id").Value),
                            Name = xmlSubcat.Attribute("name").Value,
                            Description = xmlSubcat.Attribute("description") != null ? xmlSubcat.Attribute("description").Value : string.Empty
                        });
                    }

                    capabilities.Categories.Add(cat);
                }
            }

            return capabilities;
        }
    }
}
