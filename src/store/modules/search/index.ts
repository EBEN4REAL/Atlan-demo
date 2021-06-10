import axios from 'axios';
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { Components } from '~/api/atlas/client';
import { Search } from '~/api/atlas/search';
import { BasicSearchAttributes } from '~/constant/projection';
import {
    SEARCH_FETCH_LIST,
    SEARCH_SET_SEARCH,
    SEARCH_SET_LIST,
    SEARCH_SET_STATUS,
    SEARCH_GET_LIST,
} from "~/constant/store_types";
import { SearchParameters } from '~/types/atlas/attributes';
import { Status } from '~/types/status';




type Getters = GetterTree<State, any>

export interface State extends Status {
    data: Components.Schemas.AtlasSearchResult;
    limit: number;
    offset: number;
    searchParameters?: SearchParameters;
}

export const state: State = {
    data: {},
    loading: false,
    error: undefined,
    cancelToken: undefined,
    searchParameters: {
        typeName: "Table",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 50,
        offset: 0,
        entityFilters: {},
    }
}

export const getters: Getters = {
    [SEARCH_GET_LIST]: state => state.data.entities
}

export const mutations: MutationTree<State> = {
    [SEARCH_SET_LIST]: (state: State,
        data: Components.Schemas.AtlasSearchResult) => {
        state.data = data;
        state.loading = false;
        state.error = undefined;
    },
    [SEARCH_SET_STATUS]: (state: State, payload: Status) => {
        state.loading = payload.loading;
        state.error = payload.error;
    },
    [SEARCH_SET_SEARCH](state: State, payload: SearchParameters) {
        Object.keys(payload).map((property: string) => {
            state.searchParameters[property] = payload[property];
        });
        state.loading = true;
        state.error = undefined;
        state.cancelToken = axios.CancelToken.source();
    },
}

export const actions: ActionTree<State, any> = {
    async [SEARCH_FETCH_LIST](
        { commit, state },
        params: SearchParameters
    ) {
        try {
            if (state.loading && state.cancelToken) {
                state.cancelToken.cancel("Operation canceled by the user.");
            }
            commit(SEARCH_SET_SEARCH, params);
            let body = state.searchParameters;
            body.attributes = BasicSearchAttributes;

            if (body.query === "*") {
                delete body.query;
            }

            const response = await Search.Basic(body, {
                cache: true,
                cancelToken: state.cancelToken.token,
            });

            console.log(response);

            if (response) {
                commit(SEARCH_SET_LIST, response);
            }
        } catch (err) {
            if (err) {
                commit(SEARCH_SET_STATUS, {
                    loading: false,
                    error: err,
                });
            }
        }
    },
}

export const search = {
    state,
    getters,
    mutations,
    actions
}




