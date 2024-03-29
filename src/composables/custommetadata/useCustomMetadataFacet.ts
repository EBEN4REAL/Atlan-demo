// * Composables
import { computed } from 'vue'

import useTypedefData from '../typedefs/useTypedefData'

export default function useCustomMetadataFacet() {
    const { activeCustomMetadataList } = useTypedefData()

    /**
     * @desc mapped BM object that has filter support
     * */
    const list = computed(() => {
        if (activeCustomMetadataList.value?.length > 0) {
            return activeCustomMetadataList.value
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
                    guid: bm.guid,
                    description: bm.description,
                    id: bm.name,
                    label: bm.displayName,
                    component: 'properties',
                    attributes: bm.attributeDefs,
                    overallCondition: 'OR',
                    isDeleted: false,
                    isDisabled: false,
                    includes: [],
                    exclude: false,
                    options: bm.options,
                    analyticsKey: 'custom_metadata',
                }))
        }
        return []
    })

    /**
     *
     * @param attributeDefs array of CM attributes
     * @param typeName the typeName of the selected asset or tab
     * @returns filters out CM attributes based on the support of the typeName
     */
    const typeNameFiltering = (attributeDefs, typeName) => {
        const attributeList = []
        attributeDefs.forEach((a) => {
            if (!a.options?.customApplicableEntityTypes) return
            if (typeof a.options?.customApplicableEntityTypes === 'string') {
                const temp = JSON.parse(a.options?.customApplicableEntityTypes)
                if (temp?.length) {
                    if (temp.includes(typeName) || typeName === '__all') {
                        attributeList.push({
                            ...a,
                            typeList: JSON.parse(
                                a.options?.customApplicableEntityTypes
                            ),
                        })
                    }
                }
            }
        })
        return attributeList
    }
    /**
     *
     * @param typeName
     * @param facet flag to check if required list is for filtering, if facet then check for allowFiltering
     * @param overview flag to check if required list should be shown in the overview tab in the sidebar, if overview=true then check for showInOverview flag
     * @returns
     */
    const getList = (typeName, facet = false, overview = false, denyCustomMetadata = []) => {
        const finalList: any = []
        activeCustomMetadataList.value.forEach((bm) => {
            const attributeList = typeNameFiltering(
                bm.attributeDefs.filter(
                    (a) =>
                        a.options?.isDeprecated !== 'true' &&
                        (facet ? a.options?.allowFiltering === 'true' : true) &&
                        (overview ? a.options?.showInOverview === 'true' : true)
                ),
                typeName
            )
            if (attributeList.length > 0 && !denyCustomMetadata.includes(bm.guid)) {
                finalList.push({
                    guid: bm.guid,
                    description: bm.description,
                    id: bm.name,
                    label: bm.displayName,
                    component: 'properties',
                    overallCondition: 'OR',
                    isDeleted: false,
                    isDisabled: false,
                    attributes: attributeList,
                    includes: [],
                    exclude: false,
                    options: bm.options,
                    analyticsKey: 'custom_metadata',
                })
            }
        })
        return finalList
    }

    return {
        list,
        getList,
        activeCustomMetadataList,
    }
}
