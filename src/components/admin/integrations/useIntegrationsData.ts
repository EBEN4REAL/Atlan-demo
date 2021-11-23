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
