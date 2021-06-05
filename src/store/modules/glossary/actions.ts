import { ActionTree, ActionContext } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

// import { getAxiosClient } from "~/api";

import { State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutation";
import { ActionTypes } from "./types-action";

import { Search } from "~/api/atlas/search";
import { Components } from "~/api/atlas/client.d";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.GLOSSARY_FETCH_LIST]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GLOSSARY_FETCH_LIST]({ commit, state }) {
    try {
      commit(MutationTypes.GLOSSARY_SET_STATUS, {
        loading: true,
      });

      let body: Components.Schemas.SearchParameters = {
        typeName: state.assetType,
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: state.limit,
        offset: state.offset,
        attributes: [],
        entityFilters: {},
      };
      const response = await Search.Basic(body, {
        cache: true,
      });
      if (response) {
        const data: Components.Schemas.AtlasSearchResult = response.data;
        commit(MutationTypes.GLOSSARY_SET_LIST, data);
      }
    } catch (err) {
      if (err) {
        commit(MutationTypes.GLOSSARY_SET_STATUS, {
          loading: true,
          error: err,
        });
      }
    }
  },
};
