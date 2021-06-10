import { getAPIPath } from "~/api";

export const GET_TENANT = 'GET_TENANT';

const tenantMap: Record<string, string> = {
    [GET_TENANT]: getAPIPath('auth', "")
}

export default tenantMap;