<template>
    <a-modal
        :visible="showCollectionModal"
        :closable="false"
        :footer="null"
        width="489px"
        :destroyOnClose="true"
    >
        <div class="w-full py-4 bg-white rounded">
            <div
                class="flex items-center justify-between px-4 mb-4 flex-nowrap"
            >
                <span
                    v-if="isCreate"
                    class="flex-none text-base font-bold text-gray-700"
                    >Create Collection</span
                >
                <span
                    v-if="!isCreate"
                    class="flex-none w-full overflow-hidden text-base font-bold text-gray-700"
                    >{{ isShare ? 'Invite' : 'Edit collection' }}
                    <!-- <span
                        class="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg"
                        >{{ item?.attributes?.name }}</span
                    > -->
                    <Tooltip
                        :tooltip-text="item?.attributes?.name"
                        placement="rightTop"
                        clamp-percentage="99%"
                        classes="block text-sm font-normal
                    text-gray-500 truncate"
                    />
                    <!-- <span
                        class="block text-sm font-normal text-gray-500 truncate"
                        >{{ item?.attributes?.name }}</span
                    > -->
                </span>
            </div>
            <div class="px-4 mb-4" v-if="!isShare">
                <span class="text-sm font-normal text-gray-700">Name</span>
                <a-input
                    ref="titleBarRef"
                    v-model:value="title"
                    class="w-full mt-1 text-red-200 border-gray-300 rounded-lg focus:border-primary-focus focus:border-2 focus:outline-none"
                    :class="$style.inputBox"
                    placeholder="Name"
                >
                    <template #prefix>
                        <div
                            class="relative flex w-6 h-6 mr-1 -ml-2 duration-200 ease-in-out rounded-sm cursor-pointer hover:bg-gray-light"
                        >
                            <div
                                class="flex items-center ml-0.5"
                                @click="toggleEmojiPicker"
                            >
                                <span
                                    v-if="selectedEmoji"
                                    class="w-4 h-4 -mt-2"
                                    style="font-size: 18px; margin-left: 0.5px"
                                >
                                    {{ selectedEmoji }}
                                </span>
                                <AtlanIcon
                                    v-else
                                    class="w-4 h-4 ml-0.5"
                                    icon="NoAvatar"
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
                                    <IconPicker
                                        :emoji="selectedEmoji"
                                        picker-element-id="create-collection-emoji-picker"
                                        @select="handleEmojiSelect"
                                        @remove="handleEmojiRemove"
                                    />
                                </template>
                            </a-popover>
                        </div>
                    </template>
                </a-input>
                <div class="mt-4">
                    <span class="text-sm font-normal text-gray-700"
                        >Description</span
                    >
                    <a-textarea
                        v-model:value="description"
                        placeholder="Describe your collection"
                        style="min-height: 82px !important"
                        class="w-full mt-1 text-sm border-gray-300 rounded-lg text-area-padding placeholder-color focus:border-primary-focus focus:border-2 focus:outline-none"
                    />
                </div>
            </div>
            <div class="mx-4 mt-3 font-normal">
                <span class="text-sm text-gray-700" v-if="!isShare">Share</span>
                <div class="flex items-center mb-1.5">
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

                    <div
                        class="flex items-center justify-center w-full h-8 pl-2 pr-2 mt-2 text-gray-700 border border-gray-300 rounded-lg rounded-l-none cursor-pointer"
                        @click="showUserDropdown"
                    >
                        <Owners
                            :showNone="false"
                            select-group-key="name"
                            select-user-key="username"
                            v-model:modelValue="userData[selectedType]"
                            :disabledModalValue="userData[otherType]"
                        />
                    </div>
                </div>
                <!-- <span class="text-xs text-gray-500"
                    >{{
                        selectedType === 'view'
                            ? 'Can view and run all the queries, but not edit'
                            : 'Can view, run and edit all queries'
                    }}
                </span> -->

                <div
                    style="max-height: 172px"
                    class="px-2 mt-2 overflow-auto bg-gray-100 rounded"
                >
                    <div
                        class="flex items-center justify-between h-7"
                        style="margin-top: 3px; margin-bottom: 3px"
                    >
                        <div class="flex items-center">
                            <Avatar
                                avatar-shape="circle"
                                :image-url="imageUrl(username)"
                                :allow-upload="false"
                                :avatar-name="username"
                                :avatar-size="20"
                            />
                            <div class="ml-2">
                                <div class="text-gray-700">
                                    <div class="mr-2 text-sm text-gray-700">
                                        {{ username }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex items-center justify-end text-gray-700 cursor-pointer"
                            style="width: 104px"
                        >
                            <span class="pl-1 text-sm text-gray-500">
                                Owner
                            </span>
                        </div>
                    </div>
                    <UserItem v-model:userData="userData" />
                </div>
            </div>
            <!-- <div
                class="px-3 py-1 mx-4 mt-3 font-normal border border-gray-300 rounded-lg"
                v-else
            >
                <div
                    class="flex items-center justify-between h-7"
                    style="margin-top: 3px; margin-bottom: 3px"
                >
                    <div class="flex items-center">
                        <Avatar
                            avatar-shape="circle"
                            :image-url="imageUrl(username)"
                            :allow-upload="false"
                            :avatar-name="username"
                            :avatar-size="20"
                        />
                        <div class="ml-2">
                            <div class="text-gray-700">
                                <div class="mr-2 text-sm text-gray-700">
                                    {{ username }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-end text-gray-700 cursor-pointer"
                        style="width: 104px"
                    >
                        <span class="mr-1.5 pl-1 text-sm text-gray-500">
                            Owner
                        </span>
                    </div>
                </div>
            </div> -->
            <div
                class="flex items-center justify-end flex-1 w-full px-4 mt-4 text-gray-700"
            >
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="flex items-center justify-between h-6 px-6 py-1 ml-3 border-none cursor-pointer hover:text-primary"
                    @click="closeModal"
                >
                    <span>Cancel</span>
                </AtlanBtn>

                <AtlanBtn
                    size="sm"
                    color="primary"
                    padding="compact"
                    class="flex items-center justify-between h-6 px-6 py-1 ml-4 border-none cursor-pointer"
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
                            isCreate ? 'Create' : isShare ? 'Invite' : 'Update'
                        }}</span>
                    </div>
                </AtlanBtn>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
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
        toRaw,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import UserSelectWidget from '~/components/common/input/owner/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { EditorState } from 'prosemirror-state'
    import { message } from 'ant-design-vue'
    import Popover from '~/components/common/facet/properties/popover.vue'
    import UserList from './userList.vue'
    import PermissionType from './permissionType.vue'
    import UserItem from './userItem.vue'
    import Owners from '~/components/common/collection/owner.vue'
    import whoami from '~/composables/user/whoami'
    import Avatar from '~/components/common/avatar/index.vue'
    import IconPicker from '~/components/common/IconPicker/IconPicker.vue'

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: {
            AtlanBtn,
            UserSelectWidget,
            AtlanIcon,
            Popover,
            UserList,
            PermissionType,
            UserItem,
            Owners,
            Avatar,
            Tooltip,
            IconPicker,
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
            const titleBarRef: Ref<null | HTMLInputElement> = ref()
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

            const isCollectionCreated = inject(
                'isCollectionCreated'
            ) as Ref<Boolean>

            const isShared = computed(() => {
                if (isCreate.value) {
                    return 'true'
                } else {
                    let x1 = item?.value?.attributes?.adminGroups
                        ? item?.value?.attributes?.adminGroups
                        : []
                    let x2 = item?.value?.attributes?.adminUsers
                        ? item?.value?.attributes?.adminUsers
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

            const getUserData = () => {
                return {
                    edit: {
                        ownerGroups: isCreate.value
                            ? []
                            : JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.adminGroups
                            ? JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.adminGroups
                            : [],
                        ownerUsers: isCreate.value
                            ? []
                            : JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.adminUsers
                            ? JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.adminUsers
                            : [],
                    },
                    view: {
                        ownerGroups: isCreate.value
                            ? []
                            : JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.viewerGroups
                            ? JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.viewerGroups
                            : [],
                        ownerUsers: isCreate.value
                            ? []
                            : JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.viewerUsers
                            ? JSON.parse(JSON.stringify(toRaw(item?.value)))
                                  ?.attributes?.viewerUsers
                            : [],
                    },
                }
            }

            const userData = ref(getUserData())

            const closeModal = () => {
                emit('update:showCollectionModal', false)
                userData.value = getUserData()
            }

            const { createCollection, updateCollection } = useQueryCollection()

            const toggleEmojiPicker = () => {
                popOverVisible.value = !popOverVisible.value
            }

            const handleEmojiSelect = ({ native }) => {
                selectedEmoji.value = native
                toggleEmojiPicker()
            }

            const handleEmojiRemove = () => {
                selectedEmoji.value = null
                toggleEmojiPicker()
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

                let ownersData = {
                    adminUsers: userData.value['edit'].ownerUsers,
                    adminGroups: userData.value['edit'].ownerGroups,
                    viewerUsers: userData.value['view'].ownerUsers,
                    viewerGroups: userData.value['view'].ownerGroups,
                }

                const { data, error, isLoading, isReady, mutate } =
                    createCollection({
                        name: title.value,
                        description: description.value,
                        ...ownersData,
                        icon: selectedEmoji.value,
                        iconType: selectedEmojiType.value,
                        createdBy: username.value,
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
                                    isCollectionCreated.value = true
                                    refetchQueryCollection.value()
                                }, 1000)
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

                let ownersData = {
                    adminUsers: userData.value['edit'].ownerUsers,
                    adminGroups: userData.value['edit'].ownerGroups,
                    viewerUsers: userData.value['view'].ownerUsers,
                    viewerGroups: userData.value['view'].ownerGroups,
                }

                const entity = {
                    typeName: 'Collection',
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
                                isCollectionCreated.value = true
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

            const selectedType = ref('edit')
            const otherType = ref('view')

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

            const imageUrl = (user: any) =>
                `${window.location.origin}/api/service/avatars/${user}`

            return {
                imageUrl,
                closeModal,
                titleBarRef,
                title,
                description,
                isShareable,
                // editors,
                // viewers,
                handleEmojiSelect,
                handleEmojiRemove,
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
                username,
            }
        },
    })
</script>
<style lang="less" scoped>
    // .placeholder {
    //     background-color: #f4f4f4;
    // }

    .placeholder-color {
        @apply text-gray-700 !important;
    }
    .placeholder-color::placeholder {
        @apply text-gray-500 !important;
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
    .inputBox {
        :global(.ant-input) {
            @apply text-gray-700 !important;
            &::placeholder {
                @apply text-gray-500 !important;
            }
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
