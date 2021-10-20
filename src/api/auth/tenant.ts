import { AxiosRequestConfig } from 'axios'
import { getAPIPath, getAxiosClient } from '~/api'
import { useAPI } from '~/services/api/useAPI'
import { getEnv } from '~/modules/__env'

const serviceAlias = 'service'

const Get = (params?: any, options?: AxiosRequestConfig) =>
    getAxiosClient().get(getAPIPath(serviceAlias, '/tenants/default'), {
        params,
        ...options,
    })

const TestSmtpConfig = (body) => {
    return useAPI('TEST_SMTP_CONFIG', 'POST', {
        cache: false,
        body,
    })
}

const Update = ({ cache, body }) =>
    useAPI('UPDATE_SMTP', 'POST', {
        cache,
        body: { ...body, realm: getEnv().DEFAULT_REALM },
    })

export const Tenant = {
    Get,
    TestSmtpConfig,
    Update,
}
