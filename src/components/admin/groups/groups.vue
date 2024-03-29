<template>
    <EmptyView
        v-if="!totalGroupsCount"
        empty-screen="CreateGroups"
        headline="Create a new group"
        button-text="Create Group"
        button-icon="Add"
        @event="() => (isGroupDrawerVisible = true)"
    />
    <DefaultLayout title="Groups" :badge="totalGroupsCount">
        <template #header>
            <div
                v-if="totalGroupsCount > 0"
                class="flex justify-between p-4 -mb-3 border border-b-0 border-gray-300 rounded-t-lg"
            >
                <div class="flex w-1/4">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search ${totalGroupsCount} group${
                            totalGroupsCount > 1 ? 's' : ''
                        }`"
                        class="h-8 mr-1 shadow-none"
                        @change="onSearch"
                    />
                </div>

                <AtlanButton2
                    v-auth="map.CREATE_GROUP"
                    label="Create Group"
                    prefix-icon="Add"
                    @click="isGroupDrawerVisible = true"
                />
            </div>
        </template>
        <a-drawer
            :visible="isGroupDrawerVisible"
            :mask="false"
            :width="450"
            :closable="false"
            :destroy-on-close="true"
            @close="isGroupDrawerVisible = false"
        >
            <AddGroup
                @closeDrawer="isGroupDrawerVisible = false"
                @refresh="getGroupList"
            />
        </a-drawer>

        <div
            v-if="isLoading"
            class="flex items-center justify-center h-full border border-gray-300 rounded-lg"
        >
            <AtlanLoader class="h-7" />
        </div>
        <div
            v-else-if="error"
            class="flex flex-col items-center h-full align-middle bg-white border border-gray-300 rounded-lg"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton2
                        color="secondary"
                        label="Try again"
                        prefix-icon="Retry"
                        @click="getGroupList()"
                    />
                </div>
            </ErrorView>
        </div>
        <template v-else-if="groupList?.length">
            <a-table
                id="groupList"
                class="overflow-hidden rounded-b-lg users-groups-table"
                :scroll="{ y: 'calc(100vh - 20rem)', x: false }"
                :pagination="false"
                :data-source="groupList"
                :columns="columns"
                :row-key="(group) => group.id"
                :loading="isLoading"
                :show-sorter-tooltip="false"
                :row-class-name="
                    (r, i) =>
                        showPreview && selectedGroupId === r.id
                            ? $style.fixSelectedRowBG
                            : ''
                "
                @change="handleTableChange"
            >
                <template #headerCell="{ title, column }">
                    <a-tooltip
                        v-if="column.sortKey"
                        placement="top"
                        class="px-4"
                    >
                        <template #title>{{
                            getSortTooltipText(
                                column.sortKey,
                                column.ascOrderString || '',
                                column.descOrderString || ''
                            )
                        }}</template>
                        <div
                            class="flex justify-start font-normal tracking-wide uppercase cursor-pointer group hover:text-gray-700"
                            :class="
                                column.align === 'right'
                                    ? 'flex-row-reverse'
                                    : ''
                            "
                        >
                            <div class="max-w-xs pt-0">
                                {{ title }}
                            </div>
                            <div
                                v-if="column.sortKey !== activeSortObject.key"
                                class="flex opacity-0 group-hover:opacity-100"
                            >
                                <div>
                                    <AtlanIcon
                                        icon="ArrowDown"
                                        class="mb-1 transform rotate-180"
                                    />
                                </div>
                                <div>
                                    <AtlanIcon
                                        icon="ArrowDown"
                                        class="mb-0.5 -ml-2"
                                    ></AtlanIcon>
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex opacity-100 group-hover:opacity-100"
                            >
                                <div v-if="activeSortObject.order === 'asc'">
                                    <AtlanIcon
                                        icon="ArrowDown"
                                        class="mb-1 transform rotate-180"
                                    />
                                </div>
                                <div v-if="activeSortObject.order === 'desc'">
                                    <AtlanIcon
                                        icon="ArrowDown"
                                        class="mb-0.5"
                                    ></AtlanIcon>
                                </div>
                            </div>
                        </div>
                    </a-tooltip>
                    <div
                        v-else
                        :class="
                            column.align === 'center'
                                ? 'justify-center'
                                : column.align === 'right'
                                ? 'justify-end'
                                : 'justify-start'
                        "
                        class="flex px-4 font-normal tracking-wide text-gray-500 uppercase w-100 group-hover:text-gray-700"
                    >
                        <div class="max-w-xs pt-0">{{ title }}</div>
                    </div>
                </template>

                <template #bodyCell="{ text: value, record: group, column }">
                    <div
                        class="flex items-center h-11"
                        @click="
                            () => {
                                handleGroupClick(group)
                            }
                        "
                    >
                        <div
                            v-if="column.key === 'name'"
                            class="flex items-center pr-6 truncate"
                        >
                            <Avatar
                                :avatar-size="32"
                                avatar-shape="circle"
                                class="mr-3"
                                :is-group="true"
                            />
                            <div class="w-full truncate">
                                <div
                                    class="flex capitalize cursor-pointer text-primary"
                                >
                                    <div class="mr-2 truncate">
                                        {{ group.name }}
                                    </div>
                                    <div
                                        v-show="group.isDefault === 'true'"
                                        class="px-2 py-1 text-xs rounded-full bg-blue-50 text-gray"
                                    >
                                        Default
                                    </div>
                                </div>
                                <p class="mb-0 text-gray-500 truncate">
                                    <a-tooltip placement="bottom">
                                        <template #title>alias</template>
                                        {{ group.alias }}</a-tooltip
                                    ><span v-if="group.description"
                                        ><span class="mx-1 text-gray-300"
                                            >•</span
                                        >{{ group.description }}</span
                                    >
                                </p>
                            </div>
                        </div>
                        <div
                            v-else-if="column.key === 'memberCount'"
                            @click.stop="handleAddMembers(group)"
                        >
                            <div class="cursor-pointer text-primary">
                                {{
                                    value >= 2
                                        ? value + ' members'
                                        : value + ' member'
                                }}
                            </div>
                        </div>
                        <div
                            v-else-if="column.key === 'personas'"
                            @click.stop=""
                        >
                            <PopoverPersonaUser :personas="group?.personas" />
                        </div>
                        <div
                            v-else-if="column.key === 'createdBy'"
                            class="flex items-center cursor-pointer"
                            @click.stop="handleUserPreview(value)"
                        >
                            <Avatar
                                v-if="value"
                                :image-url="imageUrl(value)"
                                :allow-upload="false"
                                :avatar-name="value"
                                :avatar-size="24"
                                :avatar-shape="'circle'"
                                class="mr-2 mt-0.5"
                            />
                            <a-tooltip placement="top">
                                <template #title>
                                    <div class="created-name">
                                        {{ value }}
                                    </div>
                                </template>

                                <div class="mt-0.5 truncate created-name">
                                    {{ value }}
                                </div>
                            </a-tooltip>
                        </div>
                        <div
                            v-else-if="column.key === 'actions'"
                            class="flex justify-end w-full"
                        >
                            <ActionButtons
                                v-auth="[map.UPDATE_GROUP]"
                                :group="group"
                                :mark-as-default-loading="markAsDefaultLoading"
                                :delete-group-loading="deleteGroupLoading"
                                @delete-group="handleDeleteGroup(group)"
                                @toggle-default="handleToggleDefault(group)"
                                @members-added="refreshTable"
                            />
                        </div>
                    </div>
                </template>
            </a-table>
            <div
                v-if="pagination.total > 1 || isLoading"
                class="flex justify-end max-w-full mt-4"
            >
                <Pagination
                    v-model:offset="groupListAPIParams.offset"
                    :total-pages="pagination.total"
                    :loading="isLoading"
                    :page-size="pagination.pageSize"
                    @mutate="getGroupList"
                />
            </div>
        </template>
        <EmptyView
            v-else
            empty-screen="NoGroups"
            desc="Oops… we didn’t find any groups that match this search"
            button-text="Clear search"
            class="min-h-full border border-gray-300 rounded-b-lg"
            image-class="h-36"
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
    import axios from 'axios'
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
    import Avatar from '~/components/common/avatar/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import PopoverPersonaUser from '~/components/admin/common/popoverPersona.vue'

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
            Avatar,
            PopoverPersonaUser,
        },
        setup(props, context) {
            const defaultTab = ref('about')
            const showGroupPreview = ref(false)
            const markAsDefaultLoading = ref(false)
            const deleteGroupLoading = ref(false)
            const showActionsDropdown = ref(false)
            const isGroupDrawerVisible = ref(false)
            const cancelTokenSource = ref()
            const activeSortObject = ref({
                order: '',
                key: '',
            })
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const {
                showUserPreview: openUserPreview,
                setUserUniqueAttribute,
                closePreview: closeUserPreview,
                username: activeUsername,
            } = useUserPreview()
            const handleUserPreview = (username: string) => {
                if (activeUsername.value === username) {
                    setUserUniqueAttribute('', 'username')
                    closeUserPreview()
                } else {
                    setUserUniqueAttribute(username, 'username')
                    openUserPreview()
                }
            }
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
                lastUpdate,
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
            watch(lastUpdate, () => {
                getGroupList()
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

            const getNextOrder = () => {
                switch (activeSortObject.value.order) {
                    case 'asc':
                        return 'desc'
                    case 'desc':
                        return ''
                    default:
                        return 'asc'
                }
            }
            const handleSort = (sortKey: string) => {
                // change sortKey

                if (sortKey !== activeSortObject.value.key) {
                    activeSortObject.value.key = sortKey
                    activeSortObject.value.order = 'asc'
                }
                // change sortOrder
                else {
                    const nextSortOrder = getNextOrder()
                    activeSortObject.value.order = getNextOrder()
                    if (!nextSortOrder) activeSortObject.value.key = ''
                }
                let sortValue = '-createdAt'
                if (
                    activeSortObject.value.key &&
                    activeSortObject.value.order
                ) {
                    sortValue = `${
                        activeSortObject.value.order === 'desc' ? '-' : ''
                    }${activeSortObject.value.key}`
                }
                groupListAPIParams.sort = sortValue
                groupListAPIParams.offset = 0
                getGroupList()
            }
            const handleTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                handleSort(sorter?.column?.sortKey ?? '')
            }

            const getSortTooltipText = (
                sortKey: string,
                ascText: string = '',
                descText: string = ''
            ) => {
                if (sortKey === activeSortObject.value.key)
                    switch (activeSortObject.value.order) {
                        case 'asc':
                            return descText || `Sort by descending`
                        case 'desc':
                            return 'Back to default'
                        default:
                            return ascText || `Sort by ascending`
                    }

                return ascText || `Sort by ascending`
            }
            const handleAddMembers = (group: any) => {
                showGroupPreviewDrawer(group, 'members')
            }

            const refreshTable = () => {
                groupListAPIParams.offset = 0
                getGroupList()
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
                    content: () =>
                        h('div', [
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
                                            ' : Deleting a group will also remove it from',
                                        ]
                                    ),
                                    h('ol', { class: ['text-sm'] }, [
                                        h(
                                            'li',
                                            '1. Personas which this group is a part of'
                                        ),
                                        h(
                                            'li',
                                            '2. Policies inside purposes which include this group'
                                        ),
                                    ]),
                                ]
                            ),
                        ]),
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
                                    useAddEvent('admin', 'group', 'deleted')
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
                if (cancelTokenSource.value) {
                    cancelTokenSource.value.cancel('cancelled')
                }
                cancelTokenSource.value = axios.CancelToken.source()
                const options = ref({
                    cancelToken: cancelTokenSource.value.token,
                })
                const requestPayload = ref()
                requestPayload.value = {
                    attributes: {
                        isDefault: [
                            `${group.isDefault === 'true' ? 'false' : 'true'}`,
                        ],
                    },
                    path: group?.path,
                }
                const { data, isReady, error, isLoading } = Groups.UpdateGroup(
                    group.id,
                    requestPayload,
                    { options }
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
                            useAddEvent('admin', 'group', 'updated', {
                                users_count: group.memberCount,
                                has_slack_channel_added:
                                    group.attributes?.channels?.some((c) =>
                                        c?.includes('slack')
                                    ) || false,
                                is_default: group.isDefault === 'true',
                                has_description: !!group.description,
                            })
                            cancelTokenSource.value = null
                            getGroupList()
                        } else if (error && error.value) {
                            if (error && error.value.message === 'cancelled')
                                return
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
                showPreview,
                selectedGroupId,
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
                refreshTable,
                getSortTooltipText,
                activeSortObject,
                imageUrl,
                handleUserPreview,
            }
        },
    })
</script>
<style lang="less">
    .users-groups-table {
        .ant-table-thead {
            height: 44px !important;
        }
        border-width: 1px;
        border-top-color: #f3f3f3;
        border-right-color: #e6e6eb;
        border-bottom-color: #e6e6eb;
        border-left-color: #e6e6eb;
    }
</style>
<style lang="less" scoped>
    .created-name {
        max-width: 130px;
    }
    .content-popover-group-persona {
        min-width: 180px;
        height: auto;
        max-height: 170px;
    }
</style>

<style lang="less" module>
    .fixSelectedRowBG {
        @apply bg-gray-100;
        :global(.ant-table-cell.ant-table-cell-fix-left.ant-table-cell-fix-left-last) {
            @apply bg-gray-100;
        }
        td {
            @apply bg-gray-100 hover:bg-gray-100 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
