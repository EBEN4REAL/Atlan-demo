<template>
    <div class="px-4 py-2 my-3">
        <template v-if="showGroupMembers">
            <div
                v-auth="map.ADD_USER_GROUP"
                class="flex items-center justify-between mb-3"
            >
                <div class="text-lg font-bold">Members</div>
                <a-button type="primary" ghost @click="handleAddMember">
                    <AtlanIcon icon="Add" class="inline-block mr-2" />Add Member
                </a-button>
            </div>
            <div class="flex flex-row items-center justify-between gap-x-1">
                <SearchAndFilter
                    v-model:value="searchText"
                    placeholder="Search Members"
                    class="mr-2"
                    size="minimal"
                    @change="handleSearch"
                />
            </div>
            <div
                v-if="!selectedGroup.memberCount"
                class="
                    flex flex-col
                    items-center
                    justify-center
                    member-list-height
                "
            >
                <div class="mt-6 text-center">
                    <p class="text-lg">No members are present in the group.</p>
                </div>
            </div>
            <div
                v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
                class="
                    flex flex-col
                    items-center
                    justify-center
                    h-full
                    bg-white
                "
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
                            <AtlanIcon
                                icon="Refresh"
                                class="inline-block mb-1 mr-1"
                            />Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
            <div v-else-if="searchText && !filteredMembersCount" class="mt-2">
                {{ `No member with name ${searchText} found.` }}
            </div>
            <div
                v-else-if="memberList?.length"
                class="mt-4 overflow-y-auto member-list-height"
            >
                <div
                    v-for="user in memberList"
                    :key="user.id"
                    class="relative py-2 border-b border-gray-100 group"
                >
                    <UserCard
                        :user="{ user, name: getUserName(user) }"
                        :minimal="true"
                    />

                    <div
                        class="
                            absolute
                            right-0
                            flex
                            justify-between
                            cursor-pointer
                            top-3
                        "
                    >
                        <div class="font-bold">
                            <div
                                v-if="removeMemberLoading[user.id]"
                                class="flex cursor-default text-error-muted"
                            >
                                <AtlanIcon
                                    style="vertical-align: middle"
                                    icon="CircleLoader"
                                    class="mr-1 animate-spin"
                                />
                                <div>Removing...</div>
                            </div>
                            <div
                                v-else
                                v-auth="map.REMOVE_USER_GROUP"
                                class="
                                    hidden
                                    text-sm
                                    font-normal
                                    cursor-pointer
                                    text-error
                                    group-hover:block
                                "
                                @click="() => removeUserFromGroup(user)"
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
        </template>
        <template v-else-if="!showGroupMembers">
            <div class="mb-3 text-lg font-bold">Members</div>

            <UserList
                :userListStyle="'max-height: calc(100vh - 17rem);'"
                :add-member-loading="addMemberLoading"
                :show-header-buttons="true"
                :minimal="true"
                @updateSelectedUsers="updateSelectedUsers"
                @showGroupMembers="handleShowGroupMembers"
                @addMembersToGroup="addMembersToGroup"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { ref, reactive, defineComponent, computed, watch, h } from 'vue'
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
import { useUserPreview } from '~/composables/user/showUserPreview'
import map from '~/constant/accessControl/map'
import SearchAndFilter from '@/common/input/searchAndFilter.vue'
import UserCard from '@/admin/groups/common/userCard.vue'
import { Modal } from 'ant-design-vue'

export default defineComponent({
    name: 'GroupMembers',
    components: {
        SearchAndFilter,
        UserCard,
        ErrorView,
        UserList,
    },
    props: {
        selectedGroup: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['refreshTable'],
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
                sort: 'firstName',
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
                              firstName: {
                                  $ilike: `%${searchText.value}%`,
                              },
                          },
                          {
                              lastName: {
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
                memberListParams.params.offset + memberListParams.params.limit
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
        const removeUserFromGroup = async (user: any) => {
            Modal.confirm({
                title: `Remove member`,
                class: 'remove-member-modal',
                content: () => {
                    return h('div', [
                        'Are you sure you want to remove',
                        h('span', [' ']),
                        h(
                            'span',
                            {
                                class: ['font-bold'],
                            },
                            [`${getUserName(user)}`]
                        ),
                        h('span', [' from ']),
                        h(
                            'span',
                            {
                                class: ['font-bold'],
                            },
                            [`${props.selectedGroup.name}`]
                        ),
                    ])
                },
                okType: 'danger',
                autoFocusButton: null,
                okButtonProps: {
                    type: 'primary',
                },
                okText: 'Delete',
                cancelText: 'Cancel',
                async onOk() {
                    const userId = user.id
                    const messageKey = Date.now()
                    const userIds = [userId]
                    const requestPayload = ref()
                    requestPayload.value = {
                        users: userIds,
                    }
                    const { data, isReady, error, isLoading } =
                        Groups.RemoveMembersFromGroup(
                            props.selectedGroup.id,
                            requestPayload
                        )
                    watch(
                        [data, isReady, error, isLoading],
                        () => {
                            removeMemberLoading.value[userId] = isLoading.value
                            if (isLoading.value) {
                                message.loading({
                                    content: `Removing ${getUserName(
                                        user
                                    )} from ${props.selectedGroup.name}`,
                                    duration: 0,
                                    key: messageKey,
                                })
                            }
                            if (isReady && !error.value && !isLoading.value) {
                                memberListParams.params.offset = 0
                                getGroupMembersList()
                                context.emit('refreshTable')
                                message.success({
                                    content: `Removed ${getUserName(
                                        user
                                    )} from ${props.selectedGroup.name}`,
                                    duration: 1.5,
                                    key: messageKey,
                                })
                            } else if (error && error.value) {
                                message.error({
                                    content: `Failed to remove ${getUserName(
                                        user
                                    )} from ${props.selectedGroup.name}`,
                                    duration: 1.5,
                                    key: messageKey,
                                })
                            }
                        },
                        { immediate: true }
                    )
                },
            })
        }

        const getUserName = (user: any) => {
            const { firstName } = user
            const { lastName } = user
            if (firstName) {
                return `${firstName} ${lastName || ''}`
            }
            return user.email
        }
        const handleAddMember = () => {
            showGroupMembers.value = false
        }
        const handleShowGroupMembers = () => {
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

        const imageUrl = (username: any) =>
            `${window.location.origin}/api/service/avatars/${username}`

        return {
            imageUrl,
            map,
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
    height: 68vh;
}
</style>
<style lang="less">
.remove-member-modal {
    .ant-modal-confirm-body-wrapper {
        @apply p-5;
    }
}
</style>
