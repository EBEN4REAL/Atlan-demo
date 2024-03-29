<template>
    <div class="h-full py-2">
        <template v-if="showGroupMembers">
            <div
                v-auth="map.ADD_USER_GROUP"
                class="flex items-center justify-between px-4 mb-3"
            >
                <div class="text-base font-bold text-gray-500">Members</div>
                <!-- <MemberPopover
                    :selected-group="selectedGroup"
                    @members-added="addMembersToGroup"
                >
                    <template #label>
                        <AtlanButton2
                            color="secondary"
                            prefix-icon="Add"
                            label="Add Member"
                        />
                    </template>
                </MemberPopover> -->
            </div>
            <div
                class="flex flex-row items-center justify-between px-4 gap-x-1"
            >
                <SearchAndFilter
                    v-if="totalMembersCount || isLoading"
                    v-model:value="searchText"
                    :placeholder="`Search ${totalMembersCount ?? 0} members`"
                    class="mr-2"
                    size="minimal"
                    @change="handleSearch"
                />
            </div>
            <div
                v-if="!totalMembersCount && !isLoading"
                class="flex flex-col items-center justify-center px-4 empty-state-wrapper"
            >
                <div class="flex items-center justify-center w-full">
                    <EmptyState
                        empty-screen="CreateGroups"
                        :desc="`${selectedGroup.name} has no members.`"
                    />
                </div>
            </div>
            <div
                v-if="error"
                class="flex flex-col items-center justify-center px-4 mt-3 bg-white empty-state-wrapper"
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
                                icon="Retry"
                                class="inline-block mb-1 mr-1"
                            />Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
            <div
                v-else-if="searchText && !filteredMembersCount && !isLoading"
                class="px-4 empty-state-wrapper"
            >
                <EmptyState
                    image-class="h-36"
                    empty-screen="NoGroups"
                    :desc="`No member with name ${searchText} found.`"
                    button-text="Clear search"
                    @event="
                        () => {
                            searchText = ''
                            handleSearch()
                        }
                    "
                />
            </div>
            <div v-else class="mt-2">
                <div class="overflow-y-auto member-list-height">
                    <div
                        v-for="user in memberList"
                        :key="user.id"
                        class="relative"
                    >
                        <div
                            class="flex items-center justify-between py-2 transition-all duration-300 rounded group hover:bg-primary-light"
                        >
                            <UserCard
                                :user="{ ...user, name: getUserName(user) }"
                                :minimal="true"
                                class="pl-1"
                            />

                            <div
                                class="absolute flex justify-between mr-2 cursor-pointer right-2 top-3"
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
                                        class="hidden text-sm font-normal cursor-pointer text-error group-hover:block"
                                        @click="() => removeUserFromGroup(user)"
                                    >
                                        Remove
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="mx-4" />
                    </div>
                </div>
                <div v-if="isLoading" class="flex justify-center mt-3">
                    <AtlanIcon
                        icon="CircleLoader"
                        class="h-5 animate-spin text-primary"
                    />
                </div>
                <div v-else-if="showLoadMore" class="flex justify-center mt-3">
                    <a-button @click="handleLoadMore">load more</a-button>
                </div>
            </div>
        </template>
        <!-- <template v-else-if="!showGroupMembers">
            <div class="mb-3 text-lg font-bold">Members</div>

            <UserList
                :userListStyle="{ 'max-height': 'calc(100vh - 17rem)' }"
                :add-member-loading="addMemberLoading"
                :show-header-buttons="true"
                :minimal="true"
                @updateSelectedUsers="updateSelectedUsers"
                @showGroupMembers="handleShowGroupMembers"
                @addMembersToGroup="addMembersToGroup"
            />
        </template> -->
    </div>
</template>

