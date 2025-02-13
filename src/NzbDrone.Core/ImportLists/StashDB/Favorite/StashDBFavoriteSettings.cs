using FluentValidation;
using NzbDrone.Core.Annotations;

namespace NzbDrone.Core.ImportLists.StashDB.Favorite
{
    public class StashDBFavoriteSettingsValidator : StashDBSettingsBaseValidator<StashDBFavoriteSettings>
    {
        public StashDBFavoriteSettingsValidator()
        : base()
        {
            RuleFor(c => c.ApiKey)
                .NotEmpty()
                .WithMessage("Api Key must not be empty");
        }
    }

    public class StashDBFavoriteSettings : StashDBSettingsBase<StashDBFavoriteSettings>
    {
        protected override AbstractValidator<StashDBFavoriteSettings> Validator => new StashDBFavoriteSettingsValidator();

        [FieldDefinition(3, Label = "Favorite Filter", Type = FieldType.Select, SelectOptions = typeof(FavoriteFilter), HelpText = "Filter by favorited entity")]
        public FavoriteFilter Filter { get; set; }

        [FieldDefinition(4, Label = "Tag StashIDs", HelpText = "Enter tag StashIDs, comma seperated  (Optional)")]
        public string Tags { get; set; }

        [FieldDefinition(5, Label = "Tags Filter", Type = FieldType.Select, SelectOptions = typeof(FilterModifier), HelpText = "Filter tags by")]
        public FilterModifier TagsFilter { get; set; }
    }
}
