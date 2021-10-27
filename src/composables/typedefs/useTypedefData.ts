import { useTypedefStore } from '~/store/typedef'

export default function useTypedefData() {
    const typedefStore = useTypedefStore()
    return {
        classificationList: typedefStore.classificationList,
        customMetadataList: typedefStore.customMetadataList,
        enumList: typedefStore.enumList,
    }
}
