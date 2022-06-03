<template>
    <div class="overflow-scroll bg-white rounded user-group-wrapper">
        <!-- START Error State -->
        <div
            v-if="errorUsersGroups"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        data-test-id="try-again"
                        ghost
                        @click="
                            () => {
                                fetchPersonaUserSubjects()
                                fetchPersonaGroupSubjects()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div
            v-else-if="isUsersLoading || isGroupsLoading"
            class="flex items-center justify-center loading-view"
        >
            <AtlanLoader class="h-7" />
        </div>

        <div
            v-else-if="!groupsError && !usersError"
            class="flex flex-col h-full overflow-y-hidden"
        >
            <div class="flex items-center justify-between w-full px-4 py-2.5">
                <div class="flex items-center text-sm font-bold text-gray-500">
                    <AtlanIcon icon="Group" class="w-auto h-4 mr-2 -mt-1" />
                    Users and groups
                </div>
                <RaisedTab
                    v-if="
                        filteredList.length || queryText || listType !== 'all'
                    "
                    v-model:active="listType"
                    :data="streams"
                    class="tab-filter"
                />
            </div>
            <div class="flex items-center px-4 mt-3 mb-2">
                <a-input
                    v-if="
                        filteredList.length || queryText || listType !== 'all'
                    "
                    v-model:value="queryText"
                    class="mr-3 border-t-0 border-b border-l-0 border-r-0 border-gray-300 rounded-none shadow-none outline-none input-search-group-user"
                    :placeholder="placeholder"
                >
                    <template #prefix>
                        <AtlanIcon icon="Search" class="mr-1" />
                    </template>
                </a-input>
            </div>
            <div
                v-if="filteredList && filteredList.length"
                class="flex-grow overflow-y-auto"
            >
                <div class="flex flex-col flex-grow mt-3 list-wrapper gap-y-2">
                    <div
                        v-for="item in filteredList"
                        :key="item.alias || item.username"
                    >
                        <div
                            class="px-6 py-2 rounded hover:bg-gray-100 card-container"
                        >
                            <!--user-->
                            <div
                                v-if="item.username"
                                class="flex items-center justify-between w-full"
                            >
                                <div>
                                    <div class="flex items-center align-middle">
                                        <avatar
                                            :image-url="imageUrl(item.username)"
                                            :allow-upload="false"
                                            :avatar-name="
                                                item.name ||
                                                item.username ||
                                                item.email ||
                                                item.firstName + item.lastName
                                            "
                                            :avatar-size="38"
                                            avatar-shape="circle"
                                            class="mr-2"
                                        />
                                        <div
                                            class="flex flex-col"
                                            :data-test-id="item.username"
                                        >
                                            <div class="truncate">
                                                <div class="flex items-center">
                                                    <a-tooltip>
                                                        <template #title>
                                                            {{
                                                                `${
                                                                    item.name ||
                                                                    item.username ||
                                                                    item.email ||
                                                                    '-'
                                                                }`
                                                            }}
                                                        </template>
                                                        <div
                                                            class="max-w-xs truncate text-primary"
                                                        >
                                                            {{
                                                                `${
                                                                    item.name ||
                                                                    item.username ||
                                                                    item.email ||
                                                                    '-'
                                                                }`
                                                            }}
                                                        </div>
                                                    </a-tooltip>
                                                    <div
                                                        v-if="
                                                            item.emailVerified ===
                                                            false
                                                        "
                                                        class="border border-alert mb-0.5 ml-3 px-1.5 rounded-2xl text-alert text-xs"
                                                    >
                                                        Invited
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="text-xs text-gray-500">
                                                @{{ item.username }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="type-data">
                                    <span
                                        v-if="item?.role_object?.name"
                                        :data-test-id="item.role_object.name"
                                        class="text-gray-500"
                                    >
                                        <span>
                                            {{ item.role_object.name || '-' }}
                                        </span>
                                    </span>
                                </div>
                                <div class="remove-data">
                                    <a-tooltip placement="bottom">
                                        <template #title>
                                            <span>Remove User</span>
                                        </template>
                                        <a-popover
                                            placement="leftTop"
                                            trigger="click"
                                            :destroy-tooltip-on-hide="true"
                                            :visible="
                                                showRemoveUserPopover[item.id]
                                            "
                                        >
                                            <template #content>
                                                <div class="p-4">
                                                    <h3
                                                        v-html="
                                                            getPopoverContent(
                                                                item,
                                                                'remove',
                                                                'user'
                                                            )
                                                        "
                                                    ></h3>
                                                    <div
                                                        class="flex items-center justify-between mt-3 gap-x-3"
                                                    >
                                                        <div
                                                            class="flex-grow"
                                                        ></div>
                                                        <AtlanBtn
                                                            color="minimal"
                                                            size="sm"
                                                            padding="compact"
                                                            @click="
                                                                showRemoveUserPopover[
                                                                    item.id
                                                                ] = false
                                                            "
                                                            >Cancel
                                                        </AtlanBtn>
                                                        <AtlanBtn
                                                            :color="'danger'"
                                                            size="sm"
                                                            padding="compact"
                                                            :is-loading="
                                                                addUsersLoading
                                                            "
                                                            :disabled="
                                                                addUsersLoading
                                                            "
                                                            @click="
                                                                confirmPopover(
                                                                    item,
                                                                    'user'
                                                                )
                                                            "
                                                        >
                                                            {{
                                                                addUsersLoading
                                                                    ? 'Removing'
                                                                    : 'Remove'
                                                            }}
                                                        </AtlanBtn>
                                                    </div>
                                                </div>
                                            </template>
                                            <div
                                                class="text-right text-red-500 cursor-pointer"
                                                @click="
                                                    showRemoveUserPopover[
                                                        item.id
                                                    ] = true
                                                "
                                            >
                                                Remove
                                            </div>
                                        </a-popover>
                                    </a-tooltip>
                                </div>
                            </div>

                            <!--group-->
                            <div
                                v-if="item.alias"
                                class="flex items-center justify-between w-full"
                            >
                                <div>
                                    <div
                                        class="flex items-center align-middle"
                                        :data-test-id="item.alias"
                                    >
                                        <div
                                            class="flex items-center self-center justify-center mr-2 align-middle rounded-full bg-primary-light text-primary"
                                            style="height: 38px; width: 38px"
                                        >
                                            <AtlanIcon
                                                icon="GroupStatic"
                                            ></AtlanIcon>
                                        </div>
                                        <div class="flex flex-col">
                                            <div class="truncate">
                                                <span class="text-primary">{{
                                                    item.name || '-'
                                                }}</span>
                                            </div>
                                            <span class="text-xs text-gray-500">
                                                {{
                                                    item.memberCountString
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="text-gray-500 type-data">Group</div>
                                <div class="remove-data">
                                    <a-tooltip placement="bottom">
                                        <template #title>
                                            <span>Remove group</span>
                                        </template>
                                        <a-popover
                                            placement="leftTop"
                                            trigger="click"
                                            :destroy-tooltip-on-hide="true"
                                            :visible="
                                                showRemoveUserPopover[item.id]
                                            "
                                        >
                                            <template #content>
                                                <div class="p-4">
                                                    <h3
                                                        v-html="
                                                            getPopoverContent(
                                                                item,
                                                                'remove',
                                                                'group'
                                                            )
                                                        "
                                                    ></h3>
                                                    <div
                                                        class="flex items-center justify-between mt-3 gap-x-3"
                                                    >
                                                        <div
                                                            class="flex-grow"
                                                        ></div>
                                                        <AtlanBtn
                                                            color="minimal"
                                                            size="sm"
                                                            padding="compact"
                                                            @click="
                                                                showRemoveUserPopover[
                                                                    item.id
                                                                ] = false
                                                            "
                                                            >Cancel
                                                        </AtlanBtn>
                                                        <AtlanBtn
                                                            :color="'danger'"
                                                            size="sm"
                                                            padding="compact"
                                                            :is-loading="
                                                                addUsersLoading
                                                            "
                                                            :disabled="
                                                                addUsersLoading
                                                            "
                                                            @click="
                                                                confirmPopover(
                                                                    item,
                                                                    'group'
                                                                )
                                                            "
                                                        >
                                                            {{
                                                                addUsersLoading
                                                                    ? 'Removing'
                                                                    : 'Remove'
                                                            }}
                                                        </AtlanBtn>
                                                    </div>
                                                </div>
                                            </template>
                                            <div
                                                class="text-right text-red-500 cursor-pointer"
                                                @click="
                                                    () =>
                                                        (showRemoveUserPopover[
                                                            item.id
                                                        ] = true)
                                                "
                                            >
                                                Remove
                                            </div>
                                        </a-popover>
                                    </a-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EmptyView
                v-else-if="
                    !filteredList.length && (queryText || listType !== 'all')
                "
                class="mt-4"
                :empty-screen="
                    !queryText ? 'CreateGroups' : 'NoResultIllustration'
                "
                :desc="
                    queryText
                        ? `Whoops! couldn't find anyone with '${queryText}' in persona`
                        : `No ${listType} added in the persona`
                "
            >
            </EmptyView>
            <EmptyState
                v-else-if="!filteredList.length && !queryText"
                image-class="h-36"
                empty-screen="CreateGroups"
                :desc="`${
                    listType === 'groups'
                        ? 'No groups added in the persona.'
                        : listType === 'users'
                        ? 'No users added in the persona'
                        : 'No users or groups added in the persona.'
                }`"
            />
        </div>
        <!-- END List -->
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import EmptyView from '@common/empty/index.vue'
    import OwnersSelector from '@common/facet/owners/index.vue'
    import ErrorView from '@common/error/index.vue'
    import Loader from '@common/loaders/page.vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import EmptyState from '@/common/empty/index.vue'

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from '@/governance/personas/composables/usePersonaUsers'
    import usePersonaGroups from '@/governance/personas/composables/usePersonaGroups'
    import usePersonaService from '@/governance/personas/composables/usePersonaService'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { IGroup, IUser } from '~/types/accessPolicies/personas'
    import RaisedTab from '@/UI/raisedTab.vue'

    export default defineComponent({
        name: 'PersonaPurposeUsersGroups',
        components: {
            Avatar,
            AtlanBtn,
            SearchAndFilter,
            OwnersSelector,
            ErrorView,
            EmptyView,
            AggregationTabs,
            Loader,
            EmptyState,
            RaisedTab,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
            cancelTokenForUsers: {
                type: Object,
                required: false,
            },
            cancelTokenForGroups: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const showRemoveUserPopover = ref({})
            const { persona, cancelTokenForUsers, cancelTokenForGroups } =
                toRefs(props)
            const listType: Ref<'all' | 'users' | 'groups'> = ref('all')
            const streams = computed(() => [
                {
                    key: 'all',
                    label: 'All',
                },
                {
                    key: 'users',
                    label: 'Users',
                },
                {
                    key: 'groups',
                    label: 'Groups',
                },
            ])
            const enableTabs = computed(() => ['users', 'groups'])

            const queryText = ref('')
            const popoverVisible = ref(false)
            const addUsersLoading = ref(false)

            const { usePersonaUserList, userColumns } = usePersonaUsers
            const { usePersonaGroupList, groupColumns } = usePersonaGroups
            const { updateUsers } = usePersonaService()
            const {
                fetchPersonaUserSubjects,
                STATES: USER_STATES,
                state: userState,
                userList,
                isLoading: isUsersLoading,
                error: usersError,
            } = usePersonaUserList(persona, cancelTokenForUsers.value)
            const {
                fetchPersonaGroupSubjects,
                groupList,
                isLoading: isGroupsLoading,
                error: groupsError,
            } = usePersonaGroupList(persona, cancelTokenForGroups.value)

            const filteredList = computed(() => {
                const qry = queryText.value
                if (listType.value === 'all') {
                    let filteredUsersList: IUser[] = []
                    let filteredGroupsList: IGroup[] = []
                    // filter by search text
                    if (queryText.value) {
                        filteredUsersList = userList.value.filter(
                            (usr) =>
                                usr?.lastName
                                    ?.toLowerCase()
                                    .includes(qry.toLowerCase()) ||
                                usr?.firstName
                                    ?.toLowerCase()
                                    .includes(qry.toLowerCase()) ||
                                usr?.username
                                    ?.toLowerCase()
                                    .includes(qry.toLowerCase())
                        )
                        filteredGroupsList = groupList.value.filter((group) =>
                            group?.name
                                ?.toLowerCase()
                                .includes(qry.toLowerCase())
                        )
                    } else {
                        filteredUsersList = [...userList.value]
                        filteredGroupsList = [...groupList.value]
                    }
                    // sort list alphabetically
                    if (filteredGroupsList && filteredGroupsList.length)
                        filteredGroupsList.sort((gp1, gp2) =>
                            gp1.name < gp2.name
                                ? -1
                                : gp1.name > gp2.name
                                ? 1
                                : 0
                        )
                    if (filteredUsersList && filteredUsersList.length)
                        filteredUsersList.sort((user1, user2) =>
                            user1.firstName < user2.firstName
                                ? -1
                                : user1.firstName > user2.firstName
                                ? 1
                                : 0
                        )

                    // return collated list
                    return [...filteredGroupsList, ...filteredUsersList] || []
                }
                if (listType.value === 'users') {
                    if (queryText.value)
                        return userList.value.filter(
                            (usr) =>
                                usr.lastName?.toLowerCase().includes(qry) ||
                                usr.firstName?.toLowerCase().includes(qry) ||
                                usr.username?.toLowerCase().includes(qry)
                        )
                    return userList.value
                }
                if (listType.value === 'groups') {
                    if (queryText.value)
                        return groupList.value.filter((group) =>
                            group.name?.toLowerCase().includes(qry)
                        )
                    return groupList.value
                }
                return []
            })
            const tabConfig = computed(() => [
                {
                    id: 'all',
                    label: 'All',
                    hideIcon: true,
                    showZero: true,
                    count:
                        (userList?.value?.length || 0) +
                            (groupList?.value?.length || 0) ?? 0,
                },
                {
                    id: 'users',
                    label: 'Users',
                    showZero: true,
                    disabled: !userList?.value?.length,
                    count: userList?.value?.length ?? 0,
                },
                {
                    id: 'groups',
                    label: 'Groups',
                    showZero: true,
                    disabled: !groupList?.value?.length,
                    count: groupList?.value?.length ?? 0,
                },
            ])
            const placeholder = computed(() => {
                const usersPlaceholder =
                    userList.value.length > 1 ? 'users' : 'user'
                const groupsPlaceholder =
                    groupList.value.length > 1 ? 'groups' : 'group'
                if (listType.value !== 'all')
                    return `Search from ${
                        listType.value === 'users'
                            ? `${userList.value.length} ${usersPlaceholder}`
                            : `${groupList.value.length} ${groupsPlaceholder}`
                    }`

                if (userList.value.length && groupList.value.length)
                    return `Search from ${userList.value.length} ${usersPlaceholder} and ${groupList.value.length} ${groupsPlaceholder}`
                if (userList.value.length)
                    return `Search from ${userList.value.length} ${usersPlaceholder} `
                if (groupList.value.length)
                    return `Search from ${groupList.value.length} ${groupsPlaceholder}`
                if (!userList.value.length && !groupList.value.length)
                    return `Search from ${userList.value.length} user and ${groupList.value.length} group`
                return ''
            })

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const {
                showUserPreview,
                setUserUniqueAttribute,
                showPreview: isUserPreviewOpen,
                closePreview: closeUserPreview,
            } = useUserPreview()
            const {
                showGroupPreview,
                setGroupUniqueAttribute,
                showPreview: isGroupPreviewOpen,
                closePreview: closeGroupPreview,
            } = useGroupPreview()

            const showUserPreviewDrawer = (user: any) => {
                if (isGroupPreviewOpen.value) closeGroupPreview()
                setUserUniqueAttribute(user.id)
                showUserPreview()
            }

            const showGroupPreviewDrawer = (
                group: any,
                activeTabKey = 'about'
            ) => {
                if (isUserPreviewOpen.value) closeUserPreview()
                setGroupUniqueAttribute(group.id)
                showGroupPreview()
            }

            const handleUpdate = () => {
                if (persona.value?.id) {
                    addUsersLoading.value = true
                    const userIds = userGroupData.value.ownerUsers ?? []
                    const groupIds = userGroupData.value.ownerGroups ?? []
                    updateUsers({
                        id: persona.value.id,
                        users: userIds,
                        groups: groupIds,
                    })
                        .then(() => {
                            addUsersLoading.value = false
                            popoverVisible.value = false
                            selectedPersonaDirty.value.users =
                                userGroupData.value.ownerUsers ?? []
                            selectedPersonaDirty.value.groups =
                                userGroupData.value.ownerGroups ?? []
                            persona.value.users =
                                userGroupData.value.ownerUsers ?? []
                            persona.value.groups =
                                userGroupData.value.ownerGroups ?? []
                            updateSelectedPersona()
                            // when we change users/groups in a persona, a watch runs to fetch more info for users/groups
                        })
                        .catch((e) => {
                            addUsersLoading.value = false
                            message.error('Failed to add users')
                        })
                }
            }

            const setPopoverState = (state: boolean) => {
                popoverVisible.value = state
            }

            const userGroupData: Ref<{
                ownerUsers: string[]
                ownerGroups: string[]
            }> = ref({
                ownerUsers: persona.value.users ?? [],
                ownerGroups: persona.value.groups ?? [],
            })

            const getPopoverContent = (
                user: any,
                action: 'remove',
                type: 'user' | 'group'
            ) =>
                `Are you sure you want to ${action} <b>${
                    user.name || user.username || user.email || ''
                }</b>?`

            const confirmPopover = (
                userOrGroup: any,
                type: 'user' | 'group'
            ) => {
                addUsersLoading.value = true
                let updatedUsersIds = userGroupData.value.ownerUsers ?? []
                let updatedGroupIds = userGroupData.value.ownerGroups ?? []
                if (type === 'user') {
                    updatedUsersIds = userGroupData.value.ownerUsers.filter(
                        (userId) => userId !== userOrGroup.id
                    )
                } else {
                    updatedGroupIds = userGroupData.value.ownerGroups.filter(
                        (groupId) => groupId !== userOrGroup.id
                    )
                }
                updateUsers({
                    id: persona.value.id,
                    users: updatedUsersIds,
                    groups: updatedGroupIds,
                })
                    .then(() => {
                        selectedPersonaDirty.value.users = updatedUsersIds
                        selectedPersonaDirty.value.groups = updatedGroupIds
                        showRemoveUserPopover.value[userOrGroup.id] = false
                        addUsersLoading.value = false
                        userGroupData.value.ownerUsers = updatedUsersIds
                        userGroupData.value.ownerGroups = updatedGroupIds
                        persona.value.users = updatedUsersIds
                        persona.value.groups = updatedGroupIds
                        updateSelectedPersona()
                    })
                    .catch((e) => {
                        if (type === 'user') {
                            persona.value.users = [
                                ...persona.value.users,
                                userOrGroup.username,
                            ]
                        } else {
                            persona.value.groups = [
                                ...persona.value.groups,
                                userOrGroup.alias,
                            ]
                        }
                        showRemoveUserPopover.value[userOrGroup.id] = false
                        addUsersLoading.value = false
                        message.error('Failed to remove user')
                    })
            }

            const handleCancel = () => {
                userGroupData.value.ownerUsers = persona.value.users ?? []
                userGroupData.value.ownerGroups = persona.value.groups ?? []
                setPopoverState(false)
            }

            watch(persona, () => {
                userGroupData.value.ownerUsers = persona.value.users ?? []
                userGroupData.value.ownerGroups = persona.value.groups ?? []
            })

            const errorUsersGroups = computed(() => {
                if (usersError.value) {
                    if (usersError.value.message.includes('cancel')) {
                        return false
                    }
                }
                if (groupsError.value) {
                    if (groupsError.value.message.includes('cancel')) {
                        return false
                    }
                }
                return usersError.value || groupsError.value
            })

            return {
                handleCancel,
                userState,
                USER_STATES,
                showGroupPreviewDrawer,
                fetchPersonaGroupSubjects,
                fetchPersonaUserSubjects,
                enableTabs,
                getPopoverContent,
                confirmPopover,
                addUsersLoading,
                handleUpdate,
                setPopoverState,
                popoverVisible,
                placeholder,
                userList,
                tabConfig,
                queryText,
                filteredList,
                listType,
                userColumns,
                imageUrl,
                showUserPreviewDrawer,
                userGroupData,
                groupColumns,
                groupList,
                isGroupsLoading,
                isUsersLoading,
                usersError,
                groupsError,
                showRemoveUserPopover,
                errorUsersGroups,
                streams,
            }
        },
    })
</script>
<style lang="less">
    .tab-filter {
        .tab-btn {
            height: fit-content !important;
            padding: 6px 10px !important;
            @apply text-xs;
        }
    }
    .input-search-group-user {
        input {
            background: none !important;
            box-shadow: none !important;
        }
    }
</style>
<style lang="less" scoped>
    .card-container {
        :hover {
            .type-data {
                // display: none;
            }
            .remove-data {
                display: none;
            }
        }
        .remove-data {
            display: none;
        }
    }
    .list-wrapper {
        // max-height: 80vh;
    }
    .loading-view {
        min-height: 10rem;
    }
    .user-group-wrapper {
        height: 85vh;
    }
</style>
