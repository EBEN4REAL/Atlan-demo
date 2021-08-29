import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { RUN_ARCHIVED_LIST,RUN_STOP } from "../keymap/run";
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


const Stop = (
    id?: any,
    body?: Ref,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => useAPI<any>(RUN_STOP, "POST", {
        pathVariables: {
            id
        },
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });



// eslint-disable-next-line import/prefer-default-export
export const Run = {
    List,
    Stop
}

