import { getAPIPath, getAxiosClient } from "~/api";
const serviceAlias = "auth";

const createAPIKey = (body?: any) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, "/accesstokens"), body);
};

const deleteAPIKey = (id?: string) => {
    return getAxiosClient().post(getAPIPath(serviceAlias, `/accesstokens/${id}/delete`))
}

export const APIKeyService = {
    createAPIKey,
    deleteAPIKey
};
