import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV from "swrv";
import { useAPI } from "~/api/useAPI";
import { UPDATE_GROUP } from "~/api/keyMaps/auth/group";
const serviceAlias = "auth";

export const URL = {
  GroupList: "/groups",
};

// const listGroup = (params?: any, options?: AxiosRequestConfig) => {
//   const { data, error, mutate } = useSWRV([getAPIPath(serviceAlias, "/groups"), params, options], fetcher);
//   return {
//     data,
//     isLoading: !error && !data,
//     isError: error,
//     mutate
//   }
// }

const ListV2 = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.GroupList), {
    params,
    ...options,
  });
};
const DeleteGroup = (
  groupId: string,
  body?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/groups/${groupId}/delete`),
    body,
    options
  );
};
const EditGroup = (
  groupId: string,
  body: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/groups/${groupId}`),
    body,
    options
  );
};
const RemoveMembersFromGroup = (
  groupId: string,
  body: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/groups/${groupId}/members/remove`),
    body,
    options
  );
};
const CreateGroup = (body?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/groups`),
    body,
    options
  );
};
const AddMembers = (
  groupId: string,
  body: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/groups/${groupId}/members`),
    body,
    options
  );
};
const UpdateGroupV2 = (id: string, body) => {
  const { data, error, isLoading } = useAPI(UPDATE_GROUP, "POST", {
    cache: false,
    body,
    pathVariables: { id },
  });
  return { data, error, isLoading };
};
export const Group = {
  ListV2,
  EditGroup,
  RemoveMembersFromGroup,
  DeleteGroup,
  CreateGroup,
  AddMembers,
  UpdateGroupV2,
};
