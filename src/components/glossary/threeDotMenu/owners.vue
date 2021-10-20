<template>
    <div class="flex flex-col items-center w-full bg-white rounded">
        <a-input
            v-input-focus
            :placeholder="
                activeOwnerTabKey === '1'
                    ? `Search ${listUsers?.length} users`
                    : `Search ${listGroups?.length} groups`
            "
            @change="handleOwnerSearch"
        >
            <template #prefix>
                <fa icon="fal search" />
            </template>
        </a-input>
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
                        <span class="ml-2 chip" v-if="listUsers?.length > 0">{{
                            listUsers?.length
                        }}</span>
                    </template>
                    <div class="h-48 overflow-y-auto">
                        <div v-if="STATES.SUCCESS === userOwnerState">
                            <template
                                v-for="user in listUsers"
                                :key="user.username"
                            >
                                <div
                                    v-if="user.username"
                                    :class="
                                        isOwner(user.username, selectedUsers)
                                            ? 'bg-primary-light'
                                            : ''
                                    "
                                    class="flex items-center justify-between w-full px-1 py-1 mb-2 rounded cursor-pointer  hover:bg-primary-light"
                                    @click="() => onSelectUser(user)"
                                >
                                    <div class="flex items-center flex-1">
                                        <img
                                            src="https://picsum.photos/id/237/50/50"
                                            alt="view"
                                            class="w-4 h-4 mr-2 rounded-full"
                                        /><span
                                            class="
                                                text-gray text-sm
                                                capitalize
                                                truncate
                                                ...
                                            "
                                            >{{ user.username }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="
                                            isOwner(
                                                user.username,
                                                selectedUsers
                                            )
                                        "
                                        class="flex items-center mr-4"
                                    >
                                        <span class="flex items-center"
                                            ><fa
                                                class="text-primary"
                                                icon="fas check-circle"
                                        /></span>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div v-else class="flex items-center justify-center">
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
                            :class="activeOwnerTabKey == '1' ? 'font-bold' : ''"
                            >Groups</span
                        >
                        <span class="ml-2 chip" v-if="listGroups?.length > 0">{{
                            listGroups?.length
                        }}</span>
                    </template>
                    <div class="h-48 overflow-y-auto">
                        <div v-if="STATES.SUCCESS === groupOwnerState">
                            <template
                                v-for="group in listGroups"
                                :key="group.name"
                            >
                                <div
                                    v-if="group.name"
                                    :class="
                                        isOwner(group.name, selectedGroups)
                                            ? 'bg-primary-light'
                                            : ''
                                    "
                                    @click="() => onSelectGroup(group)"
                                    class="relative flex items-center justify-between w-full px-1 py-1 mb-2 rounded cursor-pointer  hover:bg-primary-light"
                                >
                                    <div class="flex items-center flex-1">
                                        <img
                                            src="https://picsum.photos/id/237/50/50"
                                            alt="view"
                                            class="w-4 h-4 mr-4 rounded-full"
                                        /><span
                                            class="
                                                text-gray text-sm
                                                truncate
                                                capitalize
                                                ...
                                            "
                                            >{{ group.name }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="
                                            isOwner(group.name, selectedGroups)
                                        "
                                        class="flex items-center mr-2"
                                    >
                                        <span class="flex items-center"
                                            ><fa
                                                class="text-primary"
                                                icon="fas check-circle"
                                        /></span>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div v-else class="flex items-center justify-center">
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
                    `&nbsp;&&nbsp;${selectedGroups.length} groups`
                }}</span>
                <span
                    v-if="selectedGroups.length > 0 || selectedUsers.length > 0"
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

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, watch, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { userInterface } from '~/types/users/user.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import updateOwners from '~/composables/asset/updateOwners'
    import OwnerInfoCard from '@/discovery/preview/hovercards/ownerInfo.vue'

    export default defineComponent({
        components: { OwnerInfoCard },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const now = ref(true)
            const ownerType = ref('user')
            const { selectedAsset } = toRefs(props)
            const showOwnersDropdown: Ref<boolean> = ref(false)
            const activeOwnerTabKey = ref('1')
            const selectedUsers: Ref<string[]> = ref(selectedAsset.value?.attributes?.ownerUsers?.split(',') ?? [])
            const selectedGroups: Ref<string[]> = ref([])
            const showAll = ref(false)

            const {
                list: listUsers,
                total: totalUsersCount,
                state: userOwnerState,
                STATES,
                handleSearch: handleUserSearch,
            } = fetchUserList(true)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
                state: groupOwnerState,
            } = fetchGroupList(true)

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
                handleCancel,
                update,
                isReady,
                state,
                ownerUsers,
                isLoading: isOwnersLoading,
                ownerGroups,
            } = updateOwners(selectedAsset)

            const handleUpdateOwners = () => {
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
                let temp = ownerUsers.value.map((username: string) => {
                    return {
                        type: 'user',
                        username,
                    }
                })
                splittedOwners = temp
                temp = ownerGroups.value.map((name: string) => {
                    return {
                        type: 'group',
                        username: name,
                    }
                })
                splittedOwners = [...splittedOwners, ...temp]
                console.log(splittedOwners, 'spilltedOwners')
                return splittedOwners
            }

            const splittedOwners = ref(
                splitArray(5, mappedSplittedOwners(ownerUsers, ownerGroups))
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

            watch(
                [ownerUsers, ownerGroups],
                () => {
                    selectedUsers.value = [...ownerUsers.value]
                    selectedGroups.value = [...ownerGroups.value]
                    splittedOwners.value = splitArray(
                        5,
                        mappedSplittedOwners(ownerUsers, ownerGroups)
                    )
                },
                {
                    immediate: true,
                }
            )
            watch(selectedAsset, (newSelectedAsset) => {
                selectedUsers.value = newSelectedAsset?.attributes?.ownerUsers?.split(',')
            })

            const handleOwnerSearch = (e: Event) => {
                const queryText = (<HTMLInputElement>e.target).value
                if (activeOwnerTabKey.value === '1') {
                    handleUserSearch(queryText)
                } else if (activeOwnerTabKey.value === '2') {
                    // for groups
                    handleGroupSearch(queryText)
                }
            }
            const toggleOwnerPopover = () => {
                showOwnersDropdown.value = !showOwnersDropdown.value
            }
            const toggleAllOwners = (state: boolean) => {
                showAll.value = state
            }

            const handleRemoveOwner = (owner: {
                username: string
                type: string
            }) => {
                if (owner.type === 'user') {
                    let filteredOwnerUsers = ownerUsers.value.filter(
                        (username) => {
                            return username !== owner.username
                        }
                    )
                    selectedUsers.value = filteredOwnerUsers
                    console.log(ownerUsers.value, 'delete', filteredOwnerUsers)
                } else {
                    let filteredOwnerGroups = ownerGroups.value.filter(
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
            watch(isReady, (newIsReady) => {
                if (newIsReady) {
                    emit('update:selectedAsset', selectedAsset.value)
                }
            })

            return {
                showAll,
                toggleAllOwners,
                userOwnerState,
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
                showOwnersDropdown,
                toggleOwnerPopover,
                selectedAsset,
                handleRemoveOwner,
                handleCancelUpdateOwnerPopover,
            }
        },
    })
</script>
<style lang="less" scoped>
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
        @apply font-bold;
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
