<template>
    <div class="my-3">
        <div v-if="showGroupMembers">
            <div class="flex flex-row justify-between">
                <div>
                    <a-input-search
                        v-model:value="searchText"
                        placeholder="Search Members"
                        :allow-clear="true"
                        class="mr-1"
                        @change="handleSearch"
                    ></a-input-search>
                </div>
                <div>
                    <a-button type="primary" ghost @click="handleAddMember"
                        ><fa icon="fal plus" class="mr-2"></fa>Add
                        Member</a-button
                    >
                </div>
            </div>
            <div
                v-if="!selectedGroup.memberCount"
                class="flex flex-col items-center justify-center"
            >
                <div class="mt-6 text-center">
                    <p class="text-lg">No members are present in the group.</p>
                </div>
            </div>
            <div
                v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
                class="flex flex-col items-center justify-center h-full bg-white "
            >
                <ErrorView>
                    <div class="mt-3">
                        <a-button
                            size="large"
                            type="primary"
                            ghost
                            @click="
                                () => {
                                    getGroupMembersList()
                                }
                            "
                        >
                            <fa icon="fal sync" class="mr-2"></fa>Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
            <div v-else-if="searchText && !filteredMembersCount" class="mt-2">
                {{ `No member with name ${searchText} found.` }}
            </div>
            <div v-else class="mt-4 overflow-y-auto member-list-height">
                <div
                    v-for="user in memberList"
                    :key="user.id"
                    class="py-2 border-b border-gray-100"
                >
                    <div class="flex justify-between cursor-pointer">
                        <div
                            class="flex items-center"
                            @click="() => handleClickUser(user.username)"
                        >
                            <a-avatar
                                shape="circle"
                                class="mr-1 ant-tag-blue text-gray avatars"
                                :size="40"
                            >
                                {{
                                    getNameInitials(
                                        getNameInTitleCase(
                                            `${getUserName(user)}`
                                        )
                                    )
                                }}
                            </a-avatar>
                            <div class="ml-2">
                                <div class="text-gray">
                                    <span class="mr-2 font-bold">{{
                                        getUserName(user)
                                    }}</span>
                                    <!-- <span class="font-normal"
                    >({{ pluralizeString("group", user.group_count) }})</span
                  > -->
                                </div>
                                <div class="text-gray">
                                    @{{ user.username }}
                                </div>
                            </div>
                        </div>
                        <div class="font-bold">
                            <div
                                v-if="removeMemberLoading[user.id]"
                                class="flex cursor-default text-error-muted"
                            >
                                <fa
                                    style="vertical-align: middle"
                                    icon="fal circle-notch"
                                    class="mr-1 animate-spin"
                                />
                                <div>Removing...</div>
                            </div>
                            <div
                                v-else
                                class="cursor-pointer text-error"
                                @click="() => removeUserFromGroup(user.id)"
                            >
                                Remove
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="
                        selectedGroup.memberCount &&
                        ([STATES.PENDING].includes(state) ||
                            [STATES.VALIDATING].includes(state))
                    "
                    class="flex justify-center mt-3"
                >
                    <a-spin></a-spin>
                </div>
                <div v-else-if="showLoadMore" class="flex justify-center mt-3">
                    <a-button @click="handleLoadMore">load more</a-button>
                </div>
            </div>
        </div>
        <div v-else-if="!showGroupMembers">
            <UserList
                :add-member-loading="addMemberLoading"
                :show-header-buttons="true"
                @updateSelectedUsers="updateSelectedUsers"
                @showGroupMembers="handleShowGroupMembers"
                @addMembersToGroup="addMembersToGroup"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue'
    import { ref, reactive, defineComponent, computed, watch } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useDebounceFn } from '@vueuse/core'
    import { Groups } from '~/services/service/groups'

    import useGroupMembers from '~/composables/group/useGroupMembers'
    import UserList from '~/components/admin/groups/common/userList.vue'
    import {
        pluralizeString,
        getNameInitials,
        getNameInTitleCase,
    } from '~/utils/string'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import AddGroupMembers from '~/components/admin/groups/groupPreview/about/members/addGroupMembers.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    export default defineComponent({
        name: 'GroupMembers',
        components: {
            ErrorView,
            AddGroupMembers,
            UserList,
        },
        props: {
            selectedGroup: {
                type: Object,
                default: {},
            },
        },
        setup(props, context) {
            const showGroupMembers = ref(true)
            const searchText = ref('')
            const showAddMemberModal = ref(false)
            const addMemberLoading = ref(false)
            const removeMemberLoading = ref({})
            const selectedUserIds = ref([])
            const memberListParams = reactive({
                groupId: props.selectedGroup.id,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'first_name',
                    filter: {},
                },
            })
            const {
                memberList,
                totalMembersCount,
                filteredMembersCount,
                getGroupMembersList,
                state,
                STATES,
            } = useGroupMembers(memberListParams)

            const handleSearch = useDebounceFn(() => {
                memberListParams.params.filter = searchText.value
                    ? {
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
                              { username: { $ilike: `%${searchText.value}%` } },
                          ],
                      }
                    : {}
                memberListParams.params.offset = 0
                getGroupMembersList()
            }, 600)
            const handleLoadMore = () => {
                memberListParams.params.offset =
                    memberListParams.params.offset +
                    memberListParams.params.limit
                getGroupMembersList()
            }
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    memberList.value.length,
                    memberListParams.params.offset,
                    memberListParams.params.limit,
                    searchText.value
                        ? filteredMembersCount.value
                        : totalMembersCount.value
                )
            )
            const addMembersToGroup = () => {
                const userIds = [...selectedUserIds.value]
                const requestPayload = ref()
                requestPayload.value = {
                    users: userIds,
                }
                const { data, isReady, error, isLoading } = Groups.AddMembers(
                    props.selectedGroup.id,
                    requestPayload
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        addMemberLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            memberListParams.params.offset = 0
                            getGroupMembersList()
                            context.emit('refreshTable')
                            message.success(
                                `${pluralizeString(
                                    'Member',
                                    userIds.length,
                                    false
                                )} added`
                            )
                            showGroupMembers.value = true
                        } else if (error && error.value) {
                            message.error(
                                'Unable to add members, please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            const removeUserFromGroup = async (userId: any) => {
                const userIds = [userId]
                const requestPayload = ref()
                requestPayload.value = {
                    users: userIds,
                }
                const { data, isReady, error, isLoading } =
                    Group.RemoveMembersFromGroup(
                        props.selectedGroup.id,
                        requestPayload
                    )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        removeMemberLoading.value[userId] = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            memberListParams.params.offset = 0
                            getGroupMembersList()
                            context.emit('refreshTable')
                            message.success('Member Removed')
                        } else if (error && error.value) {
                            message.error('Failed, try again')
                        }
                    },
                    { immediate: true }
                )
            }
            const getUserName = (user: any) => {
                const { first_name } = user
                const { last_name } = user
                if (first_name) {
                    return `${first_name} ${last_name || ''}`
                }
                return user.email
            }
            const handleAddMember = () => {
                // showAddMemberModal.value = true;
                showGroupMembers.value = false
            }
            const handleShowGroupMembers = () => {
                // showAddToGroupModal.value = false;
                showGroupMembers.value = true
            }
            const closeAddGroupModal = () => {
                showAddMemberModal.value = false
            }
            // user preview drawer
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }
            const updateSelectedUsers = (userList) => {
                selectedUserIds.value = [...userList]
            }
            return {
                searchText,
                showLoadMore,
                memberList,
                totalMembersCount,
                filteredMembersCount,
                getGroupMembersList,
                handleSearch,
                state,
                STATES,
                handleLoadMore,
                removeUserFromGroup,
                getUserName,
                getNameInitials,
                getNameInTitleCase,
                pluralizeString,
                handleAddMember,
                showAddMemberModal,
                addMembersToGroup,
                addMemberLoading,
                closeAddGroupModal,
                handleClickUser,
                showGroupMembers,
                handleShowGroupMembers,
                updateSelectedUsers,
                removeMemberLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    .member-list-height {
        max-height: 68vh;
    }
</style>
