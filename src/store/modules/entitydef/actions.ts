import { ActionTree, ActionContext } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

// import { getAxiosClient } from "~/api";

import { State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutation";
import { ActionTypes } from "./types-action";

// import { Typedef } from "~/api/atlas/typedef";
import { Components } from "~/api/atlas/client.d";
import { Typedef } from "~/api/atlas/typedef";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.ENTITYDEF_FETCH_LIST]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.ENTITYDEF_FETCH_LIST]({ commit }) {
    try {
      commit(MutationTypes.ENTITYDEF_SET_STATUS, {
        loading: true,
      });
      const response = await Typedef.List(undefined, {
        cache: true,
      });
      if (response.data) {
        const data: Components.Schemas.AtlasTypesDef = response.data;
        commit(MutationTypes.ENTITYDEF_SET_DATA, data);
      }
    } catch (err) {
      console.log(err);
      if (err) {
        commit(MutationTypes.ENTITYDEF_SET_STATUS, {
          loading: true,
          error: err,
        });
      }
    }
  },
};
