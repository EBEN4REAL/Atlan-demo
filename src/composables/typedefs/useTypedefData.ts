import { watch, ref, computed } from 'vue'
import { useTypedefStore } from '~/store/typedef'

export default function useTypedefData() {
    const typedefStore = useTypedefStore()

    const classificationList = computed(() => typedefStore.classificationList)

    const customMetadataList = computed(() => typedefStore.customMetadataList)

    return {
        classificationList,
        customMetadataList,
        enumList: typedefStore.enumList,
    }
}
