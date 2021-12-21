import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    setTermsCount(value: any): void
    setCategoryCount(value: any): void
    setSelectedGTC(value: any): void
    setActivePanel(value: any): void
    setPreferences(value: any): void
    setActiveFacet(value: any): void
    setActivePostFacet(value: any): void
    addGlossary(value: any): void
    updateGlossary(value: any): void
    setActiveGlossaryQualifiedName(value: any): void
}

export const actions: Actions = {
    setSelectedGTC(value) {
        this.selectedGTC = value
    },
    setList(value) {
        this.list = value.map((i) => ({
            ...i,
            id: i.attributes.qualifiedName,
            label: i.attributes.name,
        }))
    },
    addGlossary(value) {
        this.list.unshift(value)
    },
    updateGlossary(value) {
        this.list.forEach((el, idx) => {
            if (el?.guid === value?.guid) {
                this.list[idx] = value
            }
        })
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
    setActiveGlossaryQualifiedName(value) {
        this.activeGlossaryQualifiedName = value
    },
}
