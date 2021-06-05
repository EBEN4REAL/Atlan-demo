import { Components } from "~/api/user/client";
import { MutationTree } from "vuex";
import { Status } from "~/types/status";

import { State } from "./state";

import { MutationTypes } from "./types-mutation";

export type Mutations<S = State> = {
  [MutationTypes.TENANT_SET_TENANT](
    state: S,
    data: Components.Schemas.RealmRepresentation
  ): void;
  [MutationTypes.TENANT_SET_STATUS](state: S, payload: Status): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.TENANT_SET_TENANT](
    state: State,
    data: Components.Schemas.RealmRepresentation
  ) {
    state.data = data;
    state.loading = false;
    state.error = undefined;
  },
  [MutationTypes.TENANT_SET_STATUS](state: State, payload: Status) {
    state.loading = payload.loading;
    state.error = payload.error;
  },
};
