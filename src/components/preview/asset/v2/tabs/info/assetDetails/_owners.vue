<template>
    <div class="w-7/12 mr-2">
        <!-- <Owners
                    @toggleOwnersDropdown="toggleOwnersDropdown"
                    :showOwnersDropdown="showOwnersDropdown"
                /> -->
        <p class="mb-0">Owners</p>
        <div v-if="!isOwnersLoading">
            <a-popover
                v-model:visible="showOwnersDropdown"
                placement="left"
                overlay-class-name="inlinepopover"
                trigger="click"
                @visibleChange="handleUpdateOwners"
            >
                <div
                    v-if="ownerUsers.length > 0"
                    class="flex flex-wrap m-2 text-sm rounded  hover:border-gray-500"
                >
                    <template
                        v-for="username in splittedOwnerUsers.a"
                        :key="username"
                    >
                        <div
                            class="flex items-center mr-2.5 mb-3 cursor-pointer"
                            v-on:click.stop="() => handleClickUser(username)"
                        >
                            <img
                                src="https://picsum.photos/id/237/50/50"
                                alt="view"
                                class="w-4 h-4 mr-1 rounded-full"
                            />
                            <p
                                class="
                                    text-gray
                                    mb-0
                                    hover:border-b
                                    truncate
                                    ...
                                "
                            >
                                {{ username }}
                            </p>
                        </div>
                    </template>

                    <div v-if="splittedOwnerUsers.b.length > 0">
                        <span
                            class="
                                px-1
                                py-0.5
                                mb-3
                                text-sm
                                rounded
                                text-primary
                                _bg-primary-light
                            "
                        >
                            +{{ splittedOwnerUsers.b.length }}
                        </span>
                    </div>
                </div>
                <div v-else class="inline-flex mt-2 mb-2 mr-2">
                    <div
                        class="inline-flex px-2 py-1 rounded cursor-pointer select-none  _bg-primary-light"
                    >
                        <span class="flex items-center text-sm">
                            <fa icon="fal plus" class="text-primary" />
                        </span>
                        <span class="mt-1 ml-2 text-sm text-primary"
                            >Add Owners</span
                        >
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
                                    ? `Search ${listUsers.length} users`
                                    : `Search ${listGroups.length} groups`
                            "
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
                                    class="h-48 overflow-y-auto"
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
                                            @click="() => onSelectUser(user)"
                                        >
                                            <div
                                                class="flex items-center flex-1"
                                            >
                                                <img
                                                    src="https://picsum.photos/id/237/50/50"
                                                    alt="view"
                                                    class="w-4 h-4 mr-2 rounded-full "
                                                /><span
                                                    class="
                                                        text-gray text-sm
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
                                </a-tab-pane>
                                <a-tab-pane
                                    key="2"
                                    :tab="
                                        'Groups ' + `(${selectedGroups.length})`
                                    "
                                    class="h-48 overflow-y-auto"
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
                                            @click="() => onSelectGroup(group)"
                                            class="flex items-center justify-between w-full px-1 py-1 mb-2 rounded cursor-pointer  hover_bg-primary-light"
                                        >
                                            <div
                                                class="flex items-center flex-1"
                                            >
                                                <img
                                                    src="https://picsum.photos/id/237/50/50"
                                                    alt="view"
                                                    class="w-4 h-4 mr-4 rounded-full "
                                                /><span
                                                    class="
                                                        text-gray text-sm
                                                        truncate
                                                        ...
                                                    "
                                                    >{{ group.name }}</span
                                                >
                                            </div>
                                            <div
                                                v-if="
                                                    isOwner(
                                                        group.name,
                                                        selectedGroups
                                                    )
                                                "
                                                class="flex items-center mr-2"
                                            >
                                                <span class="flex items-center"
                                                    ><fa
                                                        class="text-primary"
                                                        icon="fas check-circle"
                                                /></span>
                                            </div>
                                        </div> </template
                                ></a-tab-pane>
                            </a-tabs>
                        </div>
                        <!-- <div class="flex justify-end w-full pt-2 border-t">
                                <a-button
                                    class="mr-2 rounded"
                                    @click="closePopover"
                                    >Cancel</a-button
                                >
                                <a-button class="rounded" type="primary"
                                    >Update
                                </a-button>
                            </div> -->
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
    import {
        defineComponent,
        PropType,
        ref,
        Ref,
        watch,
        onMounted,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { userInterface } from '~/types/users/user.interface'
    import { groupInterface } from '~/types/groups/group.interface'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import updateOwners from '~/composables/asset/updateOwners'

    export default defineComponent({
        components: {},
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

            const toggleOwnersDropdown = () => {
                showOwnersDropdown.value = true
            }
            const {
                list: listUsers,
                total: totalUsersCount,
                filtered,
                handleSearch: handleUserSearch,
            } = fetchUserList(now)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
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
                isCompleted,
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
            const splittedOwnerUsers = ref(splitArray(3, ownerUsers.value))
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
                ownerUsers,
                () => {
                    console.log('owners changed', ownerUsers.value)
                    selectedUsers.value = ownerUsers.value
                    splittedOwnerUsers.value = splitArray(3, ownerUsers.value)
                },
                {
                    immediate: true,
                }
            )
            watch(
                ownerGroups,
                () => {
                    selectedGroups.value = ownerGroups.value
                },
                {
                    immediate: true,
                }
            )
            return {
                handleUpdateOwners,
                clearSelectedOwners,
                selectedGroups,
                selectedUsers,
                isOwnersLoading,
                closePopover,
                activeOwnerTabKey,
                isOwner,
                splittedOwnerUsers,
                ownerUsers,
                ownerGroups,
                handleClickUser,
                onSelectGroup,
                onSelectUser,
                listUsers,
                listGroups,
                showOwnersDropdown,
                toggleOwnersDropdown,
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
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            @apply pb-3 px-1;
            @apply mx-2;
            @apply text-gray-description;
            @apply text-xs;
        }
    }
</style>
