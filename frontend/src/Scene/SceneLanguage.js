import PropTypes from 'prop-types';
import React from 'react';
import Label from 'Components/Label';
import Popover from 'Components/Tooltip/Popover';
import { kinds, tooltipPositions } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

function SceneLanguage(props) {
  const {
    className,
    languages,
    isCutoffNotMet
  } = props;

  if (!languages) {
    return null;
  }

  if (languages.length === 1) {
    return (
      <Label
        className={className}
        kind={isCutoffNotMet ? kinds.INVERSE : kinds.DEFAULT}
      >
        {languages[0].name}
      </Label>
    );
  }

  return (
    <Popover
      className={className}
      anchor={
        <Label
          className={className}
          kind={isCutoffNotMet ? kinds.INVERSE : kinds.DEFAULT}
        >
          {translate('MultiLanguage')}
        </Label>
      }
      title={translate('Languages')}
      body={
        <ul>
          {
            languages.map((language) => {
              return (
                <li key={language.id}>
                  {language.name}
                </li>
              );
            })
          }
        </ul>
      }
      position={tooltipPositions.LEFT}
    />
  );
}

SceneLanguage.propTypes = {
  className: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.object),
  isCutoffNotMet: PropTypes.bool
};

SceneLanguage.defaultProps = {
  isCutoffNotMet: true
};

export default SceneLanguage;
