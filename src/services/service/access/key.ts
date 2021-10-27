import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const WHO_AM_I = 'WHO_AM_I'
export const EVALUATE = 'EVALUATE'

export const map = {
    [WHO_AM_I]: () => getAPIPath(BASE_PATH, '/whoami'),
    [EVALUATE]: () => getAPIPath(BASE_PATH, '/evaluate'),
}
