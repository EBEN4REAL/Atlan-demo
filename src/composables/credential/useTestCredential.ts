import { Ref, ref } from 'vue'

import axios from 'axios'

import { Credential } from '~/services/service/credentials'
import { useOptions } from '~/services/api/common'

export function useTestCredential(
    body: Record<string, any> | Ref<Record<string, any>>
) {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    options.asyncOptions = ref({
        immediate: false,
    })

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Credential.Test(body, options)

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const buildCredentialBody = (formState, propertyId, configName) => {
        const extra = {}
        Object.keys(formState).forEach((key) => {
            if (key.includes(`${propertyId}.extra.`)) {
                extra[key.replace(`${propertyId}.extra.`, '')] = formState[key]
            }
        })
        const authType = formState[`${propertyId}.auth-type`]
        return {
            host: formState[`${propertyId}.host`],
            port: parseInt(formState[`${propertyId}.port`]),
            authType,
            username: formState[`${propertyId}.${authType}.username`],
            password: formState[`${propertyId}.${authType}.password`],
            extra,
            connectorConfigName: configName,
        }
    }

    const refresh = () => {
        cancelRequest()
        mutate()
    }

    return {
        data,
        options,
        cancel,
        mutate,
        refresh,
        isReady,
        error,
        isLoading,
        isValidating,
        cancelRequest,
        buildCredentialBody,
    }
}
