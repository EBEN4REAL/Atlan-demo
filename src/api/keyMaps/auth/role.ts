import { getAPIPath } from "~/api";

export const LIST_ROLES = "LIST_ROLES";

const roleMap: Record<string, (...params: any) => string> = {
  [LIST_ROLES]: () => getAPIPath("auth", "/roles"),
};
export default roleMap;
