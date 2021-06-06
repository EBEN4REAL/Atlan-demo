import { GetterTree, MutationTree, ActionTree } from 'vuex'
import {
    GET_GROUP_LIST,
    SET_GROUP_LIST,
    SET_GROUP_LIST_API_PARAMS,
  } from "~/constant/store_types";


type GroupGetter = GetterTree<GroupState, any>

export interface GroupState {
    groupList: Group[],
    groupListAPIParams: {}
}
  
export interface Group {
    text: string,
    checked: boolean
}

export const state: GroupState = {
  groupList: [],
  groupListAPIParams: {
    limit: 6,
    offset: 0,
    sort: "-created_at",
    filter: {},
  },
}

export const getters: GroupGetter = {
  groupList: state => state.groupList
}

export const mutations: MutationTree<GroupState> = {
  [SET_GROUP_LIST]:(state, newGroup) => {
    state.groupList = newGroup;
  },
  [SET_GROUP_LIST_API_PARAMS]:(state, newGroup) => {
    state.groupListAPIParams = {...state.groupListAPIParams, ...newGroup};
  }
}

export const actions: ActionTree<GroupState, any> = {
  [SET_GROUP_LIST]:({commit}, data) => {
    commit(SET_GROUP_LIST, data)
  },
  [SET_GROUP_LIST_API_PARAMS]:({commit}, params) => {
    commit(SET_GROUP_LIST_API_PARAMS, params)
  },
}

export const groups = {
  state,
  getters,
  mutations,
  actions
}




