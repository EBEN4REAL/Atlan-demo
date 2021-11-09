<template>
    <div>
        <div class="flex flex-row justify-between">
            <div class="flex w-full">
                <a-button
                    v-if="showBackButton"
                    class="mr-3"
                    @click="$emit('showUserGroups')"
                >
                    <AtlanIcon icon="CaretLeft" />
                </a-button>
                <div class="w-full">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search all groups`"
                        @change="handleSearch"
                        class="mr-1"
                        size="minimal"
                    />
                </div>
            </div>
            <div v-if="showAddButton">
                <a-button
                    :loading="addToGroupLoading"
                    type="primary"
                    :disabled="addToGroupLoading || !selectedIds.length"
                    @click="$emit('addUserToGroups')"
                >
                    <fa icon="fal plus" class="mr-2" />Add
                </a-button>
            </div>
        </div>
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        ghost
                        @click="
                            () => {
                                getGroupList()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div v-else class="mt-4 overflow-auto">
            <a-checkbox-group class="w-full">
                <div class="flex flex-col w-full">
                    <template v-for="group in groupList" :key="group.id">
                        <a-checkbox
                            :value="group.id"
                            class="flex items-center w-full py-2 border-b border-gray-100 "
                            @change="handleChange"
                        >
                            <div class="flex justify-between">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="mb-1 text-primary">
                                            <span class="mr-2">{{
                                                group.name
                                            }}</span>
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            @{{ group.alias
                                            }}<span
                                                v-if="group.memberCountString"
                                                class="text-gray-500"
                                                ><span class="mx-1">|</span
                                                >{{
                                                    group.memberCountString
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-checkbox>
                    </template>
                </div>
            </a-checkbox-group>
            <div
                v-if="
                    [STATES.PENDING].includes(state) ||
                    [STATES.VALIDATING].includes(state)
                "
                class="flex justify-center mt-3"
            >
                <a-spin></a-spin>
            </div>
            <div v-else-if="showLoadMore" class="flex justify-center mt-3">
                <a-button @click="handleLoadMore">load more</a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import {
        pluralizeString,
        getNameInitials,
        getNameInTitleCase,
    } from '~/utils/string'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import useGroups from '~/composables/group/useGroups'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'GroupList',
        components: {
            ErrorView,
            SearchAndFilter,
        },
        props: {
            addToGroupLoading: {
                type: Boolean,
                default: false,
            },
            showBackButton: {
                type: Boolean,
                default: true,
            },
            showAddButton: {
                type: Boolean,
                default: true,
            },
        },
        setup(props, context) {
            const selectedIds = ref([])
            const searchText = ref('')
            const groupListAPIParams = reactive({
                limit: 10,
                offset: 0,
                sort: 'name',
                filter: {},
            })
            const {
                groupListConcatenated: groupList,
                totalGroupsCount,
                filteredGroupsCount,
                getGroupList,
                state,
                STATES,
            } = useGroups(groupListAPIParams)

            const handleSearch = useDebounceFn((input: any) => {
                groupListAPIParams.filter = searchText.value
                    ? {
                          $or: [
                              { name: { $ilike: `%${searchText.value}%` } },
                              { alias: { $ilike: `%${searchText.value}%` } },
                          ],
                      }
                    : {}
                groupListAPIParams.offset = 0
                getGroupList()
            }, 200)
            const handleLoadMore = () => {
                groupListAPIParams.offset += groupListAPIParams.limit
                getGroupList()
            }
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    groupList.value.length,
                    groupListAPIParams.offset,
                    groupListAPIParams.limit,
                    searchText.value
                        ? filteredGroupsCount.value
                        : totalGroupsCount.value
                )
            )
            const handleChange = (event) => {
                if (
                    event.target.checked &&
                    !selectedIds.value.includes(event.target.value)
                ) {
                    selectedIds.value.push(event.target.value)
                } else if (!event.target.checked) {
                    const index = selectedIds.value.indexOf(event.target.value)
                    if (index > -1) {
                        selectedIds.value.splice(index, 1)
                    }
                }
                context.emit('updateSelectedGroups', selectedIds.value)
            }

            return {
                searchText,
                showLoadMore,
                groupList,
                totalGroupsCount,
                filteredGroupsCount,
                getGroupList,
                handleSearch,
                state,
                STATES,
                handleLoadMore,
                getNameInitials,
                getNameInTitleCase,
                pluralizeString,
                handleChange,
                selectedIds,
            }
        },
    })
</script>

<style></style>
