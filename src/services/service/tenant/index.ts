/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { AxiosRequestConfig } from 'axios'

import { useOptions, resolveUrl } from '~/services/api/common'

const GetTenant = (options?: AxiosRequestConfig) =>
    useAPIPromise(resolveUrl(map.GET_TENANT), 'GET', { options: options || {} })

const UpdateTenant = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.POST_TENANT, 'POST', { body }, options || {})

const UploadLogo = (body?: Ref<any>, options?: useOptions) =>
    useAPI(map.UPLOAD_LOGO, 'POST', { body }, options || {})

const TestSmtpConfig = (body?: Ref<any>, options?: useOptions) =>
    useAPI(map.TEST_SMTP_CONFIG, 'POST', {
        body,
    }, options || {})

const UpdateSmtpConfig = (body?: Ref<any>, options?: useOptions) =>
    useAPI(map.POST_SMTP_CONFIG, 'POST', {
        body,
    }, options || {})

export const Tenant = {
    GetTenant,
    UpdateTenant,
    UploadLogo,
    TestSmtpConfig,
    UpdateSmtpConfig,
}
