import { watch, ref, computed } from 'vue'
import { useTypedefStore } from '~/store/typedef'

export default function useTypedefData() {
    const typedefStore = useTypedefStore()

    const classificationList = computed(() => typedefStore.classificationList)

    return {
        classificationList,
        customMetadataList: typedefStore.customMetadataList,
        enumList: typedefStore.enumList,
    }
}
