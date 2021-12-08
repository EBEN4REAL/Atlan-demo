import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const UPLOAD_AVATAR = 'UPLOAD_AVATAR'
export const GET_AVATAR = 'GET_AVATAR'

export const map = {
    [UPLOAD_AVATAR]: () => getAPIPath(BASE_PATH, '/avatars'),
    [GET_AVATAR]: ({ username }: PathParams) =>
        `/api/${getAPIPath('service', `/avatars/${username}`)}`
}
