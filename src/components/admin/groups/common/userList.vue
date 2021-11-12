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
                <a-input-search
                    v-model:value="searchText"
                    placeholder="Search users"
                    :allow-clear="true"
                    class="mr-1"
                    @change="handleSearch"
                ></a-input-search>
            </div>
            <div v-if="showHeaderButtons">
                <a-button
                    type="primary"
                    :loading="addMemberLoading"
                    :disabled="addMemberLoading"
                    class="flex items-center text-sm"
                    @click="$emit('addMembersToGroup')"
                >
                    <AtlanIcon icon="Add" class="mr-2" />
                    Add
                </a-button>
            </div>
        </div>
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
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
        <div v-else class="pl-4 mt-2 overflow-auto">
            <a-checkbox-group class="w-full">
                <div class="flex flex-col w-full" :style="userListStyle">
                    <template v-for="user in userList" :key="user.id">
                        <a-checkbox
                            :value="user.id"
                            class="
                                flex
                                items-center
                                w-full
                                py-2
                                border-b border-gray-100
                            "
                            @change="handleChange"
                        >
                            <span class="flex justify-between ml-3">
                                <div class="flex items-center">
                                    <Avatar
                                        :image-url="imageUrl(user.username)"
                                        :allow-upload="false"
                                        :avatar-name="
                                            user.name ||
                                            user.uername ||
                                            user.email
                                        "
                                        :avatar-size="minimal ? 30 : 40"
                                        class="mr-2"
                                    />
                                    <div class="ml-2">
                                        <div class="text-gray">
                                            <div class="mr-2 font-bold">
                                                {{ user.name }}
                                            </div>
                                            <div
                                                v-if="!minimal"
                                                class="mr-2 text-gray"
                                            >
                                                {{ user.email }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </a-checkbox>
                    </template>
                </div>
            </a-checkbox-group>
            <div
                v-if="
                    [STATES.PENDING].includes(state) ||
                    [STATES.VALIDATING].includes(state)
                "
                class="flex justify-center mt-3"
            >
                <AtlanIcon icon="Loader" class="h-10 animate-spin" />
            </div>
            <div
                v-else-if="showLoadMore"
                class="absolute flex justify-center w-full mt-3"
            >
                <AtlanButton color="secondary" @click="handleLoadMore"
                    >load more
                </AtlanButton>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, defineComponent, computed } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import {
        pluralizeString,
        getNameInitials,
        getNameInTitleCase,
    } from '~/utils/string'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import { useUsers } from '~/composables/user/useUsers'
    import Avatar from '~/components/common/avatar/index.vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'UsersList',
        components: {
            ErrorView,
            Avatar,
            AtlanButton,
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
                sort: 'first_name',
                filter: {
                    $and: [
                        {
                            email_verified: true,
                        },
                    ],
                },
            })
            const {
                usersListConcatenated: userList,
                filteredUserCount,
                getUserList,
                state,
                STATES,
            } = useUsers(userListAPIParams)

            const handleSearch = useDebounceFn(() => {
                userListAPIParams.filter = {
                    $and: [
                        { email_verified: true },
                        {
                            $or: [
                                {
                                    first_name: {
                                        $ilike: `%${searchText.value}%`,
                                    },
                                },
                                {
                                    last_name: {
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
                    filteredUserCount.value // filtered value because we are filtering users in the getUsers API call and getting only the users that have email_verified as true.
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
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            return {
                searchText,
                showLoadMore,
                userList,
                filteredUserCount,
                getUserList,
                handleSearch,
                state,
                STATES,
                handleLoadMore,
                getNameInitials,
                getNameInTitleCase,
                pluralizeString,
                handleChange,
                selectedIds,
                imageUrl,
            }
        },
    })
</script>

<style lang="less" scoped>
    .userlist-height {
        max-height: calc(100vh - 35rem);
    }
</style>
