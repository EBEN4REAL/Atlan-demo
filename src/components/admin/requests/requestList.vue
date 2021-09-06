<template>
    <p class="mb-2 text-2xl">Requests</p>
    <p class="mb-0 text-sm text-gray">Manage org-wide requests</p>
    <SearchAndFilter v-model:value="searchTerm" class="max-w-xl pt-6 mb-4">
        <template #filter>
            <RequestFilters v-model:filters="filters" />
        </template>
    </SearchAndFilter>
    <div v-if="listLoading">Loading</div>
    <VirtualList
        v-else-if="requestList.length && !listLoading"
        :data="requestList"
        data-key="id"
    >
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
    <div v-else>Empty state</div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch } from 'vue'
    import { useMagicKeys, whenever } from '@vueuse/core'
    import { useRequestList } from '~/composables/requests/useRequests'

    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestListItem from './requestListItem.vue'
    import RequestFilters from './requestFilters.vue'
    import { RequestAttributes, RequestStatus } from '~/types/atlas/requests'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'RequestList',
        components: {
            VirtualList,
            RequestListItem,
            SearchAndFilter,
            RequestFilters,
        },
        setup() {
            // keyboard navigation stuff
            const { Shift, ArrowUp, ArrowDown, x, Meta, Control } =
                useMagicKeys()
            const selectedList = ref(new Set<string>())
            const selectedIndex = ref(-1)
            const searchTerm = ref('')
            const filters = ref({ status: ['active'] as RequestStatus[] })

            const {
                response,
                isLoading: listLoading,
                error: listError,
            } = useRequestList(searchTerm, filters)
            const requestList = computed(() => response.value?.records || [])

            function isSelected(guid: string): boolean {
                return selectedList.value.has(guid)
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
            }

            whenever(ArrowUp, () => {
                if (selectedIndex.value > -1) {
                    selectedIndex.value--
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            })

            whenever(ArrowDown, () => {
                if (selectedIndex.value < requestList.value.length - 1) {
                    selectedIndex.value++
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            })

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
            }
        },
    })
</script>

<style></style>
