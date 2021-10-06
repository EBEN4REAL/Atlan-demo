<template>
    <div class="px-4 pb-6 mt-1">
        <div class="flex items-center justify-between mb-3">
            <SearchAndFilter
                v-model:value="queryText"
                placeholder="Search"
                :autofocus="true"
                @change="handleOwnerSearch"
            >
            </SearchAndFilter>
            <a-button-group>
                <a-button
                    @click="setActiveTab('users')"
                    :class="activeOwnerTabKey === 'users' ? 'text-primary' : ''"
                >
                    <template #icon
                        ><AtlanIcon icon="User" class="mx-auto"
                    /></template>
                </a-button>
                <a-button
                    @click="setActiveTab('groups')"
                    :class="
                        activeOwnerTabKey === 'groups' ? 'text-primary' : ''
                    "
                    ><template #icon
                        ><AtlanIcon
                            icon="GroupStatic"
                            class="mx-auto" /></template
                ></a-button>
            </a-button-group>
        </div>
        <div class="relative w-full">
            <template v-if="activeOwnerTabKey === 'users'">
                <div class="w-full overflow-y-auto h-44">
                    <div
                        v-if="
                            STATES.SUCCESS === userOwnerState &&
                            userList.length < 1
                        "
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center">
                            <img
                                :src="emptyScreen"
                                alt="No logs"
                                class="w-2/5 m-auto mb-4"
                            />
                            <span class="text-gray-500">No Users Found</span>
                        </div>
                    </div>
                    <div
                        v-if="STATES.SUCCESS === userOwnerState"
                        class="flex flex-col w-full"
                    >
                        <a-checkbox-group
                            v-model:value="data.userValue"
                            class="w-full"
                            @change="handleUsersChange"
                        >
                            <template
                                v-for="item in userList"
                                :key="item.username"
                            >
                                <a-checkbox
                                    v-if="item.username"
                                    :value="item.username"
                                    class="w-full mb-3"
                                >
                                    <div
                                        v-if="item.username === myUsername"
                                        class="inline-flex capitalize"
                                    >
                                        {{ item.username }}

                                        <span class="font-bold">
                                            {{ '&nbsp;(me)' }}
                                        </span>
                                    </div>
                                    <span v-else class="capitalize">
                                        {{ item.username }}
                                    </span>
                                </a-checkbox>
                            </template>
                        </a-checkbox-group>
                    </div>
                    <div v-else class="flex items-center justify-center mt-3">
                        <a-spin size="small" class="mr-2 leading-none"></a-spin
                        ><span>Fetching users</span>
                    </div>
                </div>
                <div
                    v-if="
                        totalUsersCount - userList.length > 0 &&
                        queryText.length < 1
                    "
                    class="mt-2"
                >
                    <div
                        v-if="
                            STATES.SUCCESS === userOwnerState && showMoreUsers
                        "
                        class="flex items-center w-auto mb-0 font-bold text-center cursor-pointer select-none  outlined text-primary"
                        @click="toggleShowMore"
                    >
                        {{ `Show ${totalUsersCount - userList.length} more` }}
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="overflow-y-auto h-44">
                    <div
                        v-if="
                            STATES.SUCCESS === groupOwnerState &&
                            groupList.length < 1
                        "
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center">
                            <img
                                :src="emptyScreen"
                                alt="No logs"
                                class="w-2/5 m-auto mb-4"
                            />
                            <span class="text-gray-500">No Groups Found</span>
                        </div>
                    </div>
                    <a-checkbox-group
                        v-if="STATES.SUCCESS === groupOwnerState"
                        v-model:value="data.groupValue"
                        @change="handleGroupsChange"
                    >
                        <div class="flex flex-col w-full">
                            <a-checkbox
                                v-for="item in groupList"
                                :key="item.name"
                                :value="item.name"
                                class="mb-3 capitalize"
                            >
                                {{ item.name }}
                            </a-checkbox>
                        </div>
                    </a-checkbox-group>
                    <div v-else class="flex items-center justify-center">
                        <a-spin size="small" class="mr-2 leading-none"></a-spin
                        ><span>Fetching groups</span>
                    </div>
                </div>
                <div
                    v-if="
                        totalGroupCount - groupList.length > 0 &&
                        queryText.length < 1
                    "
                    class="mt-3"
                >
                    <div
                        v-if="
                            GROUPSTATES.SUCCESS === groupOwnerState &&
                            showMoreGroups
                        "
                        class="flex items-center w-auto mb-3 font-bold text-center cursor-pointer select-none  outlined text-primary"
                        @click="toggleShowMoreGroups"
                    >
                        {{ `Show ${totalGroupCount - groupList.length} more` }}
                    </div>
                </div>
            </template>

            <div>
                <a-checkbox
                    v-model:checked="data.noOwnerAssigned"
                    class="w-full py-3 border-t"
                    @change="noOwnersToggle"
                >
                    No Owners assigned
                </a-checkbox>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, toRefs, watch } from 'vue'
    import Groups from '@common/selector/groups/index.vue'
    import Users from '@common/selector/users/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { Collapse } from '~/types'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import { userInterface } from '~/types/users/user.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import whoami from '~/composables/user/whoami'
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'OwnersFilter',
        components: {
            Groups,
            Users,
            SearchAndFilter,
        },
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const activeOwnerTabKey: Ref<'users' | 'groups'> = ref('users')
            const showMoreUsers = ref(true)
            const showMoreGroups = ref(true)
            const queryText = ref('')

            // own info
            const { username: myUsername } = whoami()

            console.log(
                'propsValue',
                data.value.userValue,
                data.value.groupValue
            )

            const handleUsersChange = () => {
                handleChange()
            }

            const handleGroupsChange = () => {
                handleChange()
            }
            const handleChange = () => {
                // make no owners unchecked
                data.value.noOwnerAssigned = false

                emit('change')
            }
            const noOwnersToggle = () => {
                data.value.userValue = []
                data.value.groupValue = []

                emit('change')
            }

            const handleOwnerSearch = () => {
                if (activeOwnerTabKey.value === 'users') {
                    handleUserSearch(queryText.value)
                } else if (activeOwnerTabKey.value === 'groups') {
                    // for groups
                    handleGroupSearch(queryText.value)
                }
            }

            function setActiveTab(tabName: 'users' | 'groups') {
                activeOwnerTabKey.value = tabName
                if (queryText.value !== '') handleOwnerSearch()
            }

            const {
                list: listUsers,
                total: totalUsersCount,
                state: userOwnerState,
                STATES,
                mutate: mutateUsers,
                setLimit,
                handleSearch: handleUserSearch,
            } = fetchUserList()

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
                STATES: GROUPSTATES,
                state: groupOwnerState,
                mutate: mutateGroups,
                setLimit: setGroupLimit,
            } = fetchGroupList()
            const onSelectUser = (user: userInterface) => {
                // unselect if already selected
                if (data.value.userValue.includes(user.username)) {
                    const index = data.value.userValue.indexOf(user.username)
                    if (index > -1) {
                        data.value.userValue.splice(index, 1)
                    }
                } else {
                    data.value.userValue.push(user.username)
                }
            }
            const onSelectGroup = (group: groupInterface) => {
                // unselect if already selected
                if (data.value.groupValue.includes(group.name)) {
                    const index = data.value.groupValue.indexOf(group.name)
                    if (index > -1) {
                        data.value.groupValue.splice(index, 1)
                    }
                } else {
                    data.value.groupValue.push(group.name)
                }
            }
            function isOwner(username: string, owners: string[]) {
                return owners.includes(username)
            }

            const userList: Ref<userInterface[]> = ref([])
            const groupList: Ref<groupInterface[]> = ref([])
            watch(
                [listUsers, listGroups],
                () => {
                    userList.value = sortClassificationsByOrder(
                        listUsers,
                        'username'
                    )
                    // removing own username from list
                    let ownUserObj: userInterface = {}
                    userList.value = userList.value.filter((user) => {
                        if (user.username === myUsername.value) {
                            ownUserObj = user
                        }
                        return user.username !== myUsername.value
                    })
                    if (Object.keys(ownUserObj).length > 0) {
                        userList.value = [ownUserObj, ...userList.value]
                    } else {
                        userList.value = [...userList.value]
                    }
                    groupList.value = sortClassificationsByOrder(
                        listGroups,
                        'name'
                    )
                },
                {
                    immediate: true,
                }
            )

            function sortClassificationsByOrder(
                data: Ref<userInterface[] | groupInterface[]>,
                key: string
            ) {
                let modifiedData: userInterface[] = []
                if (data?.value) {
                    modifiedData = data.value.sort((dataA, dataB) => {
                        const a = dataA[key].toLowerCase()
                        const b = dataB[key].toLowerCase()
                        if (a < b) {
                            return -1
                        }
                        if (a > b) {
                            return 1
                        }
                        return 0
                    })
                }
                return modifiedData
            }
            function toggleShowMore() {
                showMoreUsers.value = !showMoreUsers.value
                setLimit(totalUsersCount.value)
                mutateUsers()
            }

            function toggleShowMoreGroups() {
                showMoreGroups.value = !showMoreGroups.value
                setGroupLimit(totalGroupCount.value)
                mutateGroups()
            }

            return {
                data,
                emptyScreen,
                queryText,
                noOwnersToggle,
                totalUsersCount,
                totalGroupCount,
                userOwnerState,
                groupOwnerState,
                STATES,
                GROUPSTATES,
                myUsername,
                showMoreGroups,
                onSelectGroup,
                isOwner,
                onSelectUser,
                userList,
                groupList,
                handleOwnerSearch,
                activeOwnerTabKey,
                toggleShowMoreGroups,
                toggleShowMore,
                handleChange,
                handleUsersChange,
                handleGroupsChange,
                showMoreUsers,
                setActiveTab,
            }
        },
        mounted() {},
    })
</script>
