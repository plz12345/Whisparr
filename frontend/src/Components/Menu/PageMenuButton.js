import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import Icon from 'Components/Icon';
import MenuButton from 'Components/Menu/MenuButton';
import styles from './PageMenuButton.css';

function PageMenuButton(props) {
  const {
    iconName,
    text,
    indicator,
    ...otherProps
  } = props;

  return (
    <MenuButton
      className={styles.menuButton}
      {...otherProps}
    >
      <Icon
        name={iconName}
        size={18}
      />

      {
        indicator &&
          <span
            className={classNames(
              styles.indicatorContainer,
              'fa-layers fa-fw'
            )}
          >
            <Icon
              className={styles.indicatorBackground}
              name={icons.CIRCLE}
              size={10}
            />
          </span>
      }

      <div className={styles.label}>
        {text}
      </div>
    </MenuButton>
  );
}

PageMenuButton.propTypes = {
  iconName: PropTypes.object.isRequired,
  text: PropTypes.string,
  indicator: PropTypes.bool.isRequired
};

PageMenuButton.defaultProps = {
  indicator: false
};

export default PageMenuButton;
