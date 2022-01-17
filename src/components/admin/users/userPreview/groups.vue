<template>
    <div class="h-full px-4 py-2 mb-3">
        <div class="flex items-center justify-between mb-3">
            <div class="text-base font-bold text-gray-500">Groups</div>
            <div v-if="showUserGroups" v-auth="map.ADD_USER_GROUP">
                <a-popover
                    v-model:visible="showGroupsPopover"
                    placement="bottom"
                    :trigger="['click']"
                    :destroy-tooltip-on-hide="true"
                    :overlay-class-name="$style.ownerPopover"
                >
                    <template #content>
                        <div class="">
                            <OwnerFacets
                                v-model:modelValue="selectedGroupIds"
                                :show-none="false"
                                :enable-tabs="['groups']"
                                :hide-disabled-tabs="true"
                                select-group-key="id"
                                :user-id="selectedUser.id"
                                :hideTabs="true"
                            ></OwnerFacets>
                        </div>
                        <div class="flex justify-end mr-3">
                            <AtlanButton
                                :is-loading="addToGroupLoading"
                                type="primary"
                                size="sm"
                                padding="compact"
                                :disabled="addToGroupLoading"
                                @click="addUserToGroups"
                            >
                                <div class="flex items-center">
                                    <div v-if="!addToGroupLoading">Save</div>
                                    <div v-else>Saving</div>
                                </div>
                            </AtlanButton>
                        </div>
                    </template>
                    <AtlanButton
                        size="sm"
                        padding="compact"
                        class="text-gray-700 bg-transparent border-gray-300 hover:bg-transparent hover:text-primary hover:border-primary"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Add" class="h-3 mr-2"></AtlanIcon>
                            <div>Add to groups</div>
                        </div></AtlanButton
                    >
                </a-popover>
            </div>
            <div v-else>
                <a-button
                    :loading="addToGroupLoading"
                    type="primary"
                    :disabled="addToGroupLoading"
                    @click="addUserToGroups"
                >
                    <div class="flex items-center">
                        <div>Done</div>
                    </div>
                </a-button>
            </div>
        </div>
        <div v-auth="map.LIST_GROUPS" class="h-full">
            <div
                v-if="totalGroupCount || isLoading"
                class="flex flex-row justify-between"
            >
                <div class="w-full">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search ${groupList?.length ?? 0} groups`"
                        class="mr-1"
                        size="minimal"
                        @change="handleSearch"
                    />
                </div>
            </div>
            <div
                v-if="totalGroupCount === 0 && !isLoading"
                class="flex flex-col items-center justify-center empty-state-wrapper"
            >
                <div
                    class="flex items-center justify-center w-full componentHeight"
                >
                    <EmptyState 
                        empty-screen="CreateGroups"
                        headline="No Groups Found"
                        desc="This user is not part of any group."
                    />
                </div>
            </div>
            <div
                v-else-if="error"
                class="flex flex-col items-center justify-center h-full mt-3 bg-white"
            >
                <ErrorView>
                    <div class="mt-3">
                        <a-button
                            size="large"
                            type="primary"
                            ghost
                            @click="
                                () => {
                                    getUserGroupList()
                                }
                            "
                        >
                            <AtlanIcon icon="Reload" class="mr-2" />Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
            <div
                v-else-if="searchText && !filteredGroupCount && !isLoading"
                class="flex flex-col items-center justify-center empty-state-wrapper"
            >
                <div
                    class="flex items-center justify-center w-full componentHeight"
                >
                    <EmptyState
                        image-class="h-36"
                        empty-screen="NoGroups"
                        :desc="`No group with name ${searchText} found.`"
                        button-text="Clear search"
                        @event="
                            () => {
                                searchText = ''
                                handleSearch()
                            }
                        "
                    />
                </div>
            </div>
            <div v-else class="mt-2 mb-2 overflow-y-auto group-list">
                <div v-for="group in groupList" :key="group.id">
                    <div
                        class="flex items-center justify-between px-3 py-2 mt-2 transition-all duration-300 rounded group hover:bg-primary-light"
                    >
                        <div class="flex items-center">
                            <div class="">
                                <div class="mb-1 font-bold text-primary">
                                    <span class="mr-2">{{ group.name }}</span>
                                </div>
                                <div class="text-sm text-gray-500">
                                    @{{ group.alias
                                    }}<span
                                        v-if="group.memberCountString"
                                        class="text-gray-500"
                                        ><span
                                            class="mx-1 text-xs text-gray-400"
                                        >
                                            •</span
                                        >{{ group.memberCountString }}</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="!removeFromGroupLoading[group.id]"
                            v-auth="map.REMOVE_USER_GROUP"
                            class="opacity-0 cursor-pointer text-error group-hover:opacity-100"
                            @click="() => removeUserFromGroup(group)"
                        >
                            Remove
                        </div>
                        <div
                            v-else
                            class="flex cursor-default text-error-muted"
                        >
                            <AtlanIcon icon="Loader" class="h-5 mr-1" />
                            <div>Removing...</div>
                        </div>
                    </div>
                    <hr class="mx-4" />
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
        </div>
    </div>
</template>

<script lang="ts">
    import { message, Modal } from 'ant-design-vue'
    import {
        defineComponent,
        computed,
        reactive,
        ref,
        watch,
        h,
        toRefs,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import ErrorView from '@common/error/index.vue'

    import { Users } from '~/services/service/users'

    import { Groups } from '~/services/service/groups'
    import GroupList from '~/components/admin/users/userPreview/groups/groupList.vue'
    import getUserGroups from '~/composables/user/getUserGroups'

    import { getIsLoadMore } from '~/utils/isLoadMore'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import EmptyState from '@/common/empty/index.vue'
    import map from '~/constant/accessControl/map'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'UserPreviewGroups',
        components: {
            ErrorView,
            GroupList,
            EmptyState,
            SearchAndFilter,
            AtlanButton,
            OwnerFacets,
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
        },
        setup(props) {
            const { selectedUser } = toRefs(props)
            const showUserGroups = ref(true)
            const showGroupsPopover = ref(false)
            const searchText = ref('')
            const showAddToGroupModal = ref(false)
            const addToGroupLoading = ref(false)
            const removeFromGroupLoading = ref({})
            const selectedGroupIds = ref({ ownerGroups: [] })
            const filter = computed(() =>
                searchText.value
                    ? {
                          $or: [
                              { name: { $ilike: `%${searchText.value}%` } },
                              { alias: { $ilike: `%${searchText.value}%` } },
                          ],
                      }
                    : {}
            )
            const offset = ref(0)
            const limit = ref(10)
            const groupListAPIParams = computed(() => ({
                userId: selectedUser.value.id,
                params: {
                    limit: limit.value,
                    offset: offset.value,
                    sort: 'name',
                    filter: filter.value,
                },
                immediate: true,
            }))
            const {
                groupList,
                totalGroupCount,
                filteredGroupCount,
                getUserGroupList,
                error,
                isLoading,
            } = getUserGroups(groupListAPIParams)
            const handleSearch = useDebounceFn((input: any) => {
                offset.value = 0
                getUserGroupList()
            }, 200)
            const handleLoadMore = () => {
                offset.value += limit.value
                getUserGroupList()
            }
            watch(
                selectedUser,
                () => {
                    getUserGroupList()
                },
                { immediate: true }
            )
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    groupList.value.length,
                    offset.value,
                    limit.value,
                    searchText.value
                        ? filteredGroupCount.value
                        : totalGroupCount.value
                )
            )
            const addUserToGroups = async () => {
                const groupIds = [...selectedGroupIds.value.ownerGroups]
                if (groupIds && groupIds.length) {
                    const requestPayload = ref({
                        groups: groupIds,
                    })
                    const {
                        data,
                        isReady,
                        error: addError,
                        isLoading: addLoading,
                    } = Users.AddGroups(props.selectedUser.id, requestPayload)
                    watch(
                        [data, isReady, addError, addLoading],
                        () => {
                            addToGroupLoading.value = addLoading.value
                            if (
                                isReady &&
                                !addError.value &&
                                !addLoading.value
                            ) {
                                offset.value = 0
                                getUserGroupList()
                                message.success('User added to groups')
                                showGroupsPopover.value = false
                                selectedGroupIds.value.ownerGroups = []
                            } else if (addError && addError.value) {
                                message.error(
                                    'Unable to add user to groups, please try again.'
                                )
                            }
                        },
                        { immediate: true }
                    )
                }
                showGroupsPopover.value = false
            }

            const removeUserFromGroup = (group: any) => {
                Modal.confirm({
                    title: `Remove from group`,
                    class: 'remove-from-group-modal',
                    content: () =>
                        h('div', [
                            'Are you sure you want to remove',
                            h('span', [' ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${props.selectedUser.name}`]
                            ),
                            h('span', [' from ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${group.name}`]
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
                        const messageKey = Date.now()
                        const userIds = [props.selectedUser.id]
                        const requestPayload = ref({
                            users: userIds,
                        })
                        const { data, isReady, error, isLoading } =
                            Groups.RemoveMembersFromGroup(
                                group.id,
                                requestPayload
                            )
                        watch(
                            [data, isReady, error, isLoading],
                            () => {
                                removeFromGroupLoading.value[group.id] =
                                    isLoading.value
                                if (isLoading.value) {
                                    message.loading({
                                        content: `Removing ${props.selectedUser.name} from ${group.name}`,
                                        duration: 0,
                                        key: messageKey,
                                    })
                                }
                                if (
                                    isReady &&
                                    !error.value &&
                                    !isLoading.value
                                ) {
                                    offset.value = 0
                                    getUserGroupList()
                                    message.success({
                                        content: `${props.selectedUser.name} removed from ${group.name}`,
                                        duration: 1.5,
                                        key: messageKey,
                                    })
                                    showUserGroups.value = true
                                } else if (error && error.value) {
                                    message.success({
                                        content: `Failed to remove ${props.selectedUser.name} from  ${group.name}, please try again.`,
                                        duration: 1.5,
                                        key: messageKey,
                                    })
                                    removeFromGroupLoading.value[group.id] =
                                        false
                                }
                            },
                            { immediate: true }
                        )
                    },
                })
            }
            const handleAddToGroup = () => {
                // showAddToGroupModal.value = true;
                // showUserGroups.value = false
                showGroupsPopover.value = true
            }
            const handleShowUserGroups = () => {
                // showAddToGroupModal.value = false;
                showUserGroups.value = true
            }

            return {
                groupList,
                totalGroupCount,
                filteredGroupCount,
                handleLoadMore,
                handleSearch,
                handleAddToGroup,
                removeUserFromGroup,
                map,
                getUserGroupList,
                searchText,
                showLoadMore,
                error,
                isLoading,
                addToGroupLoading,
                removeFromGroupLoading,
                showAddToGroupModal,
                addUserToGroups,
                showUserGroups,
                handleShowUserGroups,
                selectedGroupIds,
                showGroupsPopover,
            }
        },
    })
</script>

<style lang="less" scoped>
    .componentHeight {
        height: calc(100vh - 12rem);
    }
    .group-list {
        height: calc(100vh - 14rem) !important;
    }
</style>
<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
