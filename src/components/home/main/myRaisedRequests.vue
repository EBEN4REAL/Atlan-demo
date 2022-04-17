<template>
    <div
        class="flex flex-col border border-gray-200 rounded requests-container"
    >
        <div
            class="flex items-baseline py-2 pl-4 pr-5 mb-1 bg-gray-100 border-b justify-between"
        >
            <span class="text-sm font-semibold text-gray-500">
                My Requests
            </span>
            <StatusFilter @change="handleStatusFilterChange" />
        </div>
        <div v-if="listLoading" class="flex items-center justify-center h-64">
            <AtlanLoader class="h-10" />
        </div>

        <div
            v-else-if="requestList?.length"
            class="py-4 overflow-x-hidden overflow-y-auto"
        >
            <template
                v-for="(request, index) in requestList"
                :key="request?.id"
            >
                <RequestListItem
                    :request="request"
                    :showActions="false"
                    :showRequestStatus="true"
                    @mouseenter="handleMouseEnter(request.id, index)"
                    size="small"
                />
            </template>
        </div>
        <div v-else class="flex flex-col items-center mt-6">
            <AtlanIcon icon="EmptyRequest" style="height: 165px" />
            <div
                class="px-10 mx-10 mt-2 text-xl font-bold text-center text-gray-700"
            >
                All caught up!!
            </div>
            <div class="px-10 mx-10 mt-2 text-center text-gray-400">
                There are no requests at this time
            </div>
        </div>
    </div>
    <!-- <div v-if="role?.toLowerCase() === 'admin'" class="my-2 mx-4"> -->
    <!--     <router-link :to="'/governance/requests'" :target="'_blank'"> -->
    <!--         <span class="text-primary text-sm cursor-pointer py-2" -->
    <!--             >See all my requests<atlan-icon icon="ArrowRight" class="ml-1" -->
    <!--         /></span> -->
    <!--     </router-link> -->
    <!-- </div> -->
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
    import whoami from '~/composables/user/whoami'

    // typescript
    import { RequestAttributes, RequestStatus } from '~/types/atlas/requests'
    // components
    import AssetPiece from '@/governance/requests/pieces/asset.vue'
    import RequestListItem from '~/components/governance/requests/requestListItem.vue'
    import StatusFilter from '@/common/assets/preview/request/statusFilter.vue'

    export default defineComponent({
        name: 'MyRequests',
        components: { AssetPiece, RequestListItem, StatusFilter },
        setup() {
            // data

            const { username, role } = whoami()
            const activeHover = ref('')
            // My requests will be showing active requests which the logged in user has raised
            const facets = ref({
                statusRequest: ['active'],
            })
            const requestList = ref([])
            const filters = ref({
                request_type: [],
                createdBy: username.value,
            })
            const searchTerm = ref('')
            const pagination = ref({
                limit: 50,
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
            const handleStatusFilterChange = (activeFilter) => {
                filters.value.status = [activeFilter.status]
            }

            return {
                requestList,
                handleMouseEnter,
                activeHover,
                role,
                handleStatusFilterChange,
                listLoading,
            }
        },
    })
</script>
<style lang="less" scoped>
    .requests-container {
        height: 390px;
    }
</style>
