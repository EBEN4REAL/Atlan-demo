
import { fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
import useSWRV, { IConfig, } from "swrv";
import { reactive, ref, Ref, toRef, toRefs } from "vue";

const serviceAlias = "auth/atlas";


export const URL = {
  BulkUpdate: "/entity/bulk"
}

const BulkUpdate = (body?: Components.Schemas.AtlasEntitiesWithExtInfo,
  options?: AxiosRequestConfig) => {
  const data = getAxiosClient().post(getAPIPath(serviceAlias, URL.BulkUpdate), body, {
    ...options,
  });
  return data;
}

export const Entity = {
  BulkUpdate,
};
