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
                    <AtlanButton
                        v-if="loginWithEmail && permissions.create"
                        type="primary"
                        class="rounded-md"
                        size="default"
                        @click="handleInviteUsers"
                        >Invite Users
                    </AtlanButton>
                </div>
            </div>
        </template>

        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton
                        color="secondary"
                        @click="
                            () => {
                                getUserList()
                            }
                        "
                    >
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <!-- Table for users-->
        <template v-else>
            <UserListTable
                :user-list="userList"
                :permissions="permissions"
                :loading="
                    [STATES.PENDING].includes(state) ||
                    [STATES.VALIDATING].includes(state)
                "
                :selected-user-id="selectedUserId"
                :show-change-role-popover="showChangeRolePopover"
                @change="handleTableChange"
                @handle-change-role="handleChangeRole"
                @showUserPreviewDrawer="showUserPreviewDrawer"
                @handleUpdateRole="handleUpdateRole"
                @handleErrorUpdateRole="handleErrorUpdateRole"
                @confirmEnableDisablePopover="confirmEnableDisablePopover"
                @showRevokeInvitationConfirm="showRevokeInvitationConfirm"
                @closeChangeRolePopover="closeChangeRolePopover"
                @showResendInvitationConfirm="showResendInvitationConfirm"
            />

            <div class="flex justify-end max-w-full mt-4">
                <a-pagination
                    :total="pagination.total"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    @change="handlePagination"
                />
            </div>
        </template>

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
    import { message, Modal } from 'ant-design-vue'
    import ErrorView from '@common/error/index.vue'
    import DefaultLayout from '@/admin/layout.vue'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import InviteUsers from './inviteUsers.vue'

    import UserFilter from './userFilter.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import AtlanButton from '~/components/UI/button.vue'
    import UserListTable from '@/admin/users/userListTable.vue'
    import { Users } from '~/services/service/users/index'

    export default defineComponent({
        name: 'UsersView',
        components: {
            UserListTable,
            AtlanButton,
            InviteUsers,
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
            const statusFilter = ref([])
            const showChangeRolePopover = ref<boolean>(false)
            const showInviteUserModal = ref(false)
            const showUserPreview = ref(false)

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

            const selectedInvite = ref({})

            const pagination = computed(() => ({
                total: filteredUserCount.value,
                pageSize: userListAPIParams.limit,
                current: userListAPIParams.offset / userListAPIParams.limit + 1,
            }))

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
                console.log('showUserPreviewDrawer', user)
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

            const handlePagination = (page: number) => {
                // modify offset
                const offset = (page - 1) * userListAPIParams.limit
                userListAPIParams.offset = offset
                getUserList()
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
                            Users.RevokeInvitation(invite.id)
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

            const confirmEnableDisablePopover = async (user: any) => {
                if (user.role !== 'admin') {
                    const requestPayload = ref({
                        enabled: !user.enabled,
                    })
                    const { data, isReady, error, isLoading } =
                        Users.UpdateUser(user.id, requestPayload)
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
                            Users.ResendVerificationEmail(invite.id)
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

            return {
                showResendInvitationConfirm,
                showRevokeInvitationConfirm,
                searchText,
                statusFilter,
                handleSearch,
                handleTableChange,
                showUserPreviewDrawer,
                listType,
                pagination,
                userList,
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
                handlePagination,
                filteredUserCount,
                showPreview,
                selectedInvite,
                getUserList,
                confirmEnableDisablePopover,
                selectedUserId,
                permissions,
                totalUserCount,
                limit: userListAPIParams.limit,
                offset: userListAPIParams.offset,
                updateFilters,
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
