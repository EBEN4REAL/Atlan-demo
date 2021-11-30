<template>
    <div>
        <div class="flex items-center mb-6 gap-x-3">
            <div style="width: 300px">
                <SearchAndFilter
                    v-model:value="queryText"
                    class="bg-white w-80"
                    :placeholder="placeholder"
                    size="bordered"
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
                    color="secondary"
                    padding="compact"
                    data-test-id="add-users"
                    class="items-center ml-auto"
                    @click="() => setPopoverState(!popoverVisible)"
                    ><span class="text-xl">+</span>
                    <span>Add {{ listType }}</span></AtlanBtn
                >
                <template #content>
                    <div
                        class="flex flex-col items-center px-3 py-4 bg-white rounded "
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
                            v-model:modelValue="userGroupData"
                            @change="handleUsersChange"
                        />
                        <div class="w-full mt-2">
                            <div class="flex justify-end text-xs">
                                <span
                                    v-if="userGroupData.ownerUsers?.length > 0"
                                    >{{
                                        `${userGroupData.ownerUsers?.length} user(s)`
                                    }}</span
                                >
                                <span
                                    v-if="
                                        userGroupData.ownerUsers?.length &&
                                        userGroupData.ownerGroups?.length
                                    "
                                    >{{ `&nbsp;&` }}</span
                                >
                                <span
                                    v-if="userGroupData.ownerGroups?.length > 0"
                                    >{{
                                        ` &nbsp;${userGroupData.ownerGroups?.length} group(s)`
                                    }}</span
                                >
                                <span
                                    v-if="
                                        userGroupData.ownerGroups?.length > 0 ||
                                        userGroupData.ownerUsers?.length > 0
                                    "
                                    >{{ `&nbsp;selected` }}</span
                                >
                            </div>
                            <div class="flex justify-between mt-2">
                                <AtlanBtn
                                    size="sm"
                                    @click="() => setPopoverState(false)"
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
                                    <span>Add</span></AtlanBtn
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>
        <div
            v-if="
                ![USER_STATES.ERROR, USER_STATES.STALE_IF_ERROR].includes(
                    userState
                )
            "
        >
            <!-- USER TABLE START -->
            <a-table
                v-if="filteredList && listType === 'users'"
                id="userList"
                class="border rounded border-300"
                :key="persona.id"
                :scroll="{ y: 'calc(100vh - 20rem)' }"
                :table-layout="'fixed'"
                :data-source="filteredList"
                :columns="userColumns"
                :row-key="(user) => user.id"
                data-test-id="user-table"
                :class="$style.table"
                :loading="
                    [USER_STATES.PENDING].includes(userState) ||
                    [USER_STATES.VALIDATING].includes(userState)
                "
                @change="handleUsersTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="flex justify-center">
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
                                user.first_name + user.last_name
                            "
                            :avatar-size="40"
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
                        class="
                            inline-flex
                            items-center
                            px-2
                            py-0.5
                            rounded
                            text-gray-500
                        "
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
                                :title="
                                    getPopoverContent(user, 'remove', 'user')
                                "
                                ok-text="Yes"
                                :ok-type="'default'"
                                cancel-text="Cancel"
                                @confirm="confirmPopover(user, 'user')"
                            >
                                <a-button
                                    size="small"
                                    data-test-id="remove-user"
                                    class="ml-3.5 w-8 h-8 rounded"
                                >
                                    <AtlanIcon
                                        icon="RemoveUser"
                                    ></AtlanIcon> </a-button
                            ></a-popconfirm>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-table>
        </div>
        <div
            v-else-if="
                listType === 'users' &&
                [USER_STATES.ERROR, USER_STATES.STALE_IF_ERROR].includes(
                    userState
                )
            "
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
        <div
            v-if="
                ![GROUP_STATES.ERROR, GROUP_STATES.STALE_IF_ERROR].includes(
                    groupState
                )
            "
        >
            <a-table
                v-if="filteredList && listType === 'groups'"
                id="groupList"
                :key="persona.id"
                :class="$style.table"
                :scroll="{ y: 'calc(100vh - 20rem)' }"
                :table-layout="'fixed'"
                data-test-id="group-table"
                :data-source="filteredList"
                :columns="groupColumns"
                :row-key="(group) => group.id"
                :loading="
                    [GROUP_STATES.PENDING].includes(groupState) ||
                    [GROUP_STATES.VALIDATING].includes(groupState)
                "
                @change="handleGroupsTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="flex justify-center">
                        <span>{{ title }}</span>
                    </div>
                </template>
                <template #group="{ text: group }">
                    <div
                        class="flex items-center align-middle"
                        :data-test-id="group.alias"
                    >
                        <avatar
                            :image-url="imageUrl(group.alias)"
                            :allow-upload="false"
                            :avatar-name="group.alias"
                            :avatar-size="40"
                            class="mr-2"
                        />
                        <div
                            class="truncate cursor-pointer"
                            @click="
                                () => {
                                    showGroupPreviewDrawer(group)
                                }
                            "
                        >
                            <span class="text-primary">{{
                                group.alias || '-'
                            }}</span>
                            <p class="mb-0 truncate text-gray">
                                @{{ group.alias || '-' }}
                            </p>
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
                                :title="
                                    getPopoverContent(group, 'remove', 'group')
                                "
                                ok-text="Yes"
                                :ok-type="'default'"
                                cancel-text="Cancel"
                                @confirm="confirmPopover(group, 'group')"
                            >
                                <a-button
                                    size="small"
                                    class="ml-3.5 w-8 h-8 rounded"
                                >
                                    <AtlanIcon
                                        icon="RemoveUser"
                                    ></AtlanIcon> </a-button
                            ></a-popconfirm>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-table>
        </div>
        <div
            v-else-if="
                listType === 'groups' &&
                [GROUP_STATES.ERROR, GROUP_STATES.STALE_IF_ERROR].includes(
                    groupState
                )
            "
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

    import { useGroupPreview } from '~/composables/drawer/showGroupPreview'

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
            } = usePersonaUserList(persona)
            const {
                getGroupList,
                STATES: GROUP_STATES,
                state: groupState,
                groupList,
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

            const handleUsersChange = (data: {
                ownerUsers: string[]
                ownerGroups: string[]
            }) => {
                persona.value.users = data?.ownerUsers ?? []
                persona.value.groups = data?.ownerGroups ?? []
                return
            }
            /* Users related functions */
            const handleUsersTableChange = (
                pagination: any,
                filters: any,
                sorter: any
            ) => {
                if (Object.keys(sorter).length) {
                    let sortValue = 'first_name'
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

            watch(persona, () => {
                userGroupData.value.ownerUsers = persona.value.users ?? []
                userGroupData.value.ownerGroups = persona.value.groups ?? []
            })

            return {
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
                handleUsersChange,
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
            }
        },
    })
</script>
<style lang="less" module>
    .table {
        :global(.ant-table-measure-row) {
            display: none;
        }
        :global(.ant-table-pagination.ant-pagination) {
            @apply m-4 !important;
        }
    }
</style>
