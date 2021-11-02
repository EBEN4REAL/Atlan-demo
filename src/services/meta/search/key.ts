import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const INDEX_SEARCH = 'INDEX_SEARCH'

export const map = {
    [INDEX_SEARCH]: () => getAPIPath(BASE_PATH, '/search/indexsearch'),
}
