export interface State {
  classifications: Array<any>;
  availableClassificationsForLink: Array<any>;
  selectedAsset: Object;
  isClassificationsFetched: boolean;
}

export const state: State = {
  classifications: [],
  selectedAsset: {},
  isClassificationsFetched: false,
  availableClassificationsForLink: [],
};
