import { getAPIPath } from "~/api";

export const BASIC_SEARCH = 'BASIC_SEARCH';
export const SAVED_SEARCH = 'SAVED_SEARCH';

const searchMap: Record<string, (...params: any) => string> = {
    [BASIC_SEARCH]: () => getAPIPath('auth/atlas', `/search/basic`),
    [SAVED_SEARCH]: () => getAPIPath('auth/atlas', `/search/save`),
}

export default searchMap;