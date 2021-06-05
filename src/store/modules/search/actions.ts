import { ActionTree, ActionContext } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";
import axios from "axios";
// import { getAxiosClient } from "~/api";

import { SearchParameters, State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutation";
import { ActionTypes } from "./types-action";

import { Search } from "~/api/atlas/search";
import { Components } from "~/api/atlas/client.d";
import { BasicSearchAttributes } from "~/constant/projection";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.SEARCH_FETCH_LIST](
    { commit }: AugmentedActionContext,
    params?: SearchParameters
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.SEARCH_FETCH_LIST](
    { commit, state },
    params: SearchParameters
  ) {
    try {
      if (state.loading && state.cancelToken) {
        state.cancelToken.cancel("Operation canceled by the user.");
      }
      commit(MutationTypes.SEARCH_SET_SEARCH, params);
      let body = state.searchParameters;

      body.attributes = BasicSearchAttributes;

      if (body.query === "*") {
        delete body.query;
      }

      const response = await Search.Basic(body, {
        cache: true,
        cancelToken: state.cancelToken.token,
      });
      if (response) {
        commit(MutationTypes.SEARCH_SET_LIST, response.data);
      }
    } catch (err) {
      if (err) {
        commit(MutationTypes.SEARCH_SET_STATUS, {
          loading: false,
          error: err,
        });
      }
    }
  },
};
