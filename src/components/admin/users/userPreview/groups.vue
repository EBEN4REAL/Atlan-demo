<template>
    <div class="px-4 py-2 mb-3">
        <div class="flex items-center justify-between mb-4">
            <div class="text-lg font-bold">Groups</div>
            <div v-if="showUserGroups" v-auth="map.ADD_USER_GROUP">
                <a-button @click="handleAddToGroup">
                    <div class="flex items-center">
                        <AtlanIcon icon="Add" class="mr-2"></AtlanIcon>
                        <span>Add to group</span>
                    </div>
                </a-button>
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
        <div v-if="showUserGroups" v-auth="map.LIST_GROUPS">
            <div class="flex flex-row justify-between">
                <div class="w-full">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search ${
                            selectedUser.group_count ?? 0
                        }  groups`"
                        class="mr-1"
                        size="minimal"
                        @change="handleSearch"
                    />
                </div>
            </div>
            <div
                v-if="!selectedUser.group_count"
                class="flex flex-col items-center justify-center"
            >
                <div
                    class="flex items-center justify-center w-full  componentHeight"
                >
                    <EmptyState desc="This user is not part of any group." />
                </div>
            </div>
            <div
                v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
                class="flex flex-col items-center justify-center h-full mt-3 bg-white "
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
                            <AtlanIcon icon="Refresh" class="mr-2" />Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
            <div v-else-if="searchText && !filteredGroupCount" class="mt-2">
                {{ `No group with name ${searchText} found.` }}
            </div>
            <div v-else class="mt-4">
                <div v-for="group in groupList" :key="group.id" class="">
                    <div
                        class="flex items-center justify-between px-3 py-2  group hover:bg-gray-100"
                    >
                        <div class="flex items-center">
                            <div class="">
                                <div class="mb-1 text-primary">
                                    <span class="mr-2">{{ group.name }}</span>
                                </div>
                                <div class="text-sm text-gray-500">
                                    @{{ group.alias
                                    }}<span
                                        v-if="group.memberCountString"
                                        class="text-gray-500"
                                        ><span class="mx-1">|</span
                                        >{{ group.memberCountString }}</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="!removeFromGroupLoading[group.id]"
                            v-auth="map.REMOVE_USER_GROUP"
                            class="opacity-0 cursor-pointer  text-error group-hover:opacity-100"
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
                </div>
                <div
                    v-if="
                        [STATES.PENDING].includes(state) ||
                        [STATES.VALIDATING].includes(state)
                    "
                    class="flex justify-center mt-3"
                >
                    <AtlanIcon icon="CircleLoader" class="h-5 animate-spin" />
                </div>
                <div v-else-if="showLoadMore" class="flex justify-center mt-3">
                    <a-button @click="handleLoadMore">load more</a-button>
                </div>
            </div>
        </div>
        <div v-else-if="!showUserGroups" v-auth="map.LIST_GROUPS">
            <GroupList
                :add-to-group-loading="addToGroupLoading"
                :show-back-button="false"
                :show-add-button="false"
                @updateSelectedGroups="updateSelectedGroups"
                @showUserGroups="handleShowUserGroups"
                @addUserToGroups="addUserToGroups"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue'
    import { defineComponent, computed, reactive, ref, watch } from 'vue'
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
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'UserPreviewGroups',
        components: {
            ErrorView,
            GroupList,
            EmptyState,
            SearchAndFilter,
            AtlanIcon,
        },
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
        },
        setup(props, context) {
            const showUserGroups = ref(true)
            const searchText = ref('')
            const showAddToGroupModal = ref(false)
            const addToGroupLoading = ref(false)
            const removeFromGroupLoading = ref({})
            const selectedGroupIds = ref([])
            const groupListAPIParams = reactive({
                userId: props.selectedUser.id,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'name',
                    filter: {},
                },
            })
            const {
                groupList,
                totalGroupCount,
                filteredGroupCount,
                getUserGroupList,
                state,
                STATES,
            } = getUserGroups(groupListAPIParams)
            const handleSearch = useDebounceFn((input: any) => {
                groupListAPIParams.params.filter = searchText.value
                    ? {
                          $or: [
                              { name: { $ilike: `%${searchText.value}%` } },
                              { alias: { $ilike: `%${searchText.value}%` } },
                          ],
                      }
                    : {}
                groupListAPIParams.params.offset = 0
                getUserGroupList()
            }, 200)
            const handleLoadMore = () => {
                groupListAPIParams.params.offset =
                    groupListAPIParams.params.offset +
                    groupListAPIParams.params.limit
                getUserGroupList()
            }
            const showLoadMore = computed(() =>
                getIsLoadMore(
                    // TODO: check if there's a better way access memberList and not use ref in a ref
                    groupList.value.length,
                    groupListAPIParams.params.offset,
                    groupListAPIParams.params.limit,
                    searchText.value
                        ? filteredGroupCount.value
                        : totalGroupCount.value
                )
            )
            const addUserToGroups = async () => {
                const groupIds = [...selectedGroupIds.value]
                if (groupIds && groupIds.length) {
                    const requestPayload = ref({
                        groups: groupIds,
                    })
                    const { data, isReady, error, isLoading } = Users.AddGroups(
                        props.selectedUser.id,
                        requestPayload
                    )
                    watch(
                        [data, isReady, error, isLoading],
                        () => {
                            addToGroupLoading.value = isLoading.value
                            if (isReady && !error.value && !isLoading.value) {
                                groupListAPIParams.params.offset = 0
                                getUserGroupList()
                                message.success('User added to groups')
                                showUserGroups.value = true
                            } else if (error && error.value) {
                                message.error(
                                    'Unable to add user to groups, please try again.'
                                )
                            }
                        },
                        { immediate: true }
                    )
                }
                showUserGroups.value = true
            }

            const removeUserFromGroup = (group: any) => {
                const userIds = [props.selectedUser.id]
                const requestPayload = ref({
                    users: userIds,
                })
                const { data, isReady, error, isLoading } =
                    Groups.RemoveMembersFromGroup(group.id, requestPayload)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        removeFromGroupLoading.value[group.id] = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            groupListAPIParams.params.offset = 0
                            getUserGroupList()
                            message.success(
                                `${props.selectedUser.name} removed from ${group.name}`
                            )
                            showUserGroups.value = true
                        } else if (error && error.value) {
                            message.error(
                                `Failed to remove ${props.selectedUser.name} from  ${group.name}, please try again.`
                            )
                            removeFromGroupLoading.value[group.id] = false
                        }
                    },
                    { immediate: true }
                )
            }
            const handleAddToGroup = () => {
                // showAddToGroupModal.value = true;
                showUserGroups.value = false
            }
            const handleShowUserGroups = () => {
                // showAddToGroupModal.value = false;
                showUserGroups.value = true
            }
            const updateSelectedGroups = (groupList) => {
                selectedGroupIds.value = [...groupList]
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
                state,
                STATES,
                addToGroupLoading,
                removeFromGroupLoading,
                showAddToGroupModal,
                addUserToGroups,
                updateSelectedGroups,
                showUserGroups,
                handleShowUserGroups,
                selectedGroupIds,
            }
        },
    })
</script>

<style lang="less" scoped>
    .componentHeight {
        height: calc(100vh - 12rem);
    }
</style>
