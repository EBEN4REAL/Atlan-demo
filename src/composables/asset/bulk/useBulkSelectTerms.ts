import { ref, Ref, computed, watch, ComputedRef } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import { Components } from '~/api/atlas/client'
import { LocalState } from '~/composables/asset/useBulkSelect'

export default function useBulkSelectTerms(selectedAssets) {
    const originalTerms: Ref<
        Record<
            string,
            | Components.Schemas.AtlasGlossaryTerm[]
            | Components.Schemas.AtlasTermAssignmentHeader[]
        >
    > = ref({})
    const terms: Ref<
        Record<
            string,
            | Components.Schemas.AtlasGlossaryTerm[]
            | Components.Schemas.AtlasTermAssignmentHeader[]
        >
    > = ref({})
    // diff bw original and latest published changes (published changes are the ones that get saved after someone clicks on done)
    const publishedChangeLog: Ref<LocalState> = ref({
        all: [] as Components.Schemas.AtlasClassification[],
        partial: [] as Components.Schemas.AtlasClassification[],
        removed: [] as Components.Schemas.AtlasClassification[],
    })
    const didTermsUpdate: ComputedRef<boolean> = computed(
        () =>
            !!(
                publishedChangeLog.value.all.length ||
                publishedChangeLog.value.removed.length
            )
    )

    watch(selectedAssets, () => {
        if (selectedAssets.value.length) {
            // update existing owners and groups
            const assetTermsMap: Record<
                string,
                Components.Schemas.AtlasGlossaryTerm[]
            > = {}

            selectedAssets.value.forEach((asset: assetInterface) => {
                assetTermsMap[asset.guid] = asset?.meanings ?? []
            })
            originalTerms.value = { ...assetTermsMap }
            console.log(originalTerms, originalTerms.value, assetTermsMap)
        }
    })
    const termFrequencyMap = computed(() => {
        interface TermFreq {
            frequency: number
            term: Components.Schemas.AtlasGlossaryTerm
        }
        const frequencyMap: Record<string, TermFreq> = {}
        if (Object.keys(terms.value).length) {
            Object.keys(terms.value).forEach((assetGuid) => {
                if (terms.value[assetGuid].length > 0) {
                    const assetTerms = terms.value[assetGuid]
                    assetTerms.forEach((term) => {
                        if (
                            frequencyMap.hasOwnProperty(
                                term.termGuid || term.guid
                            )
                        )
                            frequencyMap[
                                term.termGuid || term.guid
                            ].frequency += 1
                        else
                            frequencyMap[term.termGuid || term.guid] = {
                                frequency: 1,
                                term,
                            }
                    })
                }
            })
        }
        return frequencyMap
    })
    const resetTerms = (originalTermsRef, termsRef, publishedChangeLogRef) => {
        termsRef.value = { ...originalTermsRef.value }
        publishedChangeLogRef.value = {
            all: [],
            partial: [],
            removed: [],
        }
    }
    const initialiseLocalState = (selectedAssets, termFrequencyMap) => {
        const state = {
            all: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
            partial: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
            removed: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
        }

        // traverse frequency map
        if (Object.keys(termFrequencyMap.value).length) {
            Object.keys(termFrequencyMap.value).forEach((term) => {
                if (
                    termFrequencyMap.value[term].frequency ===
                    selectedAssets.value.length
                )
                    state.all.push(termFrequencyMap.value[term].term)
                else state.partial.push(termFrequencyMap.value[term].term)
            })
        }
        return state
    }
    const updateTerms = (
        termsRef,
        localState,
        originalTermsRef,
        publishedChangeLogRef
    ) => {
        const updatedObj = {}
        Object.keys(originalTermsRef.value).map((assetGuid) => {
            const uniqueTermsNames = new Set()
            const uniqueTerms = [
                ...originalTermsRef.value[assetGuid],
                ...localState.value.all,
            ].filter((term) => {
                if (uniqueTermsNames.has(term.guid || term.termGuid))
                    return false

                uniqueTermsNames.add(term.guid || term.termGuid)
                return true
            })
            updatedObj[assetGuid] = uniqueTerms
        })
        Object.keys(updatedObj).forEach((assetGuid) => {
            updatedObj[assetGuid].filter(
                (term) =>
                    !localState.value.removed.includes(
                        term.guid || term.termGuid
                    )
            )
        })
        termsRef.value = { ...updatedObj }
        publishedChangeLogRef.value = { ...localState.value }
    }

    return {
        originalTerms,
        terms,
        resetTerms,
        initialiseLocalState,
        updateTerms,
        termFrequencyMap,
        didTermsUpdate,
        publishedChangeLog,
    }
}
