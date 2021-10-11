import { getAPIPath } from "~/api";

export const GET_BUSINESS_METADATA = "GET_BUSINESS_METADATA";
export const ADD_BUSINESS_METADATA = "ADD_BUSINESS_METADATA";
export const UPDATE_BUSINESS_METADATA = "UPDATE_BUSINESS_METADATA";
export const UPDATE_ASSET_BUSINESS_METADATA = "UPDATE_ASSET_BUSINESS_METADATA";

const businessMetadataMap: Record<string, (...params: any) => string> = {
  [GET_BUSINESS_METADATA]: () => getAPIPath("auth/atlas", `/types/typedefs`),
  [ADD_BUSINESS_METADATA]: () => getAPIPath("auth/atlas", `/types/typedefs`),
  [UPDATE_BUSINESS_METADATA]: () => getAPIPath("auth/atlas", `/types/typedefs`),
  [UPDATE_ASSET_BUSINESS_METADATA]: ({ guid }) => getAPIPath("auth/atlas", `/entity/guid/${guid}/businessmetadata`),
};

export default businessMetadataMap;