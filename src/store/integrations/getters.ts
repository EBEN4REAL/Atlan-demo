import { _GettersTree } from 'pinia'
import { State } from './state'

interface SlackStatus {
    created: boolean,
    configured: boolean,
    channels: [{ name: string, id: string }],
    id: string,
    oAuth: string,
    teamName: string
}

export interface Getters {
    getIntegrationList(state: State): any
    tenantSlackStatus(state: State): any
    userSlackStatus(state: State): any
}

const getters: _GettersTree<State> & Getters = {
    getIntegrationList(state: State) {
        return state.allIntegrations
    },
    tenantSlackStatus: (state: State): SlackStatus => {
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
    userSlackStatus: (state: State): SlackStatus => {
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
