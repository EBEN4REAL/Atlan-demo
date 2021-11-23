import { State } from './state'

export type Getters = {
    getCustomMetadataList(state: State): object[] | null
    getCustomMetadataListProjections(): string[]
}

export const getters: Getters = {
    getCustomMetadataList(state: State) {
        return state.customMetadataList
    },
    getCustomMetadataListProjections() {
        const reqBmAttrNames: string[] = []
        this.getCustomMetadataList?.forEach((bm) => {
            if (bm.attributeDefs && bm.attributeDefs.length && !bm.isArchived) {
                bm.attributeDefs.forEach((attr: { name: any }) => {
                    reqBmAttrNames.push(`${bm.name}.${attr.name}`)
                })
            }
        })
        return reqBmAttrNames
    },
}
