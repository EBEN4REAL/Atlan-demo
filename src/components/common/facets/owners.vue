<template>
    <div class="px-4 py-1 pb-3 pl-5">
        <div class="flex justify-between">
            <a-input
                v-input-focus
                :placeholder="
                    activeOwnerTabKey === '1'
                        ? `Search ${userList?.length} users`
                        : `Search ${groupList?.length} groups`
                "
                class="rounded"
                @change="handleOwnerSearch"
            >
                <template #prefix>
                    <fa icon="fal search" />
                </template>
            </a-input>
            <div class="mr-1">
                <a-popover trigger="click" placement="rightTop">
                    <template #content class="rounded">
                        <div class="p-0">
                            <div class="flex justify-between mb-2">
                                <p class="mb-0 text-sm text-gray-500">
                                    Sort by
                                </p>
                            </div>
                            <CustomRadioButton
                                class="pb-2"
                                :list="ownerSortOptions"
                                v-model:data="ownersFilterOptionsData"
                                @change="handleSortChange"
                            />
                        </div>
                    </template>
                    <div v-if="ownersFilterOptionsData !== null" class="mr-1">
                        <a-badge
                            :dot="ownersFilterOptionsData !== null"
                            :class="$style.badge"
                        >
                            <a-button class="px-2 py-1 ml-2 rounded">
                                <span class="flex items-center justify-center">
                                    <fa
                                        icon="fas sort-amount-up"
                                        class="hover:text-primary-500"
                                    />
                                </span>
                            </a-button>
                        </a-badge>
                    </div>
                    <div v-else class="mr-1">
                        <a-button class="px-2 py-1 ml-2 rounded">
                            <span class="flex items-center justify-center">
                                <fa
                                    icon="fas sort-amount-up"
                                    class="hover:text-primary-500"
                                />
                            </span>
                        </a-button>
                    </div>
                </a-popover>
            </div>
        </div>

        <div class="relative w-full">
            <a-tabs
                v-model:activeKey="activeOwnerTabKey"
                :class="$style.previewtab"
            >
                <a-tab-pane key="1">
                    <template #tab>
                        <span
                            class="text-sm"
                            :class="activeOwnerTabKey == '1' ? 'font-bold' : ''"
                            >Users</span
                        >
                        <span class="ml-2 chip" v-if="totalUsersCount > 0">{{
                            totalUsersCount
                        }}</span>
                    </template>
                    <div class="w-full overflow-y-auto h-44">
                        <a-checkbox-group
                            v-model:value="data.userValue"
                            class="w-full"
                            @change="handleUsersChange"
                            v-if="STATES.SUCCESS === userOwnerState"
                        >
                            <div class="flex flex-col w-full">
                                <a-checkbox
                                    v-for="item in userList"
                                    :key="item.username"
                                    :value="item.username"
                                    class="w-full mb-3"
                                    :class="
                                        item.username === myUsername
                                            ? 'border-b pb-3'
                                            : ''
                                    "
                                >
                                    <div
                                        v-if="item.username === myUsername"
                                        class="inline-flex capitalize"
                                    >
                                        {{ item.username }}

                                        <span class="font-bold">
                                            {{ '&nbsp;(me)' }}
                                        </span>
                                    </div>
                                    <span v-else class="capitalize">
                                        {{ item.username }}
                                    </span>
                                </a-checkbox>
                            </div>
                        </a-checkbox-group>
                        <div
                            v-else
                            class="flex items-center justify-center mt-3"
                        >
                            <a-spin
                                size="small"
                                class="mr-2 leading-none"
                            ></a-spin
                            ><span>Fetching users</span>
                        </div>
                    </div>
                    <div
                        v-if="totalUsersCount - userList.length > 0"
                        class="mt-2"
                    >
                        <div
                            v-if="
                                STATES.SUCCESS === userOwnerState &&
                                showMoreUsers
                            "
                            class="flex items-center w-auto mb-0 font-bold text-center cursor-pointer select-none  outlined text-primary"
                            @click="toggleShowMore"
                        >
                            {{
                                `Show ${totalUsersCount - userList.length} more`
                            }}
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span
                            class="text-sm"
                            :class="activeOwnerTabKey == '2' ? 'font-bold' : ''"
                            >Groups</span
                        >
                        <span class="chip" v-if="totalGroupCount > 0">
                            {{ totalGroupCount }}
                        </span>
                    </template>
                    <div class="overflow-y-auto h-44">
                        <a-checkbox-group
                            v-if="STATES.SUCCESS === groupOwnerState"
                            v-model:value="data.groupValue"
                            @change="handleGroupsChange"
                        >
                            <div class="flex flex-col w-full">
                                <a-checkbox
                                    v-for="item in groupList"
                                    :key="item.name"
                                    :value="item.name"
                                    class="mb-3 capitalize"
                                >
                                    {{ item.name }}
                                </a-checkbox>
                            </div>
                        </a-checkbox-group>
                        <div v-else class="flex items-center justify-center">
                            <a-spin
                                size="small"
                                class="mr-2 leading-none"
                            ></a-spin
                            ><span>Fetching groups</span>
                        </div>
                    </div>
                    <div
                        v-if="totalGroupCount - groupList.length > 0"
                        class="mt-2"
                    >
                        <div
                            v-if="
                                GROUPSTATES.SUCCESS === groupOwnerState &&
                                showMoreGroups
                            "
                            class="flex items-center w-auto mb-0 font-bold text-center cursor-pointer select-none  outlined text-primary"
                            @click="toggleShowMoreGroups"
                        >
                            {{
                                `Show ${
                                    totalGroupCount - groupList.length
                                } more`
                            }}
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
            <!-- <div>
                <a-checkbox
                    v-model:checked="noOwnersAssigned"
                    class="pt-4 border-t"
                >
                    no owners assigned
                </a-checkbox>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, toRefs, watch } from 'vue'
    import Groups from '@common/selector/groups/index.vue'
    import Users from '@common/selector/users/index.vue'
    import { Collapse } from '~/types'
    import { Components } from '~/api/atlas/client'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import { userInterface } from '~/types/users/user.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            Groups,
            Users,
            CustomRadioButton,
        },
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const now = ref(true)
            const { data } = toRefs(props)
            const activeOwnerTabKey = ref('1')
            const showMoreUsers = ref(true)
            const showMoreGroups = ref(true)
            const noOwnersAssigned = ref(false)
            // own info
            const { username: myUsername, name: myName } = whoami()

            const criterion: Ref<Components.Schemas.FilterCriteria[]> = ref([])
            console.log(
                'propsValue',
                data.value.userValue,
                data.value.groupValue
            )

            const handleUsersChange = () => {
                handleChange()
            }

            const handleGroupsChange = () => {
                handleChange()
            }
            const handleChange = () => {
                data.value.userValue.forEach((name: string) => {
                    criterion.value.push({
                        attributeName: 'ownerUsers',
                        attributeValue: name,
                        operator: 'contains',
                    })
                })
                data.value.groupValue.forEach((groupname: string) => {
                    criterion.value.push({
                        attributeName: 'ownerGroups',
                        attributeValue: groupname,
                        operator: 'contains',
                    })
                })

                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'OR',
                        criterion: criterion.value,
                    } as Components.Schemas.FilterCriteria,
                })
                criterion.value = []
            }

            const handleOwnerSearch = (e: Event) => {
                const queryText = (<HTMLInputElement>e.target).value
                if (activeOwnerTabKey.value === '1') {
                    handleUserSearch(queryText)
                } else if (activeOwnerTabKey.value === '2') {
                    // for groups
                    handleGroupSearch(queryText)
                }
            }
            const {
                list: listUsers,
                total: totalUsersCount,
                filtered,
                state: userOwnerState,
                STATES,
                mutate: mutateUsers,
                setLimit: setLimit,
                handleSearch: handleUserSearch,
            } = fetchUserList(now)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
                STATES: GROUPSTATES,
                state: groupOwnerState,
                mutate: mutateGroups,
                setLimit: setGroupLimit,
            } = fetchGroupList(now)
            const onSelectUser = (user: userInterface) => {
                // unselect if already selected
                if (data.value.userValue.includes(user.username)) {
                    const index = data.value.userValue.indexOf(user.username)
                    if (index > -1) {
                        data.value.userValue.splice(index, 1)
                    }
                } else {
                    data.value.userValue.push(user.username)
                }
            }
            const onSelectGroup = (group: groupInterface) => {
                // unselect if already selected
                if (data.value.groupValue.includes(group.name)) {
                    const index = data.value.groupValue.indexOf(group.name)
                    if (index > -1) {
                        data.value.groupValue.splice(index, 1)
                    }
                } else {
                    data.value.groupValue.push(group.name)
                }
            }
            function isOwner(username: string, owners: string[]) {
                return owners.includes(username)
            }

            const ownersFilterOptionsData = ref('asc')
            const ownerSortOptions = [
                {
                    id: 'asc',
                    label: 'A-Z',
                },
                {
                    id: 'dsc',
                    label: 'Z-A',
                },
            ]
            const userList: Ref<userInterface[]> = ref([])
            const groupList: Ref<groupInterface[]> = ref([])
            watch(
                [listUsers, listGroups],
                () => {
                    userList.value = sortClassificationsByOrder(
                        ownersFilterOptionsData.value,
                        listUsers,
                        'username'
                    )
                    // removing own username from list
                    let ownUserObj: userInterface = {}
                    userList.value = userList.value.filter((user) => {
                        if (user.username === myUsername.value) {
                            ownUserObj = user
                        }
                        return user.username !== myUsername.value
                    })
                    console.log(ownUserObj, 'ownUser')
                    userList.value = [ownUserObj, ...userList.value]
                    groupList.value = sortClassificationsByOrder(
                        ownersFilterOptionsData.value,
                        listGroups,
                        'name'
                    )
                },
                {
                    immediate: true,
                }
            )

            function handleSortChange(sortingOrder: string) {
                userList.value = sortClassificationsByOrder(
                    sortingOrder,
                    listUsers,
                    'username'
                )
                // removing own username from list
                let ownUserObj: userInterface = {}
                userList.value = userList.value.filter((user) => {
                    if (user.username === myUsername.value) {
                        ownUserObj = user
                    }
                    return user.username !== myUsername.value
                })
                userList.value = [ownUserObj, ...userList.value]
                groupList.value = sortClassificationsByOrder(
                    ownersFilterOptionsData.value,
                    listGroups,
                    'name'
                )
            }

            function sortClassificationsByOrder(
                sortingOrder: string,
                data: Ref<userInterface[] | groupInterface[]>,
                key: string
            ) {
                switch (sortingOrder) {
                    case 'asc': {
                        let modifiedData: userInterface[] = []
                        modifiedData = data.value.sort((dataA, dataB) => {
                            const a = dataA[key]
                            const b = dataB[key]
                            if (a < b) {
                                return -1
                            }
                            if (a > b) {
                                return 1
                            }
                            return 0
                        })
                        return modifiedData
                    }
                    case 'dsc': {
                        let modifiedData: groupInterface[] = []
                        modifiedData = data.value.sort((dataA, dataB) => {
                            const a = dataA[key]
                            const b = dataB[key]
                            if (a < b) {
                                return 1
                            }
                            if (a > b) {
                                return -1
                            }
                            return 0
                        })
                        return modifiedData
                    }
                }
            }
            function toggleShowMore() {
                showMoreUsers.value = !showMoreUsers.value
                setLimit(totalUsersCount.value)
                mutateUsers()
            }
            function toggleShowMoreGroups() {
                showMoreGroups.value = !showMoreGroups.value
                setGroupLimit(totalGroupCount.value)
                mutateGroups()
            }

            return {
                data,
                noOwnersAssigned,
                totalUsersCount,
                totalGroupCount,
                userOwnerState,
                groupOwnerState,
                STATES,
                GROUPSTATES,
                ownersFilterOptionsData,
                ownerSortOptions,
                myUsername,
                showMoreGroups,
                onSelectGroup,
                isOwner,
                onSelectUser,
                userList,
                groupList,
                handleOwnerSearch,
                activeOwnerTabKey,
                toggleShowMoreGroups,
                toggleShowMore,
                handleChange,
                handleUsersChange,
                handleGroupsChange,
                handleSortChange,
                showMoreUsers,
            }
        },
        mounted() {},
    })
</script>

<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owner-child {
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }
    // .owner-child:nth-child(2) {
    //     margin-top: 0.3rem;
    //     margin-bottom: 0.3rem;
    // }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            @apply pb-3 px-1;
            @apply mx-2;
            @apply text-gray-500;
            @apply text-xs;
        }
        :global(.ant-checkbox-group) {
            @apply w-full !important;
        }
    }
    .badge {
        :global(.ant-badge-dot) {
            @apply bg-primary !important;
        }
        :global(.ant-badge-count) {
            @apply top-3 right-2 !important;
        }
    }
</style>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-primary;
        @apply bg-primary-light;
    }
    .owner-checkbox:last-child {
        @apply pb-0 mb-0 !important;
    }
</style>
