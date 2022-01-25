import { Ref, ref } from 'vue'

import axios from 'axios'

import { Credential } from '~/services/service/credentials'
import { useOptions } from '~/services/api/common'

export default function useGetCredential(id: string, immediate) {
    const options: useOptions = {}

    options.asyncOptions = ref({
        immediate,
        resetOnExecute: true,
    })

    const { data, mutate, error, isLoading, isReady } = Credential.GetByID(
        { id },
        options
    )

    return {
        data,
        options,

        mutate,

        isReady,
        error,
        isLoading,
    }
}
