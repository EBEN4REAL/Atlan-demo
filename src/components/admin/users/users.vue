<template>
    <DefaultLayout
        v-if="permissions.list"
        title="Users"
        :badge="totalUserCount"
    >
        <template #header>
            <div class="flex justify-between">
                <div class="flex w-1/4">
                    <a-input-search
                        v-model:value="searchText"
                        :placeholder="`Search all ${
                            totalUserCount || ''
                        } users`"
                        class="mr-1 shadow-sm a-input-search-icon-left"
                        size="default"
                        :allow-clear="true"
                        @change="handleSearch"
                    ></a-input-search>
                    <UserFilter
                        v-model="statusFilter"
                        @change="updateFilters"
                    />
                </div>
                <div class="flex">
                    <a-button
                        v-if="loginWithEmail && permissions.create"
                        type="primary"
                        class="rounded-md"
                        size="default"
                        @click="handleInviteUsers"
                        >Invite Users</a-button
                    >
                </div>
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
            <div>
                <a-table
                    v-if="userList"
                    id="userList"
                    class="overflow-hidden border rounded-lg rounded-table"
                    :scroll="{ y: 'calc(100vh - 20rem)' }"
                    :table-layout="'fixed'"
                    :data-source="userList"
                    :columns="
                        columns.filter(
                            (col) =>
                                col.title !== 'Actions' || permissions.update
                        )
                    "
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
                                avatar-shape="circle"
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
                                <p class="mb-0 text-gray-500 truncate">
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
                                rounded-xl
                                text-gray-700
                            "
                            :style="{
                                backgroundColor:
                                    statusColorCodes[user.status_object.status],
                            }"
                        >
                            <div>{{ user.status_object.status }}</div>
                        </div>
                    </template>
                    <template #actions="{ text: user }">
                        <a-button-group>
                            <a-tooltip
                                v-if="
                                    user.enabled &&
                                    user.email_verified &&
                                    permissions.update
                                "
                                placement="top"
                                class="mr-3.5"
                            >
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
                                                class="pr-0  hover:bg-transparent"
                                                @click="closeChangeRolePopover"
                                                ><AtlanIcon
                                                    icon="Cancel"
                                                    class="h-3"
                                                ></AtlanIcon
                                            ></a-button>
                                        </div>
                                    </template>
                                    <template #content>
                                        <ChangeRole
                                            :user="selectedUser"
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
                                        <AtlanIcon
                                            icon="ChangeRole"
                                        ></AtlanIcon>
                                    </a-button>
                                </a-popover>
                            </a-tooltip>
                            <a-tooltip
                                v-if="
                                    user.enabled &&
                                    user.email_verified &&
                                    permissions.update
                                "
                                placement="top"
                            >
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
                                        <AtlanIcon
                                            icon="DeleteUser"
                                        ></AtlanIcon> </a-button
                                ></a-popconfirm>
                            </a-tooltip>
                            <a-tooltip
                                v-if="!user.enabled && permissions.update"
                                placement="top"
                                class="rounded mr-3.5"
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
                            <a-tooltip
                                v-if="
                                    !user.email_verified && permissions.update
                                "
                                placement="top"
                                class="rounded mr-3.5"
                            >
                                <template #title>
                                    <span>Resend Invite</span>
                                </template>
                                <a-button
                                    size="small"
                                    @click="
                                        showResendInvitationConfirm({
                                            email: user.email,
                                            id: user.id,
                                        })
                                    "
                                >
                                    <AtlanIcon icon="ResendInvite"></AtlanIcon
                                ></a-button>
                            </a-tooltip>
                            <a-dropdown
                                v-if="!user.email_verified"
                                :trigger="['click']"
                            >
                                <a-button
                                    class="rounded"
                                    size="small"
                                    type="secondary"
                                    @click="(e) => e.preventDefault()"
                                >
                                    <AtlanIcon icon="KebabMenu"></AtlanIcon>
                                </a-button>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item
                                            key="1"
                                            @click="
                                                showRevokeInvitationConfirm({
                                                    email: user.email,
                                                    id: user.id,
                                                })
                                            "
                                            >Revoke Invitation</a-menu-item
                                        ><a-popover
                                            placement="leftTop"
                                            trigger="click"
                                            :destroy-tooltip-on-hide="true"
                                            :visible="
                                                selectedUserId === user.id &&
                                                showChangeRolePopover
                                            "
                                            ><template #title>
                                                <div
                                                    class="flex items-center justify-between "
                                                >
                                                    <span>Change Role</span
                                                    ><a-button
                                                        type="text"
                                                        class="pr-0  hover:bg-transparent"
                                                        @click="
                                                            closeChangeRolePopover
                                                        "
                                                        ><AtlanIcon
                                                            icon="Cancel"
                                                            class="h-3"
                                                        ></AtlanIcon
                                                    ></a-button>
                                                </div>
                                            </template>
                                            <template #content>
                                                <ChangeRole
                                                    :user="selectedUser"
                                                    :role-list="roleList"
                                                    @updateRole="
                                                        handleUpdateRole
                                                    "
                                                    @errorUpdateRole="
                                                        handleErrorUpdateRole
                                                    "
                                                />
                                            </template>
                                            <a-menu-item
                                                key="2"
                                                @click="handleChangeRole(user)"
                                                >Change User Role</a-menu-item
                                            ></a-popover
                                        >
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </a-button-group>
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
            </div>
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
    </DefaultLayout>
</template>
<script lang="ts">
    import { defineComponent, ref, reactive, computed, watch } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { Modal, message } from 'ant-design-vue'
    import ErrorView from '@common/error/index.vue'
    import DefaultLayout from '@/admin/layout.vue'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar/index.vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import ChangeRole from './changeRole.vue'
    import InviteUsers from './inviteUsers.vue'
    import useRoles from '~/composables/roles/useRoles'

    import UserFilter from './userFilter.vue'
    import useTenantData from '~/composables/tenant/useTenantData'

    export default defineComponent({
        name: 'Users',
        components: {
            ChangeRole,
            InviteUsers,
            Avatar,
            ErrorView,
            DefaultLayout,
            UserFilter,
        },

        setup() {
            const { loginWithEmailAllowed } = useTenantData()

            const permissions = computed(() => ({
                list: true,
                create: true,
                update: true,
                delete: true,
                suspend: true,
            }))

            const loginWithEmail = ref(loginWithEmailAllowed)

            const listType = ref('users')
            const searchText = ref('')
            const statusFilter = ref(null)
            const showChangeRolePopover = ref<boolean>(false)
            const showInviteUserModal = ref(false)
            const showUserPreview = ref(false)
            const { username: currentUserUsername } = whoami()

            const invitationComponentRef = ref(null)
            const userListAPIParams: any = reactive({
                limit: 15,
                offset: 0,
                sort: 'first_name',
                filter: { $and: [] },
            })

            const {
                userList,
                filteredUserCount,
                getUserList,
                state,
                STATES,
                totalUserCount,
            } = useUsers(userListAPIParams)

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

            const updateFilters = () => {
                // filter preset
                const theSearchFilter = {
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
                }
                const theStatusFilter = {
                    $or: statusFilter.value,
                }
                const filterTypes = [searchText.value, statusFilter.value]
                const filterValues = [theSearchFilter, theStatusFilter] // both must match array positions, can merge later with value and key as object
                userListAPIParams.filter.$and = filterTypes.reduce(
                    (filtered, option, index) => {
                        if (option) filtered.push(filterValues[index])
                        return filtered
                    },
                    []
                )

                userListAPIParams.offset = 0
                getUserList()
            }

            const handleSearch = useDebounceFn(() => {
                updateFilters()
            }, 600)

            const handleTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                if (Object.keys(sorter).length) {
                    let sortValue = 'first_name'
                    if (sorter.order && sorter.column && sorter.column.sortKey)
                        sortValue = `${sorter.order === 'descend' ? '-' : ''}${
                            sorter.column.sortKey
                        }`
                    userListAPIParams.sort = sortValue
                }
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
                selectedUserId.value = user.id

                showChangeRolePopover.value = true
            }
            const closeChangeRolePopover = () => {
                showChangeRolePopover.value = false
                selectedUserId.value = ''
            }
            const handleInviteUsers = () => {
                showInviteUserModal.value = true
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

            const closeInviteUserModal = () => {
                showInviteUserModal.value = false
                reloadTable()
            }

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
                `${window.location.origin}/api/service/avatars/${username}`

            const handlePagination = (page: number) => {
                // modify offset
                const offset = (page - 1) * userListAPIParams.limit
                userListAPIParams.offset = offset
                getUserList()
            }
            const isCurrentUser = (username: string) =>
                username === currentUserUsername.value

            const showResendInvitationConfirm = (invite: {
                email: any
                id: string
            }) => {
                Modal.confirm({
                    content: `Are you sure you want to resend verification email to ${invite.email}?`,
                    title: `Resend Verification Email`,
                    okText: 'Send Email',
                    okType: 'primary',
                    onOk() {
                        const { data, isReady, error, isLoading } =
                            User.ResendVerificationEmail(invite.id)
                        watch([data, isReady, error, isLoading], () => {
                            if (isReady && !error.value && !isLoading.value) {
                                message.success('Email sent')
                            } else if (error && error.value) {
                                message.error('Failed to send email, try again')
                            }
                        })
                    },
                })
            }

            const showRevokeInvitationConfirm = (invite: {
                email: any
                id: string
            }) => {
                Modal.confirm({
                    title: 'Revoke Invitation',
                    content: `Are you sure you want to revoke invitation for ${invite.email} ?`,
                    okText: 'Yes',
                    okType: 'danger',
                    onOk() {
                        const { data, isReady, error, isLoading } =
                            User.RevokeInvitation(invite.id)
                        watch([data, isReady, error, isLoading], () => {
                            if (isReady && !error.value && !isLoading.value) {
                                message.success('Invitation revoked.')
                                reloadTable()
                            } else if (error && error.value) {
                                message.error(
                                    'Unable to revoke invite, please try again'
                                )
                            }
                        })
                    },
                })
            }

            return {
                searchText,
                statusFilter,
                handleSearch,
                handleTableChange,
                showUserPreviewDrawer,
                getNameInitials,
                getNameInTitleCase,
                listType,
                pagination,
                userList,
                selectedUser,
                showUserPreview,
                state,
                STATES,
                loginWithEmail,
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
                permissions,
                totalUserCount,
                limit: userListAPIParams.limit,
                offset: userListAPIParams.offset,
                showResendInvitationConfirm,
                showRevokeInvitationConfirm,
                updateFilters,
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
                statusColorCodes: {
                    Active: '#DAEED4',
                    Disabled: '#FADEE0',
                    Invited: '#F8EED3',
                },
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

    .a-input-search-icon-left {
        .ant-input-suffix {
        }
    }
</style>
