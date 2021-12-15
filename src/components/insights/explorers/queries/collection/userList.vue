<template>
    <div class="relative">
        <div class="flex flex-row justify-between">
            <div class="flex items-center gap-x-3" :class="userListHeaderClass">
                <a-popover
                    trigger="click"
                    placement="bottomLeft"
                    v-model:visible="popoverVisible"
                >
                    <div class="flex w-full item-center">
                        <SearchAndFilter
                            v-model:value="searchText"
                            placeholder="Search users"
                            class="w-full h-8 mt-2 border border-l-0 border-gray-300 rounded-lg rounded-r-none"
                            size="minimal"
                            @change="handleSearch"
                            @focus="showPopover(true)"
                        />
                        <!-- <slot name="dropdown"></slot> -->
                    </div>

                    <template #content>
                        <a-tabs
                            v-model:activeKey="type"
                            size="small"
                            :class="$style.tabBar"
                        >
                            <a-tab-pane key="users" tab="Users">
                                <div
                                    v-if="userError"
                                    class="flex flex-col items-center h-full align-middle bg-white"
                                >
                                    <ErrorView>
                                        <div>
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
                                <template v-else>
                                    <div class="px-4 pb-2">
                                        <div
                                            class="overflow-auto"
                                            style="width: 449px"
                                        >
                                            <div
                                                class="flex flex-col w-full"
                                                :style="userListStyle"
                                            >
                                                <template
                                                    v-for="user in userList"
                                                    :key="user.id"
                                                >
                                                    <a-checkbox
                                                        :checked="
                                                            userMap[
                                                                user.username
                                                            ]
                                                        "
                                                        class="inline-flex flex-row-reverse items-center w-full py-2 pr-4 border-b border-gray-100"
                                                        @change="
                                                            (event) =>
                                                                handleChange(
                                                                    event,
                                                                    {
                                                                        ...user,
                                                                        type: 'users',
                                                                    }
                                                                )
                                                        "
                                                        :class="
                                                            $style.atlanReverse
                                                        "
                                                    >
                                                        <UserCard
                                                            :user="user"
                                                            class="pl-0"
                                                        />
                                                    </a-checkbox>
                                                </template>
                                            </div>
                                        </div>
                                        <div
                                            v-if="showLoadMore"
                                            class="flex justify-center w-full mt-3"
                                        >
                                            <AtlanButton
                                                color="secondary"
                                                padding="compact"
                                                size="sm"
                                                @click="handleLoadMore"
                                                class="w-20"
                                            >
                                                <AtlanIcon
                                                    v-if="userIsLoading"
                                                    icon="Loader"
                                                    class="h-3 animate-spin"
                                                />
                                                <span v-else> load more </span>
                                            </AtlanButton>
                                        </div>
                                    </div>
                                </template>
                            </a-tab-pane>
                            <a-tab-pane key="groups" tab="Groups">
                                <div
                                    v-if="groupError"
                                    class="flex flex-col items-center h-full align-middle bg-white"
                                >
                                    <ErrorView>
                                        <div>
                                            <AtlanButton
                                                color="secondary"
                                                @click="
                                                    () => {
                                                        getGroupList()
                                                    }
                                                "
                                            >
                                                <AtlanIcon icon="Reload" />
                                                Try again
                                            </AtlanButton>
                                        </div>
                                    </ErrorView>
                                </div>
                                <template v-else>
                                    <div class="px-4 pb-2">
                                        <div
                                            class="overflow-auto"
                                            style="width: 449px"
                                        >
                                            <div
                                                class="flex flex-col w-full"
                                                :style="userListStyle"
                                            >
                                                <template
                                                    v-for="group in groupList"
                                                    :key="group.id"
                                                >
                                                    <a-checkbox
                                                        :checked="
                                                            groupMap[
                                                                group.alias
                                                            ]
                                                        "
                                                        class="inline-flex flex-row-reverse items-center w-full py-2 pr-4 border-b border-gray-100"
                                                        @change="
                                                            (event) =>
                                                                handleChange(
                                                                    event,
                                                                    {
                                                                        ...group,
                                                                        type: 'groups',
                                                                    }
                                                                )
                                                        "
                                                        :class="
                                                            $style.atlanReverse
                                                        "
                                                    >
                                                        <GroupCard
                                                            :group="group"
                                                            class="pl-0"
                                                        />
                                                    </a-checkbox>
                                                </template>
                                            </div>
                                        </div>
                                        <div
                                            v-if="showLoadMore"
                                            class="flex justify-center w-full mt-3"
                                        >
                                            <AtlanButton
                                                color="secondary"
                                                padding="compact"
                                                size="sm"
                                                @click="handleLoadMore"
                                                class="w-20"
                                            >
                                                <AtlanIcon
                                                    v-if="groupIsLoading"
                                                    icon="Loader"
                                                    class="h-3 animate-spin"
                                                />
                                                <span v-else> load more </span>
                                            </AtlanButton>
                                        </div>
                                    </div>
                                </template>
                            </a-tab-pane>
                        </a-tabs>
                    </template>
                </a-popover>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed, PropType } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import { useUsers } from '~/composables/user/useUsers'
    import useGroups from '~/composables/group/useGroups'

    import AtlanButton from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import UserCard from '~/components/admin/groups/common/userCard.vue'
    import GroupCard from '~/components/admin/groups/common/groupCard.vue'

    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'UsersList',
        components: {
            UserCard,
            GroupCard,
            ErrorView,
            AtlanButton,
            SearchAndFilter,
        },
        props: {
            addMemberLoading: {
                type: Boolean,
                default: false,
            },
            minimal: {
                type: Boolean,
                default: false,
            },
            showHeaderButtons: {
                type: Boolean,
                default: false,
            },
            userListHeaderClass: {
                type: String,
                default: '',
            },
            userListStyle: {
                type: Object,
                default: () => {},
            },
            selectedUsers: {
                type: Array,
                required: true,
            },
            selectedUsersData: {
                type: Array,
                required: true,
            },
            selectedGroups: {
                type: Array,
                required: true,
            },
            selectedGroupsData: {
                type: Array,
                required: true,
            },
        },

        setup(props, context) {
            const {
                selectedUsers,
                selectedUsersData,
                selectedGroups,
                selectedGroupsData,
            } = useVModels(props)
            const selectedIds = ref([])
            const searchText = ref('')
            const userListAPIParams: any = reactive({
                limit: 10,
                offset: 0,
                sort: 'firstName',
                filter: {
                    $and: [
                        {
                            emailVerified: true,
                        },
                    ],
                },
            })

            const {
                usersListConcatenated: userList,
                filteredUserCount,
                getUserList,
                isLoading: userIsLoading,
                error: userError,
            } = useUsers(userListAPIParams, 'LIST_ALL_USERS')

            const groupListAPIParams: any = reactive({
                limit: 10,
                offset: 0,
                filter: {},
                sort: '-createdAt',
            })

            const {
                groupList,
                filteredGroupsCount,
                getGroupList,
                error: groupError,
                isLoading: groupIsLoading,
            } = useGroups(groupListAPIParams)

            let type = ref('users')

            const handleSearch = useDebounceFn(() => {
                if (type.value === 'users') {
                    userListAPIParams.filter = {
                        $and: [
                            { emailVerified: true },
                            {
                                $or: [
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
                                ],
                            },
                        ],
                    }
                    userListAPIParams.offset = 0
                    getUserList()
                } else {
                    groupListAPIParams.filter = {
                        $or: [
                            { name: { $ilike: `%${searchText.value}%` } },
                            {
                                attributes: {
                                    $elemMatch: {
                                        alias: {
                                            $ilike: `%${searchText.value}%`,
                                        },
                                    },
                                },
                            },
                        ],
                    }
                    groupListAPIParams.offset = 0
                    getGroupList()
                }
            }, 200)

            const handleLoadMore = () => {
                if (type.value === 'users') {
                    userListAPIParams.offset += userListAPIParams.limit
                    getUserList()
                } else {
                    groupListAPIParams.offset += groupListAPIParams.limit
                    getGroupList()
                }
            }

            const showLoadMore = computed(() => {
                if (type.value === 'users') {
                    return getIsLoadMore(
                        userList.value.length,
                        userListAPIParams.offset,
                        userListAPIParams.limit,
                        filteredUserCount.value
                    )
                } else {
                    return getIsLoadMore(
                        groupList.value.length,
                        groupListAPIParams.offset,
                        groupListAPIParams.limit,
                        filteredGroupsCount.value // filtered value because we are filtering users in the getUsers API call and getting only the users that have emailVerified as true.
                    )
                }
            })

            // const selectedUsers = ref([])
            // const selectedUsersData = ref([])
            // const selectedGroups = ref([])
            // const selectedGroupsData = ref([])

            const userMap = computed(() => {
                let data = {}
                selectedUsers.value.forEach((selectedItem) => {
                    data[selectedItem] = true
                })

                return data
            })

            const groupMap = computed(() => {
                let data = {}
                selectedGroups.value.forEach((selectedItem) => {
                    data[selectedItem] = true
                })

                return data
            })

            // selectedUsers.value.forEach((selectedItem) => {
            //     userMap.value[selectedItem] = true
            // })

            // selectedGroups.value.forEach((selectedItem) => {
            //     groupMap.value[selectedItem] = true
            // })

            const handleChange = (event, item) => {
                if (item.type === 'users') {
                    if (event.target.checked) {
                        userMap.value[item.username] = true
                    } else {
                        delete userMap.value[item.username]
                    }

                    selectedUsers.value = [...Object.keys(userMap.value)]

                    let users = []
                    Object.keys(userMap.value).forEach((user) => {
                        let x = userList.value.find((el) => {
                            return el.username === user
                        })
                        users.push(x)
                    })

                    selectedUsersData.value = [...users]
                } else {
                    if (event.target.checked) {
                        groupMap.value[item.alias] = true
                    } else {
                        delete groupMap.value[item.alias]
                    }
                    selectedGroups.value = [...Object.keys(groupMap.value)]

                    let groups = []
                    Object.keys(groupMap.value).forEach((group) => {
                        let x = groupList.value.find((el) => {
                            return el.alias === group
                        })
                        groups.push(x)
                    })

                    selectedGroupsData.value = [...groups]
                }

                console.log('data: ', {
                    users: selectedUsers.value,
                    grps: selectedGroups.value,
                    userData: selectedUsersData.value,
                    grpData: selectedGroupsData.value,
                })
                // console.log('event: ', event)
            }

            const popoverVisible = ref(false)
            const showPopover = (val) => {
                popoverVisible.value = val
            }

            const setType = (typeName) => {
                type.value = typeName
            }

            return {
                searchText,
                showLoadMore,
                userList,
                filteredUserCount,
                getUserList,
                handleSearch,
                userIsLoading,
                userError,
                groupIsLoading,
                groupError,
                handleLoadMore,
                handleChange,
                selectedIds,
                popoverVisible,
                showPopover,
                type,
                setType,
                groupList,
                getGroupList,
                userMap,
                groupMap,
            }
        },
    })
</script>

<style lang="less" scoped></style>
<style lang="less" module>
    .tabBar {
        :global(.ant-tabs-nav-list) {
            margin-left: 16px !important;
        }
    }
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
