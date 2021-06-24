import { getAPIPath } from "~/api";

export const BASIC_SEARCH = 'BASIC_SEARCH';

const searchMap: Record<string, (...params: any) => string> = {
    [BASIC_SEARCH]: () => getAPIPath('auth/atlas', `/search/basic`),
}

export default searchMap;