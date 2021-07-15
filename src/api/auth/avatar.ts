import { AxiosRequestConfig } from "axios";
import { useAPI } from "../useAPI";
import { UPLOAD_AVATAR } from "~/api/keyMaps/auth/avatar"
import { Ref } from "vue";
import { IConfig } from "swrv";
import { AsyncStateOptions } from "@vueuse/core";



export const URL = {
  UPLOAD_AVATAR: "/avatar"
}

const UploadAvatar = (cache?: string, body?: Ref<any>, options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>, dependantFetchingKey?: Ref<any>) => {
  return useAPI<any>(UPLOAD_AVATAR, "POST", {
    cache,
    body,
    options,
    dependantFetchingKey
  });
}

export const Avatar = {
  URL,
  UploadAvatar,
};


