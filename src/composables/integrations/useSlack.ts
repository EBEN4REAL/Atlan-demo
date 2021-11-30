import { ref } from 'vue'
import { Integrations } from '~/services/service/integrations'


let { origin } = window.location
if (origin.includes('localhost')) {
    // origin = `https://staging.atlan.com`
    origin = `http://localhost:5008`
}

function installSlackUrl() {
    const scopes = [
        'chat:write',
        'chat:write.public',
        'channels:read',
    ]

    const api = `${origin}/api/service/slack/auth`
    const state = {
        api,
        origin
    }

    const base64State = btoa(JSON.stringify(state))
    // tood: slack client id should come from env
    return `slack.com/oauth/v2/authorize?client_id=521029643301.2774249192164&scope=${scopes.join(
        ','
    )}&user_scope=&state=${base64State}`
}

// id that we get in slack message link
function getTimestampFromSlackMessageId(id) {
    const removePchar = id.substring(1)
    const position = 10
    const dot = "."
    const ts = [removePchar.slice(0, position), dot, id.slice(position)].join('');
    return ts
}

export const getIntegrationLink = (alias) => {
    switch (alias.toLowerCase()) {
        case 'slack':
            return installSlackUrl()
        default: return ''
    }
}

export const shareOnSlack = (integrationID, integrationType, channelAlias, message, link) => {
    const body = ref({
        integrationType,
        "actionData": {
            channelAlias, message, link, domain: origin
        }
    })
    const { data, isLoading, error, isReady } = Integrations.ShareSlack(integrationID, body, {})
    return { data, isLoading, error, isReady }
}

// detects if its a valid slack chat url
export const isSlackLink = (link) => link.includes('.slack.com/archives')


export const getChannelAndMessageIdFromSlackLink = (link) => {
    // https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638280466031300
    // https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638283148036400?thread_ts=1638280466.031300&cid=C02CBB6SPDM

    const idPaths = link.split("/archives/")[1]
    const channelId = idPaths.split("/")[0]
    const messageId = getTimestampFromSlackMessageId(idPaths.split("/")[1].split("?")[0])
    // if (idPaths.split("/")[1].includes("thread_ts")) {
    //     // eslint-disable-next-line prefer-destructuring
    //     messageId = idPaths.split("/")[1].split("thread_ts=")[1].split("&")[0]
    //     console.log("messageId", messageId)
    // }

    return {
        channelId,
        messageId
    }
}