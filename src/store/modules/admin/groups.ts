import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { GroupApi } from "~/api/auth/group";
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
  [GET_GROUP_LIST]:({commit}, params) => {
    //update the API params
    commit(SET_GROUP_LIST_API_PARAMS, params)

    console.log(state.groupListAPIParams)
    //make API call to get new group list with new params   
    const {data} = GroupApi.listGroup(state.groupListAPIParams, {});
    commit(SET_GROUP_LIST, data);
  },

}

export const groups = {
  state,
  getters,
  mutations,
  actions
}




