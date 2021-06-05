import { MutationTree } from "vuex";
import { Components } from "~/api/atlas/client";
import { Status } from "~/types/status";

import { State } from "./state";

import { MutationTypes } from "./types-mutation";

export type Mutations<S = State> = {
  [MutationTypes.ENTITYDEF_SET_DATA](
    state: S,
    data: Components.Schemas.AtlasTypesDef
  ): void;
  [MutationTypes.ENTITYDEF_SET_STATUS](state: S, payload: Status): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ENTITYDEF_SET_DATA](
    state: State,
    data: Components.Schemas.AtlasTypesDef
  ) {
    state.data = data;
    state.loading = false;
    state.error = undefined;
  },
  [MutationTypes.ENTITYDEF_SET_STATUS](state: State, payload: Status) {
    state.loading = payload.loading;
    state.error = payload.error;
  },
};
