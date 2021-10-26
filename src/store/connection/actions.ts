import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    setAssetCount(value: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
    setAssetCount(value) {
        this.list.forEach((element, index) => {
            const aggr = value.find(
                (item) => item.key === element.attributes?.name
            )
            if (aggr) {
                element.attributes.assetCount = aggr.doc_count
            } else {
                element.attributes.assetCount = 0
            }
        })
    },
}
