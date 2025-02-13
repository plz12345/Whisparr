import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';

const selectOverviewOptions = createSelector(
  (state: AppState) => state.sceneIndex.overviewOptions,
  (overviewOptions) => overviewOptions
);

export default selectOverviewOptions;
