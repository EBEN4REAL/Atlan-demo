import { ActionTree, ActionContext } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

// import { getAxiosClient } from "~/api";

import { State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutation";
import { ActionTypes } from "./types-action";

import { Components } from "~/api/auth/client";
import { Tenant } from "~/api/auth/tenant";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.TENANT_GET_TENANT]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.TENANT_GET_TENANT]({ commit, state }) {
    try {
      commit(MutationTypes.TENANT_SET_STATUS, {
        loading: true,
      });

      const response = await Tenant.Get(undefined, {
        cache: true,
      });
      if (response.data) {
        const data: Components.Schemas.RealmRepresentation = response.data;
        commit(MutationTypes.TENANT_SET_TENANT, data);
      }
    } catch (err) {
      if (err) {
        commit(MutationTypes.TENANT_SET_STATUS, {
          loading: true,
          error: err,
        });
      }
    }
  },
};
