/* eslint-disable no-unused-vars */
import { State } from './state'

export interface Actions extends State {
    setAllIntegrationsList(list: any): void
    setIntegrationTypes(list: any): void,
    removeIntegration(id: string): void
    setIntegrationStatus({ name, level, configured, created }): void
    getIntegration(alias: string, tenantLevel): object | undefined
}

const actions: Actions = {
    setAllIntegrationsList(list) {
        this.allIntegrations = list
    },
    setIntegrationTypes(list) {
        this.integrationTypes = list
    },
    removeIntegration(id) {
        const integration = this.allIntegrations?.find(i => i.id === id)
        if (integration)
            this.setIntegrationStatus({ name: integration.name, level: integration.integrationLevel, configured: false, created: false })
        this.allIntegrations = this.allIntegrations?.filter(i => i.id !== id) ?? []

    },
    getIntegration(alias: string, tenantLevel: boolean) {
        if (!alias) {
            return undefined
        }
        const integrationLevel = tenantLevel ? "tenant" : "personal"
        return this.allIntegrations?.find(integration => integration.name.toLowerCase() === alias.toLowerCase() && integration.integrationLevel === integrationLevel)
    },
    setIntegrationStatus({ name, level, configured, created }) {
        this.integrationStatus[name] = {
            ...(this.integrationStatus[name] ?? {}), [level]: {
                configured,
                created
            }
        }
    },
}
export default actions
