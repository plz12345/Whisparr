using System;
using System.Collections.Generic;
using NzbDrone.Core.Movies;
using NzbDrone.Core.ThingiProvider;

namespace NzbDrone.Core.ImportLists
{
    public class ImportListDefinition : ProviderDefinition
    {
        public ImportListDefinition()
        {
            Tags = new HashSet<int>();
        }

        public bool Enabled { get; set; }
        public bool EnableAuto { get; set; }
        public MonitorTypes Monitor { get; set; }
        public int QualityProfileId { get; set; }
        public string RootFolderPath { get; set; }
        public bool SearchOnAdd { get; set; }
        public override bool Enable => Enabled;

        public ImportListType ListType { get; set; }
        public TimeSpan MinRefreshInterval { get; set; }
    }
}
