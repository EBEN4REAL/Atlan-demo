import { ref, computed } from 'vue'
import { Integrations } from '~/services/service/integrations'
import { useAuthStore } from '~/store/auth'
import integrationStore from '~/store/integrations/index'

let { origin } = window.location
if (origin.includes('localhost')) {
    // origin = `https://staging.atlan.com`
    origin = `http://localhost:5008`
}

export const getSlackInstallUrlState = (isTenant: boolean) => {
    const authStore = useAuthStore()
    const api = `${origin}/api/service/slack/auth`
    const userId = authStore.id
    const state = {
        api,
        origin,
        isTenant,
        userId,
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
    integrationId,
    channelAlias,
    message,
    link,
}) => {
    const body = ref({
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

// detects if its a valid slack chat url
export const isSlackLink = (link) =>
    link && link.includes('.slack.com/archives')

export const getChannelAndMessageIdFromSlackLink = (link) => {
    // https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638280466031300
    // https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638283148036400?thread_ts=1638280466.031300&cid=C02CBB6SPDM

    const idPaths = link.split('/archives/')[1]
    const channelId = idPaths.split('/')[0]
    const messageId = getTimestampFromSlackMessageId(
        idPaths.split('/')[1].split('?')[0]
    )
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

export const getDeepLinkFromUserDmLink = (link: string) => {
    // https://app.slack.com/client/TFB0VJX8V/DFQBG65CN
    // slack://channel?team=TFB0VJX8V&id=DFQBG65CN
    const splits = link.split('/')
    const teamId = splits[splits.length - 2]
    const conversationId = splits[splits.length - 1]
    const deepLink = `slack://channel?team=${teamId}&id=${conversationId}`
    return deepLink
}

export const tenantLevelOauthUrl = computed(() => {
    const intStore = integrationStore()
    const slackIntegration = intStore.getIntegration('slack', true)
    const oauthBaseUrl = slackIntegration?.source_metadata?.oauthUrl
    const state = getSlackInstallUrlState(true)
    const slackOauth = `${oauthBaseUrl}&state=${state}`
    return slackOauth
})

export const userLevelOauthUrl = computed(() => {
    const intStore = integrationStore()
    const slackIntegration = intStore.getIntegration('slack', false)
    const oauthBaseUrl = slackIntegration?.source_metadata?.oauthUrl
    const state = getSlackInstallUrlState(true)
    const slackOauth = `${oauthBaseUrl}&state=${state}`
    return slackOauth
})
