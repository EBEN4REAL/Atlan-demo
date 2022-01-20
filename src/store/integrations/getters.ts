interface SlackStatus {
    created: boolean,
    configured: boolean,
    channels: [{ name: string, id: string }],
    id: string,
    oAuth: string,
    teamName: string

}

const getters = {
    getIntegrationList(state) {
        return state.allIntegrations
    },
    tenantSlackStatus: (state): SlackStatus => {
        const integration = JSON.parse(JSON.stringify(state.allIntegrations.find(i => i.name.toLowerCase() === 'slack' && i.integrationLevel === 'tenant') ?? null))
        return {
            oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
            id: integration?.id || null,
            created: !!integration,
            configured: integration?.isConfigured,
            channels: integration?.config?.channels ?? [],
            teamName: integration?.sourceMetadata?.teamName
        }
    },
    userSlackStatus: (state): SlackStatus => {
        const integration = JSON.parse(JSON.stringify(state.allIntegrations.find(i => i.name.toLowerCase() === 'slack' && i.integrationLevel === 'user') ?? null))
        return {
            oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
            id: integration?.id || null,
            created: !!integration,
            configured: integration?.isConfigured,
            channels: integration?.config?.channels ?? [],
            teamName: integration?.sourceMetadata?.teamName
        }
    }
}
export default getters
