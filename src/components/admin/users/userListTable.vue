<template>
    <a-table
        v-if="userList"
        id="userList"
        class="overflow-hidden border rounded-table users-groups-table"
        :scroll="{ y: 'calc(100vh - 20rem)', x: 1080 }"
        :data-source="userList"
        :columns="userColumns"
        :row-key="(user) => user.id"
        :pagination="false"
        :loading="loading"
        :show-sorter-tooltip="false"
        @change="handleTableChange"
    >
        <template #headerCell="{ title, column }">
            <a-tooltip v-if="column.sortKey" placement="top" class="p-4">
                <template #title>{{
                    getSortTooltipText(
                        column.sortKey,
                        column.ascOrderString || '',
                        column.descOrderString || ''
                    )
                }}</template>
                <div
                    class="flex justify-start font-normal tracking-wide text-gray-500 uppercase cursor-pointer group"
                    :class="column.align === 'right' ? 'flex-row-reverse' : ''"
                >
                    <div>
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
                            <AtlanIcon icon="ArrowDown" class="mb-0.5 -ml-2" />
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
                class="flex p-4 font-normal tracking-wide text-gray-500 uppercase w-100 group-hover:text-gray-700"
            >
                {{ title }}
            </div>
        </template>
        <template #name="{ text: user }">
            <div
                class="flex items-center align-middle"
                :style="{
                    maxWidth:
                        userColumns.filter(
                            (column) => column?.key === 'user'
                        )[0].width + 'px',
                }"
                @click="
                    () => {
                        if (!user.emailVerified) return
                        emit('showUserPreviewDrawer', user)
                    }
                "
            >
                <Avatar
                    :image-url="imageUrl(user.username)"
                    :allow-upload="isCurrentUser(user.username)"
                    :avatar-name="user.name || user.username || user.email"
                    :avatar-size="26"
                    avatar-shape="circle"
                    class="mr-2"
                />
                <div
                    class="max-w-full truncate"
                    :class="!user.emailVerified ? '' : 'cursor-pointer'"
                >
                    <span v-if="user.emailVerified" class="text-primary">{{
                        nameCase(user.name) || '-'
                    }}</span>
                    <span v-else class="text-primary">{{
                        user.email || '-'
                    }}</span>
                    <p class="mb-0 text-gray-500 truncate">
                        @{{ user.username || '-' }}
                    </p>
                </div>
            </div>
        </template>
        <template #role="{ text: user }">
            <a-tooltip
                v-if="user.enabled && user.emailVerified"
                placement="top"
                class="mr-3.5"
            >
                <!-- <template #title>
                    <span>Change Role</span>
                </template> -->
                <a-popover
                    placement="bottomRight"
                    trigger="click"
                    :destroy-tooltip-on-hide="true"
                    :visible="
                        selectedUserId === user.id && showChangeRolePopover
                    "
                >
                    <template #content>
                        <ChangeRole
                            :user="selectedUser"
                            :role-list="roleList"
                            @close="emit('closeChangeRolePopover')"
                            @updateRole="emit('handleUpdateRole')"
                            @errorUpdateRole="emit('handleErrorUpdateRole')"
                        />
                    </template>
                    <div
                        v-if="user.enabled"
                        v-auth="map.UPDATE_USERS"
                        class="flex items-center h-8 mr-auto text-center cursor-pointer"
                        @click="emit('handleChangeRole', user)"
                    >
                        {{ user.role_object.name }}
                        <AtlanIcon
                            :icon="
                                selectedUserId === user.id &&
                                showChangeRolePopover
                                    ? 'ChevronUp'
                                    : 'ChevronDown'
                            "
                            class="self-center h-3 ml-1 text-primary"
                        />
                    </div>
                </a-popover>
            </a-tooltip>
        </template>
        <template #status="{ text: user }">
            <div
                class="inline-flex items-center px-2 py-0.5 rounded-xl text-gray-700"
                @click="
                    () => {
                        if (!user.emailVerified) return
                        emit('showUserPreviewDrawer', user)
                    }
                "
            >
                <div
                    class="dot"
                    :class="`${
                        user.status_object.status === 'Active'
                            ? 'bg-success'
                            : user.status_object.status === 'Disabled'
                            ? 'bg-error'
                            : 'bg-alert'
                    }`"
                />
                <div>{{ user.status_object.status }}</div>
            </div>
        </template>
        <template #group="{ text: user }">
            <Groups
                v-if="user?.groupCount"
                class="cursor-default"
                :user="user"
                @handleManageGroups="handleManageGroups"
            />
            <div v-else class="text-right text-primary">-</div>
        </template>
        <template #persona="{ text: user }">
            <a-popover
                v-if="user?.personas?.length"
                placement="bottom"
                :destroy-tooltip-on-hide="true"
            >
                <template #content>
                    <div class="p-3 content-popover-group-persona">
                        <div class="flex justify-between">
                            Personas
                            <!-- <div>
                                <span class="ml-auto text-primary">
                                    Manage
                                </span>
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="ml-1 text-primary"
                                />
                            </div> -->
                        </div>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <div
                                v-for="persona in user?.personas"
                                :key="persona.id"
                                class="px-2 border rounded-xl"
                            >
                                {{ persona.name }}
                            </div>
                        </div>
                    </div>
                </template>
                <div class="text-right cursor-default text-primary">
                    {{ user?.personas?.length || '-' }}
                </div>
            </a-popover>
            <div v-else class="text-right text-primary">-</div>
        </template>
        <template #actions="{ text: user }">
            <a-button-group v-auth="map.UPDATE_USERS">
                <a-dropdown
                    v-if="user.emailVerified && user.enabled"
                    :trigger="['click']"
                >
                    <div
                        class="flex items-center justify-center w-8 h-8 cursor-pointer"
                        @click="(e) => e.preventDefault()"
                    >
                        <AtlanIcon icon="KebabMenu"></AtlanIcon>
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="verified-user-1">
                                <AddGroups
                                    :user="user"
                                    @groupAdded="handleGroupUpdated"
                                />
                            </a-menu-item>
                            <!-- <a-menu-item key="verified-user-2">
                                <AddPersonas :user="user" />
                            </a-menu-item> -->
                            <a-menu-item
                                key="verified-user-3"
                                @click="
                                    emit('toggleDisableEnablePopover', user)
                                "
                            >
                                <div
                                    class="flex items-center px-1.5 py-1 cursor-pointer text-red-600 border-t"
                                >
                                    <AtlanIcon
                                        class="mr-2 icon-disabled-user"
                                        icon="DisableUser"
                                    />
                                    Disable user
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown
                    v-if="user.emailVerified && !user.enabled"
                    :trigger="['click']"
                >
                    <div
                        class="flex items-center justify-center w-8 h-8 cursor-pointer"
                        @click="(e) => e.preventDefault()"
                    >
                        <AtlanIcon icon="KebabMenu"></AtlanIcon>
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                key="verified-user-3"
                                @click="
                                    emit('toggleDisableEnablePopover', user)
                                "
                            >
                                <div
                                    class="flex items-center justify-center h-8 p-2 py-3 cursor-pointer"
                                >
                                    <AtlanIcon
                                        class="mr-2"
                                        icon="CheckCircled"
                                    />
                                    Enable user
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-popover
                    placement="leftTop"
                    trigger="click"
                    :destroy-tooltip-on-hide="true"
                    :visible="
                        selectedUserId === user.id && showDisableEnablePopover
                    "
                >
                    <template #content>
                        <div class="p-4 w-60">
                            <h3
                                v-html="
                                    getEnableDisablePopoverContent(
                                        user,
                                        user.enabled ? 'disable' : 'enable'
                                    )
                                "
                            ></h3>
                            <div
                                class="flex items-center justify-between mt-3 gap-x-3"
                            >
                                <div class="flex-grow"></div>
                                <AtlanButton
                                    color="minimal"
                                    size="sm"
                                    padding="compact"
                                    @click="$emit('toggleDisableEnablePopover')"
                                    >Cancel
                                </AtlanButton>
                                <AtlanButton
                                    :color="user.enabled ? 'danger' : 'primary'"
                                    size="sm"
                                    padding="compact"
                                    @click="
                                        emit(
                                            'confirmEnableDisablePopover',
                                            user
                                        )
                                    "
                                    >{{ user.enabled ? 'Disable' : 'Enable' }}
                                </AtlanButton>
                            </div>
                        </div>
                    </template>
                </a-popover>
                <a-popover
                    placement="leftTop"
                    trigger="click"
                    :destroy-tooltip-on-hide="true"
                    :visible="
                        selectedUserId === user.id && showRevokeInvitePopover
                    "
                >
                    <template #content>
                        <div class="p-4 w-60">
                            <h3>
                                Revoke invitation for
                                <b>{{
                                    user.name ||
                                    user.username ||
                                    user.email ||
                                    ''
                                }}</b>
                                ?
                            </h3>
                            <div
                                class="flex items-center justify-between mt-3 gap-x-3"
                            >
                                <div class="flex-grow"></div>
                                <AtlanButton
                                    color="minimal"
                                    size="sm"
                                    padding="compact"
                                    @click="$emit('handleRevokeInvite', false)"
                                    >Cancel
                                </AtlanButton>
                                <AtlanButton
                                    :color="'danger'"
                                    size="sm"
                                    padding="compact"
                                    @click="
                                        $emit('revokeInvite', {
                                            email: user.email,
                                            id: user.id,
                                        })
                                    "
                                    >Revoke
                                </AtlanButton>
                            </div>
                        </div>
                    </template>
                </a-popover>
                <!-- enable/disable  -->
                <!-- <a-tooltip v-if="user.emailVerified" placement="top">
                    <template #title>
                        <span>
                            {{
                                user.enabled ? 'Disable User' : 'Enable User'
                            }}</span
                        >
                    </template>
                </a-tooltip> -->
                <!-- invitation -->
                <!-- <a-tooltip
                    v-if="!user.emailVerified"
                    placement="top"
                    class="rounded mr-3.5"
                >
                    <template #title>
                        <span>Resend Invite</span>
                    </template>
                    <div
                        class="flex items-center justify-center w-8 h-8 border rounded cursor-pointer customShadow"
                        @click="
                            emit('resendInvite', {
                                email: user.email,
                                id: user.id,
                            })
                        "
                    >
                        <AtlanIcon icon="ResendInvite"></AtlanIcon>
                    </div>
                </a-tooltip> -->
                <a-dropdown v-if="!user.emailVerified" :trigger="['click']">
                    <div
                        class="flex items-center justify-center w-8 h-8 cursor-pointer"
                        @click="(e) => e.preventDefault()"
                    >
                        <AtlanIcon icon="KebabMenu" />
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0">
                                <div
                                    class="flex items-center justify-center h-8 p-2 py-3 cursor-pointer"
                                    @click="
                                        emit('resendInvite', {
                                            email: user.email,
                                            id: user.id,
                                        })
                                    "
                                >
                                    <AtlanIcon
                                        class="mr-2"
                                        icon="ResendInvite"
                                    />
                                    Resend invitation
                                </div>
                            </a-menu-item>
                            <a-menu-item
                                key="revoke inviation"
                                @click="emit('handleRevokeInvite', user.id)"
                            >
                                <div
                                    class="flex items-center justify-center h-8 p-2 py-3 text-red-600 cursor-pointer"
                                >
                                    <AtlanIcon
                                        class="mr-2 text-red-600"
                                        icon="Revoke"
                                    />
                                    Revoke Invitation
                                </div>
                            </a-menu-item>

                            <!-- <a-popover
                                placement="leftTop"
                                trigger="click"
                                :destroy-tooltip-on-hide="true"
                                :visible="
                                    selectedUserId === user.id &&
                                    showChangeRolePopover
                                "
                            >
                                <template #content>
                                    <ChangeRole
                                        :user="selectedUser"
                                        :role-list="roleList"
                                        @close="emit('closeChangeRolePopover')"
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
                            </a-popover> -->
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-button-group>
        </template>
    </a-table>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar/index.vue'

    import { userColumns, statusColorClass } from '~/constant/users'
    import useRoles from '~/composables/roles/useRoles'
    import ChangeRole from './changeRole.vue'
    import map from '~/constant/accessControl/map'
    import AtlanButton from '@/UI/button.vue'
    import Groups from './groups.vue'
    import AddGroups from './addGroups.vue'
    import AddPersonas from './addPersona.vue'

    export default defineComponent({
        name: 'UserListTable',
        components: {
            Avatar,
            ChangeRole,
            AtlanButton,
            Groups,
            AddGroups,
            AddPersonas,
        },
        props: {
            userList: { type: Array, required: true },
            loading: { type: Boolean, required: true },
            selectedUserId: { type: String, required: true },
            showChangeRolePopover: { type: Boolean, required: true },
            showDisableEnablePopover: { type: Boolean, required: true },
            showRevokeInvitePopover: { type: Boolean, required: true },
        },
        emits: [
            'toggleDisableEnablePopover',
            'handleUpdateRole',
            'showResendInvitationConfirm',
            'confirmEnableDisablePopover',
            'change',
            'showRevokeInvitationConfirm',
            'showUserPreviewDrawer',
            'closeChangeRolePopover',
            'handleChangeRole',
            'resendInvite',
            'revokeInvite',
            'handleRevokeInvite',
            'handleErrorUpdateRole',
            'refetch',
        ],
        setup(props, { emit }) {
            const { userList, selectedUserId } = toRefs(props)

            const { username: currentUserUsername } = whoami()
            const activeSortObject = ref({ key: '', order: '' })

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
                    return `Are you sure you want to ${action} <b>${
                        user.name || user.username || user.email || ''
                    }</b>?`
                return `Admins cannot ${action} other admins. If you still wish to perform this action, downgrade the user's role to Member/Data Steward and then enable the user.`
            }

            // fetch roles- need this to find role id when changing user/invite role
            const { roleList } = useRoles()
            const handleManageGroups = (user) => {
                emit('showUserPreviewDrawer', user, 'groups')
            }
            const handleGroupUpdated = () => {
                emit('refetch')
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
            const handleTableChange = (pagination: any, filters: any, sort) => {
                const sortKey = sort?.column?.sortKey
                if (sortKey !== activeSortObject.value.key) {
                    activeSortObject.value.key = sortKey
                    activeSortObject.value.order = 'asc'
                } else {
                    const nextSortOrder = getNextOrder()
                    activeSortObject.value.order = getNextOrder()
                    if (!nextSortOrder) activeSortObject.value.key = ''
                }
                let sortValue = 'firstName'
                if (activeSortObject.value.key) {
                    sortValue = `${
                        activeSortObject.value.order === 'desc' ? '-' : ''
                    }${activeSortObject.value.key}`
                }
                emit('change', sortValue)
            }
            return {
                roleList,
                userColumns,
                nameCase,
                selectedUser,
                getEnableDisablePopoverContent,
                imageUrl,
                emit,
                isCurrentUser,
                statusColorClass,
                map,
                handleManageGroups,
                handleGroupUpdated,
                activeSortObject,
                getSortTooltipText,
                handleTableChange,
            }
        },
    })
</script>

<style lang="less" scoped>
    .customShadow {
        box-shadow: 0px 1px 0px 0px hsla(0, 0%, 0%, 0.05);
    }
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .content-popover-group-persona {
        width: 180px;
    }
</style>

<style lang="less">
    .icon-disabled-user {
        path {
            stroke: #dc2626;
        }
        circle {
            stroke: #dc2626;
        }
    }
</style>
