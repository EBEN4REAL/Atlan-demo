<template>
    <div>
        <div class="mb-2 text-2xl text-gray">Manage Members <a-badge :number-style="{backgroundColor: '#5277D7'}" :count="filteredUserCount" /></div>
        <div class="pb-6 text-sm text-gray">
            Add, remove and manage their roles
        </div>
        <div class="flex justify-between mb-4 gap-x-5">
            <div class="flex w-1/4">
                <a-input-search
                    v-model:value="searchText"
                    placeholder="Search Members"
                    class="mr-1"
                    size="default"
                    :allow-clear="true"
                    @change="handleSearch"
                ></a-input-search>
            </div>
            <div class="flex justify-end">
                <a-popover placement="bottom">
                    <template #content>
                        <div class="flex">
                            <div class="pr-3 border-gray-200">
                                <div class="flex justify-between">
                                    <p class="mb-1 text-gray-500">Status</p>
                                    <fa
                                        v-if="statusFilterValue"
                                        icon="fal times-circle"
                                        class="text-red-600 cursor-pointer"
                                        @click="resetStatusFilter"
                                    ></fa>
                                </div>
                                <a-radio-group
                                    v-model:value="statusFilterValue"
                                    @change="handleStatusFilterChange"
                                >
                                    <div class="flex flex-col space-y-1">
                                        <a-radio :value="'enabled'"
                                            >Active Users</a-radio
                                        >
                                        <a-radio :value="'disabled'"
                                            >Disabled Users</a-radio
                                        >
                                    </div>
                                </a-radio-group>
                            </div>
                            <!-- <div class="pl-3 border-l border-dashed">
                <p class="mb-1 text-gray-500">Role</p>
                <a-radio-group>
                  <div class="flex flex-col space-y-1">
                    <a-radio>Admin</a-radio>
                    <a-radio>Cloud</a-radio>
                    <a-radio>Steward</a-radio>
                    <a-radio>Member</a-radio>
                  </div>
                </a-radio-group>
              </div>-->
                        </div>
                    </template>
                    <a-button
                        size="default"
                        class="mr-2 rounded-md text-gray-500"
                    >
                        <fa icon="fal filter" class="mr-1"></fa>Filter users
                        <!--TODO: add logic to count filters and show the count here-->
                        <span v-if="statusFilterValue">(1)</span>
                    </a-button>
                </a-popover>
                <a-button
                    v-if="loginWithEmailAllowed"
                    type="primary"
                    class="rounded-md"
                    size="default"
                    @click="handleInviteUsers"
                    >Add User</a-button
                >
            </div>
        </div>
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
                                getUserList()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <!-- Table for users-->
        <div v-else>
            <div v-if="listType === 'users'">
                <a-table
                    v-if="userList && listType === 'users'"
                    id="userList"
                    :scroll="{ y: 'calc(100vh - 20rem)' }"
                    :table-layout="'fixed'"
                    :data-source="userList"
                    :columns="columns"
                    :row-key="(user) => user.id"
                    :pagination="false"
                    :loading="
                        [STATES.PENDING].includes(state) ||
                        [STATES.VALIDATING].includes(state)
                    "
                    @change="handleTableChange"
                >
                    <template #name="{ text: user }">
                        <div class="flex items-center align-middle">
                            <avatar
                                :image-url="imageUrl(user.username)"
                                :allow-upload="isCurrentUser(user.username)"
                                :avatar-name="
                                    user.name || user.uername || user.email
                                "
                                :avatar-size="40"
                                class="mr-2"
                            />
                            <div
                                class="truncate cursor-pointer"
                                @click="
                                    () => {
                                        showUserPreviewDrawer(user)
                                    }
                                "
                            >
                                <span class="text-primary">{{
                                    nameCase(user.name) || '-'
                                }}</span>
                                <p class="mb-0 text-gray truncate">
                                    @{{ user.username || '-' }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #status="{ text: user }">
                        <div
                            class="
                                inline-flex
                                items-center
                                px-2
                                py-0.5
                                bg-gray-100
                                rounded
                                text-gray-500
                            "
                        >
                            <fa
                                :icon="user.status_object.icon"
                                :class="user.status_object.color"
                                class="mr-1 text-xs"
                            ></fa>
                            <div>{{ user.status_object.status }}</div>
                        </div>
                    </template>
                    <template #actions="{ text: user }">
                        <a-button-group>
                            <a-tooltip v-if="user.enabled" placement="top">
                                <template #title>
                                    <span>Disable User</span>
                                </template>
                                <a-popconfirm
                                    placement="leftTop"
                                    :title="
                                        getEnableDisablePopoverContent(
                                            user,
                                            user.enabled ? 'disable' : 'enable'
                                        )
                                    "
                                    ok-text="Yes"
                                    :ok-type="
                                        user.role !== 'admin'
                                            ? 'danger'
                                            : 'default'
                                    "
                                    cancel-text="Cancel"
                                    @confirm="confirmEnableDisablePopover(user)"
                                >
                                    <a-button
                                        size="small"
                                        class="mr-3.5 rounded"
                                    >
                                        <fa
                                            icon="fal user-slash"
                                        ></fa> </a-button
                                ></a-popconfirm>
                            </a-tooltip>
                            <a-tooltip
                                v-if="!user.enabled"
                                placement="top"
                                class="mr-3.5 rounded"
                            >
                                <template #title>
                                    <span>Enable User</span> </template
                                ><a-popconfirm
                                    placement="leftTop"
                                    :title="
                                        getEnableDisablePopoverContent(
                                            user,
                                            user.enabled ? 'disable' : 'enable'
                                        )
                                    "
                                    ok-text="Yes"
                                    :ok-type="
                                        user.role !== 'admin'
                                            ? 'danger'
                                            : 'default'
                                    "
                                    cancel-text="Cancel"
                                    @confirm="confirmEnableDisablePopover(user)"
                                >
                                    <a-button size="small">
                                        <fa
                                            icon="fal user-check"
                                        ></fa> </a-button
                                ></a-popconfirm>
                            </a-tooltip>
                            <a-tooltip v-if="user.enabled" placement="top">
                                <template #title>
                                    <span>Change Role</span>
                                </template>
                                <a-popover
                                    placement="leftTop"
                                    trigger="click"
                                    :destroy-tooltip-on-hide="true"
                                    :visible="
                                        selectedUserId === user.id &&
                                        showChangeRolePopover
                                    "
                                    ><template #title
                                        ><div
                                            class="flex items-center justify-between "
                                        >
                                            <span>Change Role</span
                                            ><a-button
                                                type="text"
                                                @click="closeChangeRolePopover"
                                                ><fa icon="fal times"></fa
                                            ></a-button>
                                        </div>
                                    </template>
                                    <template #content>
                                        <ChangeRole
                                            :user="
                                                listType === 'users'
                                                    ? selectedUser
                                                    : selectedInvite
                                            "
                                            :role-list="roleList"
                                            @updateRole="handleUpdateRole"
                                            @errorUpdateRole="
                                                handleErrorUpdateRole
                                            "
                                        />
                                    </template>
                                    <a-button
                                        v-if="user.enabled"
                                        size="small"
                                        class="rounded"
                                        @click="handleChangeRole(user)"
                                    >
                                        <fa icon="fal user-shield"></fa>
                                    </a-button>
                                </a-popover>
                            </a-tooltip>
                        </a-button-group>
                    </template>
                </a-table>
                <div class="flex justify-between max-w-full mt-4">
                    <a-button
                        type="link"
                        size="default"
                        :class="{
                            'opacity-0 pointer-events-none':
                                !loginWithEmailAllowed,
                        }"
                        @click="toggleUserInvitationList"
                        >View Pending Invitations</a-button
                    >
                    <a-pagination
                        :total="pagination.total"
                        :current="pagination.current"
                        :page-size="pagination.pageSize"
                        @change="handlePagination"
                    />
                </div>
            </div>
            <InvitationListTable
                v-if="listType === 'invitations'"
                ref="invitationComponentRef"
                :search-text="searchText"
                @toggleList="toggleUserInvitationList"
                @showPreview="showUserPreviewDrawer"
                @changeRole="handleChangeRole"
                ><template #changeRoleContent
                    ><ChangeRole
                        :user="selectedInvite"
                        :role-list="roleList"
                        @updateRole="handleUpdateRole"
                        @errorUpdateRole="handleErrorUpdateRole" /></template
            ></InvitationListTable>
        </div>

        <a-modal
            :visible="showInviteUserModal"
            :destroy-on-close="true"
            title="Invite User"
            :footer="null"
            @cancel="closeInviteUserModal"
        >
            <InviteUsers
                @close="closeInviteUserModal"
                @handleInviteSent="handleInviteSent"
            />
        </a-modal>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, reactive, computed, watch } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import ErrorView from '@common/error/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import useUsers from '~/composables/user/useUsers'
    import InvitationListTable from './invitationListTable.vue'
    import { User } from '~/api/auth/user'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar.vue'
    import {
        getNameInitials,
        getNameInTitleCase,
    } from '~/composables//utils/string-operations'
    import ChangeRole from './changeRole.vue'
    import InviteUsers from './inviteUsers.vue'
    import useRoles from '~/composables/roles/useRoles'
    import { useTenantStore } from '~/store/tenants'

    export default defineComponent({
        components: {
            InvitationListTable,
            ChangeRole,
            InviteUsers,
            Avatar,
            ErrorView,
        },

        setup() {
            const tenantStore = useTenantStore()
            const loginWithEmailAllowed = ref(
                tenantStore?.tenant?.loginWithEmailAllowed ?? false
            )
            const listType = ref('users')
            const searchText = ref('')
            const showChangeRolePopover = ref<boolean>(false)
            const showInviteUserModal = ref(false)
            const showUserPreview = ref(false)
            const statusFilterValue = ref<string>('')
            const { username: currentUserUsername } = whoami()

            const invitationComponentRef = ref(null)
            const userListAPIParams: any = reactive({
                limit: 15,
                offset: 0,
                sort: 'first_name',
                filter: { $and: [{ email_verified: true }] },
            })

            const { userList, filteredUserCount, getUserList, state, STATES } =
                useUsers(userListAPIParams)

            const selectedUserId = ref('')
            const selectedUser = computed(() => {
                let activeUserObj = {}
                if (userList && userList.value && userList.value.length)
                    activeUserObj = userList.value.find(
                        (user: any) => user.id === selectedUserId.value
                    )
                return activeUserObj
            })
            const selectedInvite = ref({})

            const pagination = computed(() => ({
                total: filteredUserCount.value,
                pageSize: userListAPIParams.limit,
                current: userListAPIParams.offset / userListAPIParams.limit + 1,
            }))

            // fetch roles- need this to find role id when changing user/invite role
            const { roleList } = useRoles()

            const searchUserList = () => {
                const localFilterParams = userListAPIParams.filter.$and
                const searchFilterIndex = localFilterParams.findIndex(
                    (filter: any) =>
                        // eslint-disable-next-line no-prototype-builtins
                        filter.hasOwnProperty('$or')
                )
                if (searchFilterIndex > -1) {
                    localFilterParams.splice(searchFilterIndex, 1)
                }
                if (searchText.value) {
                    userListAPIParams.filter = {
                        $and: [
                            ...localFilterParams,
                            {
                                $or: searchText.value
                                    ? [
                                          {
                                              first_name: {
                                                  $ilike: `%${searchText.value}%`,
                                              },
                                          },
                                          {
                                              last_name: {
                                                  $ilike: `%${searchText.value}%`,
                                              },
                                          },
                                          {
                                              username: {
                                                  $ilike: `%${searchText.value}%`,
                                              },
                                          },
                                      ]
                                    : [],
                            },
                        ],
                    }
                    userListAPIParams.offset = 0
                } else {
                    userListAPIParams.filter = {
                        $and: [...localFilterParams],
                    }
                }
                getUserList()
            }

            const handleSearch = useDebounceFn(() => {
                if (listType.value === 'users') searchUserList()
            }, 600)

            const handleTableChange = (filters: any, sorter: any) => {
                // add filters
                // let allFilters: any = [];
                // if (Object.keys(filters).length) {
                //   let filterKeys = Object.keys(filters);
                //   filterKeys.forEach((key) => {
                //     filters[key].forEach((value: any) =>
                //       allFilters.push(JSON.parse(value))
                //     );
                //   });
                //   let localFilterParams = [...userListAPIParams.filter.$and];
                //   let enabledFilterIndex = localFilterParams.findIndex((filter) => {
                //     // eslint-disable-next-line no-prototype-builtins
                //     return filter.hasOwnProperty("enabled");
                //   });
                //   if (enabledFilterIndex > -1) {
                //     localFilterParams.splice(enabledFilterIndex, 1);
                //   }
                //   if (allFilters && allFilters.length) {
                //     userListAPIParams.filter = {
                //       $and: [...localFilterParams, ...allFilters],
                //     };
                //     userListAPIParams.offset = 0;
                //   } else {
                //     userListAPIParams.filter = {
                //       $and: [...localFilterParams],
                //     };
                //   }
                // }
                // add sort
                if (Object.keys(sorter).length) {
                    let sortValue = 'first_name'
                    if (sorter.order && sorter.column && sorter.column.sortKey)
                        sortValue = `${sorter.order === 'descend' ? '-' : ''}${
                            sorter.column.sortKey
                        }`
                    userListAPIParams.sort = sortValue
                }
                // modify offset
                // const offset = (pagination.current - 1) * userListAPIParams.limit;
                // userListAPIParams.offset = offset;
                // fetch groups
                getUserList()
            }
            // BEGIN: USER PREVIEW
            const {
                showPreview,
                showUserPreview: openPreview,
                setUserUniqueAttribute,
            } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                openPreview()
                selectedUserId.value = user.id
            }

            // END: USER PREVIEW
            const handleChangeRole = (user: any) => {
                if (listType.value === 'users') selectedUserId.value = user.id
                else Object.assign(selectedInvite.value, user)

                showChangeRolePopover.value = true
            }
            const closeChangeRolePopover = () => {
                showChangeRolePopover.value = false
                selectedUserId.value = ''
            }
            const handleInviteUsers = () => {
                showInviteUserModal.value = true
            }
            const closeInviteUserModal = () => {
                showInviteUserModal.value = false
            }
            const getEnableDisablePopoverContent = (
                user: any,
                action: 'enable' | 'disable'
            ) => {
                if (user.role !== 'admin')
                    return `Are you sure you want to ${action} ${
                        user.name || user.username || user.email || ''
                    }?`
                return `Admins cannot ${action} other admins. If you still wish to perform this action, downgrade the user's role to Member/Data Steward and then enable the user.`
            }

            const confirmEnableDisablePopover = async (user: any) => {
                if (user.role !== 'admin') {
                    const requestPayload = ref({
                        enabled: !user.enabled,
                    })
                    const { data, isReady, error, isLoading } = User.UpdateUser(
                        user.id,
                        requestPayload
                    )
                    watch([data, isReady, error, isLoading], () => {
                        if (isReady && !error.value && !isLoading.value) {
                            getUserList()
                            message.success(
                                `User ${user.enabled ? 'Disabled' : 'Enabled'}`
                            )
                        } else if (error && error.value) {
                            message.error(
                                `Unable to ${
                                    user.enabled ? 'disable' : 'enable'
                                } user. Try again.`
                            )
                        }
                    })
                }
            }

            const toggleUserInvitationList = () => {
                if (listType.value === 'users') {
                    listType.value = 'invitations'
                } else {
                    listType.value = 'users'
                    getUserList()
                }
            }
            const reloadTable = () => {
                if (listType.value === 'users') getUserList()
                if (
                    listType.value === 'invitations' &&
                    invitationComponentRef.value
                )
                    invitationComponentRef.value.getInvitationList()
            }

            watch(showPreview, () => {
                if (!showPreview.value) reloadTable()
            })

            const handleUpdateRole = () => {
                message.success('User role updated.')
                closeChangeRolePopover()
                reloadTable()
            }
            const handleErrorUpdateRole = () => {
                message.error(
                    'Unable to update role for the user. Please try again.'
                )
                closeChangeRolePopover()
                reloadTable()
            }
            const handleInviteSent = () => {
                if (
                    listType.value === 'invitations' &&
                    invitationComponentRef.value
                )
                    invitationComponentRef.value.getInvitationList()
                closeInviteUserModal()
            }

            const nameCase = (name: string) => {
                if (name) {
                    const nameCaseArray: string[] = []
                    const split = name.split(' ')
                    split.forEach((element) => {
                        nameCaseArray.push(
                            element.charAt(0).toUpperCase() +
                                element.substr(1).toLowerCase()
                        )
                    })
                    return nameCaseArray.join(' ')
                }
                return name
            }
            const imageUrl = (username: any) =>
                `http://localhost:3333/api/auth/tenants/default/avatars/${username}`
            const handleStatusFilterChange = () => {
                console.log(statusFilterValue.value)
                const localFilterParams = [...userListAPIParams.filter.$and]
                const enabledFilterIndex = localFilterParams.findIndex(
                    (filter) =>
                        // eslint-disable-next-line no-prototype-builtins
                        filter.hasOwnProperty('enabled')
                )
                if (enabledFilterIndex > -1) {
                    localFilterParams.splice(enabledFilterIndex, 1)
                }
                if (statusFilterValue.value) {
                    userListAPIParams.filter = {
                        $and: [
                            ...localFilterParams,
                            statusFilterValue.value === 'enabled'
                                ? { enabled: true }
                                : { enabled: false },
                        ],
                    }
                } else {
                    userListAPIParams.filter = {
                        $and: [...localFilterParams],
                    }
                }
                userListAPIParams.offset = 0
                getUserList()
            }
            const resetStatusFilter = () => {
                statusFilterValue.value = ''
                const localFilterParams = [...userListAPIParams.filter.$and]
                const enabledFilterIndex = localFilterParams.findIndex(
                    (filter) =>
                        // eslint-disable-next-line no-prototype-builtins
                        filter.hasOwnProperty('enabled')
                )
                if (enabledFilterIndex > -1) {
                    localFilterParams.splice(enabledFilterIndex, 1)
                }
                userListAPIParams.filter = {
                    $and: [...localFilterParams],
                }
                userListAPIParams.offset = 0
                getUserList()
            }
            const handlePagination = (page: number) => {
                // modify offset
                const offset = (page - 1) * userListAPIParams.limit
                userListAPIParams.offset = offset
                getUserList()
            }
            const isCurrentUser = (username: string) =>
                username === currentUserUsername.value
            return {
                searchText,
                handleSearch,
                handleTableChange,
                showUserPreviewDrawer,

                toggleUserInvitationList,
                getNameInitials,
                getNameInTitleCase,
                listType,
                pagination,
                userList,
                selectedUser,
                showUserPreview,
                state,
                STATES,
                loginWithEmailAllowed,
                showChangeRolePopover,
                handleChangeRole,
                closeChangeRolePopover,
                handleUpdateRole,
                handleErrorUpdateRole,
                invitationComponentRef,
                closeInviteUserModal,
                showInviteUserModal,
                handleInviteUsers,
                handleInviteSent,
                reloadTable,
                nameCase,
                imageUrl,
                statusFilterValue,
                handleStatusFilterChange,
                resetStatusFilter,
                handlePagination,
                filteredUserCount,
                isCurrentUser,
                showPreview,
                selectedInvite,
                roleList,
                getUserList,
                getEnableDisablePopoverContent,
                confirmEnableDisablePopover,
                selectedUserId,
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: 'User',
                        key: 'user',
                        sorter: true,
                        width: 320,
                        slots: { customRender: 'name' },
                        sortKey: 'first_name',
                    },
                    {
                        title: 'Role',
                        key: 'role',
                        sorter: false,
                        width: 150,
                        slots: { customRender: 'role' },
                        dataIndex: 'role_object.name',
                    },
                    {
                        title: 'Groups',
                        key: 'group',
                        sorter: true,
                        width: 150,
                        slots: { customRender: 'group' },
                        sortKey: 'group_count',
                        dataIndex: 'group_count_string',
                    },
                    {
                        title: 'Status',
                        key: 'status',
                        slots: { customRender: 'status' },
                        // dataIndex: "status_object.status",
                        // filters: [
                        //   { text: "Active", value: JSON.stringify({ enabled: true }) },
                        //   { text: "Disabled", value: JSON.stringify({ enabled: false }) },
                        //   // { text: "Locked", value: JSON.stringify({ locked: true }) },
                        // ],
                        filterMultiple: false,
                        width: 150,
                    },
                    {
                        title: 'Actions',
                        width: 120,
                        slots: { customRender: 'actions' },
                    },
                ],
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-popover-content) {
        --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
</style>
