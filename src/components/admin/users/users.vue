<template>
    <DefaultLayout title="Users" :badge="totalUserCount">
        <template #header>
            <div class="flex justify-between">
                <div v-auth="map.LIST_USERS" class="flex items-baseline w-1/4">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search all ${
                            totalUserCount || ''
                        } users`"
                        class="mr-1"
                        size="minimal"
                        @change="handleSearch"
                    />
                    <UserFilter
                        v-model="statusFilter"
                        @change="updateFilters"
                    />
                </div>
                <div v-auth="map.CREATE_USERS" class="flex">
                    <AtlanButton
                        v-if="loginWithEmail"
                        type="primary"
                        class="rounded-md"
                        size="sm"
                        @click="handleInviteUsers"
                    >
                        Invite Users
                    </AtlanButton>
                </div>
            </div>
        </template>

        <div
            v-if="error && userList.length === 0"
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
            <EmptyView
                v-if="isReady && !userList.length"
                empty-screen="NoUsers"
                desc="Oops… we didn’t find any users that match this search"
                button-text="Clear search"
                @event="clearFilter"
            />
            <template v-else>
                <div
                    v-if="isLoading"
                    class="flex items-center justify-center h-full"
                >
                    <AtlanIcon icon="Loader" class="h-7 animate-spin" />
                </div>
                <UserListTable
                    v-else
                    v-auth="map.LIST_USERS"
                    :user-list="userList"
                    :loading="isLoading"
                    :selected-user-id="selectedUserId"
                    :show-change-role-popover="showChangeRolePopover"
                    :show-disable-enable-popover="showDisableEnablePopover"
                    :show-revoke-invite-popover="showRevokeInvitePopover"
                    @toggleDisableEnablePopover="toggleDisableEnablePopover"
                    @handleRevokeInvite="handleRevokeInvite"
                    @revokeInvite="revokeInvite"
                    @change="handleTableChange"
                    @handle-change-role="handleChangeRole"
                    @showUserPreviewDrawer="showUserPreviewDrawer"
                    @handleUpdateRole="handleUpdateRole"
                    @handleErrorUpdateRole="handleErrorUpdateRole"
                    @confirmEnableDisablePopover="confirmEnableDisablePopover"
                    @closeChangeRolePopover="closeChangeRolePopover"
                    @resendInvite="resendInvite"
                />
                <div
                    v-auth="map.LIST_USERS"
                    class="flex justify-end max-w-full mt-4"
                    v-if="pagination.total > 1 || isLoading"
                >
                    <Pagination
                        :total-pages="pagination.total"
                        :loading="isLoading"
                        :page-size="pagination.pageSize"
                        v-model:offset="userListAPIParams.offset"
                        @mutate="getUserList"
                    />
                </div>
            </template>
        </template>

        <a-modal
            :visible="showInviteUserModal"
            :destroy-on-close="true"
            :footer="null"
            :closable="false"
            :width="470"
            wrap-class-name="inviteModal"
            @cancel="closeInviteUserModal"
        >
            <InviteUsers
                :tenant-name="tenantName"
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
    import EmptyView from '@common/empty/index.vue'
    import DefaultLayout from '@/admin/layout.vue'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import InviteUsers from './inviteUsers.vue'

    import UserFilter from './userFilter.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import AtlanButton from '~/components/UI/button.vue'
    import UserListTable from '@/admin/users/userListTable.vue'
    import { Users } from '~/services/service/users/index'
    import map from '~/constant/accessControl/map'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Pagination from '@/common/list/pagination.vue'

    export default defineComponent({
        name: 'UsersView',
        components: {
            Pagination,
            SearchAndFilter,
            UserListTable,
            AtlanButton,
            InviteUsers,
            ErrorView,
            DefaultLayout,
            EmptyView,
            UserFilter,
        },

        setup() {
            const { loginWithEmailAllowed, name: tenantName } = useTenantData()

            const loginWithEmail = ref(loginWithEmailAllowed)

            const listType = ref('users')
            const searchText = ref('')
            const statusFilter = ref([])
            const showChangeRolePopover = ref<boolean>(false)
            const showRevokeInvitePopover = ref<boolean>(false)
            const showInviteUserModal = ref(false)
            const showUserPreview = ref(false)
            const showDisableEnablePopover = ref<boolean>(false)

            const invitationComponentRef = ref(null)
            const userListAPIParams: any = reactive({
                limit: 4,
                offset: 0,
                sort: 'firstName',
                filter: { $and: [] },
            })

            const {
                userList,
                filteredUserCount,
                getUserList,
                isLoading,
                error,
                isReady,
                totalUserCount,
            } = useUsers(userListAPIParams)

            const clearFilter = () => {
                userListAPIParams.filter = {}
                searchText.value = ''
                statusFilter.value = []
                getUserList()
            }

            const selectedUserId = ref('')

            const selectedInvite = ref({})

            const pagination = computed(() => ({
                total: Math.ceil(
                    filteredUserCount.value / userListAPIParams.limit
                ),
                pageSize: userListAPIParams.limit,
                current: userListAPIParams.offset / userListAPIParams.limit + 1,
            }))

            const updateFilters = () => {
                // filter preset
                const theSearchFilter = {
                    $or: searchText.value
                        ? [
                              {
                                  firstName: {
                                      $ilike: `%${searchText.value}%`,
                                  },
                              },
                              {
                                  lastName: {
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
                        if (option?.length > 0)
                            filtered.push(filterValues[index])
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
                    let sortValue = 'firstName'
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
                closePreview,
                userId,
            } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                if (userId.value === user.id && showPreview.value) {
                    closePreview()
                } else {
                    setUserUniqueAttribute(user.id)
                    openPreview()
                    selectedUserId.value = user.id
                }
            }

            // END: USER PREVIEW
            const handleChangeRole = (user: any) => {
                selectedUserId.value = user.id
                showChangeRolePopover.value = true
                showRevokeInvitePopover.value = false
                showInviteUserModal.value = false
                showUserPreview.value = false
                showDisableEnablePopover.value = false
            }

            const toggleDisableEnablePopover = (user: any) => {
                if (user) {
                    selectedUserId.value = user.id
                    showDisableEnablePopover.value = true
                } else
                    showDisableEnablePopover.value =
                        !showDisableEnablePopover.value
                showChangeRolePopover.value = false
                showRevokeInvitePopover.value = false
                showInviteUserModal.value = false
                showUserPreview.value = false
            }

            const closeChangeRolePopover = () => {
                showChangeRolePopover.value = false
                selectedUserId.value = ''
            }
            const handleInviteUsers = () => {
                showInviteUserModal.value = true
                showChangeRolePopover.value = false
                showRevokeInvitePopover.value = false
                showUserPreview.value = false
                showDisableEnablePopover.value = false
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

            const handleRevokeInvite = (id) => {
                if (id) selectedUserId.value = id
                showRevokeInvitePopover.value = !showRevokeInvitePopover.value
                showChangeRolePopover.value = false
                showInviteUserModal.value = false
                showUserPreview.value = false
                showDisableEnablePopover.value = false
            }

            const revokeInvite = (invite: { email: any; id: string }) => {
                showRevokeInvitePopover.value = false
                const { data, isReady, error, isLoading } =
                    Users.RevokeInvitation(invite.id)
                message.loading({
                    key: 'remoke_invite',
                    content: 'Revoking invitation...',
                })
                watch([data, isReady, error, isLoading], () => {
                    if (isReady && !error.value && !isLoading.value) {
                        message.success({
                            key: 'remoke_invite',
                            content: 'Invitation revoked.',
                        })
                        reloadTable()
                    } else if (error && error.value) {
                        message.error({
                            key: 'remoke_invite',
                            content:
                                'Unable to revoke invite, please try again',
                        })
                    }
                })
            }

            const confirmEnableDisablePopover = async (user: any) => {
                if (user.role !== 'admin') {
                    const requestPayload = ref({
                        enabled: !user.enabled,
                    })
                    message.loading({
                        key: 'enableDisable',
                        content: `${
                            user.enabled
                                ? 'Disabling user...'
                                : 'Enabling user...'
                        }`,
                        duration: 10,
                    })
                    const { data, isReady, error, isLoading } =
                        Users.UpdateUser(user.id, requestPayload)
                    watch([data, isReady, error, isLoading], () => {
                        if (isReady && !error.value && !isLoading.value) {
                            getUserList()
                            message.success({
                                key: 'enableDisable',
                                content: `User ${
                                    user.enabled ? 'Disabled' : 'Enabled'
                                }`,
                                duration: 2,
                            })
                        } else if (error && error.value) {
                            message.error({
                                key: 'enableDisable',
                                content: `Unable to ${
                                    user.enabled ? 'disable' : 'enable'
                                } user. Try again.`,
                                duration: 2,
                            })
                        }
                    })
                }
                showDisableEnablePopover.value = false
            }

            const resendInvite = (invite: { email: any; id: string }) => {
                const { data, isReady, error, isLoading } =
                    Users.ResendVerificationEmail(invite.id)
                message.loading({
                    content: 'Sending invitation...',
                    key: 'send_invite',
                })
                watch([data, isReady, error, isLoading], () => {
                    if (isReady && !error.value && !isLoading.value) {
                        message.success({
                            content: 'Email sent',
                            key: 'send_invite',
                        })
                    } else if (error && error.value) {
                        message.error({
                            content: 'Failed to send email, try again',
                            key: 'send_invite',
                        })
                    }
                })
            }

            return {
                isReady,
                tenantName,
                map,
                resendInvite,
                showRevokeInvitePopover,
                searchText,
                statusFilter,
                handleSearch,
                handleTableChange,
                showUserPreviewDrawer,
                listType,
                pagination,
                userList,
                showUserPreview,
                isLoading,
                error,
                loginWithEmail,
                showDisableEnablePopover,
                toggleDisableEnablePopover,
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

                filteredUserCount,
                showPreview,
                handleRevokeInvite,
                selectedInvite,
                revokeInvite,
                getUserList,
                confirmEnableDisablePopover,
                selectedUserId,
                totalUserCount,
                userListAPIParams,
                limit: userListAPIParams.limit,
                offset: userListAPIParams.offset,
                updateFilters,
                clearFilter,
            }
        },
    })
</script>

<style lang="less" scoped>
    .a-input-search-icon-left {
        .ant-input-suffix {
        }
    }
</style>
