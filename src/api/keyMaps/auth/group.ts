import { getAPIPath } from "~/api";

export const LIST_GROUPS = 'LIST_GROUPS';

const groupsMap: Record<string, (...params:any) => string> = {
    [LIST_GROUPS]: () => getAPIPath('auth', "/groups/v2")
}

export default groupsMap;