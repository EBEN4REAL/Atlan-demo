import { getAPIPath } from "~/api";

export const LIST_GROUPS = "LIST_GROUPS";
export const GET_GROUP = "GET_GROUP";
export const UPDATE_GROUP = "UPDATE_GROUP";

const groupsMap: Record<string, (...params: any) => string> = {
  [LIST_GROUPS]: () => getAPIPath("auth", "/groups"),
  [GET_GROUP]: () => getAPIPath("auth", `/groups`),
  [UPDATE_GROUP]: ({ id }) => getAPIPath("auth", `/groups/${id}`),
};

export default groupsMap;
