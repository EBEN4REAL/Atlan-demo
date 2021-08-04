import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { RUN_ARCHIVED_LIST } from "../keymap/run";

import { useAPI } from "../useAPI";

const List = (
    params?: Ref,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => useAPI<any>(RUN_ARCHIVED_LIST, "GET", {
        params,
        options,
        cacheSuffix,
        dependantFetchingKey
    });

// const List = (params?: any, options?: AxiosRequestConfig) => {
//     return getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
//       params,
//       ...options,
//     });
//   };


export const Run = {
    List,
};