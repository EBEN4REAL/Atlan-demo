import { _GettersTree } from 'pinia'
import { State } from './state'

interface SlackStatus {
    created: boolean,
    createdAt: number,
    configured: boolean,
    channels: [{ name: string, id: string }],
    id: string,
    oAuth: string,
    teamName: string,
    createdBy: string,
    memberID?: string
}
interface JiraStatus {
    created: boolean,
    createdAt: number,
    configured: boolean,
    id: string,
    oAuth: string,
    orgName: string,
    createdBy: string,
    orgId?: string,
    avatar?: string,
    config?: any
}

export interface Getters {
    getIntegrationList(state: State): any
    tenantSlackStatus(state: State): any
    userSlackStatus(state: State): any
    tenantJiraStatus(state: State): any
    userJiraStatus(state: State): any
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
            createdBy: integration?.createdBy,
            createdAt: integration?.createdAt,
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
            createdAt: integration?.createdAt,
            createdBy: integration?.createdBy,
            configured: integration?.isConfigured,
            channels: integration?.config?.channels ?? [],
            teamName: integration?.sourceMetadata?.teamName,
            memberID: integration?.sourceMetadata?.slackUserId
        }
    },
    tenantJiraStatus: (state: State): JiraStatus => {
        const integration = JSON.parse(JSON.stringify(state.allIntegrations.find(i => i.name.toLowerCase() === 'jira' && i.integrationLevel === 'tenant') ?? null))
        const integrationConfig = JSON.parse(JSON.stringify(state.integrationConfigs.find(i => i.name.toLowerCase() === 'jira') ?? null))

        return {
            oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
            id: integration?.id || null,
            createdBy: integration?.createdBy,
            createdAt: integration?.createdAt,
            created: !!integration,
            configured: integration?.isConfigured,
            orgName: integration?.sourceMetadata?.orgName,
            orgId: integration?.sourceMetadata?.orgId,
            avatar: integration?.sourceMetadata?.avatar,
            config: {
                ...(integrationConfig || {})
            }
        }
    },
    userJiraStatus: (state: State): JiraStatus => {
        const integration = JSON.parse(JSON.stringify(state.allIntegrations.find(i => i.name.toLowerCase() === 'jira' && i.integrationLevel === 'user') ?? null))
        return {
            oAuth: integration?.sourceMetadata?.oauthUrl ?? '',
            id: integration?.id || null,
            created: !!integration,
            createdAt: integration?.createdAt,
            createdBy: integration?.createdBy,
            configured: integration?.isConfigured,
            orgName: integration?.sourceMetadata?.orgName,
            orgId: integration?.sourceMetadata?.orgId,
            avatar: integration?.sourceMetadata?.avatar
        }
    },
}
export default getters
