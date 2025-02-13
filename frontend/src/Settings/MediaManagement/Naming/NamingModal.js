import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FieldSet from 'Components/FieldSet';
import SelectInput from 'Components/Form/SelectInput';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import NamingOption from './NamingOption';
import styles from './NamingModal.css';

const separatorOptions = [
  {
    key: ' ',
    get value() {
      return `${translate('Space')} ( )`;
    }
  },
  {
    key: '.',
    get value() {
      return `${translate('Period')} (.)`;
    }
  },
  {
    key: '_',
    get value() {
      return `${translate('Underscore')} (_)`;
    }
  },
  {
    key: '-',
    get value() {
      return `${translate('Dash')} (-)`;
    }
  }
];

const caseOptions = [
  {
    key: 'title',
    get value() {
      return translate('DefaultCase');
    }
  },
  {
    key: 'lower',
    get value() {
      return translate('Lowercase');
    }
  },
  {
    key: 'upper',
    get value() {
      return translate('Uppercase');
    }
  }
];

const fileNameTokens = [
  {
    token: '{Movie Title} - {Quality Full}',
    example: 'Movie Title (2010) - HDTV-720p Proper'
  }
];

const movieTokens = [
  { token: '{Movie Title}', example: 'Movie\'s Title' },
  { token: '{Movie CleanTitle}', example: 'Movies Title' },
  { token: '{Movie TitleThe}', example: 'Movie\'s Title, The' },
  { token: '{Movie TitleFirstCharacter}', example: 'M' },
  { token: '{Movie Collection}', example: 'The Movie Collection' },
  { token: '{Release Year}', example: '2009' }
];

const sceneTokens = [
  { token: '{Scene Title}', example: 'Scene\'s Title' },
  { token: '{Scene CleanTitle}', example: 'Scenes Title' },
  { token: '{Scene TitleThe}', example: 'Scene\'s Title, The' },
  { token: '{Scene TitleFirstCharacter}', example: 'S' },
  { token: '{Scene Performers}', example: 'Abigail Mac Tera Patrick John Holmes' },
  { token: '{Scene PerformersFemale}', example: 'Abigail Mac Tera Patrick' },
  { token: '{Release Date}', example: '2009-02-04' },
  { token: '{Release ShortDate}', example: '09 02 04' }
];

const studioTokens = [
  { token: '{Studio Title}', example: 'Studio\'s Title' },
  { token: '{Studio TitleSlug}', example: 'Studio\'sTitle' },
  { token: '{Studio CleanTitle}', example: 'Studios Title' },
  { token: '{Studio TitleThe}', example: 'Studio\'s Title, The' },
  { token: '{Studio TitleFirstCharacter}', example: 'S' },
  { token: '{Studio Network}', example: 'Brazzers' }
];

const movieIdTokens = [
  { token: '{ImdbId}', example: 'tt12345' },
  { token: '{TmdbId}', example: '123456' }
];

const sceneIdTokens = [
  { token: '{StashId}', example: '155f2559-d1f1-42b1-8cbe-9008542df5ce' }
];

const qualityTokens = [
  { token: '{Quality Full}', example: 'HDTV-720p Proper' },
  { token: '{Quality Title}', example: 'HDTV-720p' }
];

const mediaInfoTokens = [
  { token: '{MediaInfo Simple}', example: 'x264 DTS' },
  { token: '{MediaInfo Full}', example: 'x264 DTS [EN+DE]', footNote: 1 },

  { token: '{MediaInfo AudioCodec}', example: 'DTS' },
  { token: '{MediaInfo AudioChannels}', example: '5.1' },
  { token: '{MediaInfo AudioLanguages}', example: '[EN+DE]', footNote: 1 },
  { token: '{MediaInfo SubtitleLanguages}', example: '[DE]', footNote: 1 },

  { token: '{MediaInfo VideoCodec}', example: 'x264' },
  { token: '{MediaInfo VideoBitDepth}', example: '10' },
  { token: '{MediaInfo VideoDynamicRange}', example: 'HDR' },
  { token: '{MediaInfo VideoDynamicRangeType}', example: 'DV HDR10' },
  { token: '{MediaInfo 3D}', example: '3D' }
];

const releaseGroupTokens = [
  { token: '{Release Group}', example: 'Rls Grp' }
];

const editionTokens = [
  { token: '{Edition Tags}', example: 'IMAX' }
];

const customFormatTokens = [
  { token: '{Custom Formats}', example: 'Surround Sound x264' }
];

const originalTokens = [
  { token: '{Original Title}', example: 'Movie.Title.HDTV.x264-EVOLVE' },
  { token: '{Original Filename}', example: 'movie title hdtv.x264-Evolve' }
];

