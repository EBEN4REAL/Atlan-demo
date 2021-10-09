<template>
    <div
        v-if="store.getShowNotification"
        class="z-10 p-4 bg-white border shadow"
    >
        <div class="mb-2 font-bold text-primary">
            {{ store.getFinalStatusLabel }}
        </div>
        <div v-if="store.getStatusLabel" class="mb-1">
            {{ store.getStatusLabel }}
        </div>
        <div v-if="store.getOwnersLabel" class="mb-1">
            {{ store.getOwnersLabel }}
        </div>
        <div v-if="store.getClassificationsLabel" class="mb-1">
            {{ store.getClassificationsLabel }}
        </div>
        <div v-if="store.getTermsLabel" class="mb-1">
            {{ store.getTermsLabel }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, toRefs } from 'vue'
import useBulkUpdateStore from '~/store/bulkUpdate'

export default {
    name: 'BulkNotification',
    props: {},
    setup() {
        const store = useBulkUpdateStore()
        const { updateStatusOwners, linkTerms, linkClassifications } = toRefs(
            store.updateStatus
        )
        watch(
            () => store.updateStatus,
            () => {
                console.log('CHANGING STATUS', store.updateStatus)
            }
        )
        return {
            store,
            updateStatusOwners,
        }
    },
}
</script>

<style>
</style>