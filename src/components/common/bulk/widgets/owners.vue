<template>
    <a-popover
        v-model:visible="showOwnersDropdown"
        placement="left"
        overlay-class-name="inlinepopover"
        trigger="click"
    >
        <template #content>
            <div class="p-2.5 bg-white flex items-center flex-col w-56 rounded">
                <div class="flex items-center justify-between w-full mb-3">
                    <SearchAndFilter
                        v-model:value="searchText"
                        :autofocus="true"
                        placeholder="Search "
                        :size="'minimal'"
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
                                        :value="item"
                                        class="w-full mb-3"
                                        :checked="
                                            localState.all.find(
                                                (oUser) =>
                                                    oUser.nameOrUsername ===
                                                    item.username
                                            )
                                        "
                                        :indeterminate="
                                            localState.partial.find(
                                                (oUser) =>
                                                    oUser.nameOrUsername ===
                                                    item.username
                                            )
                                        "
                                        @change="handleOwnerChange"
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
                                </template>
                            </div>
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
                                        :value="item"
                                        class="mb-3 capitalize"
                                        :checked="
                                            localState.all.find(
                                                (oGroup) =>
                                                    oGroup.nameOrUsername ===
                                                    item.name
                                            )
                                        "
                                        :indeterminate="
                                            localState.partial.find(
                                                (oGroup) =>
                                                    oGroup.nameOrUsername ===
                                                    item.name
                                            )
                                        "
                                        @change="handleOwnerChange"
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
        <div
            class="mb-3 text-xs text-gray-500"
            @click.stop="toggleOwnerPopover"
        >
            <p class="mb-1 text-sm text-gray mb-2.5">Owners</p>
            <div class="flex">
                <!-- same owners for all selected assets -->
                <div
                    v-if="ownersList && ownersList.length"
                    class="flex flex-grow mr-1 text-sm"
                >
                    <PillGroup
                        :class="ownersList && ownersList.length ? '' : 'hidden'"
                        :data="formattedOwnersList"
                        label-key="nameOrUsername"
                        popover-trigger="hover"
                        :read-only="true"
                    >
                        <template #pillPrefix="{ item }">
                            <avatar
                                v-if="item && item.type === 'user'"
                                class="-ml-2.5"
                                :image-url="
                                    KeyMaps.auth.avatar.GET_AVATAR({
                                        username: item.nameOrUsername,
                                    })
                                "
                                :allow-upload="false"
                                :avatar-name="item.nameOrUsername"
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
                            <span
                                v-if="splitOwners.second.length > 0"
                                class="
                                    px-1
                                    py-0.5
                                    text-sm
                                    rounded
                                    text-primary
                                    mr-3
                                    cursor-pointer
                                "
                                @click.stop="() => toggleShowAll()"
                            >
                                {{
                                    showAll
                                        ? 'Show less'
                                        : `and ${splitOwners.second.length} more`
                                }}
                            </span>
                            <div
                                class="p-1.5 border rounded-full cursor-pointer"
                            >
                                <AtlanIcon icon="Pencil" />
                            </div>
                        </template>
                    </PillGroup>
                </div>
                <!-- Multiple owners -->
                <div
                    v-else-if="
                        ownersList &&
                        !ownersList.length &&
                        Object.keys(ownerFrequencyMap).length
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
                    <div class="p-1.5 border rounded-full cursor-pointer">
                        <AtlanIcon icon="Pencil" />
                    </div>
                </div>
                <!-- No owners present -->
                <div
                    v-else-if="!Object.keys(ownerFrequencyMap).length"
                    class="p-1.5 border rounded-full cursor-pointer"
                >
                    <AtlanIcon icon="Pencil" />
                </div>
            </div>
            <div class="mt-2.5">
                <div v-if="changeLog.all.length">
                    {{ getTruncatedStringFromArray(changeLog.all, 20) }}
                    <span class="text-success">added</span>
                </div>
                <div v-if="changeLog.removed.length">
                    {{ getTruncatedStringFromArray(changeLog.removed, 20) }}
                    <span class="text-error">removed</span>
                </div>
            </div>
        </div>
    </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject, computed, watch, ref, Ref } from 'vue'
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
import { splitArray, getTruncatedStringFromArray } from '~/utils/string'

