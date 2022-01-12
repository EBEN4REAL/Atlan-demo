<template>
    <div class="w-full" :class="listClass ? listClass : 'h-44'">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No users found</span>
            </div>
        </div>
        <div
            class="flex flex-col w-full overflow-y-auto"
            :class="checkboxListClass ? checkboxListClass : 'h-40'"
        >
            <div class="w-full px-3">
                <div>
                    <template
                        v-for="item in userList"
                        :key="item[selectUserKey]"
                    >
                        <a-checkbox
                            :checked="
                                map[item[selectUserKey]] ||
                                disabledKeyMap[item[selectUserKey]]
                            "
                            :disabled="
                                disabledKeyMap[item[selectUserKey]] &&
                                disabledKeyMap[item[selectUserKey]] === true
                            "
                            class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded atlanReverse hover:bg-primary-light"
                            :class="listItemClass"
                            @change="
                                (checked) =>
                                    handleChange(checked, item[selectUserKey])
                            "
                        >
                            <div class="flex items-center">
                                <Avatar
                                    v-if="showAvatar"
                                    avatar-shape="circle"
                                    :image-url="imageUrl(item.username)"
                                    :allow-upload="false"
                                    :avatar-name="item.username"
                                    :avatar-size="20"
                                    class="mr-2"
                                />
                                <div
                                    class="text-sm leading-none capitalize text-gray"
                                >
                                    {{ fullName(item) }}
                                </div>
                            </div>
                        </a-checkbox>
                    </template>
                </div>
            </div>
            <div
                v-if="userList.length > 0"
                class="flex items-center justify-between px-4"
            >
                <!-- <p class="text-xs text-gray-500">
                    {{ userList.length }} of {{ filterTotal }} users
                </p> -->
                <template v-if="userList?.length < filterTotal">
                    <div
                        v-if="isLoading || isEnriching"
                        class="flex justify-center ml-auto"
                    >
                        <AtlanIcon
                            icon="CircleLoader"
                            class="text-primary animate-spin"
                        />
                    </div>
                    <div
                        v-else
                        class="flex items-center ml-auto text-xs cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                    >
                        load more...
                    </div>
                </template>
            </div>
        </div>
        <div class="pl-4">
            <p class="text-xs text-gray-500">
                {{ userList.length }} of {{ filterTotal }} users
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref, toRefs, Ref } from 'vue'
    import { useVModels, onKeyStroke } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'UsersFilter',
        components: {
            Avatar,
        },
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: Array,
                required: false,
                default: () => [],
            },
            selectUserKey: {
                type: String,
                required: false,
                default: () => 'username', // can be id/username
            },
            cacheKey: {
                type: String,
                required: false,
                default: () => 'DEFAULT_USERS',
            },
            disabledKeys: {
                type: Array,
                required: false,
            },
            groupId: {
                type: String,
                required: false,
                default: '',
            },
            showAvatar: {
                type: Boolean,
                required: false,
            },
            listClass: {
                type: String,
                required: false,
            },
            checkboxListClass: {
                type: String,
                required: false,
            },
            listItemClass: {
                type: String,
                required: false,
            },
            showLoggedInUser: {
                type: Boolean,
                required: false,
                default: true,
            },
            // to get complete records and not an array of selected ids or usernames
            selectedRecords: {
                type: Object,
                default: null,
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, disabledKeys, selectedRecords } = useVModels(
                props,
                emit
            )
            const { selectUserKey, queryText, groupId, showLoggedInUser } =
                toRefs(props)
            const localValue = ref(modelValue.value)
            const allUsers = ref({}) // map of all users (userId: userRecord)

            const map = computed(() => {
                const data = {}
                modelValue?.value?.forEach((key) => {
                    data[key] = true
                })
                return data
            })

            const {
                userList: users,
                handleSearch,
                total,
                filterTotal: totalUsers,
                loadMore,
                isLoading,
                isEnriching,
            } = useFacetUsers({
                groupId,
            })

            watch(
                () => queryText.value,
                () => {
                    handleSearch(queryText.value)
                }
            )
            const { username } = whoami()

            // to filter out loggedIn user if needed from list based on showLoggedInUser
            const userList = computed(() => {
                if (showLoggedInUser.value) {
                    return users.value
                }
                return users.value.filter(
                    (user) => user.username !== username.value
                )
            })

            // Populating allUsers
            watch(
                users,
                () => {
                    if (users && users.value.length) {
                        users.value.forEach((user) => {
                            if (!allUsers.value[user.id])
                                allUsers.value[user.id] = { ...user }
                        })
                    }
                },
                {
                    deep: true,
                    immediate: true,
                }
            )
            // to decrease the total users count if loggedIn user is removed from list based on showLoggedInUser
            const filterTotal = computed(() => {
                if (showLoggedInUser.value) {
                    return totalUsers.value
                }
                return totalUsers.value - 1
            })

            const disabledKeyMap = computed(() => {
                const data = {}
                disabledKeys?.value?.forEach((key) => {
                    data[key] = true
                })
                userList.value.forEach((user) => {
                    if (user.isPartOfGroup) {
                        data[user[selectUserKey.value]] = true
                    }
                })
                // console.log('disabled keys: ', data)
                return data
            })

            const fullName = (item) => {
                if (item.firstName) {
                    return `${item.firstName} ${item.lastName || ''}`
                }
                return `${item.username}`
            }
            const handleChange = (checked, id) => {
                 if (checked.target.checked) {
                    map.value[id] = true
                } else {
                    delete map.value[id]
                }
                modelValue.value = [...Object.keys(map.value)]
                if (selectedRecords) {
                    selectedRecords.value = [
                        ...Object.keys(map.value).map(
                            (userId) => allUsers.value[userId]
                        ),
                    ]
                    emit('change')
                }
            }

            onKeyStroke(['Enter'], (e) => {
                const { key } = e

                if (key === 'Enter') {
                    if (userList.value.length === 1) {
                        // console.log('enter pressed')

                        const id = userList.value[0][selectUserKey.value]
                        if (!disabledKeyMap.value[id]) {
                            if (map.value[id]) {
                                delete map.value[id]
                            } else {
                                map.value[id] = true
                            }
                            modelValue.value = [...Object.keys(map.value)]
                        }
                    }
                }
            })

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            return {
                loadMore,
                isLoading,
                map,
                userList,
                fullName,
                handleSearch,
                total,
                localValue,
                filterTotal,
                handleChange,
                disabledKeyMap,
                isEnriching,
                imageUrl,
                username,
            }
        },
    })
</script>
