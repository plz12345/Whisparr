import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { addMovie, setAddMovieDefault } from 'Store/Actions/addMovieActions';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import selectSettings from 'Store/Selectors/selectSettings';
import AddNewMovieModalContent from './AddNewMovieModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addMovie,
    createDimensionsSelector(),
    createSystemStatusSelector(),
    (state) => state.settings.safeForWorkMode,
    (addMovieState, dimensions, systemStatus, safeForWorkMode) => {
      const {
        isAdding,
        addError,
        movieDefaults
      } = addMovieState;

      const {
        settings,
        validationErrors,
        validationWarnings
      } = selectSettings(movieDefaults, {}, addError);

      return {
        isAdding,
        addError,
        isSmallScreen: dimensions.isSmallScreen,
        validationErrors,
        validationWarnings,
        isWindows: systemStatus.isWindows,
        safeForWorkMode,
        ...settings
      };
    }
  );
}

const mapDispatchToProps = {
  setAddMovieDefault,
  addMovie
};

class AddNewMovieModalContentConnector extends Component {

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setAddMovieDefault({ [name]: value });
  };

  onAddMoviePress = () => {
    const {
      foreignId,
      rootFolderPath,
      monitor,
      qualityProfileId,
      searchForMovie,
      tags
    } = this.props;

    this.props.addMovie({
      foreignId,
      rootFolderPath: rootFolderPath.value,
      monitor: monitor.value,
      qualityProfileId: qualityProfileId.value,
      searchForMovie: searchForMovie.value,
      tags: tags.value
    });
  };

  //
  // Render

  render() {
    return (
      <AddNewMovieModalContent
        {...this.props}
        onInputChange={this.onInputChange}
        onAddMoviePress={this.onAddMoviePress}
      />
    );
  }
}

AddNewMovieModalContentConnector.propTypes = {
  foreignId: PropTypes.string.isRequired,
  rootFolderPath: PropTypes.object,
  monitor: PropTypes.object.isRequired,
  qualityProfileId: PropTypes.object,
  searchForMovie: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
  onModalClose: PropTypes.func.isRequired,
  setAddMovieDefault: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewMovieModalContentConnector);
