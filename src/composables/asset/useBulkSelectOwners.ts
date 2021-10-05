import { ref, Ref, computed, ComputedRef, watch } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

export interface UpdatedOwnerType {
    addedOwnerUsers: Array<String>
    removedOwnerUsers: Array<String>
    addedOwnerGroups: Array<String>
    removedOwnerGroups: Array<String>
}
export default function useBulkSelectOwners(selectedAssets) {
    // const ownerUsersFrequencyMap: Ref<Record<string, number>> = ref({})
    // const ownerGroupsFrequencyMap: Ref<Record<string, number>> = ref({})
    const existingOwnerUsers: Ref<Record<string, string>> = ref({})
    const existingOwnerGroups: Ref<Record<string, string>> = ref({})
    watch(selectedAssets, () => {
        if (selectedAssets.value.length) {
            // update existing owners and groups
            const assetOwnerUsersMap: Record<string, string> = {}
            const assetOwnerGroupsMap: Record<string, string> = {}
            selectedAssets.value.forEach((asset: assetInterface) => {
                assetOwnerUsersMap[asset.guid] =
                    asset?.attributes?.ownerUsers ?? ''
                assetOwnerGroupsMap[asset.guid] =
                    asset?.attributes?.ownerGroups ?? ''
            })
            existingOwnerUsers.value = { ...assetOwnerUsersMap }
            existingOwnerGroups.value = { ...assetOwnerGroupsMap }
        }
    })
    const updatedOwners: Ref<UpdatedOwnerType> = ref({
        addedOwnerUsers: [],
        removedOwnerUsers: [],
        addedOwnerGroups: [],
        removedOwnerGroups: [],
    })
    const ownerUsersFrequencyMap: ComputedRef<Record<string, number>> =
        computed(() => {
            const frequencyMap: Record<string, number> = {}
            if (Object.keys(existingOwnerUsers.value).length) {
                Object.keys(existingOwnerUsers.value).forEach((assetGuid) => {
                    if (existingOwnerUsers.value[assetGuid].length > 0) {
                        const ownerUsersArray =
                            existingOwnerUsers.value[assetGuid].split(',')
                        ownerUsersArray.forEach((ownerUser) => {
                            if (frequencyMap.hasOwnProperty(ownerUser))
                                frequencyMap[ownerUser] += 1
                            else frequencyMap[ownerUser] = 1
                        })
                    }
                })
            }
            return frequencyMap
        })
    const ownerGroupsFrequencyMap: ComputedRef<Record<string, number>> =
        computed(() => {
            const frequencyMap: Record<string, number> = {}
            if (selectedAssets.value.length) {
                selectedAssets.value.forEach((asset: assetInterface) => {
                    if (asset?.attributes?.ownerGroups?.length > 0) {
                        const ownerGroupsArray =
                            asset.attributes.ownerGroups.split(',')
                        ownerGroupsArray.forEach((ownerGroup) => {
                            if (frequencyMap.hasOwnProperty(ownerGroup))
                                frequencyMap[ownerGroup] += 1
                            else frequencyMap[ownerGroup] = 1
                        })
                    }
                })
            }
            return frequencyMap
        })

    // const existingOwnerGroups = computed(() => {
    //     if (selectedAssets.value.length) {
    //         const assetOwnerGroupsMap: Record<string, string> = {}
    //         selectedAssets.value.forEach((asset: assetInterface) => {
    //             assetOwnerGroupsMap[asset.guid] =
    //                 asset?.attributes?.ownerGroups?.split(',') ?? []
    //         })
    //         return assetOwnerGroupsMap
    //     }
    //     return {}
    // })
    const handleUpdateOwners = (
        updatedOwnerValues,
        ownersRef,
        existingOwnerUsersRef,
        existingOwnerGroupsRef
    ) => {
        // Owners
        Object.keys(existingOwnerUsersRef.value).forEach((assetKey) => {
            let updatedOwnerUsers = [
                ...new Set(
                    existingOwnerUsersRef.value[assetKey]
                        ? [
                              ...existingOwnerUsersRef.value[assetKey].split(
                                  ','
                              ),
                              ...updatedOwnerValues.addedOwnerUsers,
                          ]
                        : [...updatedOwnerValues.addedOwnerUsers]
                ),
            ]
            updatedOwnerUsers = updatedOwnerUsers.filter(
                (oUser) =>
                    updatedOwnerValues.removedOwnerUsers.findIndex(
                        (user) => user === oUser
                    ) < 0
            )
            // eslint-disable-next-line no-param-reassign
            existingOwnerUsersRef.value = {
                ...existingOwnerUsersRef.value,
                [assetKey]: updatedOwnerUsers.join(','),
            }
        })
        // Groups
        Object.keys(existingOwnerGroupsRef.value).forEach((assetKey) => {
            let updatedOwnerGroups = [
                ...new Set(
                    existingOwnerGroupsRef.value[assetKey]
                        ? [
                              ...existingOwnerGroupsRef.value[assetKey].split(
                                  ','
                              ),
                              ...updatedOwnerValues.addedOwnerGroups,
                          ]
                        : [...updatedOwnerValues.addedOwnerGroups]
                ),
            ]
            updatedOwnerGroups = updatedOwnerGroups.filter(
                (oGroup) =>
                    updatedOwnerValues.removedOwnerGroups.findIndex(
                        (group) => group === oGroup
                    ) < 0
            )
            // eslint-disable-next-line no-param-reassign
            existingOwnerGroupsRef.value = {
                ...existingOwnerGroupsRef.value,
                [assetKey]: updatedOwnerGroups.join(','),
            }
        })

        // eslint-disable-next-line no-param-reassign
        ownersRef.value = updatedOwnerValues
    }

    return {
        updatedOwners,
        ownerUsersFrequencyMap,
        ownerGroupsFrequencyMap,
        existingOwnerUsers,
        existingOwnerGroups,
        handleUpdateOwners,
    }
}
