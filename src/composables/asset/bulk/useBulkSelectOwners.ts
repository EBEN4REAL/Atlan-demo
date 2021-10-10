import { ref, Ref, computed, watch, ComputedRef } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import { Components } from '~/api/atlas/client'
import { LocalState } from '~/composables/asset/useBulkSelect'

interface Owner {
    nameOrUsername: string
    type: string
}
interface OwnerFreq {
    frequency: number
    owner: Owner
}
export default function useBulkSelectOwners(selectedAssets) {
    const originalOwners: Ref<Record<string, Owner[]>> = ref({})
    const owners: Ref<Record<string, Owner[]>> = ref({})
    // diff bw original and latest published changes (published changes are the ones that get saved after someone clicks on done)
    const publishedChangeLog: Ref<LocalState> = ref({
        all: [] as Owner[],
        partial: [] as Owner[],
        removed: [] as Owner[],
    })
    const didOwnersUpdate: ComputedRef<boolean> = computed(
        () =>
            !!(
                publishedChangeLog.value.all.length ||
                publishedChangeLog.value.removed.length
            )
    )
    watch(selectedAssets, () => {
        if (selectedAssets.value.length) {
            // update existing owners and groups
            const assetOwnerMap: Record<string, Owner[]> = {}

            selectedAssets.value.forEach((asset: assetInterface) => {
                const ownerUsersString = asset?.attributes?.ownerUsers
                const ownerUsers = ownerUsersString
                    ? ownerUsersString.split(',').map((oUser) => ({
                          nameOrUsername: oUser,
                          type: 'user',
                      }))
                    : []
                const ownerGroupsString = asset?.attributes?.ownerGroups
                const ownerGroups = ownerGroupsString
                    ? ownerGroupsString?.split(',').map((oGroup) => ({
                          nameOrUsername: oGroup,
                          type: 'group',
                      }))
                    : []

                assetOwnerMap[asset.guid] = [
                    ...(ownerUsers && ownerUsers.length ? ownerUsers : []),
                    ...(ownerGroups && ownerGroups.length ? ownerGroups : []),
                ]
            })
            originalOwners.value = { ...assetOwnerMap }
            console.log(originalOwners, originalOwners.value, assetOwnerMap)
        }
    })

    // for driving tags/multiple-owner tags we show in the widget
    const ownerFrequencyMap = computed(() => {
        const frequencyMap: Record<string, OwnerFreq> = {}
        if (Object.keys(owners.value).length) {
            Object.keys(owners.value).forEach((assetGuid) => {
                if (owners.value[assetGuid].length > 0) {
                    const assetOwners = owners.value[assetGuid]
                    assetOwners.forEach((owner) => {
                        if (frequencyMap.hasOwnProperty(owner.nameOrUsername))
                            frequencyMap[owner.nameOrUsername].frequency += 1
                        else
                            frequencyMap[owner.nameOrUsername] = {
                                frequency: 1,
                                owner,
                            }
                    })
                }
            })
        }
        return frequencyMap
    })
    // for calculating what changed
    const getInitialLocalState = (originalOwners, selectedAssets) => {
        const frequencyMap: Record<string, OwnerFreq> = {}
        const state = {
            all: [] as Owner[],
            partial: [] as Owner[],
            removed: [] as Owner[],
        }

        if (Object.keys(originalOwners.value).length) {
            Object.keys(originalOwners.value).forEach((assetGuid) => {
                if (originalOwners.value[assetGuid].length > 0) {
                    const assetOwners = originalOwners.value[assetGuid]
                    assetOwners.forEach((owner) => {
                        if (frequencyMap.hasOwnProperty(owner.nameOrUsername))
                            frequencyMap[owner.nameOrUsername].frequency += 1
                        else
                            frequencyMap[owner.nameOrUsername] = {
                                frequency: 1,
                                owner,
                            }
                    })
                }
            })
        }
        // traverse frequency map
        if (Object.keys(frequencyMap).length) {
            Object.keys(frequencyMap).forEach((ownerKey) => {
                if (
                    frequencyMap[ownerKey].frequency ===
                    selectedAssets.value.length
                )
                    state.all.push(frequencyMap[ownerKey].owner)
                else state.partial.push(frequencyMap[ownerKey].owner)
            })
        }
        return state
    }
    const resetOwners = (
        originalOwnersRef,
        ownersRef,
        publishedChangeLogRef
    ) => {
        ownersRef.value = { ...originalOwnersRef.value }
        publishedChangeLogRef.value = {
            all: [],
            partial: [],
            removed: [],
        }
    }
    const initialiseLocalState = (selectedAssets, ownerFrequencyMap) => {
        const state = {
            all: [] as Owner[],
            partial: [] as Owner[],
            removed: [] as Owner[],
        }

        // traverse frequency map
        if (Object.keys(ownerFrequencyMap.value).length) {
            Object.keys(ownerFrequencyMap.value).forEach((ownerKey) => {
                if (
                    ownerFrequencyMap.value[ownerKey].frequency ===
                    selectedAssets.value.length
                )
                    state.all.push(ownerFrequencyMap.value[ownerKey].owner)
                else state.partial.push(ownerFrequencyMap.value[ownerKey].owner)
            })
        }
        return state
    }
    const updateOwners = (
        ownersRef,
        localState,
        originalOwnersRef,
        publishedChangeLogRef,
        changeLog
    ) => {
        const updatedObj = {}
        Object.keys(originalOwnersRef.value).map((assetGuid) => {
            const uniqueOwnersNames = new Set()
            const uniqueOwners = [
                ...originalOwnersRef.value[assetGuid],
                ...localState.value.all,
            ].filter((owner) => {
                if (uniqueOwnersNames.has(owner.nameOrUsername)) return false
                uniqueOwnersNames.add(owner.nameOrUsername)
                return true
            })
            updatedObj[assetGuid] = uniqueOwners
        })
        Object.keys(updatedObj).forEach((assetGuid) => {
            updatedObj[assetGuid] = updatedObj[assetGuid].filter(
                (owner) =>
                    !localState.value.removed.find(
                        (o) => o.nameOrUsername === owner.nameOrUsername
                    )
            )
        })
        ownersRef.value = { ...updatedObj }
        publishedChangeLogRef.value = { ...changeLog.value }
    }

    return {
        originalOwners,
        owners,
        resetOwners,
        initialiseLocalState,
        updateOwners,
        ownerFrequencyMap,
        publishedChangeLog,
        didOwnersUpdate,
        getInitialLocalState,
    }
}
