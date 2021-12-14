<template>
    <a-modal
        :visible="showCollectionModal"
        :closable="false"
        :footer="null"
        width="584px"
        bodyStyle="{
            height: 450px 
        }"
        :destroyOnClose="true"
    >
        <template #title>
            <div
                class="flex items-center justify-between text-gray-500 flex-nowrap"
            >
                <span v-if="isCreate" class="flex-none font-bold text text-gray"
                    >Create Collection</span
                >
                <span
                    v-if="!isCreate"
                    class="flex-none font-bold text text-gray"
                    >Edit
                    <span
                        class="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg"
                        >{{ item?.attributes?.name }}</span
                    ></span
                >
                <div class="flex items-center text-gray-700">
                    <span class="mr-2 text-sm">Share with others</span>
                    <a-switch v-model:checked="isShareable" size="small" />
                </div>
            </div>
        </template>
        <div class="w-full px-4 pb-5 text-gray-500 bg-white rounded">
            <div class="">
                <div>
                    <a-input
                        :ref="titleBarRef"
                        v-model:value="title"
                        class="w-full border-gray-300 rounded-lg focus:border-primary-focus focus:border-2 focus:outline-none"
                        placeholder="Collection name"
                    >
                        <template #prefix>
                            <!-- <span v-show="imageNotFound" class="mr-2">
                                🔗
                            </span> -->
                            <!-- v-show="!imageNotFound" -->
                            <div class="relative flex w-5 h-5 pr-4">
                                <div
                                    @click="toggleEmojiPicker"
                                    class="flex items-center"
                                >
                                    <span v-if="selectedEmoji" class="mt-1">
                                        {{ selectedEmoji }}
                                    </span>
                                    <AtlanIcon
                                        v-else
                                        :icon="'NoAvatar'"
                                    ></AtlanIcon>
                                </div>
                                <!-- <div class="absolute left-0 z-10 emoji-wrapper"> -->
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
                                <!-- </div> -->
                            </div>
                        </template>
                    </a-input>
                </div>
                <div class="mt-4">
                    <a-textarea
                        v-model:value="description"
                        placeholder="Describe your collection"
                        class="w-full h-20 text-sm border-gray-300 rounded-lg focus:border-primary-focus focus:border-2 focus:outline-none"
                    />
                </div>
            </div>
            <div
                class="px-4 py-2 mt-4 bg-gray-100 rounded-lg"
                v-if="isShareable"
            >
                <div class="flex flex-col">
                    <div>
                        <span class="font-bold">Viewers</span>
                        <UserSelectWidget
                            :read-only="false"
                            :model-value="viewers"
                            placementPos="bottomLeft"
                        />
                    </div>
                    <div class="mt-3">
                        <span class="font-bold">Editors</span>
                        <UserSelectWidget
                            class="mt-1"
                            :read-only="false"
                            :model-value="editors"
                            placementPos="bottomLeft"
                        />
                    </div>
                </div>
            </div>
            <div class="flex items-center w-full mt-5">
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

                            <span>{{ isCreate ? 'Create' : 'Update' }}</span>
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
    } from 'vue'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import AtlanBtn from '~/components/UI/button.vue'
    import UserSelectWidget from '~/components/common/input/owner/index.vue'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { EditorState } from 'prosemirror-state'
    import { message } from 'ant-design-vue'

    const emojiIndex = new EmojiIndex(emojiData)

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: { AtlanBtn, UserSelectWidget, Picker, AtlanIcon },
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
        },
        emits: ['update:showCollectionModal'],
        setup(props, { emit }) {
            let { isCreate, item } = toRefs(props)

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
            const selectedEmoji = ref(
                isCreate.value ? null : item?.value?.attributes?.icon
            )
            const selectedEmojiType = ref(
                isCreate.value ? null : item?.value?.attributes?.iconType
            )

            const isShareable = ref(true)
            const popOverVisible = ref(false)
            const editors = ref({
                ownerGroups: isCreate.value
                    ? []
                    : item?.value?.attributes?.ownerGroups,
                ownerUsers: isCreate.value
                    ? []
                    : item?.value?.attributes?.ownerUsers,
            })
            const viewers = ref({
                ownerGroups: isCreate.value
                    ? []
                    : item?.value?.attributes?.viewerGroups,
                ownerUsers: isCreate.value
                    ? []
                    : item?.value?.attributes?.viewerUsers,
            })

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
                // console.log('isCreate:', typeof isCreate.value)
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

                const { data, error, isLoading } = createCollection({
                    name: title.value,
                    description: description.value,
                    ownerUsers: editors.value.ownerUsers
                        ? editors.value.ownerUsers
                        : [],
                    ownerGroups: editors.value.ownerGroups
                        ? editors.value.ownerGroups
                        : [],
                    viewerUsers: viewers.value.ownerUsers
                        ? viewers.value.ownerUsers
                        : [],
                    viewerGroups: viewers.value.ownerGroups
                        ? viewers.value.ownerGroups
                        : [],
                    icon: selectedEmoji.value,
                    iconType: selectedEmojiType.value,
                })

                watch(
                    [isLoading, error],
                    () => {
                        console.log('collection error: ', error.value)
                        isCollectionSaving.value = isLoading?.value
                        if (
                            isLoading?.value === false &&
                            error.value === undefined
                        ) {
                            closeModal()
                            /* Fetch fresh collections */
                            refetchQueryCollection.value()
                        }
                    },
                    {
                        immediate: true,
                    }
                )
            }

            const updateCollectionData = () => {
                console.log('item: ', item.value)

                let ownersData = isShareable.value
                    ? {
                          ownerUsers: editors.value.ownerUsers,
                          ownerGroups: editors.value.ownerGroups,
                          viewerUsers: viewers.value.ownerUsers,
                          viewerGroups: viewers.value.ownerGroups,
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
                const { data, error, isLoading } = updateCollection(entity)
                watch(
                    [isLoading, error],
                    () => {
                        console.log('collection error: ', error.value)
                        isCollectionSaving.value = isLoading?.value
                        if (
                            isLoading?.value === false &&
                            error.value === undefined
                        ) {
                            closeModal()
                            refetchQueryCollection.value()
                        }
                    },
                    {
                        immediate: true,
                    }
                )
            }

            return {
                closeModal,
                titleBarRef,
                title,
                description,
                isShareable,
                editors,
                viewers,
                emojiIndex,
                handleEmojiSelect,
                popOverVisible,
                toggleEmojiPicker,
                selectedEmoji,
                isCollectionSaving,
                saveOrUpdateCollection,
                isCreate,
                item,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
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
