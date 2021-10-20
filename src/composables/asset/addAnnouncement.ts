import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'

export default function addAnnouncement(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()
    const announcement: { [key: string]: any } = ref({})
    const isCompleted = ref(false)
    const isLoading = ref(false)
    const body: { [key: string]: any } = ref({})

    const announcementType: WritableComputedRef<string> = computed({
        get: () =>
            selectedAsset.value?.attributes?.announcementType
            || "information"
        ,
        set: (newValue: string) => {
            announcement.value.type = newValue
            body.value = getBody()
        },
    })
    const announcementMessage: WritableComputedRef<string> = computed({
        get: () => selectedAsset.value?.attributes?.announcementMessage,
        set: (newValue: string) => {
            announcement.value.description = newValue
            body.value = getBody()
        },
    })
    const announcementTitle: WritableComputedRef<string> = computed({
        get: () =>
            selectedAsset.value?.attributes?.announcementTitle,

        set: (newValue: string) => {
            announcement.value.title = newValue
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
                    announcementType: announcement.value.type,
                    announcementTitle: announcement.value.title,
                    announcementMessage: announcement.value.description,
                    announcementUpdatedAt: Date.now(),
                    announcementUpdatedBy: username,
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
            selectedAsset.value.attributes.announcementType =
                announcement.value.type
            selectedAsset.value.attributes.announcementTitle =
                announcement.value.title
            selectedAsset.value.attributes.announcementMessage =
                announcement.value.description
            selectedAsset.value.attributes.announcementUpdatedAt = Date.now()
            selectedAsset.value.attributes.announcementUpdatedBy =
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
        announcementType,
        announcementMessage,
        announcementTitle,
        state,
        update,
        isReady,
        error,
        isCompleted,
        isLoading,
    }
}
