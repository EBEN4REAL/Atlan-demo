import { getAPIPath } from "~/api";

export const CONNECTION_SETUP = 'CONNECTION_SETUP';
export const CONNECTION_TEST_NETWORK = 'CONNECTION_TEST_NETWORK';
export const CONNECTION_ARCHIVE = "CONNECTION_ARCHIVE";

const connectionmap: Record<string, (...params: any) => string> = {
    [CONNECTION_SETUP]: () => getAPIPath('auth/atlas', `/connections/setup`),
    [CONNECTION_TEST_NETWORK]: () => getAPIPath('auth', `/connections/test`),
    [CONNECTION_ARCHIVE]: (id) => getAPIPath('auth', `/connections/${id}/archive`),
}

export default connectionmap;