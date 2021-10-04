<template>
    <div>
        <a-popover
            placement="left"
            overlay-class-name="inlinepopover"
            trigger="click"
        >
            <!-- <span
                v-if="ownerUsers.length < 1 && ownerGroups.length < 1"
                class="text-xs cursor-pointer text-primary hover:underline"
                @click.stop="toggleOwnerPopover"
                >Add owners</span
            > -->
            OLLLLLLLSSS
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
                    <div class="flex items-center justify-between mb-3">
                        <SearchAndFilter
                            v-model:value="searchText"
                            :autofocus="true"
                            placeholder="Search "
                            @change="handleOwnerSearch"
                        >
                        </SearchAndFilter>
                        <a-button-group>
                            <a-button
                                :class="
                                    activeOwnerTabKey === 'users'
                                        ? 'text-primary'
                                        : ''
                                "
                                @click="setActiveTab('users')"
                            >
                                <template #icon
                                    ><AtlanIcon icon="User" class="mx-auto"
                                /></template>
                            </a-button>
                            <a-button
                                :class="
                                    activeOwnerTabKey === 'groups'
                                        ? 'text-primary'
                                        : ''
                                "
                                @click="setActiveTab('groups')"
                                ><template #icon
                                    ><AtlanIcon
                                        icon="GroupStatic"
                                        class="mx-auto" /></template
                            ></a-button>
                        </a-button-group>
                    </div>

                    <div class="relative w-full">
                        <template v-if="activeOwnerTabKey === 'users'">
                            <div class="h-48 overflow-y-auto">
                                <div
                                    v-if="STATES.SUCCESS === userOwnerState"
                                    class="flex flex-col w-full"
                                >
                                    <template
                                        v-for="item in userList"
                                        :key="item.username"
                                    >
                                        <a-checkbox
                                            v-if="item.username"
                                            :value="item.username"
                                            class="w-full mb-3"
                                            :checked="
                                                selectedUsers.all.includes(
                                                    item.username
                                                )
                                            "
                                            :indeterminate="
                                                selectedUsers.partial.includes(
                                                    item.username
                                                )
                                            "
                                            @change="onSelectUser"
                                        >
                                            <div
                                                v-if="
                                                    item.username === myUsername
                                                "
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
                                    </template>
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
                        </template>
                        <template v-if="activeOwnerTabKey === 'groups'">
                            <div class="h-48 overflow-y-auto">
                                <div
                                    v-if="
                                        STATES.SUCCESS === groupOwnerState &&
                                        groupList.length < 1
                                    "
                                    class="flex flex-col items-center justify-center h-full "
                                >
                                    <div class="flex flex-col items-center">
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
                                <div v-if="STATES.SUCCESS === groupOwnerState">
                                    <div class="flex flex-col w-full">
                                        <a-checkbox
                                            v-for="item in groupList"
                                            :key="item.name"
                                            :value="item.name"
                                            class="mb-3 capitalize"
                                            :checked="
                                                selectedGroups.includes(
                                                    item.name
                                                )
                                            "
                                            @change="onSelectGroup"
                                        >
                                            {{ item.name }}
                                        </a-checkbox>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="flex items-center justify-center"
                                >
                                    <a-spin
                                        size="small"
                                        class="mr-2 leading-none"
                                    ></a-spin
                                    ><span>Fetching groups</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="w-full mt-2">
                        <div class="flex justify-end text-xs">
                            <span v-if="selectedUsers.length > 0">{{
                                `${selectedUsers.length} user(s)`
                            }}</span>
                            <span
                                v-if="
                                    selectedUsers.length &&
                                    selectedGroups.length
                                "
                                >{{ `&nbsp;&` }}</span
                            >
                            <span v-if="selectedGroups.length > 0">{{
                                ` &nbsp;${selectedGroups.length} group(s)`
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
                                @click="handleConfirm"
                                >Done</a-button
                            >
                        </div>
                    </div>
                </div>
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, watch, ref, Ref } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import SearchAndFilter from '@/common/input/searchAndFilter.vue'
import updateOwners from '~/composables/asset/updateOwners'
import fetchGroupList from '~/composables/group/fetchGroupList'
import fetchUserList from '~/composables/user/fetchUserList'
import whoami from '~/composables/user/whoami'
import { groupInterface } from '~/types/groups/group.interface'
import { userInterface } from '~/types/users/user.interface'

interface SelectedOwners {
    partial: Array<string>
    all: Array<string>
    removed: Array<string>
}
export default defineComponent({
    name: 'UpdateBulkOwners',
    components: { SearchAndFilter },
    setup() {
        const { username: myUsername, name: myName } = whoami()
        const selectedAssets = inject('selectedAssets')
        const ownerUsersFrequencyMap = inject('ownerUsersFrequencyMap')
        const existingOwnerUsers = inject('existingOwnerUsers')
        const ownerGroupsFrequencyMap = inject('ownerGroupsFrequencyMap')
        const existingOwnerGroups = inject('existingOwnerGroups')
        const updatedOwners = inject('updatedOwners')
        const activeOwnerTabKey: Ref<'users' | 'groups'> = ref('users')
        const selectedUsers: Ref<SelectedOwners> = ref({
            partial: [],
            all: [],
            removed: [],
        })
        const selectedGroups: Ref<SelectedOwners> = ref({
            partial: [],
            all: [],
            removed: [],
        })
        const searchText: Ref<string> = ref('')
        const showAll = ref(false)
        const userList: Ref<userInterface[]> = ref([])
        const groupList: Ref<groupInterface[]> = ref([])

        const getOriginalConfig = () => {
            const selectedUsersLocal: SelectedOwners = {
                partial: [],
                all: [],
                removed: [],
            }
            if (
                ownerUsersFrequencyMap &&
                ownerUsersFrequencyMap.value &&
                Object.keys(ownerUsersFrequencyMap.value).length
            ) {
                Object.keys(ownerUsersFrequencyMap.value).forEach((user) => {
                    if (
                        ownerUsersFrequencyMap.value[user] ===
                        selectedAssets.value.length
                    )
                        selectedUsersLocal.all.push(user)
                    else if (
                        ownerUsersFrequencyMap.value[user] <
                        selectedAssets.value.length
                    )
                        selectedUsersLocal.partial.push(user)
                })
            }
            return selectedUsersLocal
        }
        const initialiseAssetOwners = () => {
            selectedUsers.value = { ...getOriginalConfig() }
        }
        // initialising assetStatus to find if status of all selected assets is same
        watch(existingOwnerUsers, initialiseAssetOwners, {
            immediate: true,
            deep: true,
        })
        const {
            list: listUsers,
            state: userOwnerState,
            STATES,
            mutate: mutateUsers,
            handleSearch: handleUserSearch,
        } = fetchUserList(true)

        const {
            list: listGroups,
            handleSearch: handleGroupSearch,
            state: groupOwnerState,
            mutate: mutateGroups,
        } = fetchGroupList(false)

        const onSelectUser = (event) => {
            if (event.target.checked) {
                // add to all
                if (!selectedUsers.value.all.includes(event.target.value))
                    selectedUsers.value.all.push(event.target.value)
                // remove from removed
                let index = selectedUsers.value.removed.indexOf(
                    event.target.value
                )
                if (index > -1) selectedUsers.value.removed.splice(index, 1)
                // remove from partial
                index = selectedUsers.value.partial.indexOf(event.target.value)
                if (index > -1) selectedUsers.value.partial.splice(index, 1)
            } else if (!event.target.checked) {
                // add to removed
                if (!selectedUsers.value.removed.includes(event.target.value))
                    selectedUsers.value.removed.push(event.target.value)
                // remove from all
                let index = selectedUsers.value.all.indexOf(event.target.value)
                if (index > -1) selectedUsers.value.all.splice(index, 1)
                // remove from partial
                index = selectedUsers.value.partial.indexOf(event.target.value)
                if (index > -1) selectedUsers.value.partial.splice(index, 1)
            }
        }

        const onSelectGroup = (event) => {
            if (
                event.target.checked &&
                !selectedGroups.value.includes(event.target.value)
            ) {
                selectedGroups.value.push(event.target.value)
            } else if (!event.target.checked) {
                const index = selectedGroups.value.indexOf(event.target.value)
                if (index > -1) {
                    selectedGroups.value.splice(index, 1)
                }
            }
        }

        watch(
            [listUsers, listGroups],
            () => {
                userList.value = [...listUsers.value]
                //     listUsers.value.map((user) => ({
                //         ...user,
                //         isPartiallyChecked:
                //             ownerUsersFrequencyMap.value[user.username] > 0 &&
                //             ownerUsersFrequencyMap.value[user.username] <
                //                 selectedAssets.value.length,
                //         isChecked:
                //             ownerUsersFrequencyMap.value[user.username] ===
                //             selectedAssets.value.length,
                //     }))
                //     // removing own username from list
                //     let ownUserObj: userInterface = {}
                //     userList.value = userList.value.filter((user) => {
                //         if (user.username === myUsername.value) {
                //             ownUserObj = user
                //         }
                //         return user.username !== myUsername.value
                //     })
                //     if (Object.keys(ownUserObj).length > 0) {
                //         userList.value = [ownUserObj, ...userList.value]
                //     } else {
                //         userList.value = [...userList.value]
                //     }
                //     // groupList.value = [...listGroups.value]
            },
            {
                immediate: true,
            }
        )
        function setActiveTab(tabName: 'users' | 'groups') {
            activeOwnerTabKey.value = tabName
        }
        mutateUsers()
        mutateGroups()

        const { handleUpdateOwners } = useBulkSelect()
        const handleConfirm = () => {
            handleUpdateOwners(
                {
                    addedOwnerUsers: [...selectedUsers.value.all],
                    removedOwnerUsers: [...selectedUsers.value.removed],
                },
                updatedOwners,
                existingOwnerUsers,
                existingOwnerGroups
            )
            // showPopover.value = false
        }
        return {
            ownerUsersFrequencyMap,
            existingOwnerUsers,
            ownerGroupsFrequencyMap,
            existingOwnerGroups,
            updatedOwners,
            handleUpdateOwners,
            userList,
            groupList,
            searchText,
            showAll,
            onSelectGroup,
            onSelectUser,
            userOwnerState,
            groupOwnerState,
            STATES,
            handleGroupSearch,
            mutateUsers,
            handleUserSearch,
            mutateGroups,
            activeOwnerTabKey,
            selectedUsers,
            selectedGroups,
            setActiveTab,
            handleConfirm,
        }
    },
})
</script>

<style>
</style>