import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_SCOPES = 'LIST_SCOPES'

export const map = {
    LIST_SCOPES: () => getAPIPath('/service', '/scopes'),
}
