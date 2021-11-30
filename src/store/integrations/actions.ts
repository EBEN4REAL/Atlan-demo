/* eslint-disable no-unused-vars */
import { State } from './state'

export interface Actions extends State {
    setAllIntegrationsList(list: any): void
    getIntegration(alias: string): object | undefined
}

const actions: Actions = {
    setAllIntegrationsList(list) {
        this.allIntegrations = list
    },
    getIntegration(alias) {
        return this.allIntegrations?.find(i => i.name.toLowerCase() === alias.toLowerCase())
    }

}
export default actions
