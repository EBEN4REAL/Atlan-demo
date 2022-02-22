import { computed, ref, toRefs } from "vue"
import useAssetInfo from "~/composables/discovery/useAssetInfo"
// import { getWorkspaceRole } from '~/composables/user/useUsers'
// import { useAuthStore } from '~/store/auth/index'
import integrationStore from '~/store/integrations/index'

export const disableSlackAsk = computed(() => {

    const intStore = integrationStore()
    const { tenantSlackStatus } = toRefs(intStore)

    if (!tenantSlackStatus.value.configured ||
        !tenantSlackStatus.value.channels.length) return true

    // const auth = useAuthStore()

    // const role = getWorkspaceRole({ roles: auth.roles || [], defaultRoles: auth.defaultRoles || [] })

    return false

})

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