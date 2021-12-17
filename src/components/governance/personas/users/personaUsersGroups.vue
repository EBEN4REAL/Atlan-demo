<template>
    <div class="bg-white">
        <div class="flex items-center mb-6 gap-x-3">
            <div style="width: 300px">
                <SearchAndFilter
                    v-model:value="queryText"
                    class="bg-white w-80"
                    :placeholder="placeholder"
                    size="minimal"
                />
            </div>
            <RaisedTab v-model:active="listType" :data="tabConfig" />

            <a-popover
                placement="left"
                v-model:visible="popoverVisible"
                trigger="click"
                :destroyTooltipOnHide="true"
            >
                <AtlanBtn
                    color="primary"
                    padding="compact"
                    :size="'sm'"
                    data-test-id="add-users"
                    class="items-center px-12 ml-auto"
                    @click="() => setPopoverState(!popoverVisible)"
                    ><span class="text-xl">+</span>
                    <span>Add {{ listType }}</span></AtlanBtn
                >
                <template #content>
                    <div
                        class="flex flex-col items-center px-1 py-4 bg-white rounded"
                        style="width: 270px"
                    >
                        <!-- <OwnersSelector
                            :no-owners-assigned="false"
                            :enableTabs="enableTabs"
                            :data="userGroupData"
                            @change="handleUsersChange"
                        /> -->
                        <OwnersSelector
                            :showNone="false"
                            :enableTabs="enableTabs"
                            selectGroupKey="id"
                            selectUserKey="id"
                            :hideDisabledTabs="true"
                            v-model:modelValue="userGroupData"
                        />
                        <div class="w-full">
                            <div class="flex justify-around">
                                <AtlanBtn
                                    size="sm"
                                    @click="handleCancel"
                                    color="secondary"
                                    padding="compact"
                                    class="w-26"
                                    style="width: 80px"
                                    data-test-id="cancel-owners"
                                    >Cancel</AtlanBtn
                                >
                                <AtlanBtn
                                    @click="handleUpdate"
                                    size="sm"
                                    :disabled="addUsersLoading"
                                    class="flex items-center"
                                    color="primary"
                                    padding="compact"
                                    style="width: 80px"
                                >
                                    <AtlanIcon
                                        v-if="addUsersLoading"
                                        icon="CircleLoader"
                                        style="margin-right: 2.5px"
                                        data-test-id="add-owners"
                                        class="w-4 h-4 animate-spin"
                                    ></AtlanIcon>
                                    <span>Update</span></AtlanBtn
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>

        <div v-if="!usersError">
            <!-- USER TABLE START -->
            <a-table
                :pagination="false"
                v-if="filteredList && listType === 'users'"
                id="userList"
                :key="persona.id"
                class="overflow-hidden border rounded-lg border-300 persona-user-group-table"
                :scroll="{ y: 'calc(100vh - 20rem)' }"
                :table-layout="'fixed'"
                :data-source="filteredList"
                :columns="userColumns"
                :row-key="(user) => user.id"
                data-test-id="user-table"
                :loading="isUsersLoading"
                @change="handleUsersTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="flex ml-2">
                        <span>{{ title }}</span>
                    </div>
                </template>
                <template #name="{ text: user }">
                    <div
                        class="flex items-center align-middle"
                        :data-test-id="user.username"
                    >
                        <avatar
                            :image-url="imageUrl(user.username)"
                            :allow-upload="false"
                            :avatar-name="
                                user.name ||
                                user.username ||
                                user.email ||
                                user.firstName + user.lastName
                            "
                            :avatar-size="26"
                            avatar-shape="circle"
                            class="mr-2"
                        />
                        <div
                            class="truncate cursor-pointer"
                            @click="
                                () => {
                                    showUserPreviewDrawer(user)
                                }
                            "
                        >
                            <span class="text-primary">{{
                                user.name || '-'
                            }}</span>
                            <p class="mb-0 truncate text-gray">
                                @{{ user.username || '-' }}
                            </p>
                        </div>
                    </div>
                </template>
                <template #role="{ text: user }">
                    <div
                        :data-test-id="user.role_object.name"
                        class="inline-flex items-center text-gray-700 rounded"
                    >
                        <div>{{ user.role_object.name || '-' }}</div>
                    </div>
                </template>
                <template #actions="{ text: user }">
                    <a-button-group>
                        <a-tooltip placement="top">
                            <template #title>
                                <span>Remove User</span>
                            </template>
                            <a-popconfirm
                                placement="leftTop"
                                overlay-class-name="popoverConfirm"
                                :title="
                                    getPopoverContent(user, 'remove', 'user')
                                "
                                ok-text="Yes"
                                :ok-type="'default'"
                                cancel-text="Cancel"
                                :icon="false"
                                @confirm="confirmPopover(user, 'user')"
                            >
                                <a-button
                                    size="small"
                                    data-test-id="remove-user"
                                    class="w-8 h-8 rounded"
                                >
                                    <AtlanIcon icon="RemoveUser"></AtlanIcon>
                                </a-button>
                            </a-popconfirm>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-table>

            <!-- <div
                class="flex justify-end max-w-full mt-4"
                v-if="listType === 'users'"
            >
                <Pagination
                    :total-pages="filteredList.length"
                    :loading="isLoading"
                    :page-size="15"
                    v-model:offset="userListAPIParams.offset"
                    @mutate="getUserList"
                />
            </div> -->
        </div>
        <div
            v-else-if="listType === 'users' && usersError"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        data-test-id="try-again"
                        ghost
                        @click="getUserList()"
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>

        <!-- USER TABLE END -->
        <div v-if="!groupsError">
            <a-table
                :pagination="false"
                v-if="filteredList && listType === 'groups'"
                id="groupList"
                :key="persona.id"
                class="overflow-hidden border rounded-lg persona-user-group-table"
                :scroll="{ y: 'calc(100vh - 20rem)' }"
                :table-layout="'fixed'"
                data-test-id="group-table"
                :data-source="filteredList"
                :columns="groupColumns"
                :row-key="(group) => group.id"
                :loading="isGroupsLoading"
                @change="handleGroupsTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="flex ml-2">
                        <span>{{ title }}</span>
                    </div>
                </template>
                <template #group="{ text: group }">
                    <div
                        class="flex items-center align-middle"
                        :data-test-id="group.alias"
                    >
                        <div
                            class="truncate cursor-pointer"
                            @click="
                                () => {
                                    showGroupPreviewDrawer(group)
                                }
                            "
                        >
                            <span class="text-primary">{{
                                group.name || '-'
                            }}</span>
                        </div>
                    </div>
                </template>

                <template #actions="{ text: group }">
                    <a-button-group>
                        <a-tooltip placement="top">
                            <template #title>
                                <span>Remove group</span>
                            </template>
                            <a-popconfirm
                                placement="leftTop"
                                overlay-class-name="popoverConfirm"
                                :title="
                                    getPopoverContent(group, 'remove', 'group')
                                "
                                ok-text="Remove"
                                :ok-type="'default'"
                                cancel-text="Cancel"
                                @confirm="confirmPopover(group, 'group')"
                            >
                                <a-button size="small" class="w-8 h-8 rounded">
                                    <AtlanIcon
                                        icon="RemoveUser"
                                    ></AtlanIcon> </a-button
                            ></a-popconfirm>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-table>

            <!-- <div
                class="flex justify-end max-w-full mt-4"
                v-if="listType === 'groups'"
            >
                <Pagination
                    :total-pages="paginationGroups.total"
                    :loading="isLoading"
                    :page-size="paginationGroups.pageSize"
                    v-model:offset="groupListAPIParams.offset"
                    @mutate="getGroupList"
                />
            </div> -->
        </div>

        <div
            v-else-if="listType === 'groups' && groupsError"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        data-test-id="try-again"
                        ghost
                        @click="getGroupList()"
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import EmptyView from '@common/empty/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import OwnersSelector from '@common/facet/owners/index.vue'

    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from '../composables/usePersonaUsers'
    import usePersonaGroups from '../composables/usePersonaGroups'
    import usePersonaService from '../composables/usePersonaService'
    import Avatar from '~/components/common/avatar/avatar.vue'
    import ErrorView from '@common/error/index.vue'
    import { reFetchList } from '../composables/usePersonaList'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import Pagination from '@/common/list/pagination.vue'
    import { useDebounceFn } from '@vueuse/core'

    import {
        isEditing,
        selectedPersonaDirty,
    } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            Avatar,
            AtlanBtn,
            RaisedTab,
            SearchAndFilter,
            OwnersSelector,
            ErrorView,
            Pagination,
            EmptyView,
        },
        props: {
            persona: {
                type: Object as PropType<IPurpose>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            console.log(persona, 'persona')
            const listType: Ref<'users' | 'groups'> = ref('users')
            const enableTabs = computed(() => [listType.value])

            const tabConfig = [
                { key: 'users', label: 'Users' },
                { key: 'groups', label: 'Groups' },
            ]

            const queryText = ref('')
            const popoverVisible = ref(false)
            const addUsersLoading = ref(false)

            const { usePersonaUserList, userColumns } = usePersonaUsers
            const { usePersonaGroupList, groupColumns } = usePersonaGroups
            const { updateUsers } = usePersonaService()
            const {
                getUserList,
                userListAPIParams,
                STATES: USER_STATES,
                state: userState,
                userList,
                isLoading: isUsersLoading,
                error: usersError,
            } = usePersonaUserList(persona)
            const {
                getGroupList,
                STATES: GROUP_STATES,
                state: groupState,
                groupList,
                isLoading: isGroupsLoading,
                error: groupsError,
            } = usePersonaGroupList(persona)

            const filteredList = computed(() => {
                const qry = queryText.value
                if (listType.value === 'users') {
                    if (queryText.value)
                        return userList.value.filter(
                            (usr) =>
                                usr.email?.toLowerCase().includes(qry) ||
                                usr.lastName?.toLowerCase().includes(qry) ||
                                usr.firstName?.toLowerCase().includes(qry) ||
                                usr.username?.toLowerCase().includes(qry)
                        )
                    return userList.value
                }
                if (listType.value === 'groups') {
                    if (queryText.value)
                        return groupList.value.filter((group) =>
                            group.name?.toLowerCase().includes(qry)
                        )
                    return groupList.value
                }
                return []
            })

            const placeholder = computed(
                () =>
                    `Search from ${
                        listType.value === 'users'
                            ? userList.value.length
                            : groupList.value.length
                    } ${listType.value}`
            )

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                showUserPreview()
            }

            const handleUpdate = () => {
                if (persona.value?.id) {
                    addUsersLoading.value = true
                    const userIds = userGroupData.value.ownerUsers ?? []
                    const groupIds = userGroupData.value.ownerGroups ?? []
                    updateUsers({
                        id: persona.value.id,
                        users: userIds,
                        groups: groupIds,
                    })
                        .then(() => {
                            addUsersLoading.value = false
                            popoverVisible.value = false
                            selectedPersonaDirty.value.users =
                                userGroupData.value.ownerUsers ?? []
                            selectedPersonaDirty.value.groups =
                                userGroupData.value.ownerGroups ?? []
                            persona.value.users =
                                userGroupData.value.ownerUsers ?? []
                            persona.value.groups =
                                userGroupData.value.ownerGroups ?? []
                            getUserList()
                            getGroupList()
                        })
                        .catch((e) => {
                            addUsersLoading.value = false
                            message.error('Failed to add users')
                            console.log('Failed to add users', e)
                        })
                }
            }

            const setPopoverState = (state: boolean) => {
                popoverVisible.value = state
            }

            const userGroupData: Ref<{
                ownerUsers: string[]
                ownerGroups: string[]
            }> = ref({
                ownerUsers: persona.value.users ?? [],
                ownerGroups: persona.value.groups ?? [],
            })

            const getPopoverContent = (
                user: any,
                action: 'remove',
                type: 'user' | 'group'
            ) => {
                return `Are you sure you want to ${action} ${
                    user.name || user.username || user.email || ''
                }?`
            }

            const confirmPopover = (
                userOrGroup: any,
                type: 'user' | 'group'
            ) => {
                addUsersLoading.value = true

                // console.log(persona.value, 'persona')
                let updatedUsersIds = userGroupData.value.ownerUsers ?? []
                let updatedGroupIds = userGroupData.value.ownerGroups ?? []
                if (type === 'user') {
                    updatedUsersIds = userGroupData.value.ownerUsers.filter(
                        (userId) => userId !== userOrGroup.id
                    )
                } else {
                    updatedGroupIds = userGroupData.value.ownerGroups.filter(
                        (groupId) => groupId !== userOrGroup.id
                    )
                }
                persona.value.users = updatedUsersIds
                selectedPersonaDirty.value.users = updatedUsersIds
                persona.value.groups = updatedGroupIds
                selectedPersonaDirty.value.groups = updatedGroupIds

                updateUsers({
                    id: persona.value.id,
                    users: updatedUsersIds,
                    groups: updatedGroupIds,
                })
                    .then(() => {
                        addUsersLoading.value = false
                        userGroupData.value.ownerUsers = updatedUsersIds
                        userGroupData.value.ownerGroups = updatedGroupIds

                        getUserList()
                        getGroupList()
                    })
                    .catch((e) => {
                        if (type === 'user') {
                            persona.value.users = [
                                ...persona.value.users,
                                userOrGroup.username,
                            ]
                        } else {
                            persona.value.groups = [
                                ...persona.value.groups,
                                userOrGroup.alias,
                            ]
                        }
                        addUsersLoading.value = false
                        message.error('Failed to add users')
                        console.log('Failed to add users', e)
                    })
            }

            /* Users related functions */
            const handleUsersTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                if (Object.keys(sorter).length) {
                    let sortValue = 'firstName'
                    if (sorter.order && sorter.column && sorter.column.sortKey)
                        sortValue = `${sorter.order === 'descend' ? '-' : ''}${
                            sorter.column.sortKey
                        }`
                    userListAPIParams.value.sort = sortValue
                }
                getUserList()
            }
            /* Group related functions */
            const handleGroupsTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                getGroupList()
            }

            // BEGIN: GROUP PREVIEW
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()
            const showGroupPreviewDrawer = (
                group: any,
                activeTabKey = 'about'
            ) => {
                setGroupUniqueAttribute(group.id)
                showGroupPreview()
            }
            const handleCancel = () => {
                userGroupData.value.ownerUsers = persona.value.users ?? []
                userGroupData.value.ownerGroups = persona.value.groups ?? []
                setPopoverState(false)
            }

            watch(persona, () => {
                userGroupData.value.ownerUsers = persona.value.users ?? []
                userGroupData.value.ownerGroups = persona.value.groups ?? []
            })

            return {
                handleCancel,
                userState,
                USER_STATES,
                showGroupPreviewDrawer,
                getGroupList,
                getUserList,
                enableTabs,
                getPopoverContent,
                confirmPopover,
                groupState,
                GROUP_STATES,
                addUsersLoading,
                handleUpdate,
                setPopoverState,
                popoverVisible,
                placeholder,
                userList,
                tabConfig,
                queryText,
                filteredList,
                listType,
                userColumns,
                imageUrl,
                handleGroupsTableChange,
                showUserPreviewDrawer,
                userGroupData,
                groupColumns,
                groupList,
                /* Users */
                handleUsersTableChange,
                isGroupsLoading,
                isUsersLoading,
                usersError,
                groupsError,
            }
        },
    })
</script>
