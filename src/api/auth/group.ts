import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV from "swrv";

const serviceAlias = "auth";

export const URL = {
  GroupList: "/groups/v2",
};

// const listGroup = (params?: any, options?: AxiosRequestConfig) => {
//   const { data, error, mutate } = useSWRV([getAPIPath(serviceAlias, "/groups/v2"), params, options], fetcher);
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
    getAPIPath(serviceAlias, `/${groupId}/members/remove`),
    body,
    options
  );
};

export const Group = {
  ListV2,
  EditGroup,
  RemoveMembersFromGroup,
  DeleteGroup,
};
