import PropTypes from 'prop-types';
import React, { Component } from 'react';
import keyboardShortcuts, { shortcuts } from 'Components/keyboardShortcuts';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import MovieSearchInputConnector from './MovieSearchInputConnector';
import PageHeaderActionsMenuConnector from './PageHeaderActionsMenuConnector';
import SafeForWorkButtonConnector from './SafeForWorkButtonConnector';
import styles from './PageHeader.css';

class PageHeader extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props);

    this.state = {
      isKeyboardShortcutsModalOpen: false
    };
  }

  componentDidMount() {
    this.props.bindShortcut(shortcuts.OPEN_KEYBOARD_SHORTCUTS_MODAL.key, this.onOpenKeyboardShortcutsModal);
  }

  //
  // Control

  onOpenKeyboardShortcutsModal = () => {
    this.setState({ isKeyboardShortcutsModalOpen: true });
  };

  //
  // Listeners

  onKeyboardShortcutsModalClose = () => {
    this.setState({ isKeyboardShortcutsModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      onSidebarToggle
    } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link
            className={styles.logoLink}
            to={'/'}
          >
            <img
              className={styles.logo}
              src={`${window.Whisparr.urlBase}/Content/Images/logo.svg`}
              alt="Whisparr Logo"
            />
          </Link>
        </div>

        <div className={styles.sidebarToggleContainer}>
          <IconButton
            id="sidebar-toggle-button"
            name={icons.NAVBAR_COLLAPSE}
            onPress={onSidebarToggle}
          />
        </div>

        <MovieSearchInputConnector />

        <div className={styles.right}>

          <SafeForWorkButtonConnector />
          <IconButton
            className={styles.donate}
            name={icons.HEART}
            aria-label="Donate"
            to="https://whisparr.com/donate"
            size={14}
            title={translate('Donate')}
          />
          <IconButton
            className={styles.translate}
            title={translate('SuggestTranslationChange')}
            name={icons.TRANSLATE}
            to="https://translate.servarr.com/projects/whisparr/whisparr/"
            size={24}
          />
          <PageHeaderActionsMenuConnector
            onKeyboardShortcutsPress={this.onOpenKeyboardShortcutsModal}
          />
        </div>

        <KeyboardShortcutsModal
          isOpen={this.state.isKeyboardShortcutsModalOpen}
          onModalClose={this.onKeyboardShortcutsModalClose}
        />
      </div>
    );
  }
}

PageHeader.propTypes = {
  onSidebarToggle: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired
};

export default keyboardShortcuts(PageHeader);
