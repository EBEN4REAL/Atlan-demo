import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    getList(state: State): any[]
    getConnectionList(): (id: string) => string[]
    getAssetList(): (id: string) => string[]
}

export const getters: GettersTree<State> & Getters = {
    getList(state: State) {
        return state.list
    },
    getConnectionList(state: State) {
        return (id) => {
            const found = state.list.find((item) => item.id === id)
            const assetList = []

            if (found?.metadataPolicies?.length) {
                found?.metadataPolicies.forEach((element) => {
                    if (element.allow) {
                        assetList.push(element?.connectionId)
                    }
                })
            }
            if (found?.dataPolicies?.length) {
                found?.dataPolicies.forEach((element) => {
                    if (element.allow) {
                        assetList.push(element?.connectionId)
                    }
                })
            }

            return assetList
        }
    },
    getAssetList(state: State) {
        return (id) => {
            const found = state.list.find((item) => item.id === id)
            const assetList = []

            if (found?.metadataPolicies?.length) {
                found?.metadataPolicies.forEach((element) => {
                    if (element.allow) {
                        assetList.push(...element?.assets)
                    }
                })
            }

            if (found?.dataPolicies?.length) {
                found?.dataPolicies.forEach((element) => {
                    if (element.allow) {
                        assetList.push(...element?.assets)
                    }
                })
            }

            if (found?.glossaryPolicies?.length) {
                found?.glossaryPolicies.forEach((element) => {
                    if (element.allow) {
                        assetList.push(...element?.glossaryQualifiedNames)
                    }
                })
            }
            return assetList
        }
    },
    getAssetListByConnectionId(state: State) {
        return (id, connectionId) => {
            const found = state?.list?.find((item) => item.id === id)
            const assetList = []

            if (found?.metadataPolicies?.length) {
                found?.metadataPolicies.forEach((element) => {
                    if (
                        element.allow &&
                        element.connectionId === connectionId
                    ) {
                        assetList.push(...element?.assets)
                    }
                })
            }

            if (found?.dataPolicies?.length) {
                found?.dataPolicies.forEach((element) => {
                    if (
                        element.allow &&
                        element.connectionId === connectionId
                    ) {
                        assetList.push(...element?.assets)
                    }
                })
            }
            return assetList
        }
    },
}
