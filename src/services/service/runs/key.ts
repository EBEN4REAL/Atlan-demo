import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const RUN_LIST = 'RUN_LIST'
export const GET_RUN = 'GET_RUN'

export const map = {
    [RUN_LIST]: () => getAPIPath(BASE_PATH, '/runs'),
    [GET_RUN]: ({ name }: PathParams) => getAPIPath(BASE_PATH, `/runs/${name}`),
}
