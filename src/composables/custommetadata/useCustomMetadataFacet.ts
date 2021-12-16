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

    const getList = (typeName) => {
        const list = []
        customMetadataList.value.forEach((bm) => {
            const attributeList = []
            bm.attributeDefs.forEach((a) => {
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
            if (attributeList.length > 0) {
                list.push({
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
        console.log({ list })
        return list
    }

    return {
        list,
        getList,
        customMetadataList,
    }
}
