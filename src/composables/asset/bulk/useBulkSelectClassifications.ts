import { ref, Ref, computed, watch, ComputedRef } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import { Components } from '~/api/atlas/client'
import { LocalState } from '~/composables/asset/useBulkSelect'

export default function useBulkSelectClassifications(selectedAssets) {
    const originalClassifications: Ref<
        Record<string, Components.Schemas.AtlasClassification[]>
    > = ref({})
    const classifications: Ref<
        Record<string, Components.Schemas.AtlasClassification[]>
    > = ref({})
    // diff bw original and latest published changes (published changes are the ones that get saved after someone clicks on done)
    const publishedChangeLog: Ref<LocalState> = ref({
        all: [] as Components.Schemas.AtlasClassification[],
        partial: [] as Components.Schemas.AtlasClassification[],
        removed: [] as Components.Schemas.AtlasClassification[],
    })
    const didClassificationsUpdate: ComputedRef<boolean> = computed(
        () =>
            !!(
                publishedChangeLog.value.all.length ||
                publishedChangeLog.value.removed.length
            )
    )
    watch(selectedAssets, () => {
        if (selectedAssets.value.length) {
            // update existing owners and groups
            const assetClassificationMap: Record<
                string,
                Components.Schemas.AtlasClassification[]
            > = {}

            selectedAssets.value.forEach((asset: assetInterface) => {
                assetClassificationMap[asset.guid] =
                    asset?.classifications ?? []
            })
            originalClassifications.value = { ...assetClassificationMap }
        }
    })
    const classificationFrequencyMap = computed(() => {
        interface ClassificationFreq {
            frequency: number
            classification: Components.Schemas.AtlasClassification
        }
        const frequencyMap: Record<string, ClassificationFreq> = {}
        if (Object.keys(classifications.value).length) {
            Object.keys(classifications.value).forEach((assetGuid) => {
                if (classifications.value[assetGuid].length > 0) {
                    const assetClassifications =
                        classifications.value[assetGuid]
                    assetClassifications.forEach((clsf) => {
                        if (frequencyMap.hasOwnProperty(clsf.typeName))
                            frequencyMap[clsf.typeName].frequency += 1
                        else
                            frequencyMap[clsf.typeName] = {
                                frequency: 1,
                                classification: clsf,
                            }
                    })
                }
            })
        }
        return frequencyMap
    })
    const resetClassifications = (
        originalClassificationsRef,
        classificationsRef,
        publishedChangeLogRef
    ) => {
        classificationsRef.value = { ...originalClassificationsRef.value }
        publishedChangeLogRef.value = {
            all: [],
            partial: [],
            removed: [],
        }
    }
    const initialiseLocalState = (
        selectedAssets,
        classificationFrequencyMap
    ) => {
        const state = {
            all: [] as Components.Schemas.AtlasClassification[],
            partial: [] as Components.Schemas.AtlasClassification[],
            removed: [] as Components.Schemas.AtlasClassification[],
        }

        // traverse frequency map
        if (Object.keys(classificationFrequencyMap.value).length) {
            Object.keys(classificationFrequencyMap.value).forEach((clsf) => {
                if (
                    classificationFrequencyMap.value[clsf].frequency ===
                    selectedAssets.value.length
                )
                    state.all.push(
                        classificationFrequencyMap.value[clsf].classification
                    )
                else
                    state.partial.push(
                        classificationFrequencyMap.value[clsf].classification
                    )
            })
        }
        return state
    }
    const updateClassifications = (
        classificationsRef,
        localState,
        originalClassificationsRef,
        publishedChangeLogRef
    ) => {
        const updatedObj = {}
        Object.keys(originalClassificationsRef.value).map((assetGuid) => {
            const uniqueClassificationsNames = new Set()
            const uniqueClassifications = [
                ...originalClassificationsRef.value[assetGuid],
                ...localState.value.all,
            ].filter((clsf) => {
                if (uniqueClassificationsNames.has(clsf.typeName)) return false

                uniqueClassificationsNames.add(clsf.typeName)
                return true
            })
            updatedObj[assetGuid] = uniqueClassifications
        })
        Object.keys(updatedObj).forEach((assetGuid) => {
            updatedObj[assetGuid].filter(
                (clsf) => !localState.value.removed.includes(clsf.typeName)
            )
        })
        classificationsRef.value = { ...updatedObj }
        publishedChangeLogRef.value = { ...localState.value }
    }

    return {
        originalClassifications,
        classifications,
        resetClassifications,
        initialiseLocalState,
        updateClassifications,
        classificationFrequencyMap,
        publishedChangeLog,
        didClassificationsUpdate,
    }
}
