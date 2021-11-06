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
        console.log(customMetadataList)
        if (customMetadataList.value?.length > 0) {
            return customMetadataList.value
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
                    id: bm.name,
                    label: bm.displayName,
                    component: 'properties',
                    image: bm.options?.image || '',
                    overallCondition: 'OR',
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
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
