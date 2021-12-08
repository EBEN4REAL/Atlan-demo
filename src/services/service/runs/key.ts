import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const RUN_LIST = 'RUN_LIST'

export const map = {
    [RUN_LIST]: () => getAPIPath(BASE_PATH, '/runs'),
}
