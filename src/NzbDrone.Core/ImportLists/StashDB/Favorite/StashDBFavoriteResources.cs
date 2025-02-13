using System.Collections.Generic;
using Newtonsoft.Json;

namespace NzbDrone.Core.ImportLists.StashDB.Favorite
{
    public class QueryFavoriteSceneQuery
    {
        private QueryFavoriteSceneQueryVariables _variables;
        private string _query;

        public QueryFavoriteSceneQuery(int page, int pageSize, FavoriteFilter filter, List<string> tags, FilterModifier tagsFilter, SceneSort sort)
        {
            _query = @"query Scenes($input: SceneQueryInput!) {
                         queryScenes(input: $input) {
                           scenes {
                             id
                             title
                             release_date
                           }
                           count
                         }
                        }";
            _variables = new QueryFavoriteSceneQueryVariables(page, pageSize, filter, tags, tagsFilter, sort);
        }

        public string Query
        {
            get
            {
                return _query;
            }
        }

        public string Variables
        {
            get
            {
                return JsonConvert.SerializeObject(_variables);
            }
        }

        public void SetPage(int page)
        {
            _variables.Input.page = page;
        }
    }

    public class QueryFavoriteSceneQueryVariables : QuerySceneQueryVariablesBase
    {
        public QueryFavoriteSceneQueryVariables(int page, int pageSize, FavoriteFilter filter, List<string> tags, FilterModifier tagsFilter, SceneSort sort)
            : base(page, pageSize, sort)
        {
            Input.favorites = filter;

            if (tags.Count > 0)
            {
                Input.tags = new FilterType(tagsFilter, tags);
            }
        }
    }
}
