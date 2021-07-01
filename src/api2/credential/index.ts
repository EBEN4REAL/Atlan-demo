


import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { Components } from "~/api/auth/client";

import { CREDENTIAL_TEST } from "../keymap/credential";
import { useAPI } from "../useAPI";

const TestCredential = (
    body?: Ref<Components.Schemas.ConnectionTest>,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: string,
    dependantFetchingKey?: Ref<any>
) => {
    return useAPI<any>(CREDENTIAL_TEST, "POST", {
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};


export const Credential = {
    TestCredential,
};

