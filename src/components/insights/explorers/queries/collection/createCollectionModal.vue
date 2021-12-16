<template>
    <a-modal
        :visible="showCollectionModal"
        :closable="false"
        :footer="null"
        width="584px"
        :destroyOnClose="true"
    >
        <div class="w-full py-4 text-gray-500 bg-white rounded">
            <div
                class="flex items-center justify-between px-4 mb-6 text-gray-500 flex-nowrap"
            >
                <span
                    v-if="isCreate"
                    class="flex-none text-base font-bold text-gray-700"
                    >Create Collection</span
                >
                <span
                    v-if="!isCreate"
                    class="flex-none text-base font-bold text-gray"
                    >{{ isShare ? 'Invite to ' : 'Edit ' }}
                    <span
                        class="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg"
                        >{{ item?.attributes?.name }}</span
                    ></span
                >
                <!-- <div class="flex items-center">
                    <span class="mr-2 text-sm font-normal text-gray-700"
                        >Share with others</span
                    >
                    <a-switch v-model:checked="isShareable" size="small" />
                </div> -->
            </div>
            <div class="px-4 mb-4" v-if="!isShare">
                <span class="text-sm font-bold text-gray-700"
                    >Collection name</span
                >
                <a-input
                    :ref="titleBarRef"
                    v-model:value="title"
                    class="w-full mt-1 text-gray-500 border-gray-300 rounded-lg placeholder-color focus:border-primary-focus focus:border-2 focus:outline-none"
                    placeholder="Collection name"
                >
                    <template #prefix>
                        <div class="relative flex w-4 h-4 mr-1">
                            <div
                                @click="toggleEmojiPicker"
                                class="flex items-center"
                            >
                                <span v-if="selectedEmoji" class="mt-1">
                                    {{ selectedEmoji }}
                                </span>
                                <AtlanIcon
                                    v-else
                                    class="w-4 h-4"
                                    :icon="'NoAvatar'"
                                ></AtlanIcon>
                            </div>
                            <a-popover
                                overlay-class-name="cm-avatar-update-modal"
                                :visible="popOverVisible"
                                :trigger="['click']"
                                placement="bottomLeft"
                                destroy-on-close
                                :on-visible-change="toggleEmojiPicker"
                                class="w-full mt-3 -ml-6 border-gray-300 rounded-lg box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
                            >
                                <template #content>
                                    <Picker
                                        :data="emojiIndex"
                                        set="apple"
                                        auto-focus
                                        :show-preview="false"
                                        :emoji-tooltip="false"
                                        :infinite-scroll="true"
                                        @select="handleEmojiSelect"
                                    />
                                </template>
                            </a-popover>
                        </div>
                    </template>
                </a-input>
                <div class="mt-4">
                    <span class="text-sm font-bold text-gray-700"
                        >Collection description</span
                    >
                    <a-textarea
                        v-model:value="description"
                        placeholder="Describe your collection"
                        style="min-height: 82px !important"
                        class="w-full mt-1 text-sm text-gray-500 border-gray-300 rounded-lg text-area-padding placeholder-color focus:border-primary-focus focus:border-2 focus:outline-none"
                    />
                </div>
            </div>
            <div class="px-4 mt-4">
                <span class="text-sm font-bold text-gray-700"
                    >Collection type</span
                >
                <!-- {{ isShareable }} -->
                <div class="mt-2">
                    <a-radio-group
                        v-model:value="isShareable"
                        name="radioGroup"
                    >
                        <a-radio value="false">
                            <span class="text-sm text-gray-700">Private</span>
                        </a-radio>
                        <a-radio value="true" class="ml-8">
                            <span class="text-sm text-gray-700">Shared</span>
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="px-4 mt-2" v-if="isShareable === 'true'">
                <span class="text-sm font-bold text-gray-700"
                    >Add members and groups</span
                >

                <div class="flex items-center mb-1.5">
                    <!-- <UserList
                        user-list-header-class="min-w-full"
                        :user-list-style="{
                            maxHeight: '250px',
                        }"
                        :minimal="true"
                        :showHeaderButtons="true"
                        class="w-full"
                        v-model:selectedUsers="
                            userData[selectedType].ownerUsers
                        "
                        v-model:selectedUsersData="
                            userDataDetail[selectedType].ownerUsers
                        "
                        v-model:selectedGroups="
                            userData[selectedType].ownerGroups
                        "
                        v-model:selectedGroupsData="
                            userDataDetail[selectedType].ownerGroups
                        "
                    /> -->
                    <a-dropdown :trigger="['click']" placement="bottomLeft">
                        <div
                            class="flex items-center justify-center h-8 mt-2 text-gray-700 border border-r-0 border-gray-300 rounded-lg rounded-r-none cursor-pointer"
                            style="width: 133px !important"
                        >
                            <span class="mr-1.5 pl-1 text-sm">
                                {{
                                    selectedType === 'view'
                                        ? 'Can view'
                                        : 'Can edit'
                                }}
                            </span>
                            <AtlanIcon
                                icon="CaretDown"
                                class="w-4 h-4 text-gray-700"
                            />
                        </div>

                        <template #overlay>
                            <PermissionType
                                :show-remove="false"
                                :handle-change="handleChange"
                                v-model:selectedType="selectedType"
                            />
                        </template>
                    </a-dropdown>
                    <a-dropdown
                        :trigger="['click']"
                        placement="bottomLeft"
                        v-model:visible="userDropdown"
                    >
                        <div
                            class="flex items-center w-full h-8 pl-4 mt-2 text-gray-700 border border-gray-300 rounded-lg rounded-l-none cursor-pointer"
                            @click="showUserDropdown"
                        >
                            <AtlanIcon
                                icon="Search"
                                class="w-4 h-4 text-gray-500"
                            />
                            <span class="px-2 text-gray-500">
                                Search users and groups
                            </span>
                        </div>

                        <template #overlay>
                            <div
                                style="width: 445px"
                                class="px-2 py-2 pt-4 bg-white rounded-lg shadow-lg"
                            >
                                <Owners
                                    :showNone="false"
                                    select-group-key="alias"
                                    select-user-key="username"
                                    v-model:modelValue="userData[selectedType]"
                                    :disabledModalValue="userData[otherType]"
                                />
                            </div>
                        </template>
                    </a-dropdown>
                </div>
                <span class="text-xs text-gray-500"
                    >{{
                        selectedType === 'view'
                            ? 'Can view and run all the queries, but not edit'
                            : 'Can view, run and edit all queries'
                    }}
                </span>

                <div
                    style="max-height: 180px"
                    class="mt-2 overflow-auto"
                    v-if="
                        userData['edit']['ownerUsers'].length ||
                        userData['edit']['ownerGroups'].length ||
                        userData['view']['ownerUsers'].length ||
                        userData['view']['ownerGroups'].length
                    "
                >
                    <UserItem v-model:userData="userData" />
                    <!-- </template>
                    </div> -->
                    <!-- <a-tabs
                        v-model:activeKey="editors"
                        size="small"
                        :class="$style.tabBar"
                    >
                        <a-tab-pane key="editors" tab="Editors">
                            <div
                                class="overflow-auto"
                                style="max-height: 150px"
                            >
                                
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="viewers" tab="Viewers">
                            <div
                                class="overflow-y-auto"
                                style="max-height: 150px"
                            >
                                <template
                                    v-for="item in [
                                        ...userData['view'].ownerUsers,
                                        ...userData['view'].ownerGroups,
                                    ]"
                                >
                                    <UserItem
                                        :user="item"
                                        permission="Viewers"
                                    />
                                </template>
                            </div>
                        </a-tab-pane>
                    </a-tabs> -->
                </div>
            </div>
            <div class="flex items-center w-full px-4 mt-5">
                <div
                    class="flex items-center justify-end flex-1 mb-1 text-gray-700 cursor-pointer"
                >
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-3 border-none hover:text-primary"
                        @click="closeModal"
                    >
                        <span>Cancel</span>
                    </AtlanBtn>

                    <AtlanBtn
                        size="sm"
                        color="primary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-2 border-none"
                        @click="saveOrUpdateCollection"
                    >
                        <div class="flex items-center text-white rounded">
                            <AtlanIcon
                                v-if="isCollectionSaving"
                                icon="CircleLoader"
                                style="margin-right: 4px"
                                class="w-4 h-4 text-white animate-spin"
                            ></AtlanIcon>

                            <span>{{
                                isCreate
                                    ? 'Create'
                                    : isShare
                                    ? 'Invite'
                                    : 'Update'
                            }}</span>
                        </div>
                    </AtlanBtn>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import emojiData from 'emoji-mart-vue-fast/data/apple.json'
    import {
        inject,
        defineComponent,
        Ref,
        ref,
        onMounted,
        nextTick,
        toRefs,
        PropType,
        watch,
        computed,
    } from 'vue'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import AtlanBtn from '~/components/UI/button.vue'
    import UserSelectWidget from '~/components/common/input/owner/index.vue'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { EditorState } from 'prosemirror-state'
    import { message } from 'ant-design-vue'
    import Popover from '~/components/common/facet/properties/popover.vue'
    import UserList from './userList.vue'
    import PermissionType from './permissionType.vue'
    import UserItem from './userItem.vue'
    import Owners from './owner.vue'
    import whoami from '~/composables/user/whoami'

    const emojiIndex = new EmojiIndex(emojiData)

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: {
            AtlanBtn,
            UserSelectWidget,
            Picker,
            AtlanIcon,
            Popover,
            UserList,
            PermissionType,
            UserItem,
            Owners,
        },
        props: {
            showCollectionModal: {
                type: Boolean as PropType<boolean>,
                required: true,
            },
            item: {
                type: Object,
                required: false,
            },
            isCreate: {
                type: Boolean,
                required: true,
            },
            isShare: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['update:showCollectionModal'],
        setup(props, { emit }) {
            let { isCreate, item } = toRefs(props)
            const { username } = whoami()
            // console.log('username: ', username.value)

            const title: Ref<string> = ref(
                isCreate.value ? '' : item?.value?.attributes.name
            )
            const description: Ref<string | undefined> = ref(
                isCreate.value ? '' : item?.value?.attributes.description
            )
            const titleBarRef: Ref<null | HTMLInputElement> = ref(null)
            const refetchQueryCollection = inject(
                'refetchQueryCollection'
            ) as Ref<Function>
            const queryCollectionsLoading = inject(
                'queryCollectionsLoading'
            ) as Ref<Boolean>
            const selectedEmoji = ref(
                isCreate.value ? null : item?.value?.attributes?.icon
            )
            const selectedEmojiType = ref(
                isCreate.value ? null : item?.value?.attributes?.iconType
            )

            const isShared = computed(() => {
                if (isCreate.value) {
                    return 'true'
                } else {
                    let x1 = item?.value?.attributes?.ownerGroups
                        ? item?.value?.attributes?.ownerGroups
                        : []
                    let x2 = item?.value?.attributes?.ownerUsers
                        ? item?.value?.attributes?.ownerUsers
                        : []
                    let x3 = item?.value?.attributes?.viewerUsers
                        ? item?.value?.attributes?.viewerUsers
                        : []
                    let x4 = item?.value?.attributes?.viewerGroups
                        ? item?.value?.attributes?.viewerGroups
                        : []

                    let len = x1.length + x2.length + x3.length + x4.length

                    return len ? 'true' : 'false'
                }
            })

            const isShareable = ref(isShared.value)

            const popOverVisible = ref(false)

            // const editors = ref({
            //     ownerGroups: isCreate.value
            //         ? []
            //         : item?.value?.attributes?.ownerGroups,
            //     ownerUsers: isCreate.value
            //         ? []
            //         : item?.value?.attributes?.ownerUsers,
            // })

            // const viewers = ref({
            //     ownerGroups: isCreate.value
            //         ? []
            //         : item?.value?.attributes?.viewerGroups,
            //     ownerUsers: isCreate.value
            //         ? []
            //         : item?.value?.attributes?.viewerUsers,
            // })

            const userData = ref({
                edit: {
                    ownerGroups: isCreate.value
                        ? []
                        : item?.value?.attributes?.ownerGroups,
                    ownerUsers: isCreate.value
                        ? [username.value]
                        : item?.value?.attributes?.ownerUsers,
                },
                view: {
                    ownerGroups: isCreate.value
                        ? []
                        : item?.value?.attributes?.viewerGroups,
                    ownerUsers: isCreate.value
                        ? []
                        : item?.value?.attributes?.viewerUsers,
                },
            })

            // watch(
            //     userData,
            //     () => {
            //         console.log('userdata: ', userData.value)
            //     },
            //     { immediate: true }
            // )

            // const userDataDetail = ref({
            //     edit: {
            //         ownerGroups: [],
            //         ownerUsers: [],
            //     },
            //     view: {
            //         ownerGroups: [],
            //         ownerUsers: [],
            //     },
            // })

            const closeModal = () => {
                emit('update:showCollectionModal', false)
            }

            const { createCollection, updateCollection } = useQueryCollection()

            const handleEmojiSelect = (emoji) => {
                selectedEmoji.value = emoji.native
                toggleEmojiPicker()
                console.log('emoji data', emoji)
            }

            const toggleEmojiPicker = () => {
                popOverVisible.value = !popOverVisible.value
            }

            onMounted(async () => {
                await nextTick()
                titleBarRef.value?.focus()
            })

            let isCollectionSaving = ref(false)

            const saveOrUpdateCollection = () => {
                if (isCreate.value) {
                    saveNewCollection()
                } else {
                    updateCollectionData()
                }
            }

            const saveNewCollection = () => {
                if (title?.value?.length === 0) {
                    message.error({
                        content: `Please add a collection name`,
                    })
                    return
                }

                let ownersData =
                    isShareable.value === 'true'
                        ? {
                              ownerUsers: userData.value['edit'].ownerUsers,
                              ownerGroups: userData.value['edit'].ownerGroups,
                              viewerUsers: userData.value['view'].ownerUsers,
                              viewerGroups: userData.value['view'].ownerGroups,
                          }
                        : {
                              ownerUsers: [],
                              ownerGroups: [],
                              viewerUsers: [],
                              viewerGroups: [],
                          }

                const { data, error, isLoading, isReady, mutate } =
                    createCollection({
                        name: title.value,
                        description: description.value,
                        ...ownersData,
                        icon: selectedEmoji.value,
                        iconType: selectedEmojiType.value,
                    })

                watch(
                    [isLoading, error, data, isReady],
                    async () => {
                        console.log('collection error: ', error.value)
                        isCollectionSaving.value = isLoading?.value
                        if (
                            isLoading?.value === false &&
                            error.value === undefined &&
                            data.value !== undefined
                        ) {
                            closeModal()
                            if (isReady && !error.value && !isLoading.value) {
                                /* IMP: Don't remove it, otherwise update collections will appear buggy */
                                setTimeout(() => {
                                    refetchQueryCollection.value()
                                }, 750)
                            }
                        }
                    },
                    {
                        immediate: true,
                    }
                )
            }

            const updateCollectionData = () => {
                console.log('item: ', item.value)

                let ownersData =
                    isShareable.value === 'true'
                        ? {
                              ownerUsers: userData.value['edit'].ownerUsers,
                              ownerGroups: userData.value['edit'].ownerGroups,
                              viewerUsers: userData.value['view'].ownerUsers,
                              viewerGroups: userData.value['view'].ownerGroups,
                          }
                        : {
                              ownerUsers: [],
                              ownerGroups: [],
                              viewerUsers: [],
                              viewerGroups: [],
                          }

                const entity = {
                    typeName: 'QueryCollection',
                    attributes: {
                        ...item?.value?.attributes,
                        ...ownersData,
                        name: title.value,
                        description: description.value,
                        icon: selectedEmoji.value,
                        iconType: selectedEmojiType.value,
                    },
                }
                const { data, error, isLoading, isReady } =
                    updateCollection(entity)
                watch(
                    [isLoading, error, data, isReady],
                    () => {
                        console.log('collection error: ', error.value)
                        isCollectionSaving.value = isLoading?.value
                        if (
                            isLoading?.value === false &&
                            error.value === undefined &&
                            data.value !== undefined
                        ) {
                            closeModal()
                            if (isReady && !error.value && !isLoading.value) {
                                refetchQueryCollection.value()
                            }
                        }
                    },
                    {
                        immediate: true,
                    }
                )
            }

            let users = ref()
            const updateUserList = (list) => {
                users.value = list
                console.log('users: ', list)
            }

            const selectedType = ref('view')
            const otherType = ref('edit')

            const handleChange = (item) => {
                if (item !== 'remove') {
                    selectedType.value = item

                    if (item === 'view') {
                        otherType.value = 'edit'
                    } else if (item === 'edit') {
                        otherType.value = 'view'
                    }
                    // console.log('users: ', {
                    //     userData: userData.value,
                    // })
                } else {
                }
            }

            const permissionOptions = ref([
                {
                    title: 'Can view',
                    type: 'view',
                    description:
                        'Can view and run all <br />the queries, but not edit',
                },
                {
                    title: 'Can edit',
                    type: 'edit',
                    description: 'Can view, run and edit all <br />queries',
                },
            ])

            const userDropdown = ref(false)
            const showUserDropdown = () => {
                userDropdown.value = true
            }
            const hideUserDropdown = () => {
                userDropdown.value = false
            }

            const handleOwnerChange = () => {
                // if (userData?.value?.edit?.ownerUsers) {
                //     if (userData?.value?.edit?.ownerUsers?.length) {
                //     } else {
                //         userData.value.edit.ownerUsers = []
                //     }
                // } else {
                //     userData.value.edit = {
                //         ...userData.value.edit,
                //         ownerUsers: [],
                //     }
                // }
                // if (userData?.value?.edit?.ownerGroups) {
                //     if (userData?.value?.edit?.ownerGroups?.length) {
                //     } else {
                //         userData.value.edit.ownerGroups = []
                //     }
                // } else {
                //     userData.value.edit = {
                //         ...userData.value.edit,
                //         ownerGroups: [],
                //     }
                // }
                // if (userData?.value?.view?.ownerUsers) {
                //     if (userData?.value?.view?.ownerUsers?.length) {
                //     } else {
                //         userData.value.view.ownerUsers = []
                //     }
                // } else {
                //     userData.value.view = {
                //         ...userData.value.view,
                //         ownerUsers: [],
                //     }
                // }
                // if (userData?.value?.view?.ownerGroups) {
                //     if (userData?.value?.view?.ownerGroups?.length) {
                //     } else {
                //         userData.value.view.ownerGroups = []
                //     }
                // } else {
                //     userData.value.view = {
                //         ...userData.value.view,
                //         ownerGroups: [],
                //     }
                // }
                // console.log('model value: ', userData.value)
            }

            return {
                closeModal,
                titleBarRef,
                title,
                description,
                isShareable,
                // editors,
                // viewers,
                emojiIndex,
                handleEmojiSelect,
                popOverVisible,
                toggleEmojiPicker,
                selectedEmoji,
                isCollectionSaving,
                saveOrUpdateCollection,
                isCreate,
                item,
                updateUserList,
                handleChange,
                selectedType,
                userData,
                // userDataDetail,
                permissionOptions,
                showUserDropdown,
                userDropdown,
                hideUserDropdown,
                otherType,
                handleOwnerChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }

    .placeholder-color::placeholder {
        color: #6f7590 !important;
    }
    .text-area-padding {
        padding: 0px !important;
        padding: 12px !important;
    }
    .absolute-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .button {
        --tw-bg-opacity: 1;
        background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
        border-width: 1 px;
        --tw-border-opacity: 1;
        border-color: rgba(230, 230, 235, var(--tw-border-opacity));
        padding: 4 px 8 px !important;
        min-width: 71 px !important;
        height: 22 px !important;
        box-sizing: border-box !important;
        border-radius: 4 px !important;
    }

    .input {
    }
</style>

<style lang="less">
    .emoji-mart {
        border: unset;

        .emoji-mart-anchor-selected {
            color: rgb(82, 119, 215) !important;
        }
        .emoji-mart-anchor:hover {
            color: rgb(51, 81, 155) !important;
        }
        .emoji-mart-anchor-bar {
            background-color: rgb(82, 119, 215) !important;
        }
    }
    .emoji-mart-category .emoji-mart-emoji span {
        cursor: pointer;
    }
    .emoji-wrapper {
        bottom: -331%;
    }
</style>

<style lang="less" module>
    // .input {
    //     :global(.ant-input:focus
    //             .ant-input:hover
    //             .ant-input::selection
    //             .focus-visible) {
    //         @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
    //     }
    //     :global(.ant-input) {
    //         @apply shadow-none outline-none border-0 px-0 !important;
    //     }
    // }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
