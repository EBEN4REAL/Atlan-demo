<template>
    <EmptyView
        v-if="!totalGroupsCount"
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

        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanIcon icon="Loader" class="h-7 animate-spin" />
        </div>
        <div
            v-else-if="error"
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
                            class="flex capitalize truncate cursor-pointer text-primary"
                        >
                            <div class="mr-2 truncate max-w-3/4">
                                {{ group.name }}
                            </div>
                            <!-- <div
                                v-if="group.isDefault === 'true'"
                                class="px-2 py-1 text-xs rounded-full bg-blue-50 text-gray"
                            >
                                Default
                            </div> -->
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
                        @deleteGroup="handleDeleteGroup(group)"
                        @toggleDefault="handleToggleDefault(group)"
                    />
                </template>
            </a-table>
            <div
                class="flex justify-end max-w-full mt-4"
                v-if="pagination.total > 1 || isLoading"
            >
                <Pagination
                    v-model:offset="groupListAPIParams.offset"
                    :totalPages="pagination.total"
                    :loading="isLoading"
                    :pageSize="pagination.pageSize"
                    @mutate="getGroupList"
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
    import { ref, reactive, defineComponent, computed, watch, h } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { message, Modal } from 'ant-design-vue'
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
    import Pagination from '@/common/list/pagination.vue'

    export default defineComponent({
        name: 'GroupList',
        components: {
            Pagination,
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
                limit: 50,
                offset: 0,
                filter: {},
                sort: '-createdAt',
            })
            const {
                groupList,
                totalGroupsCount,
                filteredGroupsCount,
                getGroupList,
                error,
                isLoading,
            } = useGroups(groupListAPIParams)

            const pagination = computed(() => ({
                total: Object.keys(groupListAPIParams.filter).length
                    ? Math.ceil(
                          filteredGroupsCount.value / groupListAPIParams.limit
                      )
                    : Math.ceil(
                          totalGroupsCount.value / groupListAPIParams.limit
                      ),
                pageSize: groupListAPIParams.limit,
                current:
                    groupListAPIParams.offset / groupListAPIParams.limit + 1,
            }))

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
                searchText.value = ''
                getGroupList()
            }

            const handleTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                // add sort
                if (Object.keys(sorter).length) {
                    let sortValue = '-createdAt'
                    if (sorter.order && sorter.column && sorter.column.sortKey)
                        sortValue = `${sorter.order === 'descend' ? '-' : ''}${
                            sorter.column.sortKey
                        }`
                    groupListAPIParams.sort = sortValue
                    groupListAPIParams.offset = 0
                }
                // modify offset
                // const offset =
                //     (pagination.current - 1) * groupListAPIParams.limit
                // groupListAPIParams.offset = offset
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
            const handleDeleteGroup = (group) => {
                Modal.confirm({
                    title: 'Delete Group',
                    class: 'delete-group-modal',
                    content: () => {
                        return h('div', [
                            'Are you sure you want to delete group',
                            h('span', [' ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${group.name}`]
                            ),
                            h('span', '?'),
                            h(
                                'div',
                                {
                                    class: ['my-4'],
                                },
                                [
                                    h(
                                        'div',
                                        {
                                            class: ['font-bold'],
                                        },
                                        [
                                            h(
                                                'span',
                                                { class: ['text-error'] },
                                                ['Warning']
                                            ),
                                            ' : Deleting the group will also remove it from',
                                        ]
                                    ),
                                    h('ol', { class: ['text-sm'] }, [
                                        h('li', '1. Existing personas'),
                                        h(
                                            'li',
                                            '2. It will get removed from policies inside purposes'
                                        ),
                                    ]),
                                ]
                            ),
                        ])
                    },
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const messageKey = Date.now()
                        const { data, isReady, error, isLoading } =
                            Groups.DeleteGroup(group.id)
                        watch(
                            [data, isReady, error, isLoading],
                            () => {
                                deleteGroupLoading.value = isLoading.value
                                if (!error.value && !isLoading.value) {
                                    getGroupList()
                                    message.success({
                                        content: `Group Removed`,
                                        duration: 1.5,
                                        key: messageKey,
                                    } as any)
                                } else if (
                                    error &&
                                    error.value &&
                                    !isLoading.value
                                ) {
                                    message.error({
                                        content: `Failed to remove group`,
                                        duration: 1.5,
                                        key: messageKey,
                                    } as any)
                                } else
                                    message.loading({
                                        content: `Removing group`,
                                        duration: 0,
                                        key: messageKey,
                                    } as any)
                            },
                            { immediate: true }
                        )
                    },
                })
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
                groupListAPIParams,
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
            }
        },
    })
</script>
<style lang="less">
    .delete-group-modal {
        .ant-modal-confirm-body-wrapper {
            @apply p-5;
        }
    }
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
    .delete-group-modal {
        .ant-modal-confirm-body-wrapper {
            @apply p-5;
        }
    }
</style>
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
    .group-table {
        // extra row hide hack
        :global(.ant-table-measure-row) {
            @apply hidden;
        }
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
