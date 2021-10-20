import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";

const serviceAlias = "service";

const createIDP = (params?: any) => getAxiosClient().post(getAPIPath(serviceAlias, "/idp"), params);

const updateIDP = (alias?: string, params?: any) => getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}`), params);

const deleteIDP = (alias?: string) => getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}/delete`))

const getMappers = (alias?: string, options?: AxiosRequestConfig) => getAxiosClient().get(getAPIPath(serviceAlias, `/idp/${alias}/mappers`), {
        ...options
    })

const createMapper = (alias?: String, params?: any) => getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}/mappers`), params);

const getDefaultIDP = () => getAxiosClient().get(getAPIPath(serviceAlias, `/idp/default`))

const setDefaultIDP = (alias: String) => getAxiosClient().post(getAPIPath(serviceAlias, `/idp/default/${alias}`))

const deleteDefaultIDP = (alias: String) => getAxiosClient().post(getAPIPath(serviceAlias, `/idp/default/${alias}/delete`))

export const IdentityProvider = {
    createIDP,
    updateIDP,
    deleteIDP,
    getMappers,
    createMapper,
    getDefaultIDP,
    setDefaultIDP,
    deleteDefaultIDP
};
