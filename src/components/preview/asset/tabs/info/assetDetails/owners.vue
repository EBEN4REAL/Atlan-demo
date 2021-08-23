<template>
    <div class="w-full mb-4 mr-2">
        <p class="mb-2">Owners</p>
        <div>
            <div
                v-if="ownerUsers.length > 0"
                class="flex flex-wrap text-sm border border-transparent rounded"
            >
                <template
                    v-for="owner in splittedOwners.a"
                    :key="owner.username"
                >
                    <OwnerInfoCard
                        :username="owner.username"
                        :type="owner.type"
                    >
                        <div
                            class="
                                relative
                                flex
                                items-center
                                px-3
                                py-1.5
                                mr-3
                                mb-2
                                rounded-full
                                bg-gray-light
                                text-gray-700
                                group
                                hover:bg-primary hover:text-white
                            "
                        >
                            <img
                                src="https://picsum.photos/id/237/50/50"
                                alt="view"
                                class="w-4 h-4 mr-2 rounded-full"
                            />
                            <div
                                class="
                                    mb-0
                                    truncate
                                    text-sm
                                    capitalize
                                    max-owner-name-width
                                    ...
                                "
                            >
                                {{ owner.username }}
                            </div>
                            <div
                                class="
                                    absolute
                                    flex
                                    items-center
                                    justify-center
                                    pl-3
                                    pr-1
                                    text-white
                                    bg-transparent
                                    border-none
                                    rounded-full
                                    opacity-0
                                    cursor-pointer
                                    group-hover:opacity-100
                                    owners-cross-btn
                                "
                                v-on:click.stop="() => handleRemoveOwner(owner)"
                            >
                                <div class="flex items-center justify-center">
                                    <fa icon="fal times-circle" class="" />
                                </div>
                            </div>
                        </div>
                    </OwnerInfoCard>
                </template>
                <template
                    v-if="showAll"
                    v-for="owner in splittedOwners.b"
                    :key="owner.username"
                >
                    <OwnerInfoCard
                        :username="owner.username"
                        :type="owner.type"
                    >
                        <div
                            class="
                                relative
                                flex
                                items-center
                                px-3
                                py-1.5
                                mr-3
                                rounded-full
                                bg-gray-light
                                text-gray-700
                                group
                                hover:bg-primary hover:text-white
                            "
                            v-on:click.stop="
                                () => handleClickUser(owner.username)
                            "
                        >
                            <img
                                src="https://picsum.photos/id/237/50/50"
                                alt="view"
                                class="w-4 h-4 mr-2 rounded-full"
                            />
                            <div
                                class="
                                    mb-0
                                    truncate
                                    text-sm
                                    capitalize
                                    max-owner-name-width
                                    ...
                                "
                            >
                                {{ owner.username }}
                            </div>
                            <div
                                class="
                                    absolute
                                    flex
                                    items-center
                                    justify-center
                                    pl-3
                                    pr-1
                                    text-white
                                    bg-transparent
                                    border-none
                                    rounded-full
                                    opacity-0
                                    cursor-pointer
                                    group-hover:opacity-100
                                    owners-cross-btn
                                "
                                v-on:click.stop="() => handleRemoveOwner(owner)"
                            >
                                <div class="flex items-center justify-center">
                                    <fa icon="fal times-circle" class="" />
                                </div>
                            </div>
                        </div>
                    </OwnerInfoCard>
                </template>
                <div
                    v-if="splittedOwners.b.length > 0 && !showAll"
                    class="flex items-center mr-3 cursor-pointer"
                    @click="() => toggleAllOwners(true)"
                >
                    <span class="px-1 py-0.5 text-sm rounded text-primary">
                        and {{ splittedOwners.b.length }} more
                    </span>
                </div>
                <div
                    v-if="splittedOwners.b.length > 0 && showAll"
                    class="flex items-center justify-center mr-3 cursor-pointer"
                    @click="() => toggleAllOwners(false)"
                >
                    <span class="px-1 py-0.5 text-sm rounded text-primary">
                        show less
                    </span>
                </div>
                <a-button
                    class="
                        flex
                        items-center
                        justify-center
                        w-8
                        h-8
                        px-2
                        py-2
                        mr-3
                        text-gray-700
                        border-none
                        rounded-full
                        bg-gray-light
                        hover:bg-primary hover:text-white
                    "
                    @click.stop="toggleOwnerPopover"
                >
                    <fa icon="fal plus" />
                </a-button>
            </div>
            <a-popover
                v-model:visible="showOwnersDropdown"
                placement="left"
                overlay-class-name="inlinepopover"
                trigger="click"
            >
                <div v-if="ownerUsers.length < 1" class="inline-flex mr-2">
                    <div
                        class="
                            flex
                            items-center
                            px-3
                            py-1.5
                            mr-3
                            rounded-full
                            cursor-pointer
                            bg-gray-light
                            text-gray-700
                            hover:bg-primary hover:text-white
                        "
                    >
                        <span class="flex items-center text-sm">
                            <fa icon="fal plus" class="" />
                        </span>
                        <span class="ml-2 text-sm">Add Owners</span>
                    </div>
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
                        <a-input
                            v-input-focus
                            :placeholder="
                                activeOwnerTabKey === '1'
                                    ? `Search ${listUsers?.length} users`
                                    : `Search ${listGroups?.length} groups`
                            "
                            @change="handleOwnerSearch"
                        >
                            <template #suffix>
                                <fa icon="fal search" />
                            </template>
                        </a-input>
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
                                            class="ml-2 chip"
                                            v-if="listUsers?.length > 0"
                                            >{{ listUsers?.length }}</span
                                        >
                                    </template>
                                    <div class="h-48 overflow-y-auto">
                                        <div
                                            v-if="
                                                STATES.SUCCESS ===
                                                userOwnerState
                                            "
                                        >
                                            <template
                                                v-for="user in listUsers"
                                                :key="user.username"
                                            >
                                                <div
                                                    v-if="user.username"
                                                    :class="
                                                        isOwner(
                                                            user.username,
                                                            selectedUsers
                                                        )
                                                            ? 'bg-primary-light'
                                                            : ''
                                                    "
                                                    class="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        w-full
                                                        px-1
                                                        py-1
                                                        mb-2
                                                        rounded
                                                        cursor-pointer
                                                        hoverbg-primary-light
                                                    "
                                                    @click="
                                                        () => onSelectUser(user)
                                                    "
                                                >
                                                    <div
                                                        class="
                                                            flex
                                                            items-center
                                                            flex-1
                                                        "
                                                    >
                                                        <img
                                                            src="https://picsum.photos/id/237/50/50"
                                                            alt="view"
                                                            class="
                                                                w-4
                                                                h-4
                                                                mr-2
                                                                rounded-full
                                                            "
                                                        /><span
                                                            class="
                                                                text-gray
                                                                text-sm
                                                                capitalize
                                                                truncate
                                                                ...
                                                            "
                                                            >{{
                                                                user.username
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div
                                                        v-if="
                                                            isOwner(
                                                                user.username,
                                                                selectedUsers
                                                            )
                                                        "
                                                        class="
                                                            flex
                                                            items-center
                                                            mr-4
                                                        "
                                                    >
                                                        <span
                                                            class="
                                                                flex
                                                                items-center
                                                            "
                                                            ><fa
                                                                class="
                                                                    text-primary
                                                                "
                                                                icon="fas check-circle"
                                                        /></span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <div
                                            v-else
                                            class="
                                                flex
                                                items-center
                                                justify-center
                                            "
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
                                            class="ml-2 chip"
                                            v-if="listGroups?.length > 0"
                                            >{{ listGroups?.length }}</span
                                        >
                                    </template>
                                    <div class="h-48 overflow-y-auto">
                                        <div
                                            v-if="
                                                STATES.SUCCESS ===
                                                groupOwnerState
                                            "
                                        >
                                            <template
                                                v-for="group in listGroups"
                                                :key="group.name"
                                            >
                                                <div
                                                    v-if="group.name"
                                                    :class="
                                                        isOwner(
                                                            group.name,
                                                            selectedGroups
                                                        )
                                                            ? 'bg-primary-light'
                                                            : ''
                                                    "
                                                    @click="
                                                        () =>
                                                            onSelectGroup(group)
                                                    "
                                                    class="
                                                        relative
                                                        flex
                                                        items-center
                                                        justify-between
                                                        w-full
                                                        px-1
                                                        py-1
                                                        mb-2
                                                        rounded
                                                        cursor-pointer
                                                        hoverbg-primary-light
                                                    "
                                                >
                                                    <div
                                                        class="
                                                            flex
                                                            items-center
                                                            flex-1
                                                        "
                                                    >
                                                        <img
                                                            src="https://picsum.photos/id/237/50/50"
                                                            alt="view"
                                                            class="
                                                                w-4
                                                                h-4
                                                                mr-4
                                                                rounded-full
                                                            "
                                                        /><span
                                                            class="
                                                                text-gray
                                                                text-sm
                                                                truncate
                                                                capitalize
                                                                ...
                                                            "
                                                            >{{
                                                                group.name
                                                            }}</span
                                                        >
                                                    </div>
                                                    <div
                                                        v-if="
                                                            isOwner(
                                                                group.name,
                                                                selectedGroups
                                                            )
                                                        "
                                                        class="
                                                            flex
                                                            items-center
                                                            mr-2
                                                        "
                                                    >
                                                        <span
                                                            class="
                                                                flex
                                                                items-center
                                                            "
                                                            ><fa
                                                                class="
                                                                    text-primary
                                                                "
                                                                icon="fas check-circle"
                                                        /></span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <div
                                            v-else
                                            class="
                                                flex
                                                items-center
                                                justify-center
                                            "
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
                                    `&nbsp;&&nbsp;${selectedGroups.length} groups`
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
    import { defineComponent, PropType, ref, Ref, watch, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { userInterface } from '~/types/users/user.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import updateOwners from '~/composables/asset/updateOwners'
    import OwnerInfoCard from '~/components/preview/asset/hovercards/ownerInfo.vue'

    export default defineComponent({
        components: { OwnerInfoCard },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const now = ref(true)
            const ownerType = ref('user')
            const { selectedAsset } = toRefs(props)
            const showOwnersDropdown: Ref<boolean> = ref(false)
            const activeOwnerTabKey = ref('1')
            const selectedUsers: Ref<string[]> = ref([])
            const selectedGroups: Ref<string[]> = ref([])
            const showAll = ref(false)

            const {
                list: listUsers,
                total: totalUsersCount,
                filtered,
                state: userOwnerState,
                STATES,
                handleSearch: handleUserSearch,
            } = fetchUserList(now)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
                state: groupOwnerState,
            } = fetchGroupList(now)
            console.log('userList->', listUsers.value)
            console.log('groupList->', listGroups.value)

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
                },
                {
                    immediate: true,
                }
            )

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
