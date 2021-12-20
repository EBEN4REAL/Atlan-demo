<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        :closable="false"
        :visible="visible"
        :class="$style.input"
        :destroy-on-close="true"
    >
        <template #title>
            <div class="flex items-center text-gray-500 flex-nowrap">
                <span class="overflow-hidden text-sm overflow-ellipsis">{{
                    title(asset)
                }}</span>
                <AtlanIcon icon="ChevronRight" class="flex-none" />
                <span class="flex-none text-sm font-bold text-gray"
                    >{{ updating ? 'Edit' : 'New' }} Resource</span
                >
            </div></template
        >
        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <AtlanButton
                    color="minimal"
                    :size="'sm'"
                    class="px-1"
                    @click="handleCancel"
                    >Cancel</AtlanButton
                >
                <AtlanButton
                    color="primary"
                    :size="'sm'"
                    :disabled="buttonDisabled"
                    @click="handleAdd"
                    >{{ updating ? 'Update' : 'Add' }}</AtlanButton
                >
            </div>
        </template>
        <div class="px-4 pt-0 pb-4">
            <span class="font-bold">Link</span>
            <a-input
                id="linkURL"
                ref="titleBar"
                v-model:value="linkURL"
                type="url"
                placeholder="Paste resource link"
                class="text-lg font-bold text-gray-700"
                allow-clear
                @change="handleUrlChange"
            />
            <div v-if="linkURL" class="mt-3">
                <span class="font-bold">Title</span>
                <div class="flex items-center gap-x-2">
                    <a-input
                        v-model:value="linkTitle"
                        placeholder="Resource title"
                        class="text-lg font-bold text-gray-700"
                        allow-clear
                    >
                        <template #prefix>
                            <!-- <span v-show="imageNotFound" class="mr-2">
                                🔗
                            </span> -->
                            <!-- v-show="!imageNotFound" -->
                            <div class="relative flex w-5 h-5 mr-2">
                                <img
                                    :src="faviconLink"
                                    alt=""
                                    @error="onImageError"
                                    @load="onImageLoad"
                                />
                                <!-- <div class="absolute left-0 z-10 emoji-wrapper">
                                    <Picker
                                        :data="emojiIndex"
                                        set="apple"
                                        auto-focus
                                        :show-preview="false"
                                        :emoji-tooltip="false"
                                        :infinite-scroll="true"
                                        @select="handleEmojiSelect"
                                    />
                                </div> -->
                            </div>
                        </template>
                    </a-input>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import data from 'emoji-mart-vue-fast/data/apple.json'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'

    // Vue
    import {
        defineComponent,
        PropType,
        ref,
        toRefs,
        nextTick,
        watch,
        Ref,
        computed,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import AtlanButton from '@/UI/button.vue'

    const emojiIndex = new EmojiIndex(data)

    export default defineComponent({
        components: { AtlanButton, Picker },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            item: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            updating: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const visible = ref<boolean>(false)
            const imageNotFound = ref(false)
            const isValidUrl = ref(false)
            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { asset, editPermission, updating, item } = toRefs(props)

            const { title, link } = useAssetInfo()

            const { handleAddResource, localResource, handleUpdateResource } =
                updateAssetAttributes(asset)

            const linkURL = ref(updating.value ? link(item.value) : 'https://')
            const faviconLink = ref(
                updating.value
                    ? `https://www.google.com/s2/favicons?domain=${linkURL.value}&sz=64`
                    : ''
            )

            // FIXME: Add a link meta parser for title
            const linkTitle = ref(updating.value ? title(item.value) : '')

            const showModal = async () => {
                if (editPermission.value) {
                    visible.value = true
                    await nextTick()
                    titleBar.value?.focus()
                }
            }

            function handleCancel() {
                visible.value = false
                linkURL.value = updating.value ? link(item.value) : 'https://'
                linkTitle.value = updating.value ? title(item.value) : ''
            }

            const buttonDisabled = computed(
                () => !linkURL.value || !isValidUrl.value
            )

            function onImageError() {
                imageNotFound.value = true
            }

            function onImageLoad() {
                // imageNotFound.value = false
            }

            function handleAdd() {
                localResource.value.link = linkURL.value
                localResource.value.title = linkTitle.value
                if (updating.value) {
                    handleUpdateResource(item)
                } else {
                    handleAddResource()
                }
                visible.value = false
                linkURL.value = 'https://'
                linkTitle.value = ''
            }

            const handleEmojiSelect = (emoji) => {
                console.log('emoji data', emoji)
                // form.value.logoType = 'emoji'
                // form.value.emoji = native
                // form.value.imageId = null
                // popOverVisible.value = false
            }

            const handleUrlChange = (e) => {
                if (e.target.checkValidity()) {
                    isValidUrl.value = true
                } else {
                    isValidUrl.value = false
                }
            }

            watch(linkURL, () => {
                if (isValidUrl.value) {
                    imageNotFound.value = false
                    faviconLink.value = `https://www.google.com/s2/favicons?domain=${linkURL.value}&sz=64`
                }
            })

            watch(item, () => {
                linkURL.value = updating.value ? link(item.value) : 'https://'
                linkTitle.value = updating.value ? title(item.value) : ''
            })

            return {
                linkTitle,
                linkURL,
                faviconLink,
                title,
                visible,
                handleCancel,
                handleAdd,
                showModal,
                buttonDisabled,
                onImageError,
                imageNotFound,
                onImageLoad,
                emojiIndex,
                handleEmojiSelect,
                handleUrlChange,
            }
        },
    })
</script>

<style lang="less" scoped>
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
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }
</style>
