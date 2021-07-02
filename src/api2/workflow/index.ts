import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { WORKFLOW_LIST } from "../keymap/workflow";
import { useAPI } from "../useAPI";

const List = (
    params?: any,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => {
    return useAPI<any>(WORKFLOW_LIST, "GET", {
        params,
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};

// const List = (params?: any, options?: AxiosRequestConfig) => {
//     return getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
//       params,
//       ...options,
//     });
//   };


export const Workflow = {
    List,
};