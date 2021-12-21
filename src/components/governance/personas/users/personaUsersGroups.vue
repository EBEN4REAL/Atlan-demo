<template>
    <div class="p-4 bg-white rounded user-group-wrapper">
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
                                getUserList()
                                getGroupList()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <!-- END Error State -->

        <!-- START Empty state: no persona users and groups -->
        <EmptyView
            v-else-if="!userList.length && !groupList.length"
            empty-screen="CreateGroups"
            headline="Add users and groups"
        >
        </EmptyView>
        <!-- END Empty state: no persona users and groups -->

        <!-- START Loading state: no persona users and groups -->
        <div
            v-else-if="isUsersLoading || isGroupsLoading"
            class="flex items-center justify-center loading-view"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-7 animate-spin"
            ></AtlanIcon>
        </div>
        <!-- END Loading state: no persona users and groups -->

        <!-- START List -->
        <div
            v-else-if="
                (userList.length || groupList.length) &&
                !groupsError &&
                !usersError
            "
        >
            <div class="flex items-center justify-between w-full mb-2">
                <div class="mr-4 w-80">
                    <SearchAndFilter
                        v-model:value="queryText"
                        class="bg-white"
                        :placeholder="placeholder"
                        size="minimal"
                    />
                </div>
                <div>
                    <a-popover
                        v-model:visible="popoverVisible"
                        placement="left"
                        trigger="click"
                        :destroy-tooltip-on-hide="true"
                    >
                        <a-button
                            type="primary"
                            @click="() => setPopoverState(!popoverVisible)"
                            >Add User/Group</a-button
                        >
                        <!-- <AtlanBtn
                            color="primary"
                            padding="compact"
                            :size="'sm'"
                            data-test-id="add-users"
                            class="items-center px-6 ml-auto"
                            ><AtlanIcon icon="Add"></AtlanIcon>
                            <span>Add </span></AtlanBtn
                        > -->
                        <template #content>
                            <div
                                class="flex flex-col items-center px-1 py-4 bg-white rounded"
                                style="width: 270px"
                            >
                                <!-- <OwnersSelector
                            :no-owners-assigned="false"
                            :enableTabs="enableTabs"
                            :data="userGroupData"
                            @change="handleUsersChange"
                        /> -->
                                <OwnersSelector
                                    v-model:modelValue="userGroupData"
                                    :show-none="false"
                                    :enable-tabs="enableTabs"
                                    select-group-key="id"
                                    select-user-key="id"
                                    :hide-disabled-tabs="true"
                                />
                                <div class="w-full">
                                    <div class="flex justify-around">
                                        <AtlanBtn
                                            size="sm"
                                            color="secondary"
                                            padding="compact"
                                            class="w-26"
                                            style="width: 80px"
                                            data-test-id="cancel-owners"
                                            @click="handleCancel"
                                            >Cancel</AtlanBtn
                                        >
                                        <AtlanBtn
                                            size="sm"
                                            :disabled="addUsersLoading"
                                            class="flex items-center"
                                            color="primary"
                                            padding="compact"
                                            style="width: 80px"
                                            @click="handleUpdate"
                                        >
                                            <AtlanIcon
                                                v-if="addUsersLoading"
                                                icon="CircleLoader"
                                                style="margin-right: 2.5px"
                                                data-test-id="add-owners"
                                                class="w-4 h-4 animate-spin"
                                            ></AtlanIcon>
                                            <span>Update</span></AtlanBtn
                                        >
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-popover>
                </div>
            </div>
            <AggregationTabs
                v-model="listType"
                :list="tabConfig"
                :no-all="true"
                :full-width="false"
                class="w-auto"
            />
            <div
                v-if="filteredList && filteredList.length"
                class="flex flex-col mt-3 overflow-y-auto divide-y divide-gray-200 list-wrapper gap-y-2"
            >
                <div
                    v-for="item in filteredList"
                    :key="item.alias || item.username"
                >
                    <div class="px-3 py-2 rounded">
                        <!--user-->
                        <div
                            v-if="item.username"
                            class="grid items-center w-full grid-cols-12"
                        >
                            <div class="col-span-6">
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
                                        :avatar-size="32"
                                        avatar-shape="circle"
                                        class="mr-2"
                                    />
                                    <div
                                        class="flex flex-col"
                                        :data-test-id="item.username"
                                    >
                                        <div
                                            class="truncate cursor-pointer"
                                            @click="
                                                () => {
                                                    showUserPreviewDrawer(item)
                                                }
                                            "
                                        >
                                            <span class="text-primary">{{
                                                item.name ||
                                                item.username ||
                                                item.email ||
                                                '-'
                                            }}</span>
                                        </div>
                                        <span class="text-xs text-gray-500">
                                            {{ item.username }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-3">
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
                            <div class="col-span-3">
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
                                        >
                                            <AtlanIcon
                                                icon="RemoveUser"
                                            ></AtlanIcon>
                                            Remove
                                        </div>
                                    </a-popover>
                                </a-tooltip>
                            </div>
                        </div>

                        <!--group-->
                        <div
                            v-if="item.alias"
                            class="grid items-center w-full grid-cols-12"
                        >
                            <div class="col-span-6">
                                <div
                                    class="flex items-center align-middle"
                                    :data-test-id="item.alias"
                                >
                                    <div
                                        class="py-0.5 px-1 rounded-full bg-primary-light text-primary mr-2"
                                    >
                                        <AtlanIcon
                                            icon="GroupStatic"
                                        ></AtlanIcon>
                                    </div>
                                    <div
                                        class="truncate cursor-pointer"
                                        @click="
                                            () => {
                                                showGroupPreviewDrawer(item)
                                            }
                                        "
                                    >
                                        <span class="text-primary">{{
                                            item.name || '-'
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-3">
                                {{ item.memberCountString }}
                            </div>
                            <div class="col-span-3">
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
                                        >
                                            <AtlanIcon
                                                icon="RemoveUser"
                                            ></AtlanIcon>
                                            Remove
                                        </div>
                                    </a-popover>
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EmptyView
                v-else-if="!filteredList.length"
                empty-screen="NoResultIllustration"
                desc="Sorry, we couldn’t find the user you were looking for"
            >
            </EmptyView>
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

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from '../composables/usePersonaUsers'
    import usePersonaGroups from '../composables/usePersonaGroups'
    import usePersonaService from '../composables/usePersonaService'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { selectedPersonaDirty } from '../composables/useEditPersona'
    import { IGroup, IUser } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            Avatar,
            AtlanBtn,
            SearchAndFilter,
            OwnersSelector,
            ErrorView,
            EmptyView,
            AggregationTabs,
            Loader,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        setup(props) {
            const showRemoveUserPopover = ref({})
            const { persona } = toRefs(props)
            const listType: Ref<'all' | 'users' | 'groups'> = ref('all')
            const enableTabs = computed(() => ['users', 'groups'])

            const queryText = ref('')
            const popoverVisible = ref(false)
            const addUsersLoading = ref(false)

            const { usePersonaUserList, userColumns } = usePersonaUsers
            const { usePersonaGroupList, groupColumns } = usePersonaGroups
            const { updateUsers } = usePersonaService()
            const {
                getUserList,
                STATES: USER_STATES,
                state: userState,
                userList,
                isLoading: isUsersLoading,
                error: usersError,
            } = usePersonaUserList(persona)
            const {
                getGroupList,
                STATES: GROUP_STATES,
                state: groupState,
                groupList,
                isLoading: isGroupsLoading,
                error: groupsError,
            } = usePersonaGroupList(persona)

            const filteredList = computed(() => {
                const qry = queryText.value
                if (listType.value === 'all') {
                    let filteredUsersList: IUser[] = []
                    let filteredGroupsList: IGroup[] = []
                    // filter by search text
                    if (queryText.value) {
                        filteredUsersList = userList.value.filter(
                            (usr) =>
                                usr?.lastName?.toLowerCase().includes(qry) ||
                                usr?.firstName?.toLowerCase().includes(qry) ||
                                usr?.username?.toLowerCase().includes(qry)
                        )
                        filteredGroupsList = groupList.value.filter((group) =>
                            group?.name?.toLowerCase().includes(qry)
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
                if (listType.value !== 'all')
                    return `Search from ${
                        listType.value === 'users'
                            ? userList.value.length
                            : groupList.value.length
                    } ${listType.value}`

                if (userList.value.length && groupList.value.length)
                    return `Search from ${userList.value.length} users and ${groupList.value.length} groups`
                if (userList.value.length)
                    return `Search from ${userList.value.length} users`
                if (groupList.value.length)
                    return `Search from ${groupList.value.length} groups`

                return ''
            })

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                showUserPreview()
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
                            getUserList()
                            getGroupList()
                        })
                        .catch((e) => {
                            addUsersLoading.value = false
                            message.error('Failed to add users')
                            console.log('Failed to add users', e)
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
                persona.value.users = updatedUsersIds
                selectedPersonaDirty.value.users = updatedUsersIds
                persona.value.groups = updatedGroupIds
                selectedPersonaDirty.value.groups = updatedGroupIds

                updateUsers({
                    id: persona.value.id,
                    users: updatedUsersIds,
                    groups: updatedGroupIds,
                })
                    .then(() => {
                        showRemoveUserPopover.value[userOrGroup.id] = false
                        addUsersLoading.value = false
                        userGroupData.value.ownerUsers = updatedUsersIds
                        userGroupData.value.ownerGroups = updatedGroupIds
                        getUserList()
                        getGroupList()
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
                        message.error('Failed to add users')
                        console.log('Failed to add users', e)
                    })
            }

            // BEGIN: GROUP PREVIEW
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()
            const showGroupPreviewDrawer = (
                group: any,
                activeTabKey = 'about'
            ) => {
                setGroupUniqueAttribute(group.id)
                showGroupPreview()
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
                getGroupList,
                getUserList,
                enableTabs,
                getPopoverContent,
                confirmPopover,
                groupState,
                GROUP_STATES,
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
            }
        },
    })
</script>
<style lang="less" scoped>
    .list-wrapper {
        max-height: calc(100vh - 30rem);
    }
    .loading-view {
        min-height: 10rem;
    }
    .user-group-wrapper {
        min-height: 24rem;
    }
</style>
