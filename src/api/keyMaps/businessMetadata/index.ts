import { getAPIPath } from "~/api";

export const GET_BUSINESS_METADATA = 'GET_BUSINESS_METADATA';

const businessMetadataMap: Record<string, (...params: any) => string> = {
    [GET_BUSINESS_METADATA]: () => getAPIPath('auth/atlas', `/types/typedefs`),
}

export default businessMetadataMap;