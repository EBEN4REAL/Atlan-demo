<template>
    <EmptyView
        v-if="!error && !searchText && !isLoading && !groupList?.length"
        empty-screen="CreateGroups"
        headline="Create a new group"
        button-text="Create Group"
        @event="() => (isGroupDrawerVisible = true)"
    />
    <DefaultLayout title="Groups" :badge="totalGroupsCount">
        <template #header>
            <div class="flex justify-between">
                <div class="flex w-1/4">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search ${totalGroupsCount} group${
                            totalGroupsCount > 1 ? 's' : ''
                        }`"
                        class="mr-1"
                        size="minimal"
                        @change="onSearch"
                    />
                </div>

                <AtlanButton
                    v-auth="map.CREATE_GROUP"
                    class="px-5"
                    size="sm"
                    type="primary"
                    @click="isGroupDrawerVisible = true"
                >
                    Create Group
                </AtlanButton>
            </div>
        </template>
        <a-drawer
            :visible="isGroupDrawerVisible"
            :mask="false"
            :width="350"
            :closable="false"
            :destroy-on-close="true"
        >
            <AddGroup
                @closeDrawer="isGroupDrawerVisible = false"
                @refresh="getGroupList"
            />
        </a-drawer>

        <div
            v-if="error"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton
                        color="secondary"
                        @click="
                            () => {
                                getGroupList()
                            }
                        "
                    >
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <template v-else-if="groupList?.length">
            <a-table
                id="groupList"
                class="overflow-hidden border rounded-lg"
                :class="$style.groupTable"
                :scroll="{ y: 'calc(100vh - 20rem)' }"
                :table-layout="'fixed'"
                :pagination="false"
                :data-source="groupList"
                :columns="columns"
                :row-key="(group) => group.id"
                :loading="isLoading"
                @change="handleTableChange"
            >
                <template #name="{ text: group }">
                    <div
                        @click="
                            () => {
                                handleGroupClick(group)
                            }
                        "
                    >
                        <div
                            class="flex capitalize truncate cursor-pointer  text-primary"
                        >
                            <div class="mr-2 truncate max-w-3/4">
                                {{ group.name }}
                            </div>
                            <div
                                v-if="group.isDefault === 'true'"
                                class="px-2 py-1 text-xs rounded-full  bg-blue-50 text-gray"
                            >
                                Default
                            </div>
                        </div>
                        <p class="mb-0 text-gray-500 truncate">
                            {{ group.description }}
                        </p>
                    </div>
                </template>
                <template #actions="{ text: group }">
                    <ActionButtons
                        v-auth="[map.UPDATE_GROUP]"
                        :group="group"
                        :mark-as-default-loading="markAsDefaultLoading"
                        :delete-group-loading="deleteGroupLoading"
                        @addMembers="handleAddMembers(group)"
                        @deleteGroup="handleDeleteGroup(group.id)"
                        @toggleDefault="handleToggleDefault(group)"
                    />
                </template>
            </a-table>
            <div class="flex justify-end max-w-full mt-4">
                <a-pagination
                    :total="pagination.total"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    @change="handlePagination"
                />
            </div>
        </template>
        <EmptyView
            v-else
            empty-screen="NoGroups"
            desc="Oops… we didn’t find any groups that match this search"
            button-text="Clear search"
            @event="clearFilter"
        />
    </DefaultLayout>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed, watch } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { message } from 'ant-design-vue'
    import { useDebounceFn } from '@vueuse/core'
    import EmptyView from '@common/empty/index.vue'
    import { Groups } from '~/services/service/groups'
    import DefaultLayout from '@/admin/layout.vue'
    import useGroups from '~/composables/group/useGroups'

    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    import ActionButtons from './actionButtons.vue'
    import AtlanButton from '@/UI/button.vue'
    import map from '~/constant/accessControl/map'
    import AddGroup from '@/admin/groups/addGroup.vue'
    import { columns } from '~/constant/groups'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'GroupList',
        components: {
            ErrorView,
            EmptyView,
            AddGroup,
            AtlanButton,
            DefaultLayout,
            ActionButtons,
            SearchAndFilter,
        },
        setup(props, context) {
            const defaultTab = ref('about')
            const showGroupPreview = ref(false)
            const markAsDefaultLoading = ref(false)
            const deleteGroupLoading = ref(false)
            const showActionsDropdown = ref(false)
            const isGroupDrawerVisible = ref(false)

            const selectedGroupId = ref('')
            const groupListAPIParams = reactive({
                limit: 15,
                offset: 0,
                filter: {},
                sort: '-created_at',
            })
            const pagination = computed(() => ({
                total: Object.keys(groupListAPIParams.filter).length
                    ? filteredGroupsCount.value
                    : totalGroupsCount.value,
                pageSize: groupListAPIParams.limit,
                current:
                    groupListAPIParams.offset / groupListAPIParams.limit + 1,
            }))

            const {
                groupList,
                totalGroupsCount,
                filteredGroupsCount,
                getGroupList,
                error,
                isLoading,
            } = useGroups(groupListAPIParams)

            // BEGIN: GROUP PREVIEW
            const {
                showPreview,
                showGroupPreview: openPreview,
                setGroupUniqueAttribute,
                setDefaultTab,
                closePreview,
                groupId,
            } = useGroupPreview()

            const showGroupPreviewDrawer = (
                group: any,
                activeTabKey = 'about'
            ) => {
                if (showPreview.value && groupId.value === group.id) {
                    closePreview()
                } else {
                    selectedGroupId.value = group.id
                    setDefaultTab(activeTabKey)
                    setGroupUniqueAttribute(group.id)
                    openPreview()
                }
            }
            watch(showPreview, () => {
                if (!showPreview.value) getGroupList()
            })
            // END: GROUP PREVIEW

            // Logic for search input
            const searchText = ref<string>('')
            const onSearch = useDebounceFn(() => {
                groupListAPIParams.filter = searchText.value
                    ? {
                          $or: [
                              { name: { $ilike: `%${searchText.value}%` } },
                              {
                                  attributes: {
                                      $elemMatch: {
                                          alias: {
                                              $ilike: `%${searchText.value}%`,
                                          },
                                      },
                                  },
                              },
                              // { alias: { $ilike: `%${searchText.value}%` } },
                          ],
                      }
                    : {}
                groupListAPIParams.offset = 0
                getGroupList()
            }, 600)
            const clearFilter = () => {
                groupListAPIParams.filter = {}
                getGroupList()
            }

            const handlePagination = (page: number) => {
                // modify offset
                const offset = (page - 1) * groupListAPIParams.limit
                groupListAPIParams.offset = offset
                getGroupList()
            }

            const handleTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                // add sort
                if (Object.keys(sorter).length) {
                    let sortValue = '-created_at'
                    if (sorter.order && sorter.column && sorter.column.sortKey)
                        sortValue = `${sorter.order === 'descend' ? '-' : ''}${
                            sorter.column.sortKey
                        }`
                    groupListAPIParams.sort = sortValue
                    groupListAPIParams.offset = 0
                }
                // modify offset
                const offset =
                    (pagination.current - 1) * groupListAPIParams.limit
                groupListAPIParams.offset = offset
                // fetch groups
                getGroupList()
            }

            const handleAddMembers = (group: any) => {
                showGroupPreviewDrawer(group, 'members')
            }

            const handleGroupClick = (group: any) => {
                showGroupPreviewDrawer(group)
            }
            const selectedGroup = computed(() => {
                let activeGroupObj = {}
                if (groupList && groupList.value && groupList.value.length)
                    activeGroupObj = groupList.value.find(
                        (group: any) => group.id === selectedGroupId.value
                    )
                return activeGroupObj
            })

            const handleClosePreview = () => {
                defaultTab.value = 'about'
                showGroupPreview.value = false
            }
            const handleDeleteGroup = (groupId: string) => {
                const { data, isReady, error, isLoading } =
                    Groups.DeleteGroup(groupId)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        deleteGroupLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            getGroupList()
                            message.success('Group Removed')
                        } else if (error && error.value) {
                            message.error('Failed, try again')
                        }
                    },
                    { immediate: true }
                )
            }

            const handleToggleDefault = (group: any) => {
                const requestPayload = ref()
                requestPayload.value = {
                    attributes: {
                        isDefault: [
                            `${group.isDefault === 'true' ? 'false' : 'true'}`,
                        ],
                    },
                }
                const { data, isReady, error, isLoading } = Groups.UpdateGroup(
                    group.id,
                    requestPayload
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        markAsDefaultLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            message.success(
                                `Group ${
                                    group.isDefault === 'true'
                                        ? 'unmarked'
                                        : 'marked'
                                } as default`
                            )
                            getGroupList()
                        } else if (error && error.value) {
                            message.error(
                                `Unable to ${
                                    group.isDefault === 'true'
                                        ? 'unmark'
                                        : 'mark'
                                } group as default, please try again`
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            return {
                columns,
                isGroupDrawerVisible,
                searchText,
                onSearch,
                groupList,
                pagination,
                clearFilter,
                handleTableChange,
                error,
                isLoading,
                handleGroupClick,
                showGroupPreview,
                totalGroupsCount,
                selectedGroup,
                handleClosePreview,
                handleDeleteGroup,
                getGroupList,
                handleAddMembers,
                defaultTab,
                handleToggleDefault,
                markAsDefaultLoading,
                deleteGroupLoading,
                showActionsDropdown,
                map,
                handlePagination,
            }
        },
    })
</script>
<style lang="less" scoped>
    #groupList {
        th.ant-table-row-cell-last {
            display: flex;
            justify-content: center;
        }
    }
    .hide-checkbox {
        .ant-checkbox {
            display: none;
        }
    }
</style>

<style lang="less" module>
    .groupTable {
        :global(.ant-table-column-title) {
            @apply text-left;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
