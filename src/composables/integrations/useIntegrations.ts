import { Ref, ref, watch } from 'vue'
import { Integrations } from '~/services/service/integrations'
import integrationStore from '~/store/integrations/index'

export const getIntegrationById = (id) => {
    const pV = ref({ id })
    const { data, isLoading, error, isReady } = Integrations.List(pV)

    const records = ref([])

    watch(data, (v) => {
        if (v) records.value = data.value?.records ?? null
    })
    return { data: records, isLoading, error }
}

export const UpdateIntegration = (pV, body, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } =
        Integrations.UpdateIntegration(pV, body, { asyncOptions })
    return { data, isLoading, error, mutate }
}

export const archiveIntegration = (pV, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } =
        Integrations.archiveIntegration(pV, { asyncOptions })
    return { data, isLoading, error, mutate }
}

const getIntegrationsList = () => {
    const params = ref({ limit: 100, offset: 0, count: true })
    const { data, isLoading, error, isReady } = Integrations.List(params)

    const records = ref([])
    watch(data, (v) => {
        if (v) records.value = data.value ?? null
    })
    return { data: records, isLoading, error, isReady }
}

const useIntegrations = async () => {
    const { setAllIntegrationsList } = integrationStore()


    const { data, isLoading, error, isReady } = getIntegrationsList()
    watch(data, () => {
        if (data?.value?.length) {
            setAllIntegrationsList(data.value)
        }
    })

    return {
        isLoading,
        error,
        isReady,
    }
}

export const UnfurlSlackMessage = (body, asyncOptions) => {
    console.log("UnfurlSlackMessage called");
    const { data, isLoading, error, isReady, mutate } = Integrations.UnfurlSlackMessage(body, { asyncOptions })
    return { data, isLoading, error, mutate }
}

export default useIntegrations;
