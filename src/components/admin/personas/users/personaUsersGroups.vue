<template>
    <div>
        <div class="flex items-center mb-6 gap-x-3">
            <SearchAndFilter
                v-model:value="queryText"
                class="bg-white w-80"
                :placeholder="placeholder"
            />
            <RaisedTab v-model:active="listType" :data="tabConfig" />

            <a-popover
                placement="left"
                v-model:visible="popoverVisible"
                trigger="click"
            >
                <AtlanBtn
                    color="light"
                    padding="compact"
                    class="ml-auto"
                    @click="() => setPopoverState(!popoverVisible)"
                    >Add users/Groups</AtlanBtn
                >
                <template #content>
                    <div
                        class="flex flex-col items-center py-1 bg-white rounded"
                        style="width: 260px"
                    >
                        <!-- <UserSelector
                            :no-owners-assigned="false"
                            :enableTabs="enableTabs"
                            :data="userGroupData"
                            @change="handleUsersChange"
                        /> -->
                        <div class="w-full mt-2">
                            <div class="flex justify-end text-xs">
                                <span
                                    v-if="userGroupData.userValue.length > 0"
                                    >{{
                                        `${userGroupData.userValue.length} user(s)`
                                    }}</span
                                >
                                <span
                                    v-if="
                                        userGroupData.userValue.length &&
                                        userGroupData.groupValue.length
                                    "
                                    >{{ `&nbsp;&` }}</span
                                >
                                <span
                                    v-if="userGroupData.groupValue.length > 0"
                                    >{{
                                        ` &nbsp;${userGroupData.groupValue.length} group(s)`
                                    }}</span
                                >
                                <span
                                    v-if="
                                        userGroupData.groupValue.length > 0 ||
                                        userGroupData.userValue.length > 0
                                    "
                                    >{{ `&nbsp;selected` }}</span
                                >
                            </div>
                            <div class="flex justify-between w-full mt-2">
                                <AtlanBtn
                                    size="sm"
                                    @click="() => setPopoverState(false)"
                                    color="secondary"
                                    padding="compact"
                                    class="w-26"
                                    style="width: 80px"
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
                                        class="w-4 h-4 animate-spin"
                                    ></AtlanIcon>
                                    <span>Add</span></AtlanBtn
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>
        <!-- USER TABLE START -->
        <a-table
            v-if="filteredList && listType === 'users'"
            id="userList"
            :key="persona.id"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :data-source="filteredList"
            :columns="userColumns"
            :row-key="(user) => user.id"
            :loading="
                [USER_STATES.PENDING].includes(userState) ||
                [USER_STATES.VALIDATING].includes(userState)
            "
            @change="handleUsersTableChange"
        >
            <template #name="{ text: user }">
                <div class="flex items-center align-middle">
                    <avatar
                        :image-url="imageUrl(user.username)"
                        :allow-upload="false"
                        :avatar-name="
                            user.name ||
                            user.username ||
                            user.email ||
                            user.first_name + user.last_name
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
                        <span class="text-primary">{{ user.name || '-' }}</span>
                        <p class="mb-0 truncate text-gray">
                            @{{ user.username || '-' }}
                        </p>
                    </div>
                </div>
            </template>
            <template #role="{ text: user }">
                <div
                    class="
                        inline-flex
                        items-center
                        px-2
                        py-0.5
                        rounded
                        text-gray-500
                    "
                >
                    <div>{{ user.role_object.name || '-' }}</div>
                </div>
            </template>
            <template #actions="{ text: user }">
                <a-button-group>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Remove User</span>
                        </template>
                        <a-popconfirm
                            placement="leftTop"
                            :title="getPopoverContent(user, 'remove', 'user')"
                            ok-text="Yes"
                            :ok-type="'default'"
                            cancel-text="Cancel"
                            @confirm="confirmPopover(user, 'user')"
                        >
                            <a-button
                                size="small"
                                class="mr-3.5 w-8 h-8 rounded"
                            >
                                <AtlanIcon icon="Delete"></AtlanIcon> </a-button
                        ></a-popconfirm>
                    </a-tooltip>
                </a-button-group>
            </template>
        </a-table>
        <div
            v-if="
                [USER_STATES.ERROR, USER_STATES.STALE_IF_ERROR].includes(
                    userState
                )
            "
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
                                listType === 'users'
                                    ? getUserList()
                                    : getGroupsList()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>

        <!-- USER TABLE END -->
        <a-table
            v-if="filteredList && listType === 'groups'"
            id="groupList"
            :key="persona.id"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :data-source="filteredList"
            :columns="groupColumns"
            :row-key="(group) => group.id"
            :loading="
                [GROUP_STATES.PENDING].includes(groupState) ||
                [GROUP_STATES.VALIDATING].includes(groupState)
            "
            @change="handleGroupsTableChange"
        >
            <template #group="{ text: group }">
                <div class="flex items-center align-middle">
                    <avatar
                        :image-url="imageUrl(group.alias)"
                        :allow-upload="false"
                        :avatar-name="group.alias"
                        :avatar-size="40"
                        class="mr-2"
                    />
                    <div
                        class="truncate cursor-pointer"
                        @click="
                            () => {
                                showGroupPreviewDrawer(group)
                            }
                        "
                    >
                        <span class="text-primary">{{
                            group.alias || '-'
                        }}</span>
                        <p class="mb-0 truncate text-gray">
                            @{{ group.alias || '-' }}
                        </p>
                    </div>
                </div>
            </template>

            <template #actions="{ text: group }">
                <a-button-group>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Remove group</span>
                        </template>
                        <a-popconfirm
                            placement="leftTop"
                            :title="getPopoverContent(group, 'remove', 'group')"
                            ok-text="Yes"
                            :ok-type="'default'"
                            cancel-text="Cancel"
                            @confirm="confirmPopover(group, 'group')"
                        >
                            <a-button
                                size="small"
                                class="mr-3.5 w-8 h-8 rounded"
                            >
                                <AtlanIcon icon="Delete"></AtlanIcon> </a-button
                        ></a-popconfirm>
                    </a-tooltip>
                </a-button-group>
            </template>
        </a-table>
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

    import AtlanBtn from '@/UI/button.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    // import UserSelector from '@/common/facets/owners.vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from '../composables/usePersonaUsers'
    import usePersonaGroups from '../composables/usePersonaGroups'
    import usePersonaService from '../composables/usePersonaService'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import { useGroupPreview } from '~/composables/drawer/showGroupPreview'

    // import {
    //     isEditing,
    //     selectedPersonaDirty,
    // } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            Avatar,
            AtlanBtn,
            RaisedTab,
            SearchAndFilter,
            // UserSelector,
        },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            console.log(persona, 'persona')
            const listType: Ref<'users' | 'groups'> = ref('users')
            const enableTabs = computed(() => [listType.value])

            const tabConfig = [
                { key: 'users', label: 'Users' },
                { key: 'groups', label: 'Groups' },
            ]

            const queryText = ref('')
            const popoverVisible = ref(false)
            const addUsersLoading = ref(false)
            const selectedUsernameToUserMap: Ref<Record<string, Object>> = ref(
                {}
            )
            const selectedGroupnameToGroupMap: Ref<Record<string, Object>> =
                ref({})

            const { usePersonaUserList, userColumns } = usePersonaUsers
            const { usePersonaGroupList, groupColumns } = usePersonaGroups
            const { updateUsers } = usePersonaService()
            const {
                getUserList,
                userListAPIParams,
                STATES: USER_STATES,
                state: userState,
                userList,
            } = usePersonaUserList(persona)
            const {
                getGroupsList,
                STATES: GROUP_STATES,
                state: groupState,
                groupList,
                groupListError,
            } = usePersonaGroupList(persona)

            const filteredList = computed(() => {
                const qry = queryText.value
                if (listType.value === 'users') {
                    if (queryText.value)
                        return userList.value.filter(
                            (usr) =>
                                usr.email?.toLowerCase().includes(qry) ||
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

            const placeholder = computed(
                () =>
                    `Search ${
                        listType.value === 'users'
                            ? userList.value.length
                            : groupList.value.length
                    } ${listType.value}`
            )

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                showUserPreview()
            }

            whenever(groupListError.value, () => {
                message.error('Failed to get groups')
                console.error(groupListError.value)
            })

            // const userGroupData = computed({
            //     get: () => ({
            //         userValue: selectedPersonaDirty.value!.users,
            //         groupValue: selectedPersonaDirty.value!.groups,
            //     }),
            //     set: (val) => {
            //         console.log(val, 'value')
            //         selectedPersonaDirty.value!.users = val.userValue
            //         selectedPersonaDirty.value!.groups = val.groupValue
            //     },
            // })

            const getIds = (users: Object) => {
                let res: string[] = []
                let k = Object.keys(users)
                k.forEach((e) => {
                    res.push(users[e].id as string)
                })
                return res
            }

            const handleUpdate = () => {
                if (persona.value?.id) {
                    addUsersLoading.value = true
                    const userIds = getIds(selectedUsernameToUserMap.value)
                    const groupIds = getIds(selectedGroupnameToGroupMap.value)
                    updateUsers({
                        id: persona.value.id,
                        users: userIds,
                        groups: groupIds,
                    })
                        .then(() => {
                            addUsersLoading.value = false
                            popoverVisible.value = false
                            getUserList()
                            getGroupsList()
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
                userValue: string[]
                groupValue: string[]
            }> = ref({
                userValue: persona.value.users ?? [],
                groupValue: persona.value.groups ?? [],
            })

            const insertUserstoMap = (
                usernames: string[],
                usersList: any[]
            ) => {
                usernames.forEach((username: string) => {
                    usersList.forEach((e: any) => {
                        if (e.username === username) {
                            selectedUsernameToUserMap.value[username] = e
                        }
                    })
                })
            }
            const insertGroupstoMap = (
                groupnames: string[],
                usersList: any[]
            ) => {
                groupnames.forEach((groupname: string) => {
                    usersList.forEach((e: any) => {
                        if (e.name === groupname) {
                            selectedGroupnameToGroupMap.value[groupname] = e
                        }
                    })
                })
            }

            const getPopoverContent = (
                user: any,
                action: 'remove',
                type: 'user' | 'group'
            ) => {
                return `Are you sure you want to ${action} ${
                    user.name || user.username || user.email || ''
                }?`
            }

            const getUsersFromUsername = (usernames: string[]) => {
                let res: Object[] = []
                usernames.forEach((username) => {
                    userList.value.forEach((e) => {
                        if (e.username === username) res.push(e)
                    })
                })
                return res
            }
            const getGroupsFromGroupname = (aliases: string[]) => {
                let res: Object[] = []
                aliases.forEach((alias) => {
                    groupList.value.forEach((e) => {
                        if (e.alias === alias) res.push(e)
                    })
                })
                return res
            }

            const confirmPopover = (
                userOrGroup: any,
                type: 'user' | 'group'
            ) => {
                addUsersLoading.value = true
                let users = getUsersFromUsername(persona.value.users ?? [])
                let groups = getGroupsFromGroupname(persona.value.groups ?? [])

                // console.log(persona.value, 'persona')

                if (type === 'user') {
                    users = users.filter((user) => user.id !== userOrGroup.id)
                } else {
                    groups = groups.filter(
                        (group) => group.id !== userOrGroup.id
                    )
                }
                const usernames = users.map((user) => user.username)
                persona.value.users = usernames
                const groupaliases = groups.map((group) => group.alias)
                persona.value.groups = groupaliases
                let userIds = users.map((user) => user.id)
                let groupIds = groups.map((group) => group.id)

                updateUsers({
                    id: persona.value.id,
                    users: userIds,
                    groups: groupIds,
                })
                    .then(() => {
                        addUsersLoading.value = false
                        userGroupData.value.userValue = usernames
                        userGroupData.value.groupValue = groupaliases
                        getUserList()
                        getGroupsList()
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

            const handleUsersChange = (data: {
                usersList: string[]
                groupsList: string[]
            }) => {
                insertUserstoMap(userGroupData.value.userValue, data.usersList)
                persona.value.users = userGroupData.value.userValue

                insertGroupstoMap(
                    userGroupData.value.groupValue,
                    data.groupsList
                )
                persona.value.groups = userGroupData.value.groupValue
            }
            /* Users related functions */
            const handleUsersTableChange = (
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
                getGroupsList()
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

            return {
                showGroupPreviewDrawer,
                getGroupsList,
                getUserList,
                USER_STATES,
                userState,
                enableTabs,
                getPopoverContent,
                confirmPopover,
                groupState,
                GROUP_STATES,
                handleUsersChange,
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
                /* Users */
                handleUsersTableChange,
            }
        },
    })
</script>
