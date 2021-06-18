import { getAPIPath } from "~/api";

export const LIST_GROUPS = "LIST_GROUPS";

const groupsMap: Record<string, (...params: any) => string> = {
  [LIST_GROUPS]: () => getAPIPath("auth", "/groups"),
};

export default groupsMap;
