import { ref, computed, watch, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '~/store/auth'
import integrationStore from '~/store/integrations/index'
import useIntegrations, {
    archiveIntegration,
    fetchIntegrationConfig,
    refetchIntegration,
} from '~/composables/integrations/useIntegrations'
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import { Integrations } from '~/services/service/integrations/index'
import { debouncedWatch } from '@vueuse/core'
import { issuesCount } from './useJiraTickets'
const { jiraListProjects, jiraGetProjectConfigurations } = Integrations


const { origin } = window.location

const getJiraInstallUrlState = (isTenant: boolean) => {

    const authStore = useAuthStore()
    const api = `${origin}/api/service/jira/auth`
    const userId = authStore.id
    const { username } = authStore
    const redirectUrl = `${origin}/admin/integrations/?success=true`


    const state = {
        api,
        origin,
        isTenant,
        userId,
        username,
        redirectUrl,
    }

    const base64State = btoa(JSON.stringify(state))
    return base64State
}

const getOAuthBaseUrl = () => {
    const store = integrationStore()

    const { tenantJiraStatus } = toRefs(store)

    const { integrationConfig: { clientId, oauthRedirectUrl, scopes } } = tenantJiraStatus.value


    const url = new URL('https://auth.atlassian.com/authorize')

    if (clientId && oauthRedirectUrl && scopes.length)
        url.search = new URLSearchParams({
            client_id: clientId,
            redirect_uri: oauthRedirectUrl,
            scope: scopes.join(' '),
            response_type: 'code',
            audience: 'api.atlassian.com'
        }).toString()

    return url
}

const tenantLevelOauthUrl = computed(() => {
    const oauthBaseUrl: URL = getOAuthBaseUrl()
    const state = getJiraInstallUrlState(true)
    const jiraOauth = `${oauthBaseUrl.href}&state=${state}&prompt=consent`
    return jiraOauth
})

const userLevelOauthUrl = computed(() => {
    const oauthBaseUrl: URL = getOAuthBaseUrl()
    const state = getJiraInstallUrlState(false)
    const jiraOauth = `${oauthBaseUrl}&state=${state}`
    return jiraOauth
})

const trackAddEvent = (tenant) => {
    if (tenant)
        useAddEvent('admin', 'integration', 'added', {
            integration: 'jira',
            level: 'tenant',
        })
    else
        useAddEvent('admin', 'integration', 'added', {
            integration: 'jira',
            level: 'user',
        })
}

const handlePopupClose = async (
    userJiraStatus,
    tenantJiraStatus,
    callback,
    tenant
) => {
    console.log('popup window closed')
    // ? recall all integration, (better (when filter support added): use filter and fetch only jira user level integration and update store)
    const { call } = useIntegrations(false)
    await call()
    // callback with status
    if (
        (!tenant && userJiraStatus.value.configured) ||
        (tenant && tenantJiraStatus.value.configured)
    ) {
        callback('success')
        trackAddEvent(tenant)
    } else callback('failure')
}

const openJiraOAuth = ({
    w = 600,
    h = 500,
    tenant = false,
    callback = (status) => ({}),
}) => {
    const store = integrationStore()
    const { userJiraStatus, tenantJiraStatus } = toRefs(store)
    const { width, height } = window.screen
    const leftPosition = width ? (width - w) / 2 : 0
    const topPosition = height ? (height - h) / 2 : 0
    const windowConfig = `height=600,width=500,left=${leftPosition},top=${topPosition},resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
    const new_window = window.open(
        tenant ? tenantLevelOauthUrl.value : userLevelOauthUrl.value,
        'popUpWindow',
        windowConfig
    )
    // *  emit('popupWindowVisible', new_window, true) * use if needed
    //! hack to detect window closing from crossXorigin
    const timer = setInterval(() => {
        if (new_window?.closed) {
            clearInterval(timer)
            handlePopupClose(
                userJiraStatus,
                tenantJiraStatus,
                callback,
                tenant
            )
        }
    }, 500)
}

export const connectJira = ({ callback = null, tenant = false }:
    { callback?: any, tenant: boolean }): any => {
    const { isLoading, call } =
        fetchIntegrationConfig(false)

    const connect = async () => {
        await call()
        openJiraOAuth({ tenant, callback: callback ? (s: string) => callback(s) : () => ({}) })
    }
    return { isLoading, connect }
}

export const archiveJira = (pV) => {
    const intStore = integrationStore()

    const {
        data,
        isLoading,
        error,
        mutate: disconnect,
    } = archiveIntegration(pV, { immediate: false })

    watch([isLoading, error], () => {
        if (isLoading.value) {
            message.loading({
                content: 'Disconnecting...',
                key: 'disconnect',
                duration: 2,
            })
        } else if (error.value) {
            const errMsg = error.value?.response?.data?.errorMessage || ''
            const generalError = 'Network error while disconnecting'
            const e = errMsg || generalError
            message.error({
                content: e,
                key: 'disconnect',
                duration: 2,
            })
        } else {
            intStore.removeIntegration(pV.value.id)
            message.success({
                content: 'Jira integration disconnected successfully',
                key: 'disconnect',
                duration: 2,
            })
        }
    })

    return {
        data,
        isLoading,
        error,
        disconnect,
    }
}


export const listProjects = () => {

    const searchText = ref()
    const maxResults = ref(100)
    const startAt = ref(0)
    const totalResults = ref()



    const params = computed(() => ({
        maxResults: maxResults.value,
        startAt: startAt.value,
        query: searchText.value
    }))


    const projects: any = ref([])

    const {
        data,
        isLoading,
        error,
        mutate,
    } = jiraListProjects(params)

    const loadMore = () => {
        startAt.value += projects.value?.length || 0
        mutate()
    }


    watch([data, error], () => {
        if (data.value) {
            const { values, total, isLast } = data.value
            if (startAt.value > 0) {
                projects.value = [...projects.value, ...(values || [])]
            } else
                projects.value = values
            totalResults.value = total
            if (isLast === false)
                loadMore()
        }

    }, { deep: true })

    const searchLoading = ref(false)
    const handleSearch = (v) => {
        projects.value = []
        startAt.value = 0
        searchText.value = v
    }




    debouncedWatch(searchText, async () => {
        searchLoading.value = true
        await mutate()
        searchLoading.value = false
    },
        { deep: true, debounce: 500 }
    )

    const lastPage = computed(() => totalResults.value === projects.value?.length)


    // const pagination = computed(() => ({
    //     totalPages: Math.ceil(
    //         totalResults.value / maxResults.value
    //     ),
    //     pageSize: maxResults.value,
    //     currentPage: startAt.value / maxResults.value + 1,
    // }))


    return {
        handleSearch, lastPage, projects, isLoading, error, searchText, searchLoading, loadMore
    }
}

export const getProjectConfig = (key) => {
    const options = {
        asyncOptions: {
            immediate: false,
            onError: (e) => {
                throw e
            },
        }
    }
    const params = computed(() => ({ projectKey: key.value }))
    const { data, isLoading, error, mutate, isReady } = jiraGetProjectConfigurations(params, options)
    const config = ref()
    watch(data, (v: any) => {
        if (v.projects?.length) {
            config.value = v.projects[0]
        }
    })

    const fetchConfig = async () => {
        config.value = null
        await mutate()
    }

    return { config, data, isLoading, error, fetchConfig, isReady }
}
