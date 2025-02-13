using NzbDrone.Core.Configuration;
using Whisparr.Http.REST;

namespace Whisparr.Api.V3.Config
{
    public class DownloadClientConfigResource : RestResource
    {
        public string DownloadClientWorkingFolders { get; set; }

        public bool EnableCompletedDownloadHandling { get; set; }
        public int CheckForFinishedDownloadInterval { get; set; }

        public bool AutoRedownloadFailed { get; set; }
        public bool AutoRedownloadFailedFromInteractiveSearch { get; set; }
    }

    public static class DownloadClientConfigResourceMapper
    {
        public static DownloadClientConfigResource ToResource(IConfigService model)
        {
            return new DownloadClientConfigResource
            {
                DownloadClientWorkingFolders = model.DownloadClientWorkingFolders,

                EnableCompletedDownloadHandling = model.EnableCompletedDownloadHandling,
                CheckForFinishedDownloadInterval = model.CheckForFinishedDownloadInterval,

                AutoRedownloadFailed = model.AutoRedownloadFailed,
                AutoRedownloadFailedFromInteractiveSearch = model.AutoRedownloadFailedFromInteractiveSearch
            };
        }
    }
}
