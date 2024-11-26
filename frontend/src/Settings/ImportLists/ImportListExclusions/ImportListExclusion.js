import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import { icons, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import EditImportListExclusionModalConnector from './EditImportListExclusionModalConnector';
import styles from './ImportListExclusion.css';

class ImportListExclusion extends Component {
  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditImportExclusionModalOpen: false,
      isDeleteImportExclusionModalOpen: false
    };
  }

  //
  // Listeners

  onEditImportExclusionPress = () => {
    this.setState({ isEditImportExclusionModalOpen: true });
  };

  onEditImportExclusionModalClose = () => {
    this.setState({ isEditImportExclusionModalOpen: false });
  };

  onDeleteImportExclusionPress = () => {
    this.setState({
      isEditImportExclusionModalOpen: false,
      isDeleteImportExclusionModalOpen: true
    });
  };

  onDeleteImportExclusionModalClose = () => {
    this.setState({ isDeleteImportExclusionModalOpen: false });
  };

  onConfirmDeleteImportExclusion = () => {
    this.props.onConfirmDeleteImportExclusion(this.props.id);
  };

  getExternalUrl = () => {
    let itemUrl = '';
    if (isNaN(this.props.foreignId)) {
      itemUrl = `https://stashdb.org/scenes/${this.props.foreignId}`;
    } else {
      itemUrl = `https://www.themoviedb.org/movie/${this.props.foreignId}`;
    }
    return itemUrl;
  };

  //
  // Render
  render() {
    const {
      id,
      movieTitle,
      foreignId,
      movieYear
    } = this.props;

    return (
      <div
        className={classNames(
          styles.importExclusion
        )}
      >
        <div className={styles.foreignId} title={foreignId}>{foreignId}</div>
        <div className={styles.movieTitle} title={movieTitle}>{movieTitle}</div>
        <div className={styles.movieYear}>{movieYear}</div>

        <div className={styles.actions}>
          <Link
            className={styles.exclusionExternalLink}
            to={this.getExternalUrl()}
            target='_blank'
          >
            <Icon name={icons.EXTERNAL_LINK} />
          </Link>
          <Link
            onPress={this.onEditImportExclusionPress}
          >
            <Icon name={icons.EDIT} />
          </Link>
        </div>

        <EditImportListExclusionModalConnector
          id={id}
          isOpen={this.state.isEditImportExclusionModalOpen}
          onModalClose={this.onEditImportExclusionModalClose}
          onDeleteImportExclusionPress={this.onDeleteImportExclusionPress}
        />

        <ConfirmModal
          isOpen={this.state.isDeleteImportExclusionModalOpen}
          kind={kinds.DANGER}
          title={translate('DeleteImportListExclusion')}
          message={translate('DeleteImportListExclusionMessageText')}
          confirmLabel={translate('Delete')}
          onConfirm={this.onConfirmDeleteImportExclusion}
          onCancel={this.onDeleteImportExclusionModalClose}
        />
      </div>
    );
  }
}

ImportListExclusion.propTypes = {
  id: PropTypes.number.isRequired,
  movieTitle: PropTypes.string.isRequired,
  foreignId: PropTypes.string.isRequired,
  movieYear: PropTypes.number.isRequired,
  onConfirmDeleteImportExclusion: PropTypes.func.isRequired
};

ImportListExclusion.defaultProps = {
  // The drag preview will not connect the drag handle.
  connectDragSource: (node) => node
};

export default ImportListExclusion;
