import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'

export default function addAnnouncement(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()
    const banner: { [key: string]: any } = ref({})
    const isCompleted = ref(false)
    const isLoading = ref(false)
    const body: { [key: string]: any } = ref({})

    const bannerType: WritableComputedRef<string> = computed({
        get: () =>
            banner.value.username ||
            selectedAsset.value?.attributes?.banner?.attributes?.username
            || "information"
        ,
        set: (newValue: string) => {
            banner.value.username = newValue
            banner.value.timestamp = Date.now()
            body.value = getBody()
        },
    })
    const bannerMessage: WritableComputedRef<string> = computed({
        get: () => selectedAsset.value?.attributes?.bannerMessage,
        set: (newValue: string) => {
            banner.value.message = newValue
            body.value = getBody()
        },
    })
    /*  const bannerHeader: WritableComputedRef<string> = computed({
         get: () =>
             banner.value.message ||
             selectedAsset.value?.attributes?.banner?.message ,
            
         set: (newValue: string) => {
             banner.value.message = newValue
             body.value = getBody()
         },
     }) */

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset.value.guid,
                typeName: selectedAsset.value.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset.value.attributes?.qualifiedName,
                    name: selectedAsset.value.attributes?.name,
                    banner: banner.value,

                    bannerMessage: banner.value.message,
                    bannerUpdatedAt: Date.now(),
                    bannerUpdatedBy: username,
                    tenantId: selectedAsset.value.attributes?.tenantId,
                    anchor: selectedAsset.value.attributes?.anchor
                },
            },
        ],
    })

    const update = () => {
        isLoading.value = true
        execute()
    }

    const { state, execute, isReady, error } = updateAsset(body, {
        immediate: false,
        resetOnExecute: true,
    })

    watch(isReady, () => {
        if (!error.value && state && isReady.value) {
            isLoading.value = false
            isCompleted.value = false
            selectedAsset.value.attributes.banner = banner.value
            selectedAsset.value.attributes.bannerMessage =
                banner.value.message
            selectedAsset.value.attributes.bannerUpdatedAt = Date.now()
            selectedAsset.value.attributes.bannerUpdatedBy =
                username as unknown as string
            selectedAsset.value.attributes.__modifiedBy =
                username as unknown as string
            selectedAsset.value.attributes.__modificationTimestamp = Date.now()
        }
    })

    const handleCancel = () => {
        isCompleted.value = false
        isLoading.value = false
    }

    return {
        handleCancel,
        bannerType,
        bannerMessage,
        state,
        update,
        isReady,
        error,
        isCompleted,
        isLoading,
    }
}
