import { State } from './state'

export type Getters = {
    getCustomMetadataList(state: State): object[] | null
    activeCustomMetadataList(state: State): object[]
    getCustomMetadataListProjections(): string[]
    getForceRevalidate(state: State): number
}

export const getters: Getters = {
    getCustomMetadataList(state: State) {
        return state.customMetadataList
    },
    activeCustomMetadataList(state: State) {
        return state.customMetadataList.reduce((acc, cm) => {
            const list = { ...cm, attributeDefs: cm.attributeDefs.filter(attr => !attr.options.isArchived) }
            acc.push(list)
            return acc
        }, [])
    },
    getCustomMetadataListProjections() {
        const reqBmAttrNames: string[] = []
        this.activeCustomMetadataList?.forEach((bm) => {
            if (bm.attributeDefs && bm.attributeDefs.length && !bm.isArchived) {
                bm.attributeDefs.forEach((attr: { name: any }) => {
                    reqBmAttrNames.push(`${bm.name}.${attr.name}`)
                })
            }
        })
        return reqBmAttrNames
    },
    getForceRevalidate(state: State) {
        return state.forceRevalidate
    },
}
