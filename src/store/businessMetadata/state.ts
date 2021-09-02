
export interface State {
  businessMetadataList: { guid: string }[] | null;
  businessMetadataListError: string | null;
  businessMetadataListLoading: boolean,
  businessMetadataListLoaded: boolean,
}

export const state: State = {
  businessMetadataList: null,
  businessMetadataListError: null,
  businessMetadataListLoading: false,
  businessMetadataListLoaded: false,
};
