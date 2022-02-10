import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const GET_TENANT = 'GET_TENANT'
export const POST_TENANT = 'POST_TENANT'
export const UPLOAD_LOGO = 'UPLOAD_LOGO'
export const TEST_SMTP_CONFIG = 'TEST_SMTP_CONFIG'
export const GET_TENANT_STATUS = 'GET_TENANT_STATUS'
export const REGISTER_TENANT = 'REGISTER_TENANT'

export const map = {
    [GET_TENANT]: () => getAPIPath(BASE_PATH, '/tenants/default'),
    [POST_TENANT]: () => getAPIPath(BASE_PATH, '/tenants/default'),
    [UPLOAD_LOGO]: () => getAPIPath(BASE_PATH, '/logo'),
    [TEST_SMTP_CONFIG]: () => getAPIPath(BASE_PATH, '/smtp/test'),
    [GET_TENANT_STATUS]: () => getAPIPath(BASE_PATH, '/tenants/default/status'),
    [REGISTER_TENANT]: () => getAPIPath(BASE_PATH, '/tenants'),
}
