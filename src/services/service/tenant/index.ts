/* eslint-disable import/prefer-default-export */
import { Ref, isRef } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const GetTenant = (options?: useOptions) =>
    useAPI(map.GET_TENANT, 'GET', {}, options || {})

const UpdateTenant = (
        body: Ref<Record<string, any>> | Record<string, any>,
        options?: useOptions
    ) => {
         // Removing XSS vulnerability - slack ref: https://atlanhq.slack.com/archives/C02R5TGJX0R/p1642001739135100
        const requestPayload = isRef(body) ? body.value : body
        let modifiedBody = { ...requestPayload }
        if (requestPayload && requestPayload.hasOwnProperty('displayNameHtml')) {
            const { displayNameHtml, ...modifiedRequestPayload } = requestPayload
            modifiedBody = {
                ...modifiedRequestPayload,
            }
        }
        return useAPI(
            map.POST_TENANT,
            'POST',
            { body: modifiedBody },
            options || {}
        )
    }
const UploadLogo = (body?: Ref<any>, options?: useOptions) =>
    useAPI(map.UPLOAD_LOGO, 'POST', { body }, options || {})

const TestSmtpConfig = (body, options?: useOptions) =>
    useAPI(
        map.TEST_SMTP_CONFIG,
        'POST',
        {
            body,
        },
        options || {}
    )

export const Tenant = {
    GetTenant,
    UpdateTenant,
    UploadLogo,
    TestSmtpConfig,
}
