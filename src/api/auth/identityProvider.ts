import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "auth";

const createIDP = (params?: any) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, "/idp"), params);
};

const updateIDP = (alias?: string, params?: any) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}`), params)
};

const deleteIDP = (alias?: string) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}/delete`))
}

const getMappers = (alias?: string, options?: AxiosRequestConfig) => {
    return getAxiosClient().get(getAPIPath(serviceAlias, `/idp/${alias}/mappers`), {
        ...options
    })
}

const createMapper = (alias?: String, params?: any) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/idp/${alias}/mappers`), params);
};

const getDefaultIDP = () => {
    return getAxiosClient().get(getAPIPath(serviceAlias, `/idp/default`));
}

const setDefaultIDP = (alias: String) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/idp/default/${alias}`));
}

const deleteDefaultIDP = (alias: String) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/idp/default/${alias}/delete`));
}

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
