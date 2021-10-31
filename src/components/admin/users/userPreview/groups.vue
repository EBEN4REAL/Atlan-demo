<template>
    <div class="mb-3">
        <div class="flex items-center justify-between mb-4">
            <div class="text-lg font-bold">Groups</div>
            <div v-if="showUserGroups">
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
        <div v-if="showUserGroups">
            <div class="flex flex-row justify-between">
                <div class="w-full">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :placeholder="`Search ${selectedUser.group_count}  groups`"
                        @change="handleSearch"
                        class="mr-1"
                        size="minimal"
                    />
                </div>
                <!-- <div>
                    <a-button @click="handleAddToGroup">
                        <div class="flex items-center">
                            <AtlanIcon icon="Add" class="mr-2"></AtlanIcon>
                            <span>Add to group</span>
                        </div>
                    </a-button>
                </div> -->
            </div>
            <div
                v-if="!selectedUser.group_count"
                class="flex flex-col items-center justify-center"
            >
                <div class="mt-6 text-center">
                    <p class="text-lg">This user is not part of any group.</p>
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
                            <fa icon="fal sync" class="mr-2"></fa>Try again
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
                            class="opacity-0 cursor-pointer  text-error group-hover:opacity-100"
                            @click="() => removeUserFromGroup(group)"
                        >
                            Remove
                        </div>
                        <div
                            v-else
                            class="flex cursor-default text-error-muted"
                        >
                            <fa
                                style="vertical-align: middle"
                                icon="fal circle-notch"
                                class="mr-1 animate-spin"
                            />
                            <div>Removing...</div>
                        </div>
                        <!-- <div class="font-bold">
                            <div
                                v-if="removeFromGroupLoading[group.id]"
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
                                @click="() => removeUserFromGroup(group)"
                            >
                                Remove
                            </div>
                        </div> -->
                    </div>
                </div>
                <div
                    v-if="
                        [STATES.PENDING].includes(state) ||
                        [STATES.VALIDATING].includes(state)
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
        <div v-else-if="!showUserGroups">
            <GroupList
                :add-to-group-loading="addToGroupLoading"
                @updateSelectedGroups="updateSelectedGroups"
                @showUserGroups="handleShowUserGroups"
                @addUserToGroups="addUserToGroups"
                :showBackButton="false"
                :showAddButton="false"
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
    import {
        pluralizeString,
        getNameInitials,
        getNameInTitleCase,
    } from '~/utils/string'
    import { getIsLoadMore } from '~/utils/isLoadMore'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'UserPreviewGroups',
        components: {
            ErrorView,
            GroupList,
            SearchAndFilter,
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
                getNameInitials,
                getNameInTitleCase,
                pluralizeString,
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

<style lang="less" module></style>