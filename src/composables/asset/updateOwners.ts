import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

export default function updateOwners(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()
    console.log(selectedAsset.value, 'selectedAssets')
    const isLoading = ref(false)

    const isCompleted = ref(false)
    const body: { [key: string]: any } = ref({})
    const localOwnerUsers: Ref<string[]> = ref([])
    localOwnerUsers.value =
        selectedAsset.value?.attributes?.ownerUsers?.split(',') || []

    const localOwnerGroups: Ref<string[]> = ref([])
    localOwnerGroups.value =
        selectedAsset.value?.attributes?.ownerGroups?.split(',') || []

    const ownerUsers: WritableComputedRef<string[]> = computed({
        get: () => {
            if (selectedAsset.value?.attributes?.ownerUsers !== '') {
                return (
                    selectedAsset.value?.attributes?.ownerUsers?.split(',') ||
                    []
                )
            } else {
                return []
            }
        },
        set: (newValue: string[]) => {
            localOwnerUsers.value = newValue
            body.value = getBody()
        },
    })

    const ownerGroups: WritableComputedRef<string[]> = computed({
        get: () => {
            if (selectedAsset.value?.attributes?.ownerGroups !== '') {
                return (
                    selectedAsset.value?.attributes?.ownerGroups?.split(',') ||
                    []
                )
            } else {
                return []
            }
        },
        set: (newValue: string[]) => {
            localOwnerGroups.value = newValue
            body.value = getBody()
        },
    })

    function getBody() {
        const val = { ownerUsers: '', ownerGroups: '' }
        if (localOwnerUsers.value.length > 0) {
            val.ownerUsers = localOwnerUsers.value.join(',')
        }

        if (localOwnerGroups.value.length > 0) {
            val.ownerGroups = localOwnerGroups.value.join(',')
        }

        const attributes: { [key: string]: string } = {
            qualifiedName: selectedAsset.value.attributes?.qualifiedName,
            name: selectedAsset.value.attributes?.name,
            tenantId: selectedAsset.value.attributes?.tenantId,
            anchor: selectedAsset.value.attributes?.anchor,
        }
        attributes['ownerUsers'] = val.ownerUsers
        attributes['ownerGroups'] = val.ownerGroups
        return {
            entities: [
                {
                    guid: selectedAsset.value.guid,
                    typeName: selectedAsset.value.typeName,
                    attributes,
                },
            ],
        }
    }
    const { state, execute, isReady, error } = updateAsset(body, {
        immediate: false,
    })

    const update = (ownerUsers: string[], ownerGroups: string[]) => {
        // console.log(localOwnerUsers.value.join(',') === ownerUsers.join(','))
        // if (localOwnerUsers.value.join(',') !== ownerUsers.join(',')) {
        //     isLoading.value = true
        //     localOwnerUsers.value = ownerUsers
        //     localOwnerGroups.value = ownerGroups
        //     body.value = getBody()
        //     execute()
        // }
        // if (localOwnerGroups.value.join(',') !== ownerGroups.join(',')) {
        //     isLoading.value = true
        //     localOwnerUsers.value = ownerUsers
        //     localOwnerGroups.value = ownerGroups
        //     body.value = getBody()
        //     execute()
        // }
        isLoading.value = true
        localOwnerUsers.value = ownerUsers
        localOwnerGroups.value = ownerGroups
        body.value = getBody()
        execute()

        // event sent on owners description
        if (
            selectedAsset.value?.typeName === 'AtlasGlossary' ||
            selectedAsset.value?.typeName === 'AtlasGlossaryTerm' ||
            selectedAsset.value?.typeName === 'AtlasGlossaryCategory'
        )
            useAddEvent('gtc', 'metadata', 'owners_updated', {
                gtc_type: assetTypeLabel[selectedAsset.value?.typeName],
            })
        else useAddEvent('discovery', 'metadata', 'owners_updated', undefined)
    }

    watch(state, () => {
        if (!error.value && state && isReady.value) {
            isCompleted.value = false
            isLoading.value = false
            if (localOwnerUsers?.value?.length > 0) {
                selectedAsset.value.attributes.ownerUsers =
                    localOwnerUsers.value?.join(',')
            } else {
                selectedAsset.value.attributes.ownerUsers = ''
            }
            if (localOwnerGroups?.value?.length > 0) {
                selectedAsset.value.attributes.ownerGroups =
                    localOwnerGroups.value?.join(',')
            } else {
                selectedAsset.value.attributes.ownerGroups = ''
            }
            selectedAsset.value.attributes.__modifiedBy =
                username as unknown as string
            selectedAsset.value.attributes.__modificationTimestamp = Date.now()

            console.log(selectedAsset.value)
        }
    })

    const handleCancel = () => {
        isCompleted.value = false
        isLoading.value = false
    }

    return {
        handleCancel,
        ownerUsers,
        state,
        execute,
        isReady,
        error,
        isCompleted,
        ownerGroups,
        update,
        isLoading,
    }
}
