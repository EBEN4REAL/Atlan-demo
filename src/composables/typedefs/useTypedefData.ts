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

    return {
        classificationList,
        customMetadataList,
        enumList: typedefStore.enumList,
    }
}
