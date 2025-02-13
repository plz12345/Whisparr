using System.Collections.Generic;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Languages;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.Parser.Model
{
    public class ParsedMovieInfo
    {
        public ParsedMovieInfo()
        {
            MovieTitles = new List<string>();
            Languages = new List<Language>();
        }

        public List<string> MovieTitles { get; set; }
        public string OriginalTitle { get; set; }
        public string ReleaseTitle { get; set; }
        public string SimpleReleaseTitle { get; set; }
        public string StudioTitle { get; set; }
        public QualityModel Quality { get; set; }
        public List<Language> Languages { get; set; }
        public string ReleaseGroup { get; set; }
        public string ReleaseHash { get; set; }
        public string ReleaseDate { get; set; }
        public string Episode { get; set; }
        public string Edition { get; set; }
        public int Year { get; set; }
        public string StashId { get; set; }
        public string ImdbId { get; set; }
        public int TmdbId { get; set; }
        public string HardcodedSubs { get; set; }
        public string ReleaseTokens { get; set; }

        public string MovieTitle => PrimaryMovieTitle;

        public string PrimaryMovieTitle
        {
            get
            {
                if (MovieTitles.Count > 0)
                {
                    return MovieTitles[0];
                }

                return null;
            }
        }

        public bool IsScene
        {
            get
            {
                return ReleaseDate.IsNotNullOrWhiteSpace() || Episode.IsNotNullOrWhiteSpace() || StashId.IsNotNullOrWhiteSpace();
            }
        }

        public override string ToString()
        {
            var result = string.Format("{0} - {1} {2}", PrimaryMovieTitle, Year, Quality);

            if (IsScene)
            {
                result = string.Format("{0} - {1} - {2} [{3}]", StudioTitle, ReleaseDate, ReleaseTokens, Quality);
            }

            return result;
        }
    }
}
