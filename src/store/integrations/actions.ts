/* eslint-disable no-unused-vars */
import { State } from './state'

export interface Actions extends State {
    setAllIntegrationsList(list: any): void
    getIntegration(alias: string, tenantLevel): object | undefined
    hasConfiguredTenantLevelIntegration(alias: string): boolean
}

const actions: Actions = {
    setAllIntegrationsList(list) {
        this.allIntegrations = list
    },
    getIntegration(alias: string, tenantLevel: boolean) {
        const integrationLevel = tenantLevel ? "tenant" : "personal"
        return this.allIntegrations?.find(integration => integration.name.toLowerCase() === alias.toLowerCase() && integration.integration_level === integrationLevel)
    },
    // checks isConfigured flag on tenant level integration
    hasConfiguredTenantLevelIntegration(alias: string) {
        const integration = this.getIntegration(alias, true)
        return integration?.is_configured
        // return this.allIntegrations?.find(i => i.name.toLowerCase() === alias.toLowerCase() && )
    }

}
export default actions
