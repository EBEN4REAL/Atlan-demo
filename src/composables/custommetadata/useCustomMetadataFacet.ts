// * Composables
import { computed } from 'vue'
import { AssetProperties } from '~/constant/assetProperties'
import useTypedefData from '../typedefs/useTypedefData'

export default function useCustomMetadataFacet() {
    const { customMetadataList } = useTypedefData()

    const propertyAttributeList = computed(() => AssetProperties)

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
                }))
        }
        return []
    })

    return {
        list,
        propertyAttributeList,
        customMetadataList,
    }
}
