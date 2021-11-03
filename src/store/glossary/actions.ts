import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    setTermsCount(value: any): void
    setCategoryCount(value: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
    setTermsCount(buckets) {
        this.list.forEach((element, index) => {
            const aggr = buckets.find(
                (item) => item.key === element.attributes?.qualifiedName
            )
            if (aggr) {
                element.termsCount = aggr.doc_count
            } else {
                element.termsCount = 0
            }
        })
    },
    setCategoryCount(buckets) {
        this.list.forEach((element, index) => {
            const aggr = buckets.find(
                (item) => item.key === element.attributes?.qualifiedName
            )
            if (aggr) {
                element.categoryCount = aggr.doc_count
            } else {
                element.categoryCount = 0
            }
        })
    },
}
