using System.Collections.Generic;
using System.Linq;
using NzbDrone.Core.Tags;
using Whisparr.Http.REST;

namespace Whisparr.Api.V3.Tags
{
    public class TagDetailsResource : RestResource
    {
        public string Label { get; set; }
        public List<int> DelayProfileIds { get; set; }
        public List<int> ImportListIds { get; set; }
        public List<int> NotificationIds { get; set; }
        public List<int> ReleaseProfileIds { get; set; }
        public List<int> IndexerIds { get; set; }
        public List<int> DownloadClientIds { get; set; }
        public List<int> AutoTagIds { get; set; }
        public List<int> MovieIds { get; set; }
    }

    public static class TagDetailsResourceMapper
    {
        public static TagDetailsResource ToResource(this TagDetails model)
        {
            if (model == null)
            {
                return null;
            }

            return new TagDetailsResource
            {
                Id = model.Id,
                Label = model.Label,
                DelayProfileIds = model.DelayProfileIds,
                ImportListIds = model.ImportListIds,
                NotificationIds = model.NotificationIds,
                ReleaseProfileIds = model.ReleaseProfileIds,
                IndexerIds = model.IndexerIds,
                DownloadClientIds = model.DownloadClientIds,
                AutoTagIds = model.AutoTagIds,
                MovieIds = model.MovieIds,
            };
        }

        public static List<TagDetailsResource> ToResource(this IEnumerable<TagDetails> models)
        {
            return models.Select(ToResource).ToList();
        }
    }
}
