import { watch, ref, computed } from 'vue'
import { useTypedefStore } from '~/store/typedef'

export default function useTypedefData() {
    const typedefStore = useTypedefStore()

    const classificationList = computed(() =>
        typedefStore.classificationList.sort((a, b) => {
            if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
                return 1
            }
            if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) {
                return -1
            }
            return 0
        })
    )

    const customMetadataList = computed(() => typedefStore.customMetadataList)

    const customMetadataProjections =
        typedefStore.getCustomMetadataListProjections

    const enumList = computed(() =>
        typedefStore.enumList
            .filter((x) => x.serviceType !== 'atlas_core')
            .sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1
                }
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1
                }
                return 0
            })
    )

    return {
        classificationList,
        customMetadataList,
        enumList,
        customMetadataProjections,
    }
}
