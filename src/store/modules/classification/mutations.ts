import { MutationTree } from "vuex";

import { State } from "./state";

import { MutationTypes } from "./types-mutations";

export type Mutations<S = State> = {
  [MutationTypes.SET_CLASSIFICATIONS](state: S, payload: any): void;
  [MutationTypes.CREATE_CLASSIFICATION](state: S, payload: any): void;
  [MutationTypes.CREATE_CLASSIFICATION_STATUS](state: S, payload: any): void;
  [MutationTypes.SET_CLASSIFICATIONS_STATUS](state: S, payload: string): void;
  [MutationTypes.SET_CLASSIFICATION_TREE](state: S, payload: any): void;
  [MutationTypes.SET_FILTERED_CLASSIFICATION_TREE](
    state: S,
    payload: any
  ): void;
  [MutationTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](
    state: S,
    payload: any
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_CLASSIFICATIONS](state: State, payload: any) {
    state.classifications = payload.classifications || [];
  },
  [MutationTypes.CREATE_CLASSIFICATION](state: State, payload: any) {
    state.classifications = payload.classifications || [];
  },
  [MutationTypes.SET_CLASSIFICATIONS_STATUS](state: State, payload: any) {
    state.classificationsStatus = payload || "";
  },
  [MutationTypes.CREATE_CLASSIFICATION_STATUS](state: State, payload: any) {
    state.createClassificationStatus = payload || "";
  },
  [MutationTypes.SET_CLASSIFICATION_TREE](state: State, payload: any) {
    state.classificationTree = payload.tree || [];
    state.filteredClassificationTree = payload.tree || [];
  },
  [MutationTypes.SET_FILTERED_CLASSIFICATION_TREE](state: State, payload: any) {
    state.filteredClassificationTree = payload.tree || [];
  },
  [MutationTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](state: State, payload: any) {
    const classificationIndex = state.classifications.findIndex(
      (c) => c.guid === payload.classification.guid
    );
    if (classificationIndex === -1) {
      return;
    }
    state.classifications[classificationIndex] = payload.classification;
    state.classifications = [...state.classifications];
  },
};
