import { getAPIPath } from "~/api";

export const LIST_GROUPS = "LIST_GROUPS";
export const GET_GROUP = "GET_GROUP";

const groupsMap: Record<string, (...params: any) => string> = {
  [LIST_GROUPS]: () => getAPIPath("auth", "/groups"),
  [GET_GROUP]: () => getAPIPath("auth", `/groups`),
};

export default groupsMap;
