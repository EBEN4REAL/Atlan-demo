import { getAPIPath } from '~/services/api/common'

// Integration & Integration types
export const GET_LICENSE = 'GET_LICENSE'

export const map = {
    [GET_LICENSE]: () => getAPIPath('/service', '/license'),
}
