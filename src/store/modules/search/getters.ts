import { GetterTree } from "vuex";
import { Components } from "~/api/atlas/client";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { SearchParameters, State } from "./state";

export type Getters = {
  getSearchResult(state: State): Components.Schemas.AtlasSearchResult | null;
  getSearchList(state: State): Components.Schemas.AtlasEntityHeader[] | null;
  getSearchLoading(state: State): boolean | false;
  getSearchParams(state: State): SearchParameters | {};
};

export const getters: GetterTree<State, RootState> & Getters = {
  getSearchResult: (state) => state.data,
  getSearchList: (state) => state.data.entities,
  getSearchLoading: (state) => state.loading,
  getSearchParams: (state) => state.searchParameters,
};
