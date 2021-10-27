// * Composables
import { computed } from 'vue'
import useTypedefData from '../typedefs/useTypedefData'

export default function useCustomMetadataFacet() {
    const { customMetadataList } = useTypedefData()

    console.log(customMetadataList)

    /**
     * @desc mapped BM object that has filter support
     * */
    const list = computed(() => {
        console.log(customMetadataList)
        if (customMetadataList?.length > 0) {
            return customMetadataList
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
                    id: bm.name,
                    label: bm.displayName,
                    component: 'businessMetadata',
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
    }
}
