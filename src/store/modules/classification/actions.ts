import { watch } from "vue";
import { ActionTree, ActionContext } from "vuex";
import { Classification } from "~/api/atlas/classification";
import { RootState } from "~/store";

// import { getAxiosClient } from "~/api";

import { State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutations";
import { ActionTypes } from "./types-actions";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.GET_CLASSIFICATIONS]({
    commit,
    getters,
  }: AugmentedActionContext): void;
  [ActionTypes.RESET_CLASSIFICATIONS]({ commit }: AugmentedActionContext): void;
  [ActionTypes.SET_CLASSIFICATIONS](
    { commit, getters }: AugmentedActionContext,
    params: any
  ): void;
  [ActionTypes.FILTER_CLASSIFICATION_TREE](
    { commit, getters }: AugmentedActionContext,
    searchText: any
  ): void;
  [ActionTypes.CREATE_CLASSIFICATION](
    { commit, getters, state }: AugmentedActionContext,
    params: any
  ): boolean;
  [ActionTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](
    { commit, getters }: AugmentedActionContext,
    params: any
  ): void;
  [ActionTypes.UPDATE_CLASSIFICATION_TREE](
    { commit }: AugmentedActionContext,
    tree: any
  ): void;
  [ActionTypes.SET_CLASSIFICATION_STATUS](
    { commit }: AugmentedActionContext,
    status: any
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.GET_CLASSIFICATIONS]({ commit, getters }) {
    try {
      commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "loading");
      const {
        data: classificationData,
        error: classificationError,
      } = Classification.getClassificationList({ cache: false });

      watch([classificationData, classificationError], () => {
        console.log(classificationData, classificationError);
        if (classificationData.value) {
          let classifications =
            classificationData.value.classificationDefs || [];
          classifications = classifications.map((classification) => {
            classification.alias = classification.name;
            return classification;
          });
          console.log("getClassifications -> classifications", classifications);
          commit(MutationTypes.SET_CLASSIFICATIONS, { classifications });
          const classificationTree = getters.transformClassificationTreeData;
          console.log(classificationTree, "classifciation Tree");
          commit(MutationTypes.SET_CLASSIFICATION_TREE, {
            tree: classificationTree,
          });
          commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "success");
        } else if (!classificationData.value && classificationError.value) {
          commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "error");
        }
      });
    } catch (err) {
      commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "error");
    }
  },
  [ActionTypes.RESET_CLASSIFICATIONS]({ commit }) {
    commit(MutationTypes.SET_CLASSIFICATIONS, { classifications: [] });
    commit(MutationTypes.SET_CLASSIFICATION_TREE, { tree: [] });
    commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "");
  },
  [ActionTypes.SET_CLASSIFICATIONS]({ commit, getters }, list) {
    try {
      commit(MutationTypes.SET_CLASSIFICATIONS, { classifications: list });
      const classificationTree = getters.transformClassificationTreeData;
      commit(MutationTypes.SET_CLASSIFICATION_TREE, {
        tree: classificationTree,
      });
    } catch (error) {
      console.log("WTF: setClassifications -> error", error);
    }
  },
  [ActionTypes.CREATE_CLASSIFICATION]({ commit, getters, state }, payload) {
    try {
      commit(MutationTypes.CREATE_CLASSIFICATION_STATUS, "loading");
      const {
        data: createClassificationData,
        error: createClassificationError,
      } = Classification.createClassification({ cache: false, payload });

      watch([createClassificationData, createClassificationError], () => {
        console.log(createClassificationData, createClassificationError);
        if (createClassificationData.value)
          commit(MutationTypes.CREATE_CLASSIFICATION_STATUS, "success");
        if (createClassificationData.value) {
          let classifications =
            createClassificationData.value.classificationDefs || [];
          classifications = [...state.classifications, ...classifications];
          classifications = classifications.map((classification) => {
            classification.alias = classification.name;
            return classification;
          });
          console.log("getClassifications -> classifications", classifications);
          commit(MutationTypes.SET_CLASSIFICATIONS, { classifications });
          const classificationTree = getters.transformClassificationTreeData;
          console.log(classificationTree, "classifciation Tree");
          commit(MutationTypes.SET_CLASSIFICATION_TREE, {
            tree: classificationTree,
          });
          commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "success");
        } else if (
          !createClassificationData.value &&
          createClassificationError.value
        ) {
          commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "error");
        }
      });
      return true;
    } catch (err) {
      commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, "error");
      return false;
    }
  },
  [ActionTypes.UPDATE_CLASSIFICATION_LIST_BY_ID](
    { commit, getters },
    classification
  ) {
    commit(MutationTypes.UPDATE_CLASSIFICATION_LIST_BY_ID, { classification });
    const classificationTree = getters.transformClassificationTreeData;
    commit(MutationTypes.SET_CLASSIFICATION_TREE, { tree: classificationTree });
  },
  [ActionTypes.UPDATE_CLASSIFICATION_TREE]({ commit }, tree) {
    commit(MutationTypes.SET_CLASSIFICATION_TREE, tree);
  },
  [ActionTypes.SET_CLASSIFICATION_STATUS]({ commit }, status) {
    commit(MutationTypes.SET_CLASSIFICATIONS_STATUS, status);
  },
  [ActionTypes.FILTER_CLASSIFICATION_TREE](
    { commit, getters },
    searchText: string
  ) {
    const tree = getters.getFilteredClassificationsBySeach(searchText);
    commit(MutationTypes.SET_FILTERED_CLASSIFICATION_TREE, tree);
  },
};
