<template>
    <div class="pb-6 mt-1">
        <div class="mb-3">
            <SearchAndFilter
                v-model:value="queryText"
                placeholder="Search"
                :autofocus="true"
                @change="handleOwnerSearch"
                size="minimal"
            >
            </SearchAndFilter>
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
                                    :value="item.email"
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
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, toRefs, watch } from 'vue'
    import Users from '@common/selector/users/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { Collapse } from '~/types'
    import fetchUserList from '~/composables/user/fetchUserList'
    import { userInterface } from '~/types/users/user.interface'
    import whoami from '~/composables/user/whoami'
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'OwnersFilter',
        components: {
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
            const activeOwnerTabKey: Ref<'users'> = ref('users')
            const showMoreUsers = ref(true)
            const queryText = ref('')

            // own info
            const { username: myUsername } = whoami()

            console.log('propsValue', data.value.userValue)

            const handleUsersChange = () => {
                handleChange()
            }

            const handleChange = () => {
                // make no owners unchecked
                data.value.noOwnerAssigned = false

                emit('change')
            }
            const noOwnersToggle = () => {
                data.value.userValue = []
                emit('change')
            }

            const handleOwnerSearch = () => {
                handleUserSearch(queryText.value)
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

            function isOwner(username: string, owners: string[]) {
                return owners.includes(username)
            }

            const userList: Ref<userInterface[]> = ref([])
            watch(
                [listUsers],
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
                },
                {
                    immediate: true,
                }
            )

            function sortClassificationsByOrder(
                data: Ref<userInterface[]>,
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

            return {
                data,
                emptyScreen,
                queryText,
                noOwnersToggle,
                totalUsersCount,
                userOwnerState,
                STATES,
                myUsername,
                isOwner,
                onSelectUser,
                userList,
                handleOwnerSearch,
                activeOwnerTabKey,
                toggleShowMore,
                handleChange,
                handleUsersChange,
                showMoreUsers,
            }
        },
        mounted() {},
    })
</script>
