export interface Integration {
    name: string,
    id: string,
    integrationLevel?: string
}
export interface IntegrationConfig {
    name: string,
    integrationLevels?: string[],
    oauthRedirectUrl?: string,
    scopes?: string[],
    integrationLevel?: string,
}

export interface JiraStore {
    projectList?: any[]
}

export interface State {
    allIntegrations: Integration[],
    integrationConfigs: IntegrationConfig[],
    jira: JiraStore,
}

export const state: State = {
    allIntegrations: [],
    integrationConfigs: [],
    jira: {},
}
