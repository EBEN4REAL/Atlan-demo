import { ref, computed, watch, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { Integrations } from '~/services/service/integrations'
import { useAuthStore } from '~/store/auth'
import integrationStore from '~/store/integrations/index'
import useIntegrations, {
    archiveIntegration,
    refetchIntegration,
} from '~/composables/integrations/useIntegrations'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

const { origin } = window.location
if (origin.includes('localhost')) {
    // origin = `https://staging.atlan.com`
    // origin = `http://localhost:5008`
}

export const stripSlackText = (text) => {
    let transformedText = text

    // Matches URL
    const urlRegex =
        /<https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()|]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>/g

    transformedText = transformedText.replace(urlRegex, (match) => {
        const stripped = match.replace(/<|>/g, '')
        return stripped.includes('|') ? stripped.split('|')[1] : stripped
    })

    // Matches slack channel IDs of the format <#C02CY86RC3E|channel-name>
    const channelRegex = /<#[A-Z0-9]{11}\|(\S+)>/g
    transformedText = transformedText.replace(channelRegex, '#$1')

    return transformedText
}

export const getSlackInstallUrlState = (isTenant: boolean) => {
    const authStore = useAuthStore()
    const api = `${origin}/api/service/slack/auth`
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

    console.log('slack auth state', state)

    const base64State = btoa(JSON.stringify(state))
    return base64State
}

// id that we get in slack message link
function getTimestampFromSlackMessageId(id) {
    const removePchar = id.substring(1)
    const position = 11
    const dot = '.'
    const ts = `${removePchar.substring(0, 10)}.${removePchar.substring(10)}`
    return ts
}

export const shareOnSlack = ({
    assetID,
    integrationId,
    channelAlias,
    message,
    link,
}) => {
    const body = ref({
        id: assetID,
        integration: integrationId,
        message,
        link,
        domain: window.origin,
        channelAlias,
    })
    const { data, isLoading, error, isReady } = Integrations.ShareSlack(
        body,
        {}
    )
    return { data, isLoading, error, isReady }
}

export const askQuestionOnSlack = ({
    assetID,
    integrationId,
    channelAlias,
    message,
    link,
}) => {
    const body = ref({
        id: assetID,
        integration: integrationId,
        message,
        link,
        domain: window.origin,
        channelAlias,
    })
    const { data, isLoading, error, isReady } = Integrations.AskQuestionSlack(
        body,
        {}
    )
    return { data, isLoading, error, isReady }
}

// detects if its a valid slack chat url
export const isSlackLink = (link) =>
    link && link.includes('.slack.com/archives')

export const getChannelAndMessageIdFromSlackLink = (link) => {
    const idPaths = link.split('/archives/')[1]
    const channelId = idPaths.split('/')[0]
    const arrIdPaths = idPaths.split('/')
    const messageId = arrIdPaths.length > 1 ? getTimestampFromSlackMessageId(
        arrIdPaths[1].split('?')[0]
    ) : arrIdPaths[0]
    // if (idPaths.split("/")[1].includes("thread_ts")) {
    //     // eslint-disable-next-line prefer-destructuring
    //     messageId = idPaths.split("/")[1].split("thread_ts=")[1].split("&")[0]
    //     console.log("messageId", messageId)
    // }

    return {
        channelId,
        messageId,
    }
}

export const getDeepLinkFromUserDmLink = (memberId: string) => {
    // https://app.slack.com/client/TFB0VJX8V/DFQBG65CN
    // slack://channel?team=TFB0VJX8V&id=DFQBG65CN
    // const splits = link.split('/')
    // const teamId = splits[splits.length - 2]
    // const conversationId = splits[splits.length - 1]
    // const deepLink = `slack://channel?team=${teamId}&id=${conversationId}`
    const deepLink = `https://slack.com/app_redirect?channel=${memberId}`
    return deepLink
}

export const tenantLevelOauthUrl = computed(() => {
    const store = integrationStore()

    const { tenantSlackStatus } = toRefs(store)
    const oauthBaseUrl = tenantSlackStatus.value.oAuth
    const state = getSlackInstallUrlState(true)
    const slackOauth = `${oauthBaseUrl}&state=${state}`
    return slackOauth
})

export const userLevelOauthUrl = computed(() => {
    const store = integrationStore()
    const { userSlackStatus, tenantSlackStatus } = toRefs(store)
    const oauthBaseUrl =
        userSlackStatus.value.oAuth || tenantSlackStatus.value.oAuth
    const state = getSlackInstallUrlState(false)
    const slackOauth = `${oauthBaseUrl}&state=${state}`
    return slackOauth
})

const trackAddEvent = (tenant) => {
    if (tenant)
        useAddEvent('admin', 'integration', 'added', {
            integration: 'slack',
            level: 'tenant',
        })
    else
        useAddEvent('admin', 'integration', 'added', {
            integration: 'slack',
            level: 'user',
        })
}

const handlePopupClose = async (
    userSlackStatus,
    tenantSlackStatus,
    callback,
    tenant
) => {
    console.log('popup window closed')
    // ? recall all integration, (better (when filter support added): use filter and fetch only slack user level integration and update store)
    const { call } = useIntegrations(false)
    await call()
    // callback with status
    if (
        (!tenant && userSlackStatus.value.configured) ||
        (tenant && tenantSlackStatus.value.configured)
    ) {
        callback('success')
        trackAddEvent(tenant)
    } else callback('failure')
}

export function openSlackOAuth({
    w = 500,
    h = 600,
    tenant = false,
    callback = (status) => ({}),
}) {
    const store = integrationStore()
    const { userSlackStatus, tenantSlackStatus } = toRefs(store)
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
                userSlackStatus,
                tenantSlackStatus,
                callback,
                tenant
            )
        }
    }, 500)
}

export const UnfurlSlackMessage = (body, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } =
        Integrations.UnfurlSlackMessage(body, { asyncOptions })
    return { data, isLoading, error, mutate, isReady }
}
export const checkAtlanBotInChannels = (body, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } =
        Integrations.AtlanBotCheckInChannels(body, { asyncOptions })
    return { data, isLoading, error, mutate, isReady }
}

export const archiveSlack = (pV) => {
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
            // also remove tge user level slack integration if exists
            if (intStore.userSlackStatus.id)
                intStore.removeIntegration(intStore.userSlackStatus.id)

            message.success({
                content: 'Slack integration has been disconnected',
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

export const createApp = (body) => {
    const { CreateSlackApp } = Integrations

    const store = integrationStore()

    const { data, isLoading, error, mutate } = CreateSlackApp(body, {
        asyncOptions: { immediate: false },
    })

    watch([isLoading, error], () => {
        if (isLoading.value) {
            message.loading({
                content: 'Creating Atlan App...',
                key: 'create',
                duration: 2,
            })
        } else if (error.value) {
            const errMsg = error.value?.response?.data?.errorMessage || ''
            const generalError = 'Error while creating Atlan App'
            const e = errMsg || generalError
            message.error({
                content: e,
                key: 'create',
                duration: 2,
            })
        } else {
            const { integrationId } = data.value
            refetchIntegration(integrationId) // what about loading
            // useIntegrations()
            message.success({
                content: 'Atlan App created successfully',
                key: 'create',
                duration: 2,
            })
        }
    })

    return {
        data,
        isLoading,
        error,
        mutate,
    }
}

export const UpdateSlackConfig = (pV, body, asyncOptions) => {
    const { data, isLoading, error, isReady, mutate } =
        Integrations.UpdateSlackConfig(pV, body, { asyncOptions })
    return { data, isLoading, error, mutate }
}
