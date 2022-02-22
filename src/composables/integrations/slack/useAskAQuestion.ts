import { computed, ref } from "vue"
import useAssetInfo from "~/composables/discovery/useAssetInfo"

export const resourceId = ref('')

export const onSlackModalSuccess = (response) => {
    console.log('onSlackModalSuccess')

    const { linkGuid } = response

    if (linkGuid)
        resourceId.value = linkGuid
}

const useAskAQuestion = (asset) => {
    const {
        getProfilePath,
    } = useAssetInfo()

    const assetLink = computed(() => {
        const baseUrl = window.location.origin
        const url = `${baseUrl}${getProfilePath(
            asset.value,
            true
        )}`
        return url
    })

    return { assetLink }

}

export default useAskAQuestion