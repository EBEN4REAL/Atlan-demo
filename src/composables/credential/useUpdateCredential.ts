import { Ref, ref } from 'vue'

import { Credential } from '~/services/service/credentials'
import { useOptions } from '~/services/api/common'

export default function useUpdateCredential(path: any, body: any, immediate) {
    const options: useOptions = {}

    options.asyncOptions = ref({
        immediate,
        resetOnExecute: false,
    })

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Credential.UpdateByID(path, body, options)

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
