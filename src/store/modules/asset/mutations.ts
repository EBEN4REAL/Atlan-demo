import { MutationTree } from "vuex";

import { State } from "./state";

import { MutationTypes } from "./types-mutations";
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "./constants";

export type Mutations<S = State> = {
  [MutationTypes.SET_ASSETS](state: S, payload: any): void;
  [MutationTypes.SET_FETCHED_ASSET_COUNT](state: S, payload: any): void;
  [MutationTypes.SET_ASSETS_STATUS](state: S, payload: any): void;
  [MutationTypes.SET_SAVED_FILTERS](state: S, payload: any): void;
  [MutationTypes.SET_SAVED_FILTER_ARCHIVE_LOADING](
    state: S,
    payload: any
  ): void;
  [MutationTypes.SET_SAVED_FILTER_ARCHIVE_ERROR](state: S, payload: any): void;
  [MutationTypes.SET_ASSET_LIST_PAGINATE_OPTIONS](state: S, payload: any): void;
  [MutationTypes.SET_ASSET_FETCH_ATTEMPTS](state: S, payload: any): void;
  [MutationTypes.SET_END_OF_PAGINATE](state: S, payload: any): void;
  [MutationTypes.SET_SAVED_FILTERS_STATUS](state: S, payload: any): void;
  [MutationTypes.UPDATE_ASSET_IN_ASSETS_LIST](state: S, payload: any): void;
  [MutationTypes.ASSET_FREQUENT_USERS_NEW_CANCEL_TOKEN](
    state: S,
    payload: any
  ): void;
  [MutationTypes.ASSET_FREQUENT_USERS_SET_LOADING](
    state: S,
    payload: string
  ): void;
  [MutationTypes.ASSET_FREQUENT_USERS_SET_ERROR](state: S, payload: any): void;
  [MutationTypes.ASSET_FREQUENT_USERS_SET](state: S, payload: any): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_ASSETS](state: State, payload: any) {
    const { assets = {}, options = {}, approximateTotalCount = 0 } = payload;
    if (options && options.isAppend) {
      state.assets = state.assets.concat(assets ? assets.entities || [] : []);
    } else {
      state.assets = assets ? assets.entities || [] : [];
    }
    state.approximateTotalCount = approximateTotalCount || 0;
  },
  [MutationTypes.SET_FETCHED_ASSET_COUNT](state: State, payload: any) {
    const { value, isAppend = false } = payload;
    if (isAppend) {
      state.fetchedAssetCountInOneBatch += value;
    } else {
      state.fetchedAssetCountInOneBatch = value;
    }
  },
  [MutationTypes.SET_ASSETS_STATUS](state: State, payload: any) {
    state.assetsStatus = payload || "";
  },
  [MutationTypes.SET_SAVED_FILTERS](state: State, payload: any) {
    state.savedFilters = payload || [];
  },
  [MutationTypes.SET_SAVED_FILTER_ARCHIVE_LOADING](state: State, payload: any) {
    state.savedFilterArchiveLoading = payload;
  },
  [MutationTypes.SET_SAVED_FILTER_ARCHIVE_ERROR](state: State, payload: any) {
    state.savedFilterArchiveError = payload;
  },
  [MutationTypes.SET_ASSET_LIST_PAGINATE_OPTIONS](state: State, payload: any) {
    if (!payload) {
      state.paginateOptions = {
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
      };
    } else {
      state.paginateOptions = payload;
    }
  },
  [MutationTypes.SET_ASSET_FETCH_ATTEMPTS](state: State, payload: any) {
    state.fetchAttemptsState = {
      ...state.fetchAttemptsState,
      [payload.attemptId]: {
        ...state.fetchAttemptsState[payload.attemptId],
        ...payload.params,
      },
    };
  },
  [MutationTypes.SET_END_OF_PAGINATE](state: State, payload: any) {
    state.isEndOfPaginate = payload;
  },
  [MutationTypes.SET_SAVED_FILTERS_STATUS](state: State, payload: any) {
    state.savedFiltersStatus = payload || "";
  },
  [MutationTypes.UPDATE_ASSET_IN_ASSETS_LIST](state: State, payload: any) {
    const assetIndex = state.assets.findIndex((a) => a.guid === payload.guid);
    if (assetIndex >= 0) {
      state.assets[assetIndex] = payload || state.assets[assetIndex] || {};
    }
  },
  [MutationTypes.ASSET_FREQUENT_USERS_NEW_CANCEL_TOKEN](
    state: State,
    payload: any
  ) {
    state.frequentUsersCancelToken = payload;
  },
  [MutationTypes.ASSET_FREQUENT_USERS_SET_LOADING](state: State, payload: any) {
    state.frequentUsersLoading = payload;
  },
  [MutationTypes.ASSET_FREQUENT_USERS_SET_ERROR](state: State, payload: any) {
    state.frequentUsersError = payload;
  },
  [MutationTypes.ASSET_FREQUENT_USERS_SET](state: State, payload: any) {
    const { entityId, list } = payload;
    state.frequentUsers = {
      ...state.frequentUsers,
      [entityId]: list,
    };
  },
};
