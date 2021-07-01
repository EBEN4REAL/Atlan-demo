import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { GET_TENANT } from "../keymap/tenant";
import { useAPI } from "../useAPI";

const GetTenant = (
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: string,
    dependantFetchingKey?: Ref<any>
) => {
    return useAPI<any>(GET_TENANT, "GET", {
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};

export const Tenant = {
    GetTenant,
};