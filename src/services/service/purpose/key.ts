import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_PURPOSE = 'LIST_PURPOSE'
export const CREATE_PURPOSE = 'CREATE_PURPOSE'
export const UPDATE_PURPOSE = 'UPDATE_PURPOSE'
export const ENABLE_DISABLE_PURPOSE = 'ENABLE_DISABLE_PURPOSE'

export const map = {
    LIST_PURPOSE: () => getAPIPath('/service', '/purposes'),
    CREATE_PURPOSE: () => getAPIPath('/service', '/purposes'),
    UPDATE_PURPOSE: ({ guid }: PathParams) =>
        getAPIPath('/service', `/purposes/${guid}`),
    UPDATE_PURPOSE_USERS: ({ guid }: PathParams) =>
        getAPIPath('/service', `/personas/${guid}/subjects`),
    DELETE_PURPOSE: ({ guid }: PathParams) =>
        getAPIPath('/service', `/purposes/${guid}`),
    LIST_SCOPES: () => getAPIPath('/service', '/scopes'),
    ENABLE_DISABLE_PURPOSE: ({ id }: PathParams) =>
        getAPIPath('/service', `/purposes/${id}/action`),
}
