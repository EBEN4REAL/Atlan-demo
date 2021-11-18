import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    setTermsCount(value: any): void
    setCategoryCount(value: any): void
    setSelectedGlossary(value: any): void
    setActivePanel(value: any): void
    setPreferences(value: any): void
    setActiveFacet(value: any): void
    setActivePostFacet(value: any): void
}

export const actions: Actions = {
    setSelectedGlossary(value) {
        this.selectedGlossary = value
    },
    setList(value) {
        this.list = value.map((i) => ({
            ...i,
            id: i.attributes.qualifiedName,
            label: i.attributes.name,
        }))
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
    setActivePanel(value) {
        this.activeFacetTab = value
    },
    setActiveFacet(value) {
        this.activeFacet = value
    },
    setPreferences(value) {
        this.preferences = value
    },
    setActivePostFacet(value) {
        this.activePostFacet = value
    },
}
