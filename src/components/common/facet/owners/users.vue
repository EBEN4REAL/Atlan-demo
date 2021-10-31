<template>
    <div class="w-full overflow-y-auto h-44">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <!-- <img
                    :src="emptyScreen"
                    alt="No logs"
                    class="w-2/5 m-auto mb-4"
                /> -->
                <span class="text-gray-500">No Users Found</span>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <a-checkbox-group class="w-full px-4">
                <template v-for="item in userList" :key="item.username">
                    <a-checkbox
                        :value="item.username"
                        class="inline-flex flex-row-reverse items-center w-full mb-3  atlan-reverse"
                    >
                        <div class="flex items-center">
                            <!-- <Avatar
                                :avatarName="fullName(item)"
                                avatarShape="circle"
                                class="mr-1"
                                avatarSize="12"
                            ></Avatar> -->
                            <div class="flex flex-col">
                                <div
                                    class="mb-1 text-sm leading-none capitalize  text-gray"
                                >
                                    {{ fullName(item) }}
                                    <span
                                        class="text-sm text-gray-500"
                                        v-if="item.username === username"
                                    >
                                        (me)
                                    </span>
                                </div>
                                <!-- <div class="text-xs leading-none text-gray-500">
                                    {{ item.username }}
                                </div> -->
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </a-checkbox-group>
        </div>

        <!-- <div v-else class="flex items-center justify-center mt-3">
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Fetching users</span>
        </div> -->
    </div>
    <!-- <div
        v-if="totalUsersCount - userList.length > 0 && queryText.length < 1"
        class="mt-2"
    >
        <div
            v-if="STATES.SUCCESS === userOwnerState && showMoreUsers"
            class="flex items-center w-auto mb-0 font-bold text-center cursor-pointer select-none outlined text-primary"
            @click="toggleShowMore"
        >
            {{ `Show ${totalUsersCount - userList.length} more` }}
        </div>
    </div> -->
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, watch, computed } from 'vue'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import Avatar from '@common/avatar/index.vue'
    import useUserData from '~/composables/user/useUserData'

    // import Groups from '@common/selector/groups/index.vue'
    // import Users from '@common/selector/users/index.vue'

    // import { Collapse } from '~/types'

    // import { userInterface } from '~/types/users/user.interface'
    // import { groupInterface } from '~/types/groups/group.interface'
    // import useUserData from '~/services2/service/composable/useUserData'
    // import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'OwnersFilter',
        components: { Avatar },
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => {
                    return ''
                },
            },
        },
        setup(props, { emit }) {
            const { list, handleSearch } = useFacetUsers()
            const { username, firstName, lastName } = useUserData()

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )

            const userList = computed(() => {
                if (props.queryText !== '') {
                    return [...list.value]
                }

                const tempList = list.value.filter(
                    (obj) => obj.username !== username
                )

                return [
                    {
                        username,
                        first_name: firstName,
                        last_name: lastName,
                    },
                    ...tempList,
                ]
            })

            const fullName = (item) => {
                if (item.first_name) {
                    return `${item.first_name} ${item.last_name || ''}`
                }

                return `${item.username}`
            }

            const avatarUrl = (item) => {
                return `${window.location.origin}/api/services/avatar/${item.username}`
            }

            // const { data } = toRefs(props)
            // const activeOwnerTabKey: Ref<'users' | 'groups'> = ref('users')
            // const showMoreUsers = ref(true)
            // const showMoreGroups = ref(true)
            // const queryText = ref('')
            // // own info
            // const { username: myUsername } = useUserData()
            // console.log(
            //     'propsValue',
            //     data.value.userValue,
            //     data.value.groupValue
            // )
            // const handleUsersChange = () => {
            //     handleChange()
            // }
            // const handleGroupsChange = () => {
            //     handleChange()
            // }
            // const handleChange = () => {
            //     // make no owners unchecked
            //     data.value.noOwnerAssigned = false
            //     emit('change')
            // }
            // const noOwnersToggle = () => {
            //     data.value.userValue = []
            //     data.value.groupValue = []
            //     emit('change')
            // }
            // const handleOwnerSearch = () => {
            //     if (activeOwnerTabKey.value === 'users') {
            //         handleUserSearch(queryText.value)
            //     } else if (activeOwnerTabKey.value === 'groups') {
            //         // for groups
            //         handleGroupSearch(queryText.value)
            //     }
            // }
            // function setActiveTab(tabName: 'users' | 'groups') {
            //     activeOwnerTabKey.value = tabName
            //     if (queryText.value !== '') handleOwnerSearch()
            // }

            // const onSelectUser = (user: userInterface) => {
            //     // unselect if already selected
            //     if (data.value.userValue.includes(user.username)) {
            //         const index = data.value.userValue.indexOf(user.username)
            //         if (index > -1) {
            //             data.value.userValue.splice(index, 1)
            //         }
            //     } else {
            //         data.value.userValue.push(user.username)
            //     }
            // }
            // const onSelectGroup = (group: groupInterface) => {
            //     // unselect if already selected
            //     if (data.value.groupValue.includes(group.name)) {
            //         const index = data.value.groupValue.indexOf(group.name)
            //         if (index > -1) {
            //             data.value.groupValue.splice(index, 1)
            //         }
            //     } else {
            //         data.value.groupValue.push(group.name)
            //     }
            // }
            // function isOwner(username: string, owners: string[]) {
            //     return owners.includes(username)
            // }
            // const userList: Ref<userInterface[]> = ref([])
            // const groupList: Ref<groupInterface[]> = ref([])
            // watch(
            //     [listUsers, listGroups],
            //     () => {
            //         userList.value = sortClassificationsByOrder(
            //             listUsers,
            //             'username'
            //         )
            //         // removing own username from list
            //         let ownUserObj: userInterface = {}
            //         userList.value = userList.value.filter((user) => {
            //             if (user.username === myUsername.value) {
            //                 ownUserObj = user
            //             }
            //             return user.username !== myUsername.value
            //         })
            //         if (Object.keys(ownUserObj).length > 0) {
            //             userList.value = [ownUserObj, ...userList.value]
            //         } else {
            //             userList.value = [...userList.value]
            //         }
            //         groupList.value = sortClassificationsByOrder(
            //             listGroups,
            //             'name'
            //         )
            //     },
            //     {
            //         immediate: true,
            //     }
            // )
            // function sortClassificationsByOrder(
            //     data: Ref<userInterface[] | groupInterface[]>,
            //     key: string
            // ) {
            //     let modifiedData: userInterface[] = []
            //     if (data?.value) {
            //         modifiedData = data.value.sort((dataA, dataB) => {
            //             const a = dataA[key].toLowerCase()
            //             const b = dataB[key].toLowerCase()
            //             if (a < b) {
            //                 return -1
            //             }
            //             if (a > b) {
            //                 return 1
            //             }
            //             return 0
            //         })
            //     }
            //     return modifiedData
            // }
            // function toggleShowMore() {
            //     showMoreUsers.value = !showMoreUsers.value
            //     setLimit(totalUsersCount.value)
            //     mutateUsers()
            // }
            // function toggleShowMoreGroups() {
            //     showMoreGroups.value = !showMoreGroups.value
            //     setGroupLimit(totalGroupCount.value)
            //     mutateGroups()
            // }
            // return {
            //     data,
            //     emptyScreen,
            //     queryText,
            //     noOwnersToggle,
            //     totalUsersCount,
            //     totalGroupCount,
            //     userOwnerState,
            //     groupOwnerState,
            //     STATES,
            //     GROUPSTATES,
            //     myUsername,
            //     showMoreGroups,
            //     onSelectGroup,
            //     isOwner,
            //     onSelectUser,
            //     userList,
            //     groupList,
            //     handleOwnerSearch,
            //     activeOwnerTabKey,
            //     toggleShowMoreGroups,
            //     toggleShowMore,
            //     handleChange,
            //     handleUsersChange,
            //     handleGroupsChange,
            //     showMoreUsers,
            //     setActiveTab,
            // } -->

            return { userList, fullName, avatarUrl, username, handleSearch }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
