import { Ref, ref, watch } from 'vue'
import { Integrations } from '~/services/service/integrations'
import integrationStore from '~/store/integrations/index'

interface IntType {
    name: String
}

export const getIntegrationTypes = () => {
    const params = ref({ limit: 10, offset: 0 })
    const { data, isLoading, error, isReady, mutate } = Integrations.ListTypes(params, { asyncOptions: { immediate: false } })

    const records: Ref<Array<IntType>> = ref([])
    const { setIntegrationStatus, setIntegrationTypes } = integrationStore()

    watch(data, (v) => {
        if (v) {
            records.value = data?.value?.records ?? null
            setIntegrationTypes(records.value)
            records.value.forEach(integration_type => {
                integration_type.integrationLevels.forEach(level => {
                    // initializing status
                    setIntegrationStatus({
                        name: integration_type.name,
                        level,
                        configured: false,
                        created: false
                    })
                })
            })
        }
    })
    return { data: records, isLoading, error, isReady, mutate }
}

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
        if (v) records.value = data.value?.records ?? null
    })
    return { data: records, isLoading, error, isReady }
}

const useIntegrations = () => {
    const { setAllIntegrationsList, setIntegrationStatus } = integrationStore()
    const { mutate: getTypes } = getIntegrationTypes()

    const { data, isLoading, error, isReady } = getIntegrationsList()


    watch(data, async () => {
        if (data?.value?.length) {
            await getTypes()
            setAllIntegrationsList(data.value)
            data.value.forEach((i: any) => {
                setIntegrationStatus({ name: i.name, level: i.integrationLevel, configured: !!i.isConfigured, created: true })
            })
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
