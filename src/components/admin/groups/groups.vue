<template>
    <DefaultLayout
        v-if="permissions.list"
        title="Groups"
        :badge="totalGroupsCount"
    >
        <template #header>
            <div class="flex justify-between">
                <div class="flex w-1/4">
                    <a-input-search
                        v-model:value="searchText"
                        :placeholder="`Search ${totalGroupsCount} group${
                            totalGroupsCount > 1 ? 's' : ''
                        }`"
                        :allow-clear="true"
                        class="mr-1"
                        @change="onSearch"
                    ></a-input-search>
                </div>
                <router-link to="/admin/groups/new">
                    <a-button
                        v-if="permissions.create"
                        class="rounded-md"
                        type="primary"
                        >Create Group</a-button
                    >
                </router-link>
            </div>
        </template>

        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center h-full align-middle bg-white"
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
        <a-table
            v-else-if="groupList"
            id="groupList"
            class="overflow-hidden border rounded-lg"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="groupList"
            :columns="
                columns.filter(
                    (col) =>
                        col.title !== 'Actions' ||
                        permissions.delete ||
                        permissions.update
                )
            "
            :row-key="(group) => group.id"
            :loading="
                [STATES.PENDING].includes(state) ||
                [STATES.VALIDATING].includes(state)
            "
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
                    :group="group"
                    :permissions="permissions"
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
    </DefaultLayout>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed, watch } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { message } from 'ant-design-vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import { Groups } from '~/services/service/groups'
    import DefaultLayout from '@/admin/layout.vue'
    import useGroups from '~/composables/group/useGroups'

    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    import ActionButtons from './actionButtons.vue'

    export default defineComponent({
        components: {
            ErrorView,

            DefaultLayout,

            ActionButtons,
        },
        setup(props, context) {
            const router = useRouter()
            const defaultTab = ref('about')
            const showGroupPreview = ref(false)
            const markAsDefaultLoading = ref(false)
            const deleteGroupLoading = ref(false)
            const showActionsDropdown = ref(false)

            const permissions = computed(() => ({
                list: true,
                add: true,
                remove: true,
                create: true,
                update: true,
            }))

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
                state,
                STATES,
            } = useGroups(groupListAPIParams)
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
                // showGroupPreview.value = true;
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
            // BEGIN: GROUP PREVIEW
            const {
                showPreview,
                showGroupPreview: openPreview,
                setGroupUniqueAttribute,
                setDefaultTab,
            } = useGroupPreview()
            const showGroupPreviewDrawer = (
                group: any,
                activeTabKey = 'about'
            ) => {
                selectedGroupId.value = group.id
                setDefaultTab(activeTabKey)
                setGroupUniqueAttribute(group.id)
                openPreview()
            }
            watch(showPreview, () => {
                if (!showPreview.value) getGroupList()
            })
            // END: GROUP PREVIEW
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
                searchText,
                onSearch,
                groupList,
                pagination,
                handleTableChange,
                state,
                STATES,
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
                permissions,
                handlePagination,
            }
        },
        data() {
            return {
                dataSource: [],
                columns: [
                    {
                        title: 'Group Name',
                        key: 'name',
                        sorter: true,
                        ellipsis: true,
                        width: 300,
                        sortKey: 'alias',
                        slots: { title: 'customTitle', customRender: 'name' },
                    },
                    {
                        title: 'Members',
                        dataIndex: 'memberCountString',
                        key: 'memberCountString',
                        sorter: true,
                        ellipsis: true,
                        sortKey: 'user_count',
                    },
                    {
                        title: 'Created By',
                        dataIndex: 'createdBy',
                        key: 'createdBy',
                    },
                    {
                        title: 'Created on',
                        dataIndex: 'createdAtTimeAgo',
                        key: 'createdAt',
                        sorter: true,
                        ellipsis: true,
                        sortKey: 'created_at',
                    },
                    {
                        title: 'Actions',

                        slots: { customRender: 'actions' },
                    },
                ],
            }
        },
    })
</script>
<style lang="less">
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
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
