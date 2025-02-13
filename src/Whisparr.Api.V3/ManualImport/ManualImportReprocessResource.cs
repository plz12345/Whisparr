using System.Collections.Generic;
using NzbDrone.Core.DecisionEngine;
using NzbDrone.Core.Languages;
using NzbDrone.Core.Qualities;
using Whisparr.Api.V3.CustomFormats;
using Whisparr.Api.V3.Movies;
using Whisparr.Http.REST;

namespace Whisparr.Api.V3.ManualImport
{
    public class ManualImportReprocessResource : RestResource
    {
        public string Path { get; set; }
        public int MovieId { get; set; }
        public MovieResource Movie { get; set; }
        public QualityModel Quality { get; set; }
        public List<Language> Languages { get; set; }
        public string ReleaseGroup { get; set; }
        public string DownloadId { get; set; }
        public List<CustomFormatResource> CustomFormats { get; set; }
        public int CustomFormatScore { get; set; }
        public IEnumerable<Rejection> Rejections { get; set; }
    }
}
