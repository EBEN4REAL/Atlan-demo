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
    updateAssetCount(
        typeName: String,
        glossaryGuid: String,
        action: String
    ): void
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
    updateAssetCount(typeName, glossaryGuid, action) {
        console.log(typeName, glossaryGuid, action)
        let foundIdx
        this.list.forEach((el, idx) => {
            if (el?.guid === glossaryGuid) {
                foundIdx = idx
            }
        })
        console.log(foundIdx)
        if (action === 'add') {
            console.log(this.list[foundIdx])
            if (typeName === 'AtlasGlossaryTerm') {
                this.list[foundIdx].termsCount =
                    this.list[foundIdx].termsCount + 1
            }
            if (typeName === 'AtlasGlossaryCategory') {
                this.list[foundIdx].categoryCount =
                    this.list[foundIdx].categoryCount + 1
            }
        }
        if (action === 'delete') {
            console.log(this.list[foundIdx])
            if (typeName === 'AtlasGlossaryTerm') {
                this.list[foundIdx].termsCount =
                    this.list[foundIdx].termsCount - 1
            }
            if (typeName === 'AtlasGlossaryCategory') {
                this.list[foundIdx].categoryCount =
                    this.list[foundIdx].categoryCount - 1
            }
        }
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
