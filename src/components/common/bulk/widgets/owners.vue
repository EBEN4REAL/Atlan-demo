<template>
    <div class="mb-3 text-xs text-gray-500" @click.stop="toggleOwnerPopover">
        <p class="mb-1 text-sm">Owners</p>
        <div class="flex">
            <!-- same owners for all selected assets -->
            <div
                v-if="ownersList && ownersList.length"
                class="flex flex-grow mr-1 text-sm"
            >
                <PillGroup
                    :class="ownersList && ownersList.length ? '' : 'hidden'"
                    :data="ownersList"
                    label-key="username"
                    popover-trigger="hover"
                    :read-only="true"
                >
                    <template #pillPrefix="{ item }">
                        <avatar
                            v-if="item && item.type === 'user'"
                            class="-ml-2.5"
                            :image-url="
                                KeyMaps.auth.avatar.GET_AVATAR({
                                    username: item.username,
                                })
                            "
                            :allow-upload="false"
                            :avatar-name="item.username"
                            avatar-size="small"
                            :avatar-shape="'circle'"
                        />
                        <AtlanIcon
                            v-else-if="item && item.type === 'group'"
                            icon="Group"
                            class="
                                h-4
                                -ml-0.5
                                text-primary
                                group-hover:text-white
                            "
                        />
                    </template>
                    <template #popover="{ item }"
                        ><OwnerInfoCard :user="item"
                    /></template>
                    <template #suffix>
                        <div class="p-1.5 border rounded-full">
                            <AtlanIcon icon="Pencil" />
                        </div>
                        <!-- <span
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
                    </span> -->
                    </template>
                </PillGroup>
            </div>
            <!-- Multiple owners -->
            <div
                v-else-if="
                    ownersList &&
                    !ownersList.length &&
                    Object.keys(ownerUsersFrequencyMap).length
                "
                class="flex"
            >
                <div
                    class="
                        p-1.5
                        bg-secondary-light
                        rounded-sm
                        text-secondary
                        mr-1
                    "
                >
                    <span class="text-sm">Multiple owners</span>
                </div>
                <div class="p-1.5 border rounded-full">
                    <AtlanIcon icon="Pencil" />
                </div>
            </div>
            <!-- No owners present -->
            <div
                v-else-if="
                    !Object.keys(ownerUsersFrequencyMap).length &&
                    !Object.keys(ownerGroupsFrequencyMap).length
                "
                class="p-1.5 border rounded-full"
            >
                <AtlanIcon icon="Pencil" />
            </div>
        </div>
        <div class="mt-1">
            <div v-if="evaluateChangeLog().all.length">
                {{ evaluateChangeLog().all.join(',') }}
                <span class="text-success">added</span>
            </div>
            <div v-if="evaluateChangeLog().removed.length">
                {{ evaluateChangeLog().removed.join(',') }}
                <span class="text-error">removed</span>
            </div>
        </div>
        <a-popover
            v-model:visible="showOwnersDropdown"
            placement="left"
            overlay-class-name="inlinepopover"
            trigger="click"
        >
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
                                                selectedGroups.all.includes(
                                                    item.name
                                                )
                                            "
                                            :indeterminate="
                                                selectedGroups.partial.includes(
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
                        <!-- <div class="flex justify-end text-xs">
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
                        </div> -->
                        <div class="flex justify-end w-full mt-2">
                            <a-button
                                class="mr-3 border rounded"
                                @click="handleCancel"
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
import {
    defineComponent,
    inject,
    computed,
    watch,
    ref,
    Ref,
    ComputedRef,
} from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import SearchAndFilter from '@/common/input/searchAndFilter.vue'
import fetchGroupList from '~/composables/group/fetchGroupList'
import fetchUserList from '~/composables/user/fetchUserList'
import whoami from '~/composables/user/whoami'
import { groupInterface } from '~/types/groups/group.interface'
import { userInterface } from '~/types/users/user.interface'
import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
import PillGroup from '~/components/UI/pill/pillGroup.vue'
import Avatar from '~/components/common/avatar.vue'
import { KeyMaps } from '~/api/keyMap'
import AtlanIcon from '../../icon/atlanIcon.vue'

interface SelectedOwners {
    partial?: Array<string>
    all: Array<string>
    removed: Array<string>
}
export default defineComponent({
    name: 'UpdateBulkOwners',
    components: {
        SearchAndFilter,
        OwnerInfoCard,
        Avatar,
        PillGroup,
        AtlanIcon,
    },
    setup() {
        const showOwnersDropdown: Ref<boolean> = ref(false)
        const searchText: Ref<string> = ref('')
        const { username: myUsername } = whoami()
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
            const selectedGroupsLocal: SelectedOwners = {
                partial: [],
                all: [],
                removed: [],
            }
            if (
                ownerGroupsFrequencyMap &&
                ownerGroupsFrequencyMap.value &&
                Object.keys(ownerGroupsFrequencyMap.value).length
            ) {
                Object.keys(ownerGroupsFrequencyMap.value).forEach((group) => {
                    if (
                        ownerGroupsFrequencyMap.value[group] ===
                        selectedAssets.value.length
                    )
                        selectedGroupsLocal.all.push(group)
                    else if (
                        ownerGroupsFrequencyMap.value[group] <
                        selectedAssets.value.length
                    )
                        selectedGroupsLocal.partial.push(group)
                })
            }
            return { selectedUsersLocal, selectedGroupsLocal }
        }
        const initialiseAssetOwners = () => {
            selectedUsers.value = { ...getOriginalConfig().selectedUsersLocal }
            selectedGroups.value = {
                ...getOriginalConfig().selectedGroupsLocal,
            }
        }
        const originalConfig: Record<string, SelectedOwners> =
            getOriginalConfig()
        let updatedConfig: Record<string, SelectedOwners> = getOriginalConfig()
        let changeLog: Record<string, SelectedOwners> = {}

        const evaluateChangeLog = () => {
            const changeLogObj = {
                all: [] as string[],
                removed: [] as string[],
            }
            const selectedOwners: SelectedOwners = {
                all: [
                    ...updatedConfig?.selectedUsersLocal?.all,
                    ...updatedConfig?.selectedGroupsLocal?.all,
                ],
                removed: [
                    ...updatedConfig?.selectedUsersLocal?.removed,
                    ...updatedConfig?.selectedGroupsLocal?.removed,
                ],
            }
            const existingOwners: SelectedOwners = {
                all: [
                    ...originalConfig?.selectedUsersLocal?.all,
                    ...originalConfig?.selectedGroupsLocal?.all,
                ],
                removed: [
                    ...originalConfig?.selectedUsersLocal?.removed,
                    ...originalConfig?.selectedGroupsLocal?.removed,
                ],
            }
            changeLogObj.all = selectedOwners.all.filter(
                (sOwner) => existingOwners.all.indexOf(sOwner) < 0
            )
            changeLogObj.removed = selectedOwners.removed.filter(
                (sOwner) => existingOwners.removed.indexOf(sOwner) < 0
            )
            return changeLogObj
        }
        changeLog = evaluateChangeLog()
        // changeLog=evaluateChangeLog()
        // const changeLog: SelectedOwners = computed(() => {
        //     const changeLogObj = {
        //         all: [] as string[],
        //         removed: [] as string[],
        //     }
        //     const selectedOwners: SelectedOwners = {
        //         all: [
        //             ...updatedConfig?.selectedUsersLocal?.all,
        //             ...updatedConfig?.selectedGroupsLocal?.all,
        //         ],
        //         removed: [
        //             ...updatedConfig?.selectedUsersLocal?.removed,
        //             ...updatedConfig?.selectedGroupsLocal?.removed,
        //         ],
        //     }
        //     const existingOwners: SelectedOwners = {
        //         all: [
        //             ...originalConfig?.selectedUsersLocal?.all,
        //             ...originalConfig?.selectedGroupsLocal?.all,
        //         ],
        //         removed: [
        //             ...originalConfig?.selectedUsersLocal?.removed,
        //             ...originalConfig?.selectedGroupsLocal?.removed,
        //         ],
        //     }
        //     changeLogObj.all = selectedOwners.all.filter(
        //         (sOwner) => existingOwners.all.indexOf(sOwner) < 0
        //     )
        //     changeLogObj.removed = selectedOwners.removed.filter(
        //         (sOwner) => existingOwners.removed.indexOf(sOwner) < 0
        //     )
        //     return changeLogObj
        // })
        // initialising assetOwners to mark checkboxes (partial/full)
        watch(
            [existingOwnerUsers, existingOwnerGroups],
            initialiseAssetOwners,
            {
                immediate: true,
                deep: true,
            }
        )
        // To show owner tags if all assets have same owners
        const ownersList = computed(() => {
            /** we can have 3 cases:
             *  All selected assets have same owners: in that case freq of each owner will be same as selectedAssets count in the freqMap; ownerList will be keys of freq map
             * No owners present in any selectedAsset: No keys in freqMap, ownerList will be []
             * Different owners for selected assets: freqMap will have keys, but ownerList will []
             */
            if (
                Object.keys(ownerUsersFrequencyMap.value).length ||
                Object.keys(ownerGroupsFrequencyMap.value).length
            ) {
                if (
                    !Object.keys(ownerUsersFrequencyMap.value).some(
                        (key) =>
                            ownerUsersFrequencyMap.value[key] !==
                            selectedAssets.value.length
                    ) &&
                    !Object.keys(ownerGroupsFrequencyMap.value).some(
                        (key) =>
                            ownerGroupsFrequencyMap.value[key] !==
                            selectedAssets.value.length
                    )
                ) {
                    const ownerList = [
                        ...Object.keys(ownerUsersFrequencyMap.value).map(
                            (username) => ({ username, type: 'user' })
                        ),
                        ...Object.keys(ownerGroupsFrequencyMap.value).map(
                            (gpName) => ({ username: gpName, type: 'group' })
                        ),
                    ]

                    return ownerList
                }
            }
            return []
        })
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

        const toggleOwnerPopover = () => {
            showOwnersDropdown.value = !showOwnersDropdown.value
            if (
                showOwnersDropdown.value &&
                !searchText.value &&
                (!listUsers?.value?.length || !listGroups?.value?.length)
            ) {
                mutateUsers()
                mutateGroups()
            }
        }
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
            if (event.target.checked) {
                // add to all
                if (!selectedGroups.value.all.includes(event.target.value))
                    selectedGroups.value.all.push(event.target.value)
                // remove from removed
                let index = selectedGroups.value.removed.indexOf(
                    event.target.value
                )
                if (index > -1) selectedGroups.value.removed.splice(index, 1)
                // remove from partial
                index = selectedGroups.value.partial.indexOf(event.target.value)
                if (index > -1) selectedGroups.value.partial.splice(index, 1)
            } else if (!event.target.checked) {
                // add to removed
                if (!selectedGroups.value.removed.includes(event.target.value))
                    selectedGroups.value.removed.push(event.target.value)
                // remove from all
                let index = selectedGroups.value.all.indexOf(event.target.value)
                if (index > -1) selectedGroups.value.all.splice(index, 1)
                // remove from partial
                index = selectedGroups.value.partial.indexOf(event.target.value)
                if (index > -1) selectedGroups.value.partial.splice(index, 1)
            }
        }

        watch(
            [listUsers, listGroups],
            () => {
                userList.value = [...listUsers.value]
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
                groupList.value = [...listGroups.value]
            },
            {
                immediate: true,
            }
        )
        function setActiveTab(tabName: 'users' | 'groups') {
            activeOwnerTabKey.value = tabName
        }
        const handleOwnerSearch = (e: Event) => {
            if (activeOwnerTabKey.value === 'users') {
                handleUserSearch(searchText.value)
            } else if (activeOwnerTabKey.value === 'groups') {
                handleGroupSearch(searchText.value)
            }
        }
        const { handleUpdateOwners } = useBulkSelect()
        const handleConfirm = () => {
            const updatedConfigLocal = {
                selectedUsersLocal: {},
                selectedGroupsLocal: {},
            }
            updatedConfigLocal.selectedUsersLocal.all = [
                ...selectedUsers.value.all,
            ]
            updatedConfigLocal.selectedUsersLocal.removed = [
                ...selectedUsers.value.removed,
            ]
            updatedConfigLocal.selectedGroupsLocal.all = [
                ...selectedGroups.value.all,
            ]
            updatedConfigLocal.selectedGroupsLocal.removed = [
                ...selectedGroups.value.removed,
            ]
            updatedConfig = { ...updatedConfigLocal }

            changeLog = evaluateChangeLog()
            handleUpdateOwners(
                {
                    addedOwnerUsers: [...selectedUsers.value.all],
                    removedOwnerUsers: [...selectedUsers.value.removed],
                    addedOwnerGroups: [...selectedGroups.value.all],
                    removedOwnerGroups: [...selectedGroups.value.removed],
                },
                updatedOwners,
                existingOwnerUsers,
                existingOwnerGroups
            )
            toggleOwnerPopover()
        }
        const handleCancel = () => {
            initialiseAssetOwners()
            toggleOwnerPopover()
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
            ownersList,
            KeyMaps,
            toggleOwnerPopover,
            showOwnersDropdown,
            handleOwnerSearch,
            listGroups,
            handleCancel,
            changeLog,
            updatedConfig,
            originalConfig,
            evaluateChangeLog,
        }
    },
})
</script>

<style>
</style>