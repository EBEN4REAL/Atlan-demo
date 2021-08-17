<template>
    <div class="w-full mr-2">
        <p class="mb-2">Owners</p>
        <div v-if="!isOwnersLoading">
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
                                flex
                                items-center
                                mr-3
                                cursor-pointer
                                my-0
                                mb-3
                                bg-gray-light
                                rounded-full
                                text-gray-700
                                px-3
                                py-1.5
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
                                    font-bold
                                    truncate
                                    text-sm
                                    capitalize
                                    max-owner-name-width
                                    ...
                                "
                            >
                                {{ owner.username }}
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
                                flex
                                items-center
                                mr-3
                                cursor-pointer
                                my-0
                                mb-3
                                bg-gray-light
                                rounded-full
                                px-3
                                py-1.5
                                text-gray-700
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
                                    font-bold
                                    truncate
                                    text-sm
                                    capitalize
                                    max-owner-name-width
                                    ...
                                "
                            >
                                {{ owner.username }}
                            </div>
                        </div>
                    </OwnerInfoCard>
                </template>
                <div
                    v-if="splittedOwners.b.length > 0 && !showAll"
                    class="flex items-center mb-3 mr-3 cursor-pointer"
                    @click="() => toggleAllOwners(true)"
                >
                    <span
                        class="
                            px-1
                            py-0.5
                            text-sm
                            font-bold
                            rounded
                            text-primary
                        "
                    >
                        and {{ splittedOwners.b.length }} more
                    </span>
                </div>
                <div
                    v-if="splittedOwners.b.length > 0 && showAll"
                    class="flex items-center justify-center mb-3 mr-3 cursor-pointer "
                    @click="() => toggleAllOwners(false)"
                >
                    <span
                        class="
                            px-1
                            py-0.5
                            text-sm
                            font-bold
                            rounded
                            text-primary
                        "
                    >
                        show less
                    </span>
                </div>
                <a-button
                    class="flex items-center justify-center w-8 mb-3 h-8 px-2 py-2 mr-3 text-gray-700 border-none rounded-full  bg-gray-light hover:bg-primary hover:text-white"
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
                @visibleChange="handleUpdateOwners"
            >
                <div v-if="ownerUsers.length < 1" class="inline-flex mb-3 mr-2">
                    <div
                        class="
                            inline-flex
                            px-3
                            py-1.5
                            rounded-full
                            cursor-pointer
                            select-none
                            text-primary
                            hover:text-white hover:bg-primary
                            _bg-primary-light
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
                            rounded
                            shadow
                            flex
                            items-center
                            flex-col
                            w-56
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
                            <template #prefix>
                                <fa icon="fal search" />
                            </template>
                        </a-input>
                        <div class="relative w-full">
                            <p
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
                            </p>
                            <a-tabs
                                v-model:activeKey="activeOwnerTabKey"
                                :class="$style.previewtab"
                            >
                                <a-tab-pane
                                    key="1"
                                    :tab="
                                        'Users ' + `(${selectedUsers.length})`
                                    "
                                >
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
                                                            ? '_bg-primary-light'
                                                            : ''
                                                    "
                                                    class="flex items-center justify-between w-full px-1 py-1 mb-2 rounded cursor-pointer  hover_bg-primary-light"
                                                    @click="
                                                        () => onSelectUser(user)
                                                    "
                                                >
                                                    <div
                                                        class="flex items-center flex-1 "
                                                    >
                                                        <img
                                                            src="https://picsum.photos/id/237/50/50"
                                                            alt="view"
                                                            class="w-4 h-4 mr-2 rounded-full "
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
                                                        class="flex items-center mr-4 "
                                                    >
                                                        <span
                                                            class="flex items-center "
                                                            ><fa
                                                                class=" text-primary"
                                                                icon="fas check-circle"
                                                        /></span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <div
                                            v-else
                                            class="flex items-center justify-center "
                                        >
                                            <a-spin
                                                size="small"
                                                class="mr-2 leading-none"
                                            ></a-spin
                                            ><span>Fetching users</span>
                                        </div>
                                    </div>
                                </a-tab-pane>
                                <a-tab-pane
                                    key="2"
                                    :tab="
                                        'Groups ' + `(${selectedGroups.length})`
                                    "
                                >
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
                                                            ? '_bg-primary-light'
                                                            : ''
                                                    "
                                                    @click="
                                                        () =>
                                                            onSelectGroup(group)
                                                    "
                                                    class="flex items-center justify-between w-full px-1 py-1 mb-2 rounded cursor-pointer  hover_bg-primary-light"
                                                >
                                                    <div
                                                        class="flex items-center flex-1 "
                                                    >
                                                        <img
                                                            src="https://picsum.photos/id/237/50/50"
                                                            alt="view"
                                                            class="w-4 h-4 mr-4 rounded-full "
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
                                                        class="flex items-center mr-2 "
                                                    >
                                                        <span
                                                            class="flex items-center "
                                                            ><fa
                                                                class=" text-primary"
                                                                icon="fas check-circle"
                                                        /></span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
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
                    </div>
                </template>
            </a-popover>
        </div>
        <div
            v-else
            class="flex items-center justify-center mt-4 text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Updating owners</span>
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
    import OwnerInfoCard from '~/components/preview/asset/v2/hovercards/ownerInfo.vue'

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
                if (!showOwnersDropdown.value) {
                    update(selectedUsers.value, selectedGroups.value)
                }
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
                    selectedUsers.value = ownerUsers.value
                    selectedGroups.value = ownerGroups.value
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
            }
        },
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
    .max-owner-name-width {
        max-width: 10rem;
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
    }
</style>
