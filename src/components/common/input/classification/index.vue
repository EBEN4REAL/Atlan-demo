<template>
    <div class="flex flex-col justify-between text-xs text-gray-500">
        <p class="mb-1 text-sm">Classifications</p>

        <div
            v-if="list.length > 0 || list.length"
            class="flex flex-wrap gap-1 text-sm"
        >
            <template v-for="classification in list" :key="classification.guid">
                <div
                    class="flex items-center py-1 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer  hover:bg-pink-400 hover:border-pink-400 group hover:shadow"
                    :class="
                        classification.entityGuid !== selectedAsset.guid
                            ? 'border-dotted'
                            : 'border-solid'
                    "
                >
                    <AtlanIcon
                        icon="ShieldFilled"
                        class="text-pink-400 group-hover:text-white"
                        v-if="classification.entityGuid !== selectedAsset.guid"
                    ></AtlanIcon>
                    <AtlanIcon
                        icon="Shield"
                        class="text-pink-400 group-hover:text-white"
                        v-else
                    ></AtlanIcon>

                    <div class="ml-1 group-hover:text-white">
                        {{ classification.displayName || classification.name }}
                    </div>
                </div>
            </template>
        </div>
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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { mergeArray } from '~/utils/array'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ClassificationWidget',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)

            const { classifications } = useAssetInfo()

            const { classificationList } = useTypedefData()

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList,
                    classifications(selectedAsset.value),
                    'name',
                    'typeName'
                )

                return matchingIdsResult
            })

            // const { username: myUsername, name: myName } = whoami()
            // const showOwnersDropdown: Ref<boolean> = ref(false)
            // const activeOwnerTabKey: Ref<'users' | 'groups'> = ref('users')
            // const selectedUsers: Ref<string[]> = ref([])
            // const selectedGroups: Ref<string[]> = ref([])
            // const searchText: Ref<string> = ref('')
            // const showAll = ref(false)
            // const userList: Ref<userInterface[]> = ref([])
            // const groupList: Ref<groupInterface[]> = ref([])
            // const ownersFilterOptionsData = ref('asc')

            // function sortClassificationsByOrder(
            //     sortingOrder: string,
            //     data: Ref<userInterface[] | groupInterface[]>,
            //     key: string
            // ) {
            //     switch (sortingOrder) {
            //         case 'asc': {
            //             let modifiedData: userInterface[] = []
            //             if (data?.value) {
            //                 modifiedData = data.value.sort((dataA, dataB) => {
            //                     const a = dataA[key].toLowerCase()
            //                     const b = dataB[key].toLowerCase()
            //                     if (a < b) {
            //                         return -1
            //                     }
            //                     if (a > b) {
            //                         return 1
            //                     }
            //                     return 0
            //                 })
            //             }
            //             return modifiedData
            //         }
            //         case 'dsc': {
            //             let modifiedData: groupInterface[] = []
            //             if (data?.value) {
            //                 modifiedData = data.value.sort((dataA, dataB) => {
            //                     const a = dataA[key].toLowerCase()
            //                     const b = dataB[key].toLowerCase()
            //                     if (a < b) {
            //                         return 1
            //                     }
            //                     if (a > b) {
            //                         return -1
            //                     }
            //                     return 0
            //                 })
            //             }
            //             return modifiedData
            //         }
            //     }
            // }
            // watch(
            //     [listUsers, listGroups],
            //     () => {
            //         userList.value = sortClassificationsByOrder(
            //             ownersFilterOptionsData.value,
            //             listUsers,
            //             'username'
            //         )
            //         // removing own username from list
            //         let ownUserObj: userInterface = {}
            //         userList.value = userList.value.filter((user) => {
            //             if (user.username === myUsername.value) {
            //                 ownUserObj = user
            //             }
            //             return user.username !== myUsername.value
            //         })
            //         if (Object.keys(ownUserObj).length > 0) {
            //             userList.value = [ownUserObj, ...userList.value]
            //         } else {
            //             userList.value = [...userList.value]
            //         }
            //         groupList.value = sortClassificationsByOrder(
            //             ownersFilterOptionsData.value,
            //             listGroups,
            //             'name'
            //         )
            //     },
            //     {
            //         immediate: true,
            //     }
            // )
            // const onSelectUser = (event) => {
            //     if (
            //         event.target.checked &&
            //         !selectedUsers.value.includes(event.target.value)
            //     ) {
            //         selectedUsers.value.push(event.target.value)
            //     } else if (!event.target.checked) {
            //         const index = selectedUsers.value.indexOf(
            //             event.target.value
            //         )
            //         if (index > -1) {
            //             selectedUsers.value.splice(index, 1)
            //         }
            //     }
            // }
            // const onSelectGroup = (event) => {
            //     if (
            //         event.target.checked &&
            //         !selectedGroups.value.includes(event.target.value)
            //     ) {
            //         selectedGroups.value.push(event.target.value)
            //     } else if (!event.target.checked) {
            //         const index = selectedGroups.value.indexOf(
            //             event.target.value
            //         )
            //         if (index > -1) {
            //             selectedGroups.value.splice(index, 1)
            //         }
            //     }
            // }
            // // user preview drawer
            // const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // const { showGroupPreview, setGroupUniqueAttribute } =
            //     useGroupPreview()
            // const handleClickUser = (item) => {
            //     if (item.type === 'user') {
            //         setUserUniqueAttribute(item.username, 'username')
            //         showUserPreview({ allowed: ['about'] })
            //     }
            //     if (item.type === 'group') {
            //         setGroupUniqueAttribute(item.name, 'groupAlias')
            //         showGroupPreview({ allowed: ['about'] })
            //     }
            // }
            // const {
            //     update,
            //     ownerUsers,
            //     isLoading: isOwnersLoading,
            //     ownerGroups,
            // } = updateOwners(selectedAsset)
            // const handleUpdateOwners = () => {
            //     console.log(selectedUsers.value, selectedGroups.value)
            //     update(selectedUsers.value, selectedGroups.value)
            // }
            // const handleCancelUpdateOwnerPopover = () => {
            //     showOwnersDropdown.value = false
            // }
            // function splitArray(sizeofSplit: number, arr: any[]) {
            //     if (sizeofSplit >= arr.length) {
            //         return {
            //             a: [...arr],
            //             b: [],
            //         }
            //     }
            //     const a: any[] = arr.slice(0, sizeofSplit)
            //     const b: any[] = arr.slice(sizeofSplit, arr.length)
            //     return {
            //         a,
            //         b,
            //     }
            // }
            // function isOwner(username: string, owners: string[]) {
            //     return owners.includes(username)
            // }
            // function mappedSplittedOwners(ownerUsers, ownerGroups) {
            //     let splittedOwners = []
            //     let temp = ownerUsers.value.map((username: string) => ({
            //         type: 'user',
            //         username,
            //     }))
            //     splittedOwners = temp
            //     temp = ownerGroups.value.map((name: string) => ({
            //         type: 'group',
            //         username: name,
            //     }))
            //     splittedOwners = [...splittedOwners, ...temp]
            //     console.log(splittedOwners, 'spilltedOwners')
            //     return splittedOwners
            // }
            // const splittedOwners = ref(
            //     splitArray(5, mappedSplittedOwners(ownerUsers, ownerGroups))
            // )
            // const ownerList = computed(() =>
            //     showAll.value
            //         ? [...splittedOwners.value.a, ...splittedOwners.value.b]
            //         : splittedOwners.value.a
            // )
            // const closePopover = () => {
            //     showOwnersDropdown.value = false
            // }
            // const clearSelectedOwners = () => {
            //     if (activeOwnerTabKey.value === 'users') {
            //         selectedUsers.value = []
            //     } else if (activeOwnerTabKey.value === 'groups') {
            //         // for groups
            //         selectedGroups.value = []
            //     }
            // }
            // console.log(ownerUsers, 'ownersUsers')
            // console.log(selectedGroups, 'selectedGroups')
            // watch(
            //     [ownerUsers, ownerGroups],
            //     () => {
            //         console.log('owners changed', ownerUsers.value)
            //         selectedUsers.value = [...ownerUsers.value]
            //         selectedGroups.value = [...ownerGroups.value]
            //         splittedOwners.value = splitArray(
            //             5,
            //             mappedSplittedOwners(ownerUsers, ownerGroups)
            //         )
            //         emit('update:selectedAsset', selectedAsset.value)
            //     },
            //     {
            //         immediate: true,
            //     }
            // )
            // const handleOwnerSearch = (e: Event) => {
            //     if (activeOwnerTabKey.value === 'users') {
            //         handleUserSearch(searchText.value)
            //     } else if (activeOwnerTabKey.value === 'groups') {
            //         handleGroupSearch(searchText.value)
            //     }
            // }
            // const toggleOwnerPopover = () => {
            //     showOwnersDropdown.value = !showOwnersDropdown.value
            //     if (
            //         !searchText.value &&
            //         (!listUsers?.value?.length || !listGroups?.value?.length)
            //     ) {
            //         mutateUsers()
            //         mutateGroups()
            //     }
            // }
            // const toggleAllOwners = () => {
            //     showAll.value = !showAll.value
            // }
            // const handleRemoveOwner = (owner: {
            //     username: string
            //     type: string
            // }) => {
            //     if (owner.type === 'user') {
            //         const filteredOwnerUsers = ownerUsers.value.filter(
            //             (username) => username !== owner.username
            //         )
            //         selectedUsers.value = filteredOwnerUsers
            //         console.log(ownerUsers.value, 'delete', filteredOwnerUsers)
            //     } else {
            //         const filteredOwnerGroups = ownerGroups.value.filter(
            //             (name) => name !== owner.username
            //         )
            //         selectedGroups.value = filteredOwnerGroups
            //     }
            //     update(selectedUsers.value, selectedGroups.value)
            // }
            // // closing the popover on making the req successfully
            // watch(isOwnersLoading, () => {
            //     if (!isOwnersLoading.value) showOwnersDropdown.value = false
            // })
            // function setActiveTab(tabName: 'users' | 'groups') {
            //     activeOwnerTabKey.value = tabName
            // }

            return {
                classifications,
                classificationList,
                list,
            }
            // return {
            //     myUsername,
            //     showAll,
            //     toggleAllOwners,
            //     userOwnerState,
            //     searchText,
            //     STATES,
            //     groupOwnerState,
            //     handleOwnerSearch,
            //     handleUpdateOwners,
            //     clearSelectedOwners,
            //     selectedGroups,
            //     selectedUsers,
            //     isOwnersLoading,
            //     closePopover,
            //     activeOwnerTabKey,
            //     isOwner,
            //     splittedOwners,
            //     ownerUsers,
            //     ownerGroups,
            //     handleClickUser,
            //     onSelectGroup,
            //     onSelectUser,
            //     listUsers,
            //     listGroups,
            //     userList,
            //     groupList,
            //     showOwnersDropdown,
            //     toggleOwnerPopover,
            //     selectedAsset,
            //     handleRemoveOwner,
            //     handleCancelUpdateOwnerPopover,
            //     ownerList,
            //     KeyMaps,
            //     setActiveTab,
            //     emptyScreen,
            // }
        },
    })
</script>
<style lang="less" scoped></style>
