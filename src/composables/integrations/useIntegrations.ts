import { Ref, ref, watch } from 'vue'
import axios from 'axios'
import { Integrations } from '~/services/service/integrations'
import integrationStore from '~/store/integrations/index'

export const getIntegrationById = (id) => {
    const pV = ref({ id })
    const { data, isLoading, error, isReady } = Integrations.getIntegrationById(pV)

    return { data, isLoading, error }
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

const cancel = ref(axios.CancelToken.source())

const getIntegrationsList = (immediate = true) => {

    const options = {
        asyncOptions: { immediate },
        options: ref({ cancelToken: cancel.value.token })
    }
    const params = ref({ limit: 100, offset: 0, count: true })
    const { data, isLoading, error, isReady, mutate } = Integrations.List(params, options)

    const records = ref([])
    watch(data, (v) => {
        if (v) records.value = data.value ?? null
    })

    const call = async () => {
        if (cancel.value) {
            cancel.value.cancel('get cancelled')
        }
        cancel.value = axios.CancelToken.source()
        options.options.value.cancelToken = cancel.value.token
        await mutate()

    }
    return { data: records, isLoading, error, isReady, call }
}

export const refetchIntegration = (id) => {
    const { updateIntegration } = integrationStore()
    const {
        data: i,
        isLoading: loading,
        error: e,
    } = getIntegrationById(id)

    watch(i, (v) => {
        if (v) updateIntegration(v)
    })
}

const useIntegrations = (immediate = true) => {

    const { setAllIntegrationsList, setAllIntegrationsFetchError } = integrationStore()


    const { data, isLoading, error, isReady, call } = getIntegrationsList(immediate)

    watch([error, data], () => {
        if (data?.value?.length) {
            setAllIntegrationsList(data.value)
            setAllIntegrationsFetchError(null)
        } else if (error) {
            setAllIntegrationsFetchError(error)
        }
    })

    return {
        call,
        isLoading,
        error,
        isReady,
    }
}

const getIntegrationsConfigList = (immediate = true) => {

    const options = {
        asyncOptions: { immediate },
        options: ref({ cancelToken: cancel.value.token })
    }
    const params = ref({})
    const { data, isLoading, error, isReady, mutate } = Integrations.ListConfigs(params, options)

    const records = ref([])

    watch(data, (v) => {
        if (v) records.value = data.value?.integrationConfigs ?? null
    })

    const call = async () => {
        if (cancel.value) {
            cancel.value.cancel('get cancelled')
        }
        cancel.value = axios.CancelToken.source()
        options.options.value.cancelToken = cancel.value.token
        await mutate()

    }
    return { data: records, isLoading, error, isReady, call }
}


export const fetchIntegrationConfig = (immediate = true) => {
    const { setAllIntegrationsConfig } = integrationStore()

    const { data, isLoading, error, isReady, call } = getIntegrationsConfigList(immediate)

    watch(data, () => {
        if (data?.value?.length) {
            setAllIntegrationsConfig(data.value)
        }
    })

    return { data, isLoading, error, isReady, call }
}

export default useIntegrations;
