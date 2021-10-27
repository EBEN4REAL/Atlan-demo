import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const UPLOAD_AVATAR = 'UPLOAD_AVATAR'

export const map = {
    [UPLOAD_AVATAR]: () => getAPIPath(BASE_PATH, '/avatar'),
}