interface Owner {
    nameOrUsername: string
    type: string
}
interface LocalState {
    all: Owner[]
    partial: Owner[]
    removed: Owner[]
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
        /** NEW */
        const showOwnersDropdown: Ref<boolean> = ref(false)
        const searchText: Ref<string> = ref('')
        const localState: Ref<LocalState> = ref({
            all: [] as Owner[],
            partial: [] as Owner[],
            removed: [] as Owner[],
        })
        const changeLog: Ref<Record<string, (string | undefined)[]>> = ref({
            all: [],
            partial: [],
            removed: [],
        })
        const {
            resetOwners,
            initialiseLocalStateOwners,
            updateOwners,
            getInitialLocalState,
        } = useBulkSelect()
        const ownersRef = inject('ownersRef')
        const originalOwnersRef = inject('originalOwnersRef')
        const selectedAssets = inject('selectedAssets')
        const ownerFrequencyMap = inject('ownerFrequencyMap')
        const publishedOwnerChangeLogRef = inject('publishedOwnerChangeLogRef')
        const activeOwnerTabKey: Ref<'users' | 'groups'> = ref('users')
        const showAll = ref(false)
        const userList: Ref<userInterface[]> = ref([])
        const groupList: Ref<groupInterface[]> = ref([])

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
        const { username: myUsername } = whoami()
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
        watch(
            originalOwnersRef,
            () => {
                resetOwners(
                    originalOwnersRef,
                    ownersRef,
                    publishedOwnerChangeLogRef
                )
                localState.value = initialiseLocalStateOwners(
                    selectedAssets,
                    ownerFrequencyMap
                )
                changeLog.value = {
                    all: [],
                    partial: [],
                    removed: [],
                }
            },
            { immediate: true }
        )
        const handleOwnerChange = (event) => {
            console.log(event.target.value)
            if (event.target.checked) {
                // add to all
                if (
                    !localState.value.all.find(
                        (owner) =>
                            owner.nameOrUsername ===
                            (event.target.value?.username ||
                                event.target.value?.name)
                    )
                ) {
                    const ownerObj = event.target.value
                    if (ownerObj.type === 'user')
                        localState.value.all.push({
                            nameOrUsername: ownerObj.username,
                            type: ownerObj.type,
                        })
                    if (ownerObj.type === 'group')
                        localState.value.all.push({
                            nameOrUsername: ownerObj.name,
                            type: ownerObj.type,
                        })
                }
                // remove from removed
                let index = localState.value.removed.findIndex(
                    (owner) =>
                        owner.nameOrUsername ===
                        (event.target.value?.username ||
                            event.target.value?.name)
                )
                if (index > -1) localState.value.removed.splice(index, 1)
                // remove from partial
                index = localState.value.partial.findIndex(
                    (owner) =>
                        owner.nameOrUsername ===
                        (event.target.value?.username ||
                            event.target.value?.name)
                )
                if (index > -1) localState.value.partial.splice(index, 1)
            } else if (!event.target.checked) {
                // add to removed
                if (
                    !localState.value.removed.find(
                        (owner) =>
                            owner.nameOrUsername ===
                            (event.target.value?.username ||
                                event.target.value?.name)
                    )
                ) {
                    const ownerObj = event.target.value
                    if (ownerObj.type === 'user')
                        localState.value.removed.push({
                            nameOrUsername: ownerObj.username,
                            type: ownerObj.type,
                        })
                    if (ownerObj.type === 'group')
                        localState.value.removed.push({
                            nameOrUsername: ownerObj.name,
                            type: ownerObj.type,
                        })
                }
                // remove from all
                let index = localState.value.all.findIndex(
                    (owner) =>
                        owner.nameOrUsername ===
                        (event.target.value?.username ||
                            event.target.value?.name)
                )
                if (index > -1) localState.value.all.splice(index, 1)
                // remove from partial
                index = localState.value.partial.findIndex(
                    (owner) =>
                        owner.nameOrUsername ===
                        (event.target.value?.username ||
                            event.target.value?.name)
                )
                if (index > -1) localState.value.partial.splice(index, 1)
            }
        }
        // find diff bw original and local state; we need changeLog ref to be updated on demand i.e. when user clicks on done, hence not making this a computed property
        const calculateChangeLog = () => {
            const changeLogLocal: LocalState = {
                all: [],
                removed: [],
                partial: [],
            }
            const initialLocalState = getInitialLocalState(
                originalOwnersRef,
                selectedAssets
            )
            changeLogLocal.all = localState.value.all.filter(
                (owner) =>
                    !initialLocalState.all.find(
                        (o) => o.nameOrUsername === owner.nameOrUsername
                    )
            )
            changeLogLocal.removed = [...localState.value.removed]
            changeLogLocal.partial = [...localState.value.partial]
            return changeLogLocal || {}
        }
        const handleConfirm = () => {
            const calChangeLog = calculateChangeLog()
            changeLog.value.all = calChangeLog.all.map((o) => o.nameOrUsername)
            changeLog.value.removed = calChangeLog.removed.map(
                (o) => o.nameOrUsername
            )
            changeLog.value.partial = calChangeLog.partial.map(
                (o) => o.nameOrUsername
            )
            updateOwners(
                ownersRef,
                localState,
                originalOwnersRef,
                publishedOwnerChangeLogRef,
                changeLog
            )
            toggleOwnerPopover()
        }
        // To show owner tags if all assets have same owners
        const ownersList = computed(() => {
            /** we can have 3 cases:
             *  All selected assets have same owners: in that case freq of each owner will be same as selectedAssets count in the freqMap; ownerList will be keys of freq map
             * No owners present in any selectedAsset: No keys in freqMap, ownerList will be []
             * Different owners for selected assets: freqMap will have keys, but ownerList will []
             */
            if (Object.keys(ownerFrequencyMap.value).length) {
                if (
                    !Object.keys(ownerFrequencyMap.value).some(
                        (key) =>
                            ownerFrequencyMap.value[key].frequency !==
                            selectedAssets.value.length
                    )
                ) {
                    const ownerList = [
                        ...Object.keys(ownerFrequencyMap.value).map(
                            (owner) => ({
                                ...ownerFrequencyMap.value[owner].owner,
                            })
                        ),
                    ]

                    return ownerList
                }
            }
            return []
        })
        const splitOwners = computed(() => {
            const { a: first, b: second } = splitArray(5, ownersList.value)
            return {
                first,
                second,
            }
        })
        const formattedOwnersList = computed(() =>
            showAll.value
                ? [...splitOwners.value.first, ...splitOwners.value.second]
                : [...splitOwners.value.first]
        )
        const toggleShowAll = () => {
            showAll.value = !showAll.value
        }
        const handleCancel = () => {
            resetOwners(
                originalOwnersRef,
                ownersRef,
                publishedOwnerChangeLogRef
            )
            localState.value = initialiseLocalStateOwners(
                selectedAssets,
                ownerFrequencyMap
            )
            changeLog.value = {
                all: [],
                partial: [],
                removed: [],
            }
            toggleOwnerPopover()
        }
        watch(
            [listUsers, listGroups],
            () => {
                userList.value = [
                    ...listUsers.value.map((user) => ({
                        ...user,
                        type: 'user',
                    })),
                ]
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
                groupList.value = [
                    ...listGroups.value.map((group) => ({
                        ...group,
                        type: 'group',
                    })),
                ]
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
        return {
            ownersRef,
            localState,
            handleConfirm,
            ownersList,
            ownerFrequencyMap,
            handleOwnerChange,
            toggleOwnerPopover,
            changeLog,
            handleCancel,
            userOwnerState,
            STATES,
            handleUserSearch,
            handleGroupSearch,
            groupOwnerState,
            setActiveTab,
            handleOwnerSearch,
            activeOwnerTabKey,
            showAll,
            userList,
            groupList,
            KeyMaps,
            showOwnersDropdown,
            formattedOwnersList,
            toggleShowAll,
            splitOwners,
            getTruncatedStringFromArray,
        }
    },
})
</script>

<style>
</style>