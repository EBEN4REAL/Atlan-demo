import { getAPIPath } from "~/api";

export const TEST_NETWORK = 'LIST_GROUPS';
export const Setup = 'Setup';

const groupsMap: Record<string, (...params:any) => string> = {
    [TEST_NETWORK]: () => getAPIPath('auth', "/connections/test"),
    [Setup]: () => getAPIPath('auth', "/connections")
}

export default groupsMap;