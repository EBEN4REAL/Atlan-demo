import { getAPIPath } from "~/api";

export const ASSET_ACCESS = "ASSET_ACCESS";
const policiesMap: Record<string, (...params: any) => string> = {
  [ASSET_ACCESS]: () => getAPIPath("auth", "/access/evaluate"),
};

export default policiesMap;
