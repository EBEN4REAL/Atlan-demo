import { getAPIPath } from "~/api";

export const GET_CLASSIFICATION_LIST = "GET_CLASSIFICATION_LIST";
export const CREATE_CLASSIFICATION = "CREATE_CLASSIFICATION";
export const BASIC_SEARCH = "BASIC_SEARCH";

const classificationMap: Record<string, (...params: any) => string> = {
  [GET_CLASSIFICATION_LIST]: () =>
    getAPIPath("auth/atlas", "/types/typedefs?type=classification"),
  [CREATE_CLASSIFICATION]: () => getAPIPath("auth/atlas", "/types/typedefs"),
  [BASIC_SEARCH]: () => getAPIPath("auth/atlas", "/search/basic"),
};

export default classificationMap;
