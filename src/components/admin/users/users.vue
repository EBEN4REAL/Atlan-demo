<template>
    <DefaultLayout title="Users" :badge="totalUserCount">
        <template #header>
            <div
                v-if="userList.length > 0"
                class="flex justify-between p-4 -mb-3 border border-b-0 border-gray-300 rounded-t-lg"
            >
                <div v-auth="map.LIST_USERS" class="flex filter-user-wrapper">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search all ${
                            totalUserCount || ''
                        } users`"
                        class="h-8 mr-1 shadow-none input-filter"
                        :dot="!!statusFilter?.length"
                        @change="handleSearch"
                    >
                        <!-- <template #filter>
                            <UserFilter
                                v-model="statusFilter"
                                @change="updateFilters"
                            />
                        </template> -->
                    </SearchAndFilter>
                    <a-popover
                        trigger="click"
                        placement="bottomLeft"
                        @visibleChange="handleClickFilter"
                        v-model="visible"
                    >
                        <template #content>
                            <UserFilter
                                v-model="statusFilter"
                                :number-of-active-user="numberOfActiveUser"
                                :number-of-disable-user="numberOfDisableUser"
                                :number-of-invited-user="numberOfInvitedUser"
                                @changeRole="changeFilterRole"
                                @change="updateFilters"
                            />
                        </template>
                        <button
                            :class="`flex items-center justify-center h-8 py-2 pl-2 pr-3 space-x-1 transition-colors border border-gray-300 rounded shadow-none hover:border-primary hover:text-primary ${
                                visible
                                    ? 'border-primary text-primary blue-icons'
                                    : ''
                            }`"
                        >
                            <AtlanIcon
                                :icon="
                                    filtersLength > 0 ? 'FilterDot' : 'Filter'
                                "
                                class="w-5 h-5"
                            />
                            <span class="text-sm"
                                >Filters
                                {{
                                    filtersLength > 0
                                        ? `(${filtersLength})`
                                        : ''
                                }}</span
                            >
                        </button>
                    </a-popover>
                </div>
                <div v-auth="map.CREATE_USERS" class="flex">
                    <AtlanButton
                        v-if="loginWithEmail"
                        type="primary"
                        class="rounded-md"
                        size="sm"
                        @click="handleInviteUsers"
                    >
                        <AtlanIcon icon="AddUser" />
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
                <UserListTable
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
                    @refetch="refetchData"
                />
                <div
                    v-if="pagination.total > 1 || isLoading"
                    v-auth="map.LIST_USERS"
                    class="flex justify-end max-w-full mt-4"
                >
                    <Pagination
                        v-model:offset="userListAPIParams.offset"
                        :total-pages="pagination.total"
                        :loading="isLoading"
                        :page-size="pagination.pageSize"
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
            const filterRole = ref('')
            const statusFilter = ref([])
            const showChangeRolePopover = ref<boolean>(false)
            const showRevokeInvitePopover = ref<boolean>(false)
            const showInviteUserModal = ref(false)
            const showUserPreview = ref(false)
            const showDisableEnablePopover = ref<boolean>(false)
            const isFirstLoad = ref(true)

            const invitationComponentRef = ref(null)
            const userListAPIParams: any = reactive({
                limit: 50,
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

            const numberOfActiveUser = ref(0)
            const numberOfDisableUser = ref(0)
            const numberOfInvitedUser = ref(0)
            watch(userList, (v) => {
                if (isFirstLoad.value) {
                    v.reduce((counter, user) => {
                        if (user.enabled) numberOfActiveUser.value += 1
                        if (!user.enabled) numberOfDisableUser.value += 1
                        if (!user.emailVerified) numberOfInvitedUser.value += 1
                        return counter
                    }, 0)
                    isFirstLoad.value = false
                }
            })

            const clearFilter = () => {
                filterRole.value = ''
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
                if (filterRole.value) {
                    const filterRoleParse = JSON.parse(filterRole.value)
                    filterValues.push(filterRoleParse)
                    filterTypes.push([filterRoleParse])
                }
                userListAPIParams.filter.$and = filterTypes.reduce(
                    (filtered, option, index) => {
                        if (option?.length > 0)
                            filtered.push(filterValues[index])
                        return filtered
                    },
                    []
                )

                console.log('user filter', userListAPIParams)

                userListAPIParams.offset = 0
                getUserList()
            }

            const changeFilterRole = (role) => {
                filterRole.value = role
                updateFilters()
            }

            const handleSearch = useDebounceFn(() => {
                updateFilters()
            }, 600)

            const handleTableChange = (query: any) => {
                if (query) {
                    userListAPIParams.sort = query
                }
                getUserList()
            }
            const refetchData = () => {
                getUserList()
            }
            // BEGIN: USER PREVIEW
            const {
                showPreview,
                showUserPreview: openPreview,
                setUserUniqueAttribute,
                closePreview,
                userId,
                userUpdated,
            } = useUserPreview()
            const showUserPreviewDrawer = (user: any, activeTab: String) => {
                if (userId.value === user.id && showPreview.value) {
                    closePreview()
                } else {
                    setUserUniqueAttribute(user.id)
                    openPreview(null, activeTab)
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

            // If any user has been updated, then reload the table, and
            // set the userUpdated flag to false.
            watch(userUpdated, () => {
                if (userUpdated.value) {
                    reloadTable()
                    userUpdated.value = false
                }
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

            const filtersLength = ref(0)
            watch(
                [statusFilter, filterRole],
                ([newA, newB]) => {
                    if (newA?.length > 0 && newB) {
                        filtersLength.value = newA.length + 1
                    } else if (newA?.length > 0) {
                        filtersLength.value = newA?.length
                    } else if (newB) {
                        filtersLength.value = 1
                    } else {
                        filtersLength.value = 0
                    }
                },
                {
                    immediate: true,
                    deep: true,
                }
            )

            const visible = ref(false)

            const handleClickFilter = (v) => {
                visible.value = v
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
                refetchData,
                changeFilterRole,
                numberOfActiveUser,
                numberOfDisableUser,
                numberOfInvitedUser,
                filtersLength,
                handleClickFilter,
                visible,
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
<style lang="less">
    .filter-user-wrapper {
        .input-filter {
            width: 300px !important;
            margin-right: 12px !important;
        }
    }
    .blue-icons {
        path {
            stroke: rgb(82, 119, 215);
        }
    }
</style>
