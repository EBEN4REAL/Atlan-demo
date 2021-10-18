import { getAPIPath } from '~/api'

export const INDEX_SEARCH = 'INDEX_SEARCH'

const serviceAlias = 'meta'

const keyMap: Record<string, (...params: any) => string> = {
    [INDEX_SEARCH]: () => getAPIPath(serviceAlias, '/search/indexsearch'),
}

export default keyMap
