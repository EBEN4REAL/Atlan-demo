import { getAPIPath } from "~/api";

export const BASIC_SEARCH = 'BASIC_SEARCH';

const searchmap: Record<string, (...params: any) => string> = {
    [BASIC_SEARCH]: () => getAPIPath('metastore', `/search/basic`),
}

export default searchmap;