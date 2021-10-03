import { getAPIPath } from "~/api";

export const TEST_NETWORK = 'LIST_GROUPS';
export const Setup = 'Setup';

export const CONNECTION_SETUP = 'CONNECTION_SETUP';
export const CONNECTION_TEST_NETWORK = 'CONNECTION_TEST_NETWORK';
export const CONNECTION_ARCHIVE = "CONNECTION_ARCHIVE";


const groupsMap: Record<string, (...params: any) => string> = {
    [TEST_NETWORK]: () => getAPIPath('auth', "/connections/test"),
    [Setup]: () => getAPIPath('auth', "/connections"),
    [CONNECTION_SETUP]: () => getAPIPath('metastore', `/connections/setup`),
    [CONNECTION_TEST_NETWORK]: () => getAPIPath('auth', `/connections/test`),
    [CONNECTION_ARCHIVE]: ({ id }) => getAPIPath('auth', `/connections/${id}/archive`),
}

export default groupsMap;
