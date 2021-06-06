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
import { ConnectionAttributes } from "~/constant/projection";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.CONNECTION_FETCH_LIST]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.CONNECTION_FETCH_LIST]({ commit, state }) {
    try {
      commit(MutationTypes.CONNECTION_SET_STATUS, {
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
        attributes: ConnectionAttributes,
        entityFilters: {},
      };
      const response = await Search.Basic(body, {
        cache: true,
      });
      if (response) {
        const data: Components.Schemas.AtlasSearchResult = response.data;
        console.log(data);
        commit(MutationTypes.CONNECTION_SET_LIST, data);
      }
    } catch (err) {
      if (err) {
        commit(MutationTypes.CONNECTION_SET_STATUS, {
          loading: true,
          error: err,
        });
      }
    }
  },
};
