import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CalendarEventQueueDetails from 'Calendar/Events/CalendarEventQueueDetails';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import { icons, kinds } from 'Helpers/Props';
import getStatusStyle from 'Utilities/Movie/getStatusStyle';
import translate from 'Utilities/String/translate';
import styles from './AgendaEvent.css';

class AgendaEvent extends Component {
  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDetailsModalOpen: false
    };
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isDetailsModalOpen: true });
  };

  onDetailsModalClose = () => {
    this.setState({ isDetailsModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      movieFile,
      title,
      titleSlug,
      genres,
      isAvailable,
      releaseDate,
      monitored,
      hasFile,
      grabbed,
      queueItem,
      showDate,
      showMovieInformation,
      showCutoffUnmetIcon,
      longDateFormat,
      colorImpairedMode,
      releaseDateParsed,
      sortDate
    } = this.props;

    let startTime = null;
    let releaseIcon = null;

    if (releaseDateParsed === sortDate) {
      startTime = releaseDate;
      releaseIcon = icons.DISC;
    }

    startTime = moment(startTime);
    const downloading = !!(queueItem || grabbed);
    const isMonitored = monitored;
    const statusStyle = getStatusStyle(null, isMonitored, hasFile, isAvailable, 'style', downloading);
    const joinedGenres = genres.slice(0, 2).join(', ');
    const link = `/movie/${titleSlug}`;

    return (
      <div className={styles.event}>
        <Link
          className={styles.underlay}
          to={link}
        />

        <div className={styles.overlay}>
          <div className={styles.date}>
            {showDate ? startTime.format(longDateFormat) : null}
          </div>

          <div className={styles.releaseIcon}>
            <Icon
              name={releaseIcon}
              kind={kinds.DEFAULT}
            />
          </div>

          <div
            className={classNames(
              styles.eventWrapper,
              styles[statusStyle],
              colorImpairedMode && 'colorImpaired'
            )}
          >
            <div className={styles.movieTitle}>
              {title}
            </div>

            {
              showMovieInformation &&
                <div className={styles.genres}>
                  {joinedGenres}
                </div>
            }

            {
              !!queueItem &&
                <span className={styles.statusIcon}>
                  <CalendarEventQueueDetails
                    {...queueItem}
                  />
                </span>
            }

            {
              !queueItem && grabbed &&
                <Icon
                  className={styles.statusIcon}
                  name={icons.DOWNLOADING}
                  title={translate('MovieIsDownloading')}
                />
            }

            {
              showCutoffUnmetIcon && !!movieFile && movieFile.qualityCutoffNotMet &&
                <Icon
                  className={styles.statusIcon}
                  name={icons.MOVIE_FILE}
                  kind={kinds.WARNING}
                  title={translate('QualityCutoffNotMet')}
                />
            }
          </div>
        </div>
      </div>
    );
  }
}

AgendaEvent.propTypes = {
  id: PropTypes.number.isRequired,
  movieFile: PropTypes.object,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAvailable: PropTypes.bool.isRequired,
  releaseDate: PropTypes.string,
  monitored: PropTypes.bool.isRequired,
  hasFile: PropTypes.bool.isRequired,
  grabbed: PropTypes.bool,
  queueItem: PropTypes.object,
  showDate: PropTypes.bool.isRequired,
  showMovieInformation: PropTypes.bool.isRequired,
  showCutoffUnmetIcon: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  colorImpairedMode: PropTypes.bool.isRequired,
  releaseDateParsed: PropTypes.number,
  sortDate: PropTypes.number
};

AgendaEvent.defaultProps = {
  genres: []
};

export default AgendaEvent;
