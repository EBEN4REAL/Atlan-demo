import axios from 'axios'
import { ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export function usePackageByName(name, immediate = false) {
    // const params = ref({ filter: { name } })
    const pathVariables = ref({ name })

    const options: useOptions = {
        asyncOptions: {
            immediate,
        },
    }
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowPackagesByName({
            pathVariables,
            options,
        })

    const changeName = (n) => {
        pathVariables.value.name = n
        mutate()
    }

    const workflowPackage = ref({})
    watch(data, () => {
        if (!data?.value) return
        workflowPackage.value = data.value
    })

    return {
        changeName,
        data,
        workflowPackage,
        error,
        isLoading,
        mutate,
    }
}
