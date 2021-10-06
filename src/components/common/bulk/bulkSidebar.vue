<template>
    <div class="p-5">
        <div
            v-if="selectedAssets && selectedAssets.length"
            class="text-xl font-bold text-primary"
        >
            {{ selectedAssets.length }}
            {{ selectedAssets.length === 1 ? `Asset` : `Assets` }} Selected
        </div>
        <Status :existing-status="existingStatus"></Status>
        <Owners></Owners>
        <a-button @click="updateAssets(selectedAssets)">Update</a-button>
    </div>
</template>

<script>
import { provide, toRefs, watch } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import Status from '@/common/bulk/widgets/status.vue'
import Owners from '@/common/bulk/widgets/owners.vue'

export default {
    name: 'BulkSidebar',
    components: {
        Status,
        Owners,
    },
    props: {
        bulkSelectedAssets: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const { bulkSelectedAssets: selectedAssets } = toRefs(props)
        const {
            existingOwners,
            existingStatus,
            existingClassifications,
            existingTerms,
            updatedStatus,
            updateAssets,
            updateSelectedAssets,
            ownerUsersFrequencyMap,
            ownerGroupsFrequencyMap,
            existingOwnerUsers,
            existingOwnerGroups,
            updatedOwners,
        } = useBulkSelect()
        /** PROVIDERS */
        provide('selectedAssets', selectedAssets)
        provide('updatedStatus', updatedStatus)
        provide('ownerUsersFrequencyMap', ownerUsersFrequencyMap)
        provide('ownerGroupsFrequencyMap', ownerGroupsFrequencyMap)
        provide('existingOwnerUsers', existingOwnerUsers)
        provide('existingOwnerGroups', existingOwnerGroups)
        provide('updatedOwners', updatedOwners)

        watch(
            selectedAssets,
            () => {
                updateSelectedAssets(selectedAssets)
            },
            {
                immediate: true,
            }
        )
        return {
            selectedAssets,
            existingOwners,
            existingStatus,
            existingClassifications,
            existingTerms,
            updateAssets,
            // mutateSelectedAsset,
        }
    },
}
</script>

<style>
</style>