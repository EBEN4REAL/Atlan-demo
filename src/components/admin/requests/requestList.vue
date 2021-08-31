<template>
    <h2 class="mb-6 text-2xl font-bold">Requests</h2>
    <VirtualList v-if="requestList.length" :data="requestList" data-key="id">
        <template #default="{ item }">
            <RequestListItem :request="item" />
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestListItem from './requestListItem.vue'

    import { useRequestList } from '~/composables/requests/useRequests'

    export default defineComponent({
        name: 'RequestList',
        components: { VirtualList, RequestListItem },
        setup() {
            const { response } = useRequestList()
            const requestList = computed(() => response.value?.records || [])

            return { requestList }
        },
    })
</script>

<style></style>
