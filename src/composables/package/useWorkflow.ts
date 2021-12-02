import axios from 'axios'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Ref, ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export function createWorkflow(body) {
    const params = ref({
        submit: true,
    })

    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate: false,
        onError: (e) => {
            throw e
        },
    })
    const { data, error, isLoading, mutate, isReady } =
        Workflows.createWorkflowPackage({
            body,
            params,
            options,
        })

    const execute = (now = false) => {
        params.value.submit = now
        mutate()
    }

    return { data, error, isLoading, execute, isReady }
}
