import { ref, computed, watch, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '~/store/auth'
import integrationStore from '~/store/integrations/index'
import useIntegrations, {
    archiveIntegration,
    refetchIntegration,
} from '~/composables/integrations/useIntegrations'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

const { origin } = window.location

export const getJiraInstallUrlState = (isTenant: boolean) => {

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

    const { config: { clientId, oauthRedirectUrl, scopes } } = tenantJiraStatus.value


    const url = new URL('https://auth.atlassian.com/authorize?audience=api.atlassian.com&response_type=code')

    if (clientId && oauthRedirectUrl && scopes.length)
        url.search = new URLSearchParams({
            client_id: clientId,
            redirect_uri: oauthRedirectUrl,
            scope: scopes,
            response_type: 'code'
        }).toString()

    return url
}

export const tenantLevelOauthUrl = computed(() => {
    const oauthBaseUrl: URL = getOAuthBaseUrl()
    const state = getJiraInstallUrlState(true)
    const jiraOauth = `${oauthBaseUrl.href}&state=${state}&prompt=consent`
    return jiraOauth
})

// export const userLevelOauthUrl = computed(() => {
//     const store = integrationStore()
//     const { userJiraStatus, tenantJiraStatus } = toRefs(store)
//     const oauthBaseUrl =
//         userJiraStatus.value.oAuth || tenantJiraStatus.value.oAuth
//     const state = getJiraInstallUrlState(false)
//     const jiraOauth = `${oauthBaseUrl}&state=${state}`
//     return jiraOauth
// })

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

export function openJiraOAuth({
    w = 500,
    h = 600,
    tenant = false,
    callback = (status) => ({}),
}) {
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
