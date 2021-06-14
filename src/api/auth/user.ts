import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "auth";


export const URL = {
  UserList: "/users/v2"
}


const ListV2 = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.UserList), {
    params,
    ...options,
  });
};

export const User = {
  ListV2,
};
