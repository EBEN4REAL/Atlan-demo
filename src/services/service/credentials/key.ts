import { isRef, Ref } from 'vue'
import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const TEST_CREDENTIAL = 'TEST_CREDENTIAL'
export const QUERY_CREDENTIAL = 'QUERY_CREDENTIAL'
export const GET_CREDENTIAL = 'GET_CREDENTIAL'

export const TEST_CREDENTIAL_BY_GUID = 'TEST_CREDENTIAL_BY_GUID'
export const UPDATE_CREDENTIAL_BY_GUID = 'UPDATE_CREDENTIAL_BY_GUID'

export const map = {
    [TEST_CREDENTIAL]: () => getAPIPath(BASE_PATH, '/credentials/test'),
    [QUERY_CREDENTIAL]: () => getAPIPath(BASE_PATH, '/credentials/query'),
    [GET_CREDENTIAL]: ({ id }: PathParams) =>
        getAPIPath(BASE_PATH, `/credentials/${id}`),
    [TEST_CREDENTIAL_BY_GUID]: (path: PathParams | Ref<PathParams>) => {
        if (isRef(path)) {
            return getAPIPath(BASE_PATH, `/credentials/${path.value.id}/test`)
        }
        return getAPIPath(BASE_PATH, `/credentials/${path.id}/test`)
    },
    [UPDATE_CREDENTIAL_BY_GUID]: (path: PathParams | Ref<PathParams>) => {
        if (isRef(path)) {
            return getAPIPath(BASE_PATH, `/credentials/${path.value.id}`)
        }
        return getAPIPath(BASE_PATH, `/credentials/${path.id}`)
    },
}
