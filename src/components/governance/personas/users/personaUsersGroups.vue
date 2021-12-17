<template>
    <div class="p-4 bg-white rounded">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
                <div class="px-2 py-1 rounded bg-primary-light text-primary">
                    <AtlanIcon icon="GroupActive" class="h-6"></AtlanIcon>
                </div>
                <div class="ml-2 font-bold">Users and groups</div>
            </div>
            <div>
                <a-popover
                    placement="left"
                    v-model:visible="popoverVisible"
                    trigger="click"
                    :destroyTooltipOnHide="true"
                >
                    <AtlanBtn
                        color="primary"
                        padding="compact"
                        :size="'sm'"
                        data-test-id="add-users"
                        class="items-center px-6 ml-auto"
                        @click="() => setPopoverState(!popoverVisible)"
                        ><AtlanIcon icon="Add"></AtlanIcon>
                        <span>Add </span></AtlanBtn
                    >
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
                                :showNone="false"
                                :enableTabs="enableTabs"
                                selectGroupKey="id"
                                selectUserKey="id"
                                :hideDisabledTabs="true"
                                v-model:modelValue="userGroupData"
                            />
                            <div class="w-full">
                                <div class="flex justify-around">
                                    <AtlanBtn
                                        size="sm"
                                        @click="handleCancel"
                                        color="secondary"
                                        padding="compact"
                                        class="w-26"
                                        style="width: 80px"
                                        data-test-id="cancel-owners"
                                        >Cancel</AtlanBtn
                                    >
                                    <AtlanBtn
                                        @click="handleUpdate"
                                        size="sm"
                                        :disabled="addUsersLoading"
                                        class="flex items-center"
                                        color="primary"
                                        padding="compact"
                                        style="width: 80px"
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
        <!-- START Error State -->
        <div
            v-if="usersError || groupsError"
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
            v-if="!userList.length && !groupList.length"
            empty-screen="CreateGroups"
            headline="Add users and groups"
        >
        </EmptyView>
        <!-- END Empty state: no persona users and groups -->

        <!-- START List -->
        <div
            v-if="
                (userList.length || groupList.length) &&
                !groupsError &&
                !usersError
            "
        >
            <div class="flex items-center justify-between w-full mb-6">
                <div class="w-full mr-4">
                    <SearchAndFilter
                        v-model:value="queryText"
                        class="bg-white w-80"
                        :placeholder="placeholder"
                        size="minimal"
                    />
                </div>
                <AggregationTabs
                    v-model="listType"
                    :list="tabConfig"
                    :no-all="true"
                    :full-width="false"
                    class="w-auto"
                />
            </div>
            <div
                v-if="filteredList && filteredList.length"
                class="overflow-y-auto list-wrapper"
            >
                <div
                    v-for="item in filteredList"
                    :key="item.alias || item.username"
                >
                    <div class="py-2 border-b">
                        <!--user-->
                        <div class="flex items-center" v-if="item.username">
                            <div class="w-2/3">
                                <div
                                    class="flex items-center align-middle"
                                    :data-test-id="item.username"
                                >
                                    <avatar
                                        :image-url="imageUrl(item.username)"
                                        :allow-upload="false"
                                        :avatar-name="
                                            item.name ||
                                            item.username ||
                                            item.email ||
                                            item.firstName + item.lastName
                                        "
                                        :avatar-size="24"
                                        avatar-shape="circle"
                                        class="mr-2"
                                    />
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
                                        <span
                                            v-if="item?.role_object?.name"
                                            :data-test-id="
                                                item.role_object.name
                                            "
                                            class="text-gray-500"
                                        >
                                            <span class="mx-2 text-gray-300"
                                                >•</span
                                            >
                                            <span>
                                                {{
                                                    item.role_object.name || '-'
                                                }}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="w-1/3">
                                {{ item.group_count_string }}
                            </div>
                            <div class="w-1/3">
                                <a-button-group>
                                    <a-tooltip placement="top">
                                        <template #title>
                                            <span>Remove User</span>
                                        </template>
                                        <a-popconfirm
                                            placement="leftTop"
                                            overlay-class-name="popoverConfirm"
                                            :title="
                                                getPopoverContent(
                                                    user,
                                                    'remove',
                                                    'user'
                                                )
                                            "
                                            ok-text="Yes"
                                            :ok-type="'default'"
                                            cancel-text="Cancel"
                                            :icon="false"
                                            @confirm="
                                                confirmPopover(user, 'user')
                                            "
                                        >
                                            <a-button
                                                size="small"
                                                data-test-id="remove-user"
                                                class="w-8 h-8 text-gray-500 border-none"
                                            >
                                                <AtlanIcon
                                                    icon="RemoveUser"
                                                    class="mr-1"
                                                ></AtlanIcon>
                                                Remove
                                            </a-button>
                                        </a-popconfirm>
                                    </a-tooltip>
                                </a-button-group>
                            </div>
                        </div>

                        <!--group-->
                        <div class="flex items-center" v-if="item.alias">
                            <div class="w-2/3">
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
                            <div class="w-1/3">
                                {{ item.memberCountString }}
                            </div>
                            <div class="w-1/3">
                                <a-button-group>
                                    <a-tooltip placement="top">
                                        <template #title>
                                            <span>Remove group</span>
                                        </template>
                                        <a-popconfirm
                                            placement="leftTop"
                                            overlay-class-name="popoverConfirm"
                                            :title="
                                                getPopoverContent(
                                                    group,
                                                    'remove',
                                                    'group'
                                                )
                                            "
                                            ok-text="Remove"
                                            :ok-type="'default'"
                                            cancel-text="Cancel"
                                            @confirm="
                                                confirmPopover(group, 'group')
                                            "
                                        >
                                            <a-button
                                                size="small"
                                                class="w-8 h-8 text-gray-500 border-none"
                                            >
                                                <AtlanIcon
                                                    icon="RemoveUser"
                                                    class="mr-1"
                                                ></AtlanIcon>
                                                Remove</a-button
                                            ></a-popconfirm
                                        >
                                    </a-tooltip>
                                </a-button-group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EmptyView
                v-else-if="!filteredList.length"
                empty-screen="NoResultIllustration"
                desc="sorry, we couldn’t find the user you were looking for"
            >
            </EmptyView>

            <!-- <div
                v-else-if="listType === 'groups' && groupsError"
                class="flex flex-col items-center h-full align-middle bg-white"
            >
                <ErrorView>
                    <div class="mt-3">
                        <a-button
                            size="large"
                            type="primary"
                            data-test-id="try-again"
                            ghost
                            @click="getGroupList()"
                        >
                            <fa icon="fal sync" class="mr-2"></fa>Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div> -->
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
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import EmptyView from '@common/empty/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import OwnersSelector from '@common/facet/owners/index.vue'

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from '../composables/usePersonaUsers'
    import usePersonaGroups from '../composables/usePersonaGroups'
    import usePersonaService from '../composables/usePersonaService'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import ErrorView from '@common/error/index.vue'
    import { reFetchList } from '../composables/usePersonaList'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import Pagination from '@/common/list/pagination.vue'
    import { useDebounceFn } from '@vueuse/core'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    import {
        isEditing,
        selectedPersonaDirty,
    } from '../composables/useEditPersona'
    import { IGroup, IUser } from '~/types/accessPolicies/personas'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            Avatar,
            AtlanBtn,
            SearchAndFilter,
            OwnersSelector,
            ErrorView,
            Pagination,
            EmptyView,
            AggregationTabs,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            console.log(persona, 'persona')
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
                userListAPIParams,
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

                    //return collated list
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
            const tabConfig = computed(() => {
                return [
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
                ]
            })
            const placeholder = computed(() => {
                if (listType.value !== 'all')
                    return `Search from ${
                        listType.value === 'users'
                            ? userList.value.length
                            : groupList.value.length
                    } ${listType.value}`
                else {
                    if (userList.value.length && groupList.value.length)
                        return `Search from ${userList.value.length} users and ${groupList.value.length} groups`
                    else if (userList.value.length)
                        return `Search from ${userList.value.length} users`
                    else if (groupList.value.length)
                        return `Search from ${groupList.value.length} groups`
                }
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
            ) => {
                return `Are you sure you want to ${action} ${
                    user?.name || user?.username || user?.email || ''
                }?`
            }

            const confirmPopover = (
                userOrGroup: any,
                type: 'user' | 'group'
            ) => {
                addUsersLoading.value = true

                // console.log(persona.value, 'persona')
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
                        addUsersLoading.value = false
                        message.error('Failed to add users')
                        console.log('Failed to add users', e)
                    })
            }

            /* Users related functions */
            const handleUsersTableChange = (
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
                    userListAPIParams.value.sort = sortValue
                }
                getUserList()
            }
            /* Group related functions */
            const handleGroupsTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                getGroupList()
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
                handleGroupsTableChange,
                showUserPreviewDrawer,
                userGroupData,
                groupColumns,
                groupList,
                /* Users */
                handleUsersTableChange,
                isGroupsLoading,
                isUsersLoading,
                usersError,
                groupsError,
            }
        },
    })
</script>
<style lang="less" scoped>
    .list-wrapper {
        max-height: calc(100vh - 30rem);
    }
</style>
