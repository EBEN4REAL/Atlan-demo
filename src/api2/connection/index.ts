


import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { Components } from "~/api/auth/client";

import { CONNECTION_SETUP, CONNECTION_TEST_NETWORK, CONNECTION_ARCHIVE } from "../keymap/connection";
import { useAPI } from "../useAPI";

const TestNetwork = (
    body?: Ref<Components.Schemas.ConnectionTest>,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => useAPI<any>(CONNECTION_TEST_NETWORK, "POST", {
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });

const Setup = (
    body?: Ref<Components.Schemas.ConnectionSetup>,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: Ref<string>,
    dependantFetchingKey?: Ref<any>
) => useAPI<any>(CONNECTION_SETUP, "POST", {
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });

const Archive = (id: string, options?: Ref<IConfig & AxiosRequestConfig>, cacheSuffix?: string,
    dependantFetchingKey?: Ref<any>) => useAPI<any>(CONNECTION_ARCHIVE, "POST", {
        pathVariables: {
            id
        },
        options,
        cacheSuffix,
        dependantFetchingKey
    });




// const Archive = (id: string, body?: Components.Schemas.ConnectionSetup, options?: AxiosRequestConfig) => {

//     return getAxiosClient().post(
//         getAPIPath(serviceAlias, `/connections/${id}/archive`),
//         {
//             deleteAssets: true,
//             deleteType: "HARD",
//         },
//         {
//             timeout: 10000
//         }
//     );
// }


export const Connection = {
    TestNetwork,
    Setup,
    Archive,
};

