import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { Components } from '~/api/atlas/client';
import {
    CONNECTION_FETCH_LIST,
    CONNECTION_SET_LIST,
    CONNECTION_SET_STATUS,
} from "~/constant/store_types";
import { Status } from '~/types/status';


type Getters = GetterTree<State, any>

export interface State extends Status {
    data: Components.Schemas.AtlasSearchResult;
    assetType: string;
    limit: number;
    offset: number;
}

export const state: State = {
    data: {},
    assetType: "AtlanConnection",
    limit: 10000,
    offset: 0,
    loading: false,
    error: undefined,
}

export const getters: Getters = {
    getConnectionList: state => state.data.entities
}

export const mutations: MutationTree<State> = {
    [CONNECTION_SET_LIST]: (state: State,
        data: Components.Schemas.AtlasSearchResult) => {
        state.data = data;
        state.loading = false;
        state.error = undefined;
    },
    [CONNECTION_SET_STATUS]: (state: State, payload: Status) => {
        state.loading = payload.loading;
        state.error = payload.error;
    }
}

export const actions: ActionTree<State, any> = {
    [CONNECTION_FETCH_LIST]: ({ commit }, data) => {

    },
}

export const connection = {
    state,
    getters,
    mutations,
    actions
}




