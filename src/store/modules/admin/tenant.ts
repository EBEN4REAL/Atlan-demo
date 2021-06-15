import { GetterTree, MutationTree, ActionTree } from "vuex";
import { Components } from "~/api/auth/client";
import { Tenant } from "~/api/auth/tenant";
import {
  TENANT_FETCH_DATA,
  TENANT_SET_DATA,
  TENANT_SET_STATUS,
  UPDATE_SMTP_CONFIG,
} from "~/constant/store_types";
import { Status } from "~/types/status";

type Getter = GetterTree<State, any>;

export interface State extends Status {
  data: Components.Schemas.RealmRepresentation;
}

export const state: State = {
  data: {},
  loading: false,
  error: undefined,
};

export const getters: Getter = {
  getDisplayName: (state) => state.data.displayName,
  getDisplayNameHTML: (state) => state.data.displayNameHtml,
  getRealmName: (state) => state.data.id,
};

export const mutations: MutationTree<State> = {
  [TENANT_SET_DATA]: (
    state: State,
    data: Components.Schemas.RealmRepresentation
  ) => {
    state.data = data;
    state.loading = false;
    state.error = undefined;
  },
  [TENANT_SET_STATUS]: (state: State, payload: Status) => {
    state.loading = payload.loading;
    state.error = payload.error;
  },
  [UPDATE_SMTP_CONFIG]: (state: State, payload) => {
    console.log(state.data);
    // state.data = {
    //   ...state.data,
    //   smtpServer: payload,
    // };
  },
};

export const actions: ActionTree<State, any> = {
  async [TENANT_FETCH_DATA]({ commit, state }) {
    try {
      commit(TENANT_SET_STATUS, {
        loading: true,
      });

      const response = await Tenant.Get(undefined, {
        cache: true,
      });
      console.log(response);
      if (response) {
        commit(TENANT_SET_DATA, response);
      }
    } catch (err) {
      console.log(err);
      if (err) {
        commit(TENANT_SET_STATUS, {
          loading: true,
          error: err,
        });
      }
    }
  },
};

export const tenant = {
  state,
  mutations,
  actions,
  getters,
};