<script lang="ts">
    import { message, Modal } from 'ant-design-vue'
    import { ref, defineComponent, computed, watch, h, toRefs } from 'vue'
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
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanButton from '@/UI/button.vue'
    import EmptyState from '@/common/empty/index.vue'
    import MemberPopover from '@/admin/groups/groupPreview/memberPopover.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    export default defineComponent({
        name: 'GroupMembers',
        components: {
            MemberPopover,
            SearchAndFilter,
            UserCard,
            ErrorView,
            UserList,
            OwnerFacets,
            AtlanButton,
            EmptyState,
        },
        props: {
            selectedGroup: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['refreshTable'],
        setup(props, context) {
            const { selectedGroup } = toRefs(props)
            const showGroupMembers = ref(true)
            const showUsersPopover = ref(false)
            const searchText = ref('')
            const showAddMemberModal = ref(false)
            const addMemberLoading = ref(false)
            const removeMemberLoading = ref({})
            const selectedUserIds = ref({ ownerUsers: [] })
            const limit = ref(10)
            const offset = ref(0)
            const filter = ref({})
            const { lastUpdate } = useGroupPreview()
            const memberListParams = computed(() => ({
                groupId: selectedGroup.value.id,
                params: {
                    limit: limit.value,
                    offset: offset.value,
                    sort: 'firstName',
                    filter: filter.value,
                },
            }))
            const {
                memberList,
                totalMembersCount,
                filteredMembersCount,
                getGroupMembersList,
                state,
                STATES,
                isLoading,
                error,
            } = useGroupMembers(memberListParams)

            const handleSearch = useDebounceFn(() => {
                filter.value = searchText.value
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
                offset.value = 0
                getGroupMembersList()
            }, 600)
            const handleLoadMore = () => {
                offset.value += limit.value
                getGroupMembersList()
            }

            watch(
                () => props.selectedGroup.id,
                (v) => {
                    selectedGroup.value.id = v
                    getGroupMembersList()
                }
            )
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    memberList.value.length,
                    offset.value,
                    limit.value,
                    searchText.value
                        ? filteredMembersCount.value
                        : totalMembersCount.value
                )
            )
            const addMembersToGroup = () => {
                offset.value = 0
                getGroupMembersList()
                context.emit('refreshTable')
            }
            const removeUserFromGroup = async (user: any) => {
                Modal.confirm({
                    title: `Remove member`,
                    class: 'remove-member-modal',
                    content: () =>
                        h('div', [
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
                            h('span', '?'),
                        ]),
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Remove',
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
                                removeMemberLoading.value[userId] =
                                    isLoading.value
                                if (isLoading.value) {
                                    message.loading({
                                        content: `Removing ${getUserName(
                                            user
                                        )} from ${props.selectedGroup.name}`,
                                        duration: 0,
                                        key: messageKey,
                                    })
                                }
                                if (
                                    isReady &&
                                    !error.value &&
                                    !isLoading.value
                                ) {
                                    useAddEvent('admin', 'group', 'updated', {
                                        users_count:
                                            selectedGroup.value.memberCount - 1,
                                        has_slack_channel_added:
                                            selectedGroup.value.attributes?.channels?.some(
                                                (c) => c?.includes('slack')
                                            ) || false,
                                        is_default:
                                            selectedGroup.value.isDefault ===
                                            'true',
                                        has_description:
                                            !!selectedGroup.value.description,
                                    })
                                    offset.value = 0
                                    getGroupMembersList()
                                    context.emit('refreshTable')
                                    message.success({
                                        content: `Removed ${getUserName(
                                            user
                                        )} from ${props.selectedGroup.name}`,
                                        duration: 1.5,
                                        key: messageKey,
                                    })
                                    lastUpdate.value = new Date()
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
                selectedUserIds,
                showUsersPopover,
                isLoading,
                error,
            }
        },
    })
</script>

<style lang="less" scoped>
    .member-list-height {
        max-height: calc(100vh - 15rem) !important;
    }
    .empty-state-wrapper {
        height: calc(100vh - 10rem) !important;
    }
</style>
<style lang="less"></style>
<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
