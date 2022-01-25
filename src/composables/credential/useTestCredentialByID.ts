import { Ref, ref } from 'vue'

import { Credential } from '~/services/service/credentials'
import { useOptions } from '~/services/api/common'

export default function useTestCredentialByID(path: any, immediate) {
    const options: useOptions = {}

    options.asyncOptions = ref({
        immediate,
        resetOnExecute: true,
    })

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Credential.TestByID(path, options)

    return {
        data,
        options,
        mutate,
        isReady,
        error,
        isLoading,
        isValidating,
    }
}
