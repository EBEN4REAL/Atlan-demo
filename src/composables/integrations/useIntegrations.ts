import { Ref, ref, watch } from 'vue'
import axios from 'axios'
import { Integrations } from '~/services/service/integrations'
import integrationStore from '~/store/integrations/index'

export const getIntegrationById = (id) => {
    const pV = ref({ id })
    const { data, isLoading, error, isReady } = Integrations.getIntegrationById(pV)

    // const records = ref([])

    // watch(data, (v) => {
    //     if (v) records.value = data.value?.records ?? null
    // })
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

    const call = () => {
        if (cancel.value) {
            cancel.value.cancel('get cancelled')
        }
        cancel.value = axios.CancelToken.source()
        options.options.value.cancelToken = cancel.value.token
        mutate()

    }
    return { data: records, isLoading, error, isReady, call }
}

const useIntegrations = (immediate = true) => {

    const { setAllIntegrationsList } = integrationStore()


    const { data, isLoading, error, isReady, call } = getIntegrationsList(immediate)

    watch(data, () => {
        if (data?.value?.length) {
            setAllIntegrationsList(data.value)
        }
    })

    return {
        call,
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
