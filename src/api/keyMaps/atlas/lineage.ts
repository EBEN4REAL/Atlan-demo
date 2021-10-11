import { getAPIPath } from "~/api";

export const GET_LINEAGE = "GET_LINEAGE";

const lineageMap: Record<string, (...params: any) => string> = {
  [GET_LINEAGE]: ({ guid, depth, direction }: Record<string, string>) =>
    getAPIPath(
      "metastore",
      `/lineage/${guid}?depth=${depth}&direction=${direction}`
    ),
};

export default lineageMap;
