<template>
    <div class="w-full mb-3 mr-2 text-sm text-gray-500">
        <p class="mb-1 text-xs">Owners</p>
        <div>
            <div v-if="ownerUsers.length > 0" class="flex flex-wrap text-sm">
                <PillGroup
                    :data="ownerList"
                    label-key="username"
                    popover-trigger="hover"
                    @add="toggleOwnerPopover"
                    @delete="handleRemoveOwner"
                >
                    <template #pillPrefix>
                        <img
                            src="https://picsum.photos/id/1005/50/50"
                            alt="view"
                            class="w-5 h-5 -ml-1 rounded-full"
                        />
                    </template>
                    <template #popover="{ item }"
                        ><OwnerInfoCard :user="item"
                    /></template>
                    <template #suffix>
                        <span
                            v-if="splittedOwners.b.length > 0"
                            class="
                                px-1
                                py-0.5
                                text-sm
                                rounded
                                text-primary
                                mr-3
                                cursor-pointer
                            "
                            @click="() => toggleAllOwners()"
                        >
                            {{
                                showAll
                                    ? 'Show less'
                                    : `and ${splittedOwners.b.length} more`
                            }}
                        </span>
                    </template>
                </PillGroup>
            </div>

            <a-popover
                v-model:visible="showOwnersDropdown"
                placement="left"
                overlay-class-name="inlinepopover"
                trigger="click"
            >
                <div v-if="ownerUsers.length < 1" class="inline-flex mr-2">
                    <div @click.stop="toggleOwnerPopover">
                        <div
                            class="flex items-center cursor-pointer  text-primary hover:text-primary hover:underline"
                        >
                            <!-- <span class="flex items-center text-xs">
                            <fa icon="fal plus" />
                        </span> -->
                            <span class="text-xs">Add owners</span>
                        </div>
                    </div>
                    <!-- <button
                        class="flex items-center px-3 py-1 mr-3 text-gray-700 border rounded-full cursor-pointer hover:bg-primary hover:text-white"
                    >
                        <span class="flex items-center text-xs">
                            <fa icon="fal plus" class="" />
                        </span>
                        <span class="ml-2 text-xs">Add Owners</span>
                    </button> -->
                </div>
                <template #content>
                    <div
                        class="
                            p-2.5
                            bg-white
                            flex
                            items-center
                            flex-col
                            w-56
                            rounded
                        "
                    >
                        <SearchAndFilter
                            v-model:value="searchText"
                            :autofocus="true"
                            :placeholder="
                                activeOwnerTabKey === '1'
                                    ? `Search ${userList?.length} users`
                                    : `Search ${groupList?.length} groups`
                            "
                            @change="handleOwnerSearch"
                        >
                        </SearchAndFilter>
                        <div class="relative w-full">
                            <!-- <p
                                class="
                                    absolute
                                    cursor-pointer
                                    right-0
                                    top-2.5
                                    text-primary
                                    z-10
                                "
                                @click="clearSelectedOwners"
                            >
                                clear
                            </p> -->
                            <a-tabs
                                v-model:activeKey="activeOwnerTabKey"
                                :class="$style.previewtab"
                            >
                                <a-tab-pane key="1">
                                    <template #tab>
                                        <span
                                            class="text-sm"
                                            :class="
                                                activeOwnerTabKey == '1'
                                                    ? ''
                                                    : ''
                                            "
                                            >Users</span
                                        >
                                        <span
                                            v-if="userList?.length > 0"
                                            class="ml-2 chip"
                                            >{{ userList?.length }}</span
                                        >
                                    </template>
                                    <div class="h-48 overflow-y-auto">
                                        <div
                                            class="flex flex-col w-full"
                                            v-if="
                                                STATES.SUCCESS ===
                                                userOwnerState
                                            "
                                        >
                                            <a-checkbox-group
                                                v-model:value="selectedUsers"
                                                class="w-full"
                                            >
                                                <template
                                                    v-for="item in userList"
                                                    :key="item.username"
                                                >
                                                    <a-checkbox
                                                        :value="item.username"
                                                        v-if="item.username"
                                                        class="w-full mb-3"
                                                    >
                                                        <div
                                                            v-if="
                                                                item.username ===
                                                                myUsername
                                                            "
                                                            class="inline-flex capitalize "
                                                        >
                                                            {{ item.username }}

                                                            <span
                                                                class="font-bold "
                                                            >
                                                                {{
                                                                    '&nbsp;(me)'
                                                                }}
                                                            </span>
                                                        </div>
                                                        <span
                                                            v-else
                                                            class="capitalize"
                                                        >
                                                            {{ item.username }}
                                                        </span>
                                                    </a-checkbox>
                                                </template>
                                            </a-checkbox-group>
                                        </div>
                                        <div
                                            v-else
                                            class="flex items-center justify-center mt-3 "
                                        >
                                            <a-spin
                                                size="small"
                                                class="mr-2 leading-none"
                                            ></a-spin
                                            ><span>Fetching users</span>
                                        </div>
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane key="2">
                                    <template #tab>
                                        <span
                                            class="text-sm"
                                            :class="
                                                activeOwnerTabKey == '1'
                                                    ? ''
                                                    : ''
                                            "
                                            >Groups</span
                                        >
                                        <span
                                            v-if="groupList?.length > 0"
                                            class="ml-2 chip"
                                            >{{ groupList?.length }}</span
                                        >
                                    </template>

                                    <div class="overflow-y-auto h-44">
                                        <div
                                            v-if="
                                                STATES.SUCCESS ===
                                                    groupOwnerState &&
                                                groupList.length < 1
                                            "
                                            class="flex flex-col items-center justify-center h-full "
                                        >
                                            <div
                                                class="flex flex-col items-center "
                                            >
                                                <img
                                                    :src="emptyScreen"
                                                    alt="No logs"
                                                    class="w-2/5 m-auto mb-4"
                                                />
                                                <span class="text-gray-500"
                                                    >No Groups Found</span
                                                >
                                            </div>
                                        </div>
                                        <a-checkbox-group
                                            v-if="
                                                STATES.SUCCESS ===
                                                groupOwnerState
                                            "
                                            v-model:value="selectedGroups"
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
                                        <div
                                            v-else
                                            class="flex items-center justify-center "
                                        >
                                            <a-spin
                                                size="small"
                                                class="mr-2 leading-none"
                                            ></a-spin
                                            ><span>Fetching groups</span>
                                        </div>
                                    </div>
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                        <div class="w-full mt-2">
                            <div class="flex justify-end text-xs">
                                <span v-if="selectedUsers.length > 0">{{
                                    `${selectedUsers.length} users`
                                }}</span>
                                <span v-if="selectedGroups.length > 0">{{
                                    `&nbsp;& &nbsp;${selectedGroups.length} groups`
                                }}</span>
                                <span
                                    v-if="
                                        selectedGroups.length > 0 ||
                                        selectedUsers.length > 0
                                    "
                                    >{{ `&nbsp;selected` }}</span
                                >
                            </div>
                            <div class="flex justify-end w-full mt-2">
                                <a-button
                                    class="mr-3 border rounded"
                                    @click="handleCancelUpdateOwnerPopover"
                                    >Cancel</a-button
                                >
                                <a-button
                                    type="primary"
                                    class="rounded"
                                    :loading="isOwnersLoading"
                                    @click="handleUpdateOwners"
                                    >Update</a-button
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>
        <!-- <div
            v-else
            class="flex items-center justify-center mt-4 text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Updating owners</span>
        </div> -->
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'
    import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
    import updateOwners from '~/composables/asset/updateOwners'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import fetchUserList from '~/composables/user/fetchUserList'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import { userInterface } from '~/types/users/user.interface'
    import emptyScreen from '~/assets/images/empty_search.png'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        components: { OwnerInfoCard, SearchAndFilter, PillGroup },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { username: myUsername, name: myName } = whoami()
            const showOwnersDropdown: Ref<boolean> = ref(false)
            const activeOwnerTabKey = ref('1')
            const selectedUsers: Ref<string[]> = ref([])
            const selectedGroups: Ref<string[]> = ref([])
            const searchText: Ref<string> = ref('')
            const showAll = ref(false)
            const userList: Ref<userInterface[]> = ref([])
            const groupList: Ref<groupInterface[]> = ref([])
            const ownersFilterOptionsData = ref('asc')

            const {
                list: listUsers,
                state: userOwnerState,
                STATES,
                mutate: mutateUsers,
                handleSearch: handleUserSearch,
            } = fetchUserList(false)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                state: groupOwnerState,
                mutate: mutateGroups,
            } = fetchGroupList(false)

            function sortClassificationsByOrder(
                sortingOrder: string,
                data: Ref<userInterface[] | groupInterface[]>,
                key: string
            ) {
                switch (sortingOrder) {
                    case 'asc': {
                        let modifiedData: userInterface[] = []
                        if (data?.value) {
                            modifiedData = data.value.sort((dataA, dataB) => {
                                const a = dataA[key].toLowerCase()
                                const b = dataB[key].toLowerCase()
                                if (a < b) {
                                    return -1
                                }
                                if (a > b) {
                                    return 1
                                }
                                return 0
                            })
                        }
                        return modifiedData
                    }
                    case 'dsc': {
                        let modifiedData: groupInterface[] = []
                        if (data?.value) {
                            modifiedData = data.value.sort((dataA, dataB) => {
                                const a = dataA[key].toLowerCase()
                                const b = dataB[key].toLowerCase()
                                if (a < b) {
                                    return 1
                                }
                                if (a > b) {
                                    return -1
                                }
                                return 0
                            })
                        }

                        return modifiedData
                    }
                }
            }

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
                    if (Object.keys(ownUserObj).length > 0) {
                        userList.value = [ownUserObj, ...userList.value]
                    } else {
                        userList.value = [...userList.value]
                    }
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

            const onSelectUser = (user: userInterface) => {
                // unselect if already selected
                if (selectedUsers.value.includes(user.username)) {
                    const index = selectedUsers.value.indexOf(user.username)
                    if (index > -1) {
                        selectedUsers.value.splice(index, 1)
                    }
                } else {
                    selectedUsers.value.push(user.username)
                }
            }
            const onSelectGroup = (group: groupInterface) => {
                // unselect if already selected
                if (selectedGroups.value.includes(group.name)) {
                    const index = selectedGroups.value.indexOf(group.name)
                    if (index > -1) {
                        selectedGroups.value.splice(index, 1)
                    }
                } else {
                    selectedGroups.value.push(group.name)
                }
            }

            // user preview drawer
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about'] })
            }

            const {
                update,
                ownerUsers,
                isLoading: isOwnersLoading,
                ownerGroups,
            } = updateOwners(selectedAsset)

            const handleUpdateOwners = () => {
                console.log(selectedUsers.value, selectedGroups.value)
                update(selectedUsers.value, selectedGroups.value)
            }
            const handleCancelUpdateOwnerPopover = () => {
                showOwnersDropdown.value = false
            }

            function splitArray(sizeofSplit: number, arr: any[]) {
                if (sizeofSplit >= arr.length) {
                    return {
                        a: [...arr],
                        b: [],
                    }
                }
                const a: any[] = arr.slice(0, sizeofSplit)
                const b: any[] = arr.slice(sizeofSplit, arr.length)
                return {
                    a,
                    b,
                }
            }
            function isOwner(username: string, owners: string[]) {
                return owners.includes(username)
            }
            function mappedSplittedOwners(ownerUsers, ownerGroups) {
                let splittedOwners = []
                let temp = ownerUsers.value.map((username: string) => ({
                    type: 'user',
                    username,
                }))
                splittedOwners = temp
                temp = ownerGroups.value.map((name: string) => ({
                    type: 'group',
                    username: name,
                }))
                splittedOwners = [...splittedOwners, ...temp]
                console.log(splittedOwners, 'spilltedOwners')
                return splittedOwners
            }

            const splittedOwners = ref(
                splitArray(5, mappedSplittedOwners(ownerUsers, ownerGroups))
            )

            const ownerList = computed(() =>
                showAll.value
                    ? [...splittedOwners.value.a, ...splittedOwners.value.b]
                    : splittedOwners.value.a
            )

            const closePopover = () => {
                showOwnersDropdown.value = false
            }

            const clearSelectedOwners = () => {
                if (activeOwnerTabKey.value === '1') {
                    selectedUsers.value = []
                } else if (activeOwnerTabKey.value === '2') {
                    // for groups
                    selectedGroups.value = []
                }
            }
            console.log(ownerUsers, 'ownersUsers')
            console.log(selectedGroups, 'selectedGroups')

            watch(
                [ownerUsers, ownerGroups],
                () => {
                    console.log('owners changed', ownerUsers.value)
                    selectedUsers.value = [...ownerUsers.value]
                    selectedGroups.value = [...ownerGroups.value]
                    splittedOwners.value = splitArray(
                        5,
                        mappedSplittedOwners(ownerUsers, ownerGroups)
                    )
                    emit('update:selectedAsset', selectedAsset.value)
                },
                {
                    immediate: true,
                }
            )

            const handleOwnerSearch = (e: Event) => {
                if (activeOwnerTabKey.value === '1') {
                    handleUserSearch(searchText.value)
                } else if (activeOwnerTabKey.value === '2') {
                    handleGroupSearch(searchText.value)
                }
            }
            const toggleOwnerPopover = () => {
                showOwnersDropdown.value = !showOwnersDropdown.value
                if (
                    !searchText.value &&
                    (!listUsers.value.length || !listGroups.value.length)
                ) {
                    mutateUsers()
                    mutateGroups()
                }
            }
            const toggleAllOwners = () => {
                showAll.value = !showAll.value
            }

            const handleRemoveOwner = (owner: {
                username: string
                type: string
            }) => {
                if (owner.type === 'user') {
                    const filteredOwnerUsers = ownerUsers.value.filter(
                        (username) => username !== owner.username
                    )
                    selectedUsers.value = filteredOwnerUsers
                    console.log(ownerUsers.value, 'delete', filteredOwnerUsers)
                } else {
                    const filteredOwnerGroups = ownerGroups.value.filter(
                        (name) => name !== owner.username
                    )
                    selectedGroups.value = filteredOwnerGroups
                }
                update(selectedUsers.value, selectedGroups.value)
            }
            // closing the popover on making the req successfully
            watch(isOwnersLoading, () => {
                if (!isOwnersLoading.value) showOwnersDropdown.value = false
            })

            return {
                myUsername,
                showAll,
                toggleAllOwners,
                userOwnerState,
                searchText,
                STATES,
                groupOwnerState,
                handleOwnerSearch,
                handleUpdateOwners,
                clearSelectedOwners,
                selectedGroups,
                selectedUsers,
                isOwnersLoading,
                closePopover,
                activeOwnerTabKey,
                isOwner,
                splittedOwners,
                ownerUsers,
                ownerGroups,
                handleClickUser,
                onSelectGroup,
                onSelectUser,
                listUsers,
                listGroups,
                userList,
                groupList,
                showOwnersDropdown,
                toggleOwnerPopover,
                selectedAsset,
                handleRemoveOwner,
                handleCancelUpdateOwnerPopover,
                ownerList,
            }
        },
    })
</script>
<style lang="less" scoped>
    .bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hoverbg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owners-cross-btn {
        right: 6px;
        height: 100%;
        @apply -top-0;
        background: linear-gradient(
            -90deg,
            rgba(82, 119, 215, 1) 60%,
            rgba(0, 0, 0, 0) 100%
        );
    }
    .owner-child {
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }
    .max-owner-name-width {
        max-width: 10rem;
    }
    // .owner-child:nth-child(2) {
    //     margin-top: 0.3rem;
    //     margin-bottom: 0.3rem;
    // }
    .chip {
        @apply px-1 pt-1 pb-1 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply text-primary;
        @apply bg-primary-light;
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            @apply pb-3 px-1;
            @apply mr-4;
            @apply text-gray-500;
            @apply text-xs;
        }
    }
</style>
