


import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { Components } from "~/api/auth/client";

import { CREDENTIAL_TEST, CREDENTIAL_TEST_BY_ID } from "../keymap/credential";
import { useAPI } from "../useAPI";

const TestCredential = (
    body?: Ref<Components.Schemas.ConnectionTest>,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => {
    return useAPI<any>(CREDENTIAL_TEST, "POST", {
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};


const TestCredentialByID = (
    id?: any,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => {
    console.log(id);
    return useAPI<any>(CREDENTIAL_TEST_BY_ID, "POST", {
        pathVariables: {
            id
        },
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};


export const Credential = {
    TestCredential,
    TestCredentialByID,
};

