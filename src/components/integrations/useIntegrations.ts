import { Ref, ref, watch } from 'vue'
import { Integrations } from '~/services/service/integrations/index'

interface IntType {
    name: String
}

export const getIntegrationTypes = () => {
    const params = ref({ limit: 10, offset: 0 })
    const { data, isLoading, error, isReady } = Integrations.ListTypes(params)

    const records: Ref<Array<IntType>> = ref([])

    watch(data, (v) => {
        if (v)
            records.value = data?.value?.records ?? null
    })
    return { data: records, isLoading, error }
}

export const getIntegrationsList = () => {
    const params = ref({ limit: 10, offset: 0, count: true })
    const { data, isLoading, error, isReady } = Integrations.List(params)

    const records = ref([])

    watch(data, (v) => {
        if (v)
            records.value = data.value?.records ?? null
    })
    return { data: records, isLoading, error }
}

export const getIntegrationById = (id) => {
    const pV = ref({ id })
    const { data, isLoading, error, isReady } = Integrations.List(pV)

    const records = ref([])

    watch(data, (v) => {
        if (v)
            records.value = data.value?.records ?? null
    })
    return { data: records, isLoading, error }
}

export const UpdateIntegration = (pV, body, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } = Integrations.UpdateIntegration(pV, body, { asyncOptions })

    const response = ref([])

    // watch(data, (v) => {
    //     if (v)
    //         records.value = data.value?.records ?? null
    // })
    return { data, isLoading, error, mutate }
}

export const archiveIntegration = (pV, asyncOptions) => {

    const { data, isLoading, error, isReady, mutate } = Integrations.archiveIntegration(pV, { asyncOptions })

    const response = ref([])

    // watch(data, (v) => {
    //     if (v)
    //         records.value = data.value?.records ?? null
    // })
    return { data, isLoading, error, mutate }
}

function installSlackUrl() {
    const scopes = [
        'chat:write',
        'chat:write.public',
        'channels:read',
    ]
    let { origin } = window.location

    if (origin.includes('localhost')) {
        origin = `https://beta.atlan.com`
    }

    const api = `${origin}/api/service/slack/auth`
    const state = {
        api,
    }

    const base64State = btoa(JSON.stringify(state))
    return `slack.com/oauth/v2/authorize?client_id=521029643301.1939789434946&scope=${scopes.join(
        ','
    )}&user_scope=&state=${base64State}`
}

export const getIntegrationLink = (alias) => {
    switch (alias.toLowerCase()) {
        case 'slack':
            return installSlackUrl()
        default: return ''
    }
}

