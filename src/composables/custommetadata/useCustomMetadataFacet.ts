// * Composables
import { computed } from 'vue'

import useTypedefData from '../typedefs/useTypedefData'

export default function useCustomMetadataFacet() {
    const { customMetadataList } = useTypedefData()

    /**
     * @desc mapped BM object that has filter support
     * */
    const list = computed(() => {
        if (customMetadataList.value?.length > 0) {
            return customMetadataList.value
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
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
            if (
                typeof a.options?.customApplicableEntityTypes === 'string'
            ) {
                let temp = JSON.parse(
                    a.options?.customApplicableEntityTypes
                )
                if (temp) {
                    if (temp.includes(typeName) || typeName === '__all') {
                        attributeList.push({
                            ...a,
                            typeList: JSON.parse(
                                a.options?.customApplicableEntityTypes
                            ),
                        })
                    }
                } else {
                    attributeList.push({
                        ...a,
                        typeList: JSON.parse(
                            a.options?.customApplicableEntityTypes
                        ),
                    })
                }
            } else {
                attributeList.push({
                    ...a,
                    typeList: [],
                })
            }
        })
        return attributeList
    }
    /**
     * 
     * @param typeName 
     * @param facet flag to check if required list is for filtering, if facet then check for allowFiltering
     * @returns 
     */
    const getList = (typeName, facet = false) => {
        const finalList: any = []
        customMetadataList.value.forEach((bm) => {
            const attributeList = typeNameFiltering(bm.attributeDefs.filter(a => facet ? a.options?.allowFiltering !== 'true' : true), typeName)
            if (attributeList.length > 0) {
                finalList.push({
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
        customMetadataList,
    }
}
