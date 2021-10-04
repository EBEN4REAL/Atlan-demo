import { ref, Ref, computed, ComputedRef, watch } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

export interface OwnersChangeLog {
    addedOwnerUsers: Array<String>
    removedOwnerUsers: Array<String>
    addedOwnerGroups: Array<String>
    removedOwnerGroups: Array<String>
}
export default function useBulkSelectOwners(selectedAssets) {
    // const ownerUsersFrequencyMap: Ref<Record<string, number>> = ref({})
    // const ownerGroupsFrequencyMap: Ref<Record<string, number>> = ref({})
    watch(selectedAssets, () => {
        console.log('OOO', selectedAssets.value)
    })
    const existingOwnerUsers = computed(() => {
        if (selectedAssets.value.length) {
            const assetOwnerUsersMap: Record<string, string> = {}
            selectedAssets.value.forEach((asset: assetInterface) => {
                assetOwnerUsersMap[asset.guid] =
                    asset?.attributes?.ownerUsers ?? []
            })
            return assetOwnerUsersMap
        }
        return {}
    })
    const updatedOwners: Ref<OwnersChangeLog> = ref({
        addedOwnerUsers: [],
        removedOwnerUsers: [],
        addedOwnerGroups: [],
        removedOwnerGroups: [],
    })
    const ownerUsersFrequencyMap: ComputedRef<Record<string, number>> =
        computed(() => {
            const frequencyMap: Record<string, number> = {}
            if (selectedAssets.value.length) {
                selectedAssets.value.forEach((asset: assetInterface) => {
                    if (asset?.attributes?.ownerUsers?.length > 0) {
                        const ownerUsersArray =
                            asset.attributes.ownerUsers.split(',')
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

    const existingOwnerGroups = computed(() => {
        if (selectedAssets.value.length) {
            const assetOwnerGroupsMap: Record<string, string> = {}
            selectedAssets.value.forEach((asset: assetInterface) => {
                assetOwnerGroupsMap[asset.guid] =
                    asset?.attributes?.ownerGroups ?? []
            })
            return assetOwnerGroupsMap
        }
        return {}
    })
    const handleUpdateOwners = (
        changeLog,
        ownersRef,
        existingOwnerUsersRef,
        existingOwnerGroupsRef
    ) => {
        Object.keys(existingOwnerUsersRef.value).forEach((assetKey) => {
            let updatedOwnerUsers = [
                ...new Set([
                    ...existingOwnerUsersRef.value[assetKey],
                    ...changeLog.addedOwnerUsers,
                ]),
            ]
            updatedOwnerUsers = updatedOwnerUsers.filter(
                (oUser) => changeLog.removedOwnerUsers.findIndex(oUser) < 0
            )
            // eslint-disable-next-line no-param-reassign
            existingOwnerUsersRef.value[assetKey] = updatedOwnerUsers
            if (false) {
                let updatedOwnerGroups = [
                    ...new Set([
                        ...existingOwnerGroupsRef.value[assetKey],
                        ...changeLog.addedOwnerGroups,
                    ]),
                ]
                updatedOwnerGroups = updatedOwnerGroups.filter(
                    (oGroup) =>
                        changeLog.removedOwnerGroups.findIndex(oGroup) < 0
                )
                // eslint-disable-next-line no-param-reassign
                existingOwnerGroupsRef.value[assetKey] = updatedOwnerGroups
            }
        })

        // eslint-disable-next-line no-param-reassign
        ownersRef.value = changeLog
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
