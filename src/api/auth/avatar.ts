import { AxiosRequestConfig } from "axios";
import { Ref } from "vue";
import { IConfig } from "swrv";
import { AsyncStateOptions } from "@vueuse/core";
import { UPLOAD_AVATAR } from "~/api/keyMaps/auth/avatar"
import { useAPI } from "../../services/api/useAPI";



export const URL = {
  UPLOAD_AVATAR: "/avatar"
}

const UploadAvatar = (cache?: string, body?: Ref<any>, options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>, dependantFetchingKey?: Ref<any>) => useAPI<any>(UPLOAD_AVATAR, "POST", {
    cache,
    body,
    options,
    dependantFetchingKey
  })

export const Avatar = {
  URL,
  UploadAvatar,
};


