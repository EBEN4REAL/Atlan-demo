<template>
    <div class="relative">
        <div class="flex flex-row justify-between">
            <div class="flex items-center gap-x-3" :class="userListHeaderClass">
                <AtlanIcon
                    v-if="showHeaderButtons"
                    class="text-gray-500 cursor-pointer h-7"
                    icon="ChevronLeft"
                    @click="$emit('showGroupMembers')"
                />
                <SearchAndFilter
                    v-model:value="searchText"
                    :placeholder="`Search ${filteredUserCount} users`"
                    class="mr-1"
                    size="minimal"
                    @change="handleSearch"
                />
            </div>
            <template v-if="showHeaderButtons">
                <AtlanButton
                    color="secondary"
                    size="sm"
                    padding="compact"
                    :loading="addMemberLoading"
                    :disabled="addMemberLoading || !selectedIds.length"
                    class="flex items-center text-sm"
                    @click="$emit('addMembersToGroup')"
                >
                    Done
                </AtlanButton>
            </template>
        </div>
        <div
            v-if="error"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
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
        <div
            v-else-if="searchText && !userList?.length"
            class="flex items-center justify-center h-64"
        >
            <EmptyView desc="No Results found." />
        </div>
        <template v-else>
            <div
                class="flex flex-col mt-2 overflow-auto"
                :style="userListStyle"
            >
                <div>
                    <div v-if="userList?.length" class="w-full">
                        <div class="flex flex-col w-full">
                            <template v-for="user in userList" :key="user.id">
                                <a-checkbox
                                    :value="user.id"
                                    class="flex flex-row-reverse items-center justify-end w-full py-2 pr-4 border-b border-gray-100 atlanReverse hover:bg-primary-light"
                                    @change="handleChange"
                                >
                                    <UserCard
                                        :user="{ ...user }"
                                        :minimal="true"
                                    />
                                </a-checkbox>
                            </template>
                        </div>
                        <div
                            v-if="showLoadMore"
                            class="flex justify-end w-full mt-3"
                        >
                            <button
                                :disabled="isLoading"
                                class="flex items-center justify-between py-2 bg-white rounded-full text-primary"
                                :class="isLoading ? 'px-2 w-9' : ''"
                                @click="handleLoadMore"
                            >
                                <template v-if="!isLoading">
                                    <p
                                        class="m-0 mr-1 overflow-hidden transition-all duration-300 cursor-pointer overflow-ellipsis whitespace-nowrap hover:underline"
                                    >
                                        Load more...
                                    </p>
                                </template>
                                <div
                                    v-else
                                    class="flex justify-center ml-auto mr-5"
                                >
                                    <AtlanIcon
                                        icon="CircleLoader"
                                        class="text-primary animate-spin"
                                    />
                                </div>
                                <!-- <AtlanIcon
                                    v-else
                                    icon="CircleLoader"
                                    class="w-auto animate-spin"
                                ></AtlanIcon> -->
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    v-if="isLoading && !userList.length"
                    class="flex justify-center mt-3"
                >
                    <AtlanLoader class="h-10" />
                </div>
            </div>

            <div class="pl-4">
                <p class="text-gray-500">
                    {{ userList?.length }} of {{ filteredUserCount }} users
                </p>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import { useUsers } from '~/composables/user/useUsers'
    import AtlanButton from '@/UI/button.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import UserCard from './userCard.vue'
    import EmptyView from '@/common/empty/index.vue'

    export default defineComponent({
        name: 'UsersList',
        components: {
            UserCard,
            EmptyView,
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
        },
        emits: ['updateSelectedUsers', 'addMembersToGroup', 'showGroupMembers'],
        setup(props, context) {
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
                isLoading,
                error,
                total,
            } = useUsers(userListAPIParams, true)

            const handleSearch = useDebounceFn(() => {
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
            }, 200)
            const handleLoadMore = () => {
                userListAPIParams.offset += userListAPIParams.limit
                getUserList()
            }
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    userList.value.length,
                    userListAPIParams.offset,
                    userListAPIParams.limit,
                    filteredUserCount.value // filtered value because we are filtering users in the getUsers API call and getting only the users that have emailVerified as true.
                )
            )
            const handleChange = (event) => {
                if (
                    event.target.checked &&
                    !selectedIds.value.includes(event.target.value)
                ) {
                    selectedIds.value.push(event.target.value)
                } else if (!event.target.checked) {
                    const index = selectedIds.value.indexOf(event.target.value)
                    if (index > -1) {
                        selectedIds.value.splice(index, 1)
                    }
                }
                context.emit('updateSelectedUsers', selectedIds.value)
            }

            return {
                total,
                searchText,
                showLoadMore,
                userList,
                filteredUserCount,
                getUserList,
                handleSearch,
                isLoading,
                error,
                handleLoadMore,
                handleChange,
                selectedIds,
            }
        },
    })
</script>

<style lang="less" scoped>
    .list {
        max-height: calc(100% - 35rem);
    }
</style>
