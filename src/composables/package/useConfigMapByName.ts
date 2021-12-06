import axios from 'axios'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Ref, ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export function useConfigMapByName(name, immediate = true) {
    // const params = ref({ filter: { name } })
    const pathVariables = { name }

    const options: useOptions = {
        asyncOptions: {
            immediate,
        },
    }
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    console.log(pathVariables)

    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowPackagesConfigMapByName({
            pathVariables,
            options,
        })

    const changeName = (n) => {
        pathVariables.value.name = n
        mutate()
    }

    const configMap = ref({})
    watch(data, () => {
        if (!data?.value) return
        configMap.value = data.value
    })

    return {
        changeName,
        data,
        configMap,
        error,
        isLoading,
        mutate,
    }
}
