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
            selectedAsset.value?.attributes?.bannerType
            || "information"
        ,
        set: (newValue: string) => {
            banner.value.type = newValue
            body.value = getBody()
        },
    })
    const bannerDescription: WritableComputedRef<string> = computed({
        get: () => selectedAsset.value?.attributes?.bannerDescription,
        set: (newValue: string) => {
            banner.value.description = newValue
            body.value = getBody()
        },
    })
    const bannerTitle: WritableComputedRef<string> = computed({
        get: () =>
            selectedAsset.value?.attributes?.bannerTitle,

        set: (newValue: string) => {
            banner.value.title = newValue
            body.value = getBody()
        },
    })

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset.value.guid,
                typeName: selectedAsset.value.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset.value.attributes?.qualifiedName,
                    name: selectedAsset.value.attributes?.name,
                    bannerType: banner.value.type,
                    bannerTitle: banner.value.title,
                    bannerDescription: banner.value.description,
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
            selectedAsset.value.attributes.bannerType =
                banner.value.type
            selectedAsset.value.attributes.bannerTitle =
                banner.value.title
            selectedAsset.value.attributes.bannerDescription =
                banner.value.description
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
        bannerDescription,
        bannerTitle,
        state,
        update,
        isReady,
        error,
        isCompleted,
        isLoading,
    }
}
