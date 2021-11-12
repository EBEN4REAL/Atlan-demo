<template>
    <DefaultLayout title="Requests" sub-title="Manage org-wide requests">
        <template #header>
            <SearchAndFilter
                v-model="searchTerm"
                class="max-w-xl mb-4"
                size="default"
            >
                <!-- <template #filter>
                    <RequestFilters v-model:filters="filters" />
                </template> -->
            </SearchAndFilter>
            <!-- <RequestTypeTabs v-model:tab="filters.request_type" /> -->
        </template>

        <div v-if="listLoading" class="flex items-center justify-center h-64">
            <a-spin size="large" />
        </div>
        <template v-else-if="requestList.length && !listLoading">
            <!-- <RequestModal
                :request="requestList[selectedIndex]"
                v-model:visible="isDetailsVisible"
                @up="traverseUp"
                @down="traverseDown"
            ></RequestModal> -->
            <VirtualList :data="requestList" data-key="id">
                <template #default="{ item, index }">
                    <RequestListItem
                        :request="item"
                        :selected="isSelected(item.id)"
                        :active="index === selectedIndex"
                        @select="selectRequest(item.id, index)"
                        @action="handleRequestAction($event, index)"
                    />
                </template>
            </VirtualList>
        </template>
        <div v-else>Empty state</div>
    </DefaultLayout>
    <!-- <NoAcces v-else /> -->
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch, Ref } from 'vue'
    import { useMagicKeys, whenever } from '@vueuse/core'
    import { useRequestList } from '~/composables/requests/useRequests'

    import DefaultLayout from '@/admin/layout.vue'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import RequestTypeTabs from './requestTypeTabs.vue'
    import RequestListItem from '~/components/governance/requests/requestListItem.vue'
    // import RequestFilters from './filters/requestFilters.vue'
    // import RequestModal from './modal/requestDetailsBase.vue'
    // import NoAcces from '@/admin/common/noAccessPage.vue'

    import { RequestAttributes, RequestStatus } from '~/types/atlas/requests'
    import { message } from 'ant-design-vue'
    // import { useAccessStore } from '~/services/access/accessStore'

    export default defineComponent({
        name: 'RequestList',
        components: {
            VirtualList,
            RequestListItem,
            SearchAndFilter,
            // RequestFilters,
            // RequestModal,
            // RequestTypeTabs,
            DefaultLayout,
            // NoAcces
        },
        setup() {
            // const accessStore = useAccessStore();
            // const listPermission = computed(() => accessStore.checkPermission('LIST_REQUEST'))
            // keyboard navigation stuff
            const { Shift, ArrowUp, ArrowDown, x, Meta, Control, Space } =
                useMagicKeys()
            const selectedList = ref(new Set<string>())
            const selectedIndex = ref(0)
            const isDetailsVisible = ref(false)
            const searchTerm = ref('')
            const filters = ref({
                status: 'active' as RequestStatus,
                request_type: [],
            })

            const {
                response,
                isLoading: listLoading,
                error: listError,
            } = useRequestList(searchTerm, filters)

            const requestList = computed(
                () =>
                    response.value?.records?.filter(
                        (req) => req.status === filters.value.status
                    ) || []
            )

            function isSelected(guid: string): boolean {
                // TODO: change this when adding bulk support
                // return selectedList.value.has(guid)
                return false
            }

            /***********************************************************************************
                /////////// DO NOT REMOVE ANY COMMENTED CODE - They are for bulk select ////////////
                ***********************************************************************************/

            function selectRequest(guid: string, index: number) {
                /** Check if the currently pressed key is not this array,
                 * then clear the set, else directly add the new item to the set
                 */
                if (!Meta.value && !Control.value) selectedList.value.clear()

                // Remove the request id if already present in the set
                if (selectedList.value.has(guid))
                    selectedList.value.delete(guid)
                else selectedList.value.add(guid)

                // Add the last selected index to the ref variable
                // Set it to -1 if nothing is selected
                if (selectedList.value.size) selectedIndex.value = index
                else selectedIndex.value = -1

                isDetailsVisible.value = true
            }

            const traverseUp = () => {
                if (selectedIndex.value > 0) {
                    selectedIndex.value--
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            }

            const traverseDown = () => {
                if (selectedIndex.value < requestList.value.length - 1) {
                    selectedIndex.value++
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            }
            whenever(ArrowUp, traverseUp)
            whenever(ArrowDown, traverseDown)

            whenever(x, () => {
                if (
                    selectedIndex.value > -1 &&
                    selectedIndex.value < requestList.value.length - 1
                ) {
                    const guid = requestList.value[selectedIndex.value].id
                    if (selectedList.value.has(guid))
                        selectedList.value.delete(guid)
                    else selectedList.value.add(guid)
                }
            })

            whenever(
                Space,
                () => (isDetailsVisible.value = !isDetailsVisible.value)
            )

            function handleRequestAction(req: RequestAttributes, idx: number) {
                if (filters.value.status.includes(req.status)) {
                    requestList.value[idx] = req
                } else {
                    requestList.value.splice(idx, 1)
                }
            }

            watch(listError, () => {
                if (listError.value)
                    message.error('Failed to load request data.')
            })

            watch(
                filters,
                () => {
                    selectedIndex.value = 0
                },
                { deep: true }
            )

            return {
                requestList,
                isSelected,
                selectRequest,
                selectedList,
                selectedIndex,
                searchTerm,
                handleRequestAction,
                filters,
                listLoading,
                listError,
                isDetailsVisible,
                traverseUp,
                traverseDown,
                // listPermission
            }
        },
    })
</script>

<style></style>