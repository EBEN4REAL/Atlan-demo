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
        <a-button @click="updateAssets(selectedAssets)">Update</a-button>
    </div>
</template>

<script>
import { provide, toRefs, watch } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import Status from '@/common/bulk/widgets/status.vue'

export default {
    name: 'BulkSidebar',
    components: {
        Status,
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
        } = useBulkSelect()
        /** PROVIDERS */
        provide('selectedAssets', selectedAssets)
        provide('updatedStatus', updatedStatus)
        //  const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
        //         inject('mutateSelectedAsset', () => {})
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