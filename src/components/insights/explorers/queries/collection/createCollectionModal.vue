<template>
    <a-modal
        :visible="showCollectionModal"
        :closable="false"
        :class="$style.input"
        :footer="null"
        :destroyOnClose="true"
    >
        <template #title>
            <div class="flex items-center text-gray-500 flex-nowrap">
                <span class="flex-none font-bold text text-gray"
                    >New Collection</span
                >
            </div></template
        >
        <div class="w-full px-4 pb-5 text-gray-500 bg-white rounded">
            <div class="">
                <div>
                    <span class="font-bold">Name</span>
                    <a-input
                        :ref="titleBarRef"
                        v-model:value="title"
                        class="border"
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
                                    class="mt-3 -ml-6"
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
                    <span class="font-bold">Description</span>
                    <a-textarea
                        v-model:value="description"
                        placeholder="What is this collection for?"
                        class="text-sm"
                        :rows="2"
                        :show-count="false"
                        :maxlength="140"
                    />
                </div>
            </div>
            <div class="p-3 mt-4 mb-5 bg-gray-100 rounded">
                <!-- Shared/Private selector -->
                <div class="flex flex-col">
                    <span class="font-bold">Visbility</span>
                    <a-radio-group
                        v-model:value="isPrivate"
                        @change="onChangePrivate"
                        class="mt-0"
                    >
                        <a-radio :value="false"> Team </a-radio>
                        <a-radio :value="true"> Private </a-radio>
                    </a-radio-group>
                </div>
                <!-- Shared access control -->
                <div class="flex flex-col mt-3" v-if="!isPrivate">
                    <div>
                        <span class="font-bold">Viewers</span>
                        <UserSelectWidget
                            class="mt-1"
                            :read-only="false"
                            :model-value="editors"
                            placementPos="bottomLeft"
                        />
                    </div>
                    <div class="mt-2">
                        <span class="font-bold">Editors</span>
                        <UserSelectWidget
                            class="mt-1"
                            :read-only="false"
                            :model-value="viewers"
                            placementPos="bottomLeft"
                        />
                    </div>
                </div>
            </div>
            <div class="flex items-center w-full">
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
                        @click="createSaveQuery"
                    >
                        <div class="flex items-center text-white rounded">
                            <AtlanIcon
                                v-if="saveQueryLoading"
                                icon="CircleLoader"
                                style="margin-right: 4px"
                                class="w-4 h-4 text-white animate-spin"
                            ></AtlanIcon>

                            <span>Create</span>
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
        defineComponent,
        Ref,
        ref,
        onMounted,
        nextTick,
        PropType,
    } from 'vue'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import AtlanBtn from '~/components/UI/button.vue'
    import UserSelectWidget from '~/components/common/input/owner/index.vue'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    const emojiIndex = new EmojiIndex(emojiData)

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: { AtlanBtn, UserSelectWidget, Picker, AtlanIcon },
        props: {
            showCollectionModal: {
                type: Boolean as PropType<boolean>,
                required: true,
            },
        },
        emits: ['update:showCollectionModal', 'onSaveQuery'],
        setup(props, { emit }) {
            const title: Ref<string> = ref('')
            const description: Ref<string | undefined> = ref('')
            const titleBarRef: Ref<null | HTMLInputElement> = ref(null)
            const saveQueryLoading = ref(false)
            const selectedEmoji = ref()
            const isPrivate = ref(false)
            const popOverVisible = ref(false)
            const editors = ref({
                ownerGroups: [],
                ownerUsers: [],
            })
            const viewers = ref({
                ownerGroups: [],
                ownerUsers: [],
            })
            const closeModal = () => {
                emit('update:showCollectionModal', false)
            }

            const createSaveQuery = () => {}

            const onChangePrivate = () => {}

            const handleEmojiSelect = (emoji) => {
                selectedEmoji.value = emoji.native
                toggleEmojiPicker()
                console.log('emoji data', emoji)
                // form.value.logoType = 'emoji'
                // form.value.emoji = native
                // form.value.imageId = null
                // popOverVisible.value = false
            }

            const toggleEmojiPicker = () => {
                popOverVisible.value = !popOverVisible.value
            }

            onMounted(async () => {
                await nextTick()
                titleBarRef.value?.focus()
            })

            return {
                closeModal,
                createSaveQuery,
                saveQueryLoading,
                titleBarRef,
                title,
                description,
                isPrivate,
                onChangePrivate,
                editors,
                viewers,
                emojiIndex,
                handleEmojiSelect,
                popOverVisible,
                toggleEmojiPicker,
                selectedEmoji,
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
