import { Components } from "~/api/atlas/client";
import { MutationTree } from "vuex";
import { Status } from "~/types/status";

import { SearchParameters, State } from "./state";

import { MutationTypes } from "./types-mutation";
import axios from "axios";

export type Mutations<S = State> = {
  [MutationTypes.SEARCH_SET_LIST](
    state: S,
    data: Components.Schemas.AtlasSearchResult
  ): void;
  [MutationTypes.SEARCH_SET_STATUS](state: S, payload: Status): void;
  [MutationTypes.SEARCH_SET_SEARCH](state: S, payload: SearchParameters): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SEARCH_SET_LIST](
    state: State,
    data: Components.Schemas.AtlasSearchResult
  ) {
    state.data = data;
    state.loading = false;
    state.error = undefined;
  },
  [MutationTypes.SEARCH_SET_STATUS](state: State, payload: Status) {
    state.loading = payload.loading;
    state.error = payload.error;
    state.cancelToken = payload.cancelToken;
  },
  [MutationTypes.SEARCH_SET_SEARCH](state: State, payload: SearchParameters) {
    Object.keys(payload).map((property: string) => {
      state.searchParameters[property] = payload[property];
    });
    state.loading = true;
    state.error = undefined;
    state.cancelToken = axios.CancelToken.source();
  },
  // [MutationTypes.SEARCH_SET_SEARCH](state: State, searchText: string) {
  //   state.entityFilter.query = searchText;
  // },
  // [MutationTypes.SEARCH_SET_SORT](state: State, payload: Object) {
  //   state.entityFilter.sortBy = payload.sortBy;
  //   state.entityFilter.sortOrder = payload.sortOrder;
  // },
};
