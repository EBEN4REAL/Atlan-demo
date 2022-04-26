import { _GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    // getIntegrationList(state: State): any
}

const getters: _GettersTree<State> & Getters = {
    // tenantSlackStatus: (state: State): SlackStatus => {
    //     const integration = JSON.parse(JSON.stringify(state.allIntegrations.find(i => i.name.toLowerCase() === 'slack' && i.integrationLevel === 'tenant') ?? null))
    //     return {
    //         oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
    //         id: integration?.id || null,
    //         createdBy: integration?.createdBy,
    //         createdAt: integration?.createdAt,
    //         created: !!integration,
    //         configured: integration?.isConfigured,
    //         channels: integration?.config?.channels ?? [],
    //         teamName: integration?.sourceMetadata?.teamName,
    //         alertsWorkflowChannel: integration?.config?.alertsWorkflowChannel || null
    //     }
    // },
}
export default getters
