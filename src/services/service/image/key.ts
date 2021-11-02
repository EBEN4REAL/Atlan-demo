import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'
export const GET_IMAGE = 'GET_IMAGE'

export const map = {
    [UPLOAD_IMAGE]: () => getAPIPath(BASE_PATH, '/images'),
    [GET_IMAGE]: ({ id }) => getAPIPath(BASE_PATH, `/images/${id}`),
}