class NamingModal extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._selectionStart = null;
    this._selectionEnd = null;

    this.state = {
      separator: ' ',
      case: 'title'
    };
  }

  //
  // Listeners

  onTokenSeparatorChange = (event) => {
    this.setState({ separator: event.value });
  };

  onTokenCaseChange = (event) => {
    this.setState({ case: event.value });
  };

  onInputSelectionChange = (selectionStart, selectionEnd) => {
    this._selectionStart = selectionStart;
    this._selectionEnd = selectionEnd;
  };

  onOptionPress = ({ isFullFilename, tokenValue }) => {
    const {
      name,
      value,
      onInputChange
    } = this.props;

    const selectionStart = this._selectionStart;
    const selectionEnd = this._selectionEnd;

    if (isFullFilename) {
      onInputChange({ name, value: tokenValue });
    } else if (selectionStart == null) {
      onInputChange({
        name,
        value: `${value}${tokenValue}`
      });
    } else {
      const start = value.substring(0, selectionStart);
      const end = value.substring(selectionEnd);
      const newValue = `${start}${tokenValue}${end}`;

      onInputChange({ name, value: newValue });
      this._selectionStart = newValue.length - 1;
      this._selectionEnd = newValue.length - 1;
    }
  };

  //
  // Render

  render() {
    const {
      name,
      value,
      isOpen,
      advancedSettings,
      additional,
      isScene,
      onInputChange,
      onModalClose
    } = this.props;

    const {
      separator: tokenSeparator,
      case: tokenCase
    } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onModalClose={onModalClose}
      >
        <ModalContent onModalClose={onModalClose}>
          <ModalHeader>
            {translate('FileNameTokens')}
          </ModalHeader>

          <ModalBody>
            <div className={styles.namingSelectContainer}>
              <SelectInput
                className={styles.namingSelect}
                name="separator"
                value={tokenSeparator}
                values={separatorOptions}
                onChange={this.onTokenSeparatorChange}
              />

              <SelectInput
                className={styles.namingSelect}
                name="case"
                value={tokenCase}
                values={caseOptions}
                onChange={this.onTokenCaseChange}
              />
            </div>

            {
              !advancedSettings &&
                <FieldSet legend={translate('FileNames')}>
                  <div className={styles.groups}>
                    {
                      fileNameTokens.map(({ token, example }) => {
                        return (
                          <NamingOption
                            key={token}
                            name={name}
                            value={value}
                            token={token}
                            example={example}
                            isFullFilename={true}
                            tokenSeparator={tokenSeparator}
                            tokenCase={tokenCase}
                            size={sizes.LARGE}
                            onPress={this.onOptionPress}
                          />
                        );
                      }
                      )
                    }
                  </div>
                </FieldSet>
            }

            {
              !isScene &&
                <div>
                  <FieldSet legend={translate('Movie')}>
                    <div className={styles.groups}>
                      {
                        movieTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('MovieID')}>
                    <div className={styles.groups}>
                      {
                        movieIdTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>
                </div>
            }

            {
              isScene &&
                <div>
                  <FieldSet legend={translate('Scene')}>
                    <div className={styles.groups}>
                      {
                        sceneTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('SceneId')}>
                    <div className={styles.groups}>
                      {
                        sceneIdTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>
                </div>
            }

            <FieldSet legend={translate('Studio')}>
              <div className={styles.groups}>
                {
                  studioTokens.map(({ token, example }) => {
                    return (
                      <NamingOption
                        key={token}
                        name={name}
                        value={value}
                        token={token}
                        example={example}
                        tokenSeparator={tokenSeparator}
                        tokenCase={tokenCase}
                        onPress={this.onOptionPress}
                      />
                    );
                  }
                  )
                }
              </div>
            </FieldSet>

            {
              additional &&
                <div>
                  <FieldSet legend={translate('Quality')}>
                    <div className={styles.groups}>
                      {
                        qualityTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('MediaInfo')}>
                    <div className={styles.groups}>
                      {
                        mediaInfoTokens.map(({ token, example, footNote }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              footNote={footNote}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>

                    <div className={styles.footNote}>
                      <Icon className={styles.icon} name={icons.FOOTNOTE} />
                      <InlineMarkdown data={translate('MediaInfoFootNote')} />
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('ReleaseGroup')}>
                    <div className={styles.groups}>
                      {
                        releaseGroupTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('Edition')}>
                    <div className={styles.groups}>
                      {
                        editionTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('CustomFormats')}>
                    <div className={styles.groups}>
                      {
                        customFormatTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('Original')}>
                    <div className={styles.groups}>
                      {
                        originalTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              size={sizes.LARGE}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>
                </div>
            }
          </ModalBody>

          <ModalFooter>
            <TextInput
              name={name}
              value={value}
              onChange={onInputChange}
              onSelectionChange={this.onInputSelectionChange}
            />
            <Button onPress={onModalClose}>
              {translate('Close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

NamingModal.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  advancedSettings: PropTypes.bool.isRequired,
  additional: PropTypes.bool.isRequired,
  isScene: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

NamingModal.defaultProps = {
  additional: false,
  isScene: false
};

export default NamingModal;
