import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "./constants";

export interface State {
  assets: Array<any>;
  approximateTotalCount: number;
  assetsStatus: string;
  savedFilters: Array<any>;
  savedFiltersStatus: string;
  savedFilterArchiveLoading: boolean;
  savedFilterArchiveError: any;
  fetchedAssetCountInOneBatch: number;
  fetchAttemptsState: any;
  paginateOptions: any;
  isEndOfPaginate: boolean;

  frequentUsers: any;
  frequentUsersLoading: boolean;
  frequentUsersCancelToken: any;
  frequentUsersError: any;
}

export const state: State = {
  assets: [],
  approximateTotalCount: 0,
  assetsStatus: "",

  savedFilters: [],
  savedFiltersStatus: "",
  savedFilterArchiveLoading: false,
  savedFilterArchiveError: null,

  fetchedAssetCountInOneBatch: 0,
  fetchAttemptsState: {},
  paginateOptions: {
    limit: 20,
    skip: 0,
    filters: {
      typeName: ["AtlanTable", "AtlanView", "AtlanBIDashboard"],
    },
    searchText: "",
    sortBy: DEFAULT_SORT_BY,
    sortOrder: DEFAULT_SORT_ORDER,
    showOwnedByMe: false,
    showBookmarkedAssets: false,
  },
  isEndOfPaginate: false,

  /*
    Example for frequentUsers
    frequentUsers: {
      <entity_guid>: []
    }
  */
  frequentUsers: {},
  frequentUsersLoading: false,
  frequentUsersCancelToken: null,
  frequentUsersError: {},
};
