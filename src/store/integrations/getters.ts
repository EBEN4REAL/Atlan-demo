interface TenantSlackStatus {
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
    tenantSlackStatus: (state): TenantSlackStatus => {
        const integration = state.allIntegrations.find(i => i.name.toLowerCase() === 'slack' && i.integrationLevel === 'tenant')
        return {
            oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
            id: integration.id || null,
            created: !!integration,
            configured: integration?.isConfigured,
            channels: integration.config?.channels ?? [],
            teamName: integration?.sourceMetadata?.teamName
        }
    }
}
export default getters
