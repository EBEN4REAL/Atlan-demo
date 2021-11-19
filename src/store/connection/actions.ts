import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    setAssetCount(value: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
    setAssetCount(buckets) {
        this.list.forEach((element, index) => {
            const aggr = buckets.find(
                (item) => item.key === element.attributes?.name
            )
            if (aggr) {
                element.assetCount = aggr.doc_count
            } else {
                element.assetCount = 0
            }
        })
    },
}
