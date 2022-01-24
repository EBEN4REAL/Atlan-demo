/* eslint-disable no-unused-vars */
import { State } from './state'

export interface Actions extends State {
    setAllIntegrationsList(list: any): void
    removeIntegration(id: string): void
    updateIntegration(payload: any): void
}

const actions: Actions = {
    setAllIntegrationsList(list) {
        this.allIntegrations = list
    },
    updateIntegration(payload: any) {
        const { id } = payload
        const index = this.allIntegrations.findIndex((i: { id: string }) => i.id === id) ?? -1
        if (index > -1)
            this.allIntegrations[index] = payload
        else this.allIntegrations.push(payload)
    },
    removeIntegration(id) {
        this.allIntegrations = this.allIntegrations?.filter(i => i.id !== id) ?? []
    },
}
export default actions
