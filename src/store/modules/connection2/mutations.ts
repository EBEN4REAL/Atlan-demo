import { Components } from "~/api/atlas/client";
import { MutationTree } from "vuex";
import { Status } from "~/types/status";

import { State } from "./state";

import { MutationTypes } from "./types-mutation";

export type Mutations<S = State> = {
  [MutationTypes.CONNECTION_SET_LIST](
    state: S,
    data: Components.Schemas.AtlasSearchResult
  ): void;
  [MutationTypes.CONNECTION_SET_STATUS](state: S, payload: Status): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.CONNECTION_SET_LIST](
    state: State,
    data: Components.Schemas.AtlasSearchResult
  ) {
    state.data = data;
    state.loading = false;
    state.error = undefined;
  },
  [MutationTypes.CONNECTION_SET_STATUS](state: State, payload: Status) {
    state.loading = payload.loading;
    state.error = payload.error;
  },
};
