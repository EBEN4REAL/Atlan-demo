<template>
    <a-table
        v-if="userList"
        id="userList"
        class="overflow-hidden border rounded-lg rounded-table user-table"
        :scroll="{ y: 'calc(100vh - 20rem)', x: true }"
        :data-source="userList"
        :columns="
            userColumns.filter(
                (col) => col.title !== 'Actions' || permissions.update
            )
        "
        :row-key="(user) => user.id"
        :pagination="false"
        :loading="loading"
        @change="(p, f, s) => emit('change', p, f, s)"
    >
        <template #name="{ text: user }">
            <div class="flex items-center align-middle">
                <Avatar
                    :image-url="imageUrl(user.username)"
                    :allow-upload="isCurrentUser(user.username)"
                    :avatar-name="user.name || user.uername || user.email"
                    :avatar-size="40"
                    avatar-shape="circle"
                    class="mr-2"
                />
                <div
                    class="truncate cursor-pointer"
                    @click="
                        () => {
                            emit('showUserPreviewDrawer', user)
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
                            selectedUserId === user.id && showChangeRolePopover
                        "
                        ><template #title
                            ><div class="flex items-center justify-between">
                                <span>Change Role</span>
                                <a-button
                                    type="text"
                                    class="pr-0 cursor-pointer  hover:bg-transparent"
                                    @click="emit('closeChangeRolePopover')"
                                >
                                    <AtlanIcon
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
                                @updateRole="emit('handleUpdateRole')"
                                @errorUpdateRole="emit('handleErrorUpdateRole')"
                            />
                        </template>
                        <a-button
                            v-if="user.enabled"
                            size="small"
                            class="rounded"
                            @click="emit('handleChangeRole', user)"
                        >
                            <AtlanIcon icon="StarCircled"></AtlanIcon>
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
                        :ok-type="user.role !== 'admin' ? 'danger' : 'default'"
                        cancel-text="Cancel"
                        @confirm="emit('confirmEnableDisablePopover', user)"
                    >
                        <a-button size="small" class="mr-3.5 rounded">
                            <AtlanIcon
                                icon="DisableUser"
                            ></AtlanIcon> </a-button
                    ></a-popconfirm>
                </a-tooltip>
                <a-tooltip
                    v-if="!user.enabled && permissions.update"
                    placement="top"
                    class="rounded mr-3.5"
                >
                    <template #title> <span>Enable User</span> </template
                    ><a-popconfirm
                        placement="leftTop"
                        :title="
                            getEnableDisablePopoverContent(
                                user,
                                user.enabled ? 'disable' : 'enable'
                            )
                        "
                        ok-text="Yes"
                        :ok-type="user.role !== 'admin' ? 'danger' : 'default'"
                        cancel-text="Cancel"
                        @confirm="emit('confirmEnableDisablePopover', user)"
                    >
                        <a-button size="small">
                            <AtlanIcon
                                icon="CheckCircled"
                            ></AtlanIcon> </a-button
                    ></a-popconfirm>
                </a-tooltip>
                <a-tooltip
                    v-if="!user.email_verified && permissions.update"
                    placement="top"
                    class="rounded mr-3.5"
                >
                    <template #title>
                        <span>Resend Invite</span>
                    </template>
                    <a-button
                        size="small"
                        @click="
                            emit('showResendInvitationConfirm', {
                                email: user.email,
                                id: user.id,
                            })
                        "
                    >
                        <AtlanIcon icon="ResendInvite"></AtlanIcon
                    ></a-button>
                </a-tooltip>
                <a-dropdown v-if="!user.email_verified" :trigger="['click']">
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
                                    emit('showRevokeInvitationConfirm', {
                                        email: user.email,
                                        id: user.id,
                                    })
                                "
                            >
                                Revoke Invitation </a-menu-item
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
                                            class="pr-0 hover:bg-transparent"
                                            @click="
                                                emit('closeChangeRolePopover')
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
                                        @updateRole="emit('handleUpdateRole')"
                                        @errorUpdateRole="
                                            emit('handleErrorUpdateRole')
                                        "
                                    />
                                </template>
                                <a-menu-item
                                    key="2"
                                    @click="emit('handleChangeRole', user)"
                                    >Change User Role
                                </a-menu-item>
                            </a-popover>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-button-group>
        </template>
    </a-table>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar/index.vue'

    import { userColumns, statusColorCodes } from '~/constant/users'
    import useRoles from '~/composables/roles/useRoles'
    import ChangeRole from './changeRole.vue'

    export default defineComponent({
        name: 'UserListTable',
        components: { Avatar, ChangeRole },
        props: {
            userList: { type: Array, required: true },
            permissions: { type: Object, required: true },
            loading: { type: Boolean, required: true },
            selectedUserId: { type: String, required: true },
            showChangeRolePopover: { type: Boolean, required: true },
        },
        emits: [
            'handleUpdateRole',
            'showResendInvitationConfirm',
            'confirmEnableDisablePopover',
            'change',
            'showRevokeInvitationConfirm',
            'showUserPreviewDrawer',
            'closeChangeRolePopover',
            'handleChangeRole',
            'handleErrorUpdateRole',
        ],
        setup(props, { emit }) {
            const { userList, selectedUserId } = toRefs(props)

            const { username: currentUserUsername } = whoami()

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const isCurrentUser = (username: string) =>
                username === currentUserUsername.value

            const selectedUser = computed(() => {
                let activeUserObj = {}
                if (userList && userList.value && userList.value.length)
                    activeUserObj = userList.value.find(
                        (user: any) => user.id === selectedUserId.value
                    )
                return activeUserObj
            })
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

            // fetch roles- need this to find role id when changing user/invite role
            const { roleList } = useRoles()

            return {
                roleList,
                userColumns,
                nameCase,
                selectedUser,
                getEnableDisablePopoverContent,
                imageUrl,
                emit,
                isCurrentUser,
                statusColorCodes,
            }
        },
    })
</script>

<style scoped lang="less">
    .user-table {
        // extra row hide hack
        :global(.ant-table-measure-row) {
            @apply hidden;
        }
    }
</style>
