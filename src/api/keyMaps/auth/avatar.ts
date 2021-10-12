import { getAPIPath } from '~/api'

export const UPLOAD_AVATAR = 'UPLOAD_AVATAR'

const avatarMap: Record<string, (...params: any) => string> = {
    [UPLOAD_AVATAR]: () => getAPIPath('service', '/avatars'),
}

export default avatarMap
