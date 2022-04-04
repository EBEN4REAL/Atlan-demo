<template>
    <div class="flex flex-col border border-gray-200 rounded requests-container">
        <div
            class="flex items-baseline py-2 pl-6 pr-5 mb-1 bg-gray-100 border-b"
        >
            <span class="text-sm font-semibold text-gray-500">
                My Requests
            </span>
        </div>
        <div class="p-4 overflow-x-hidden overflow-y-auto">
            <template
                v-for="(request, index) in requestList"
                :key="request?.id"
            >
                <RequestListItem
                    :request="request"
                    :showActions="false"
                    @mouseenter="handleMouseEnter(request.id, index)"
                    :active-hover="activeHover"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        defineAsyncComponent,
        watch,
    } from 'vue'
    // composables
    import { useRequestList } from '~/composables/requests/useRequests'

    // typescript
    import { RequestAttributes, RequestStatus } from '~/types/atlas/requests'
    // components
    import AssetPiece from '@/governance/requests/pieces/asset.vue'
    import RequestListItem from '~/components/governance/requests/requestListItem.vue'

    export default defineComponent({
        name: 'MyRequests',
        components: { AssetPiece, RequestListItem },
        setup() {
            // data

            // My requests will be showing active requests which the logged in user has raised
            const facets = ref({
                statusRequest: ['active'],
            })
            const requestList = ref([])
            const activeHover = ref('')
            const filters = ref({
                status: 'active' as RequestStatus,
                request_type: [],
                createdBy: 'member_user',
            })
            const searchTerm = ref('')
            const pagination = ref({
                limit: 10,
                offset: 0,
                totalPages: 1,
                totalData: 0,
            })

            const {
                response,
                isLoading: listLoading,
                error: listError,
                mutate,
            } = useRequestList(searchTerm, filters, pagination)

            watch(response, () => {
                requestList.value = response.value?.records || []
                pagination.value.totalPages =
                    response.value.filterRecord / pagination.value.limit
                pagination.value.totalData = response.value.filterRecord
                console.log(requestList.value)
            })

            const handleMouseEnter = (itemId, idx) => {
                if (activeHover.value !== itemId) {
                    activeHover.value = itemId
                }
            }

            return {
                requestList,
                handleMouseEnter,
                activeHover,
            }
        },
    })
</script>
<style lang="less" scoped>
    .requests-container{
        height: 390px;
    }
</style>
