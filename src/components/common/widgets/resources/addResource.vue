<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        :closable="false"
        :visible="visible"
        :class="$style.input"
        centered
    >
        <template #title>
            <div class="flex items-center text-gray-500 flex-nowrap">
                <!--  <span class="flex-none text-lg text-gray"
                    >Add New Resource</span
                > -->
                <span class="overflow-hidden text-sm overflow-ellipsis">{{
                    title(asset)
                }}</span>
                <AtlanIcon icon="ChevronRight" class="flex-none" />
                <span class="flex-none text-sm font-bold text-gray"
                    >New Resource</span
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
                    @click="handleAdd"
                    :disabled="buttonDisabled"
                    >Add</AtlanButton
                >
            </div>
        </template>
        <div class="px-4 pt-0 pb-4">
            <span class="font-bold">Link</span>
            <a-input
                ref="titleBar"
                v-model:value="link"
                placeholder="Paste resource link"
                class="text-lg font-bold text-gray-700"
                allow-clear
            />
            <div v-if="link" class="mt-3">
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
    import { useDebounceFn } from '@vueuse/core'
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
        },
        setup(props) {
            const visible = ref<boolean>(false)
            const imageNotFound = ref(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { asset } = toRefs(props)

            const { title } = useAssetInfo()

            const { handleAddResource, localResource } =
                updateAssetAttributes(asset)

            const link = ref('')
            const faviconLink = ref('')

            // FIXME: Add a link meta parser for title
            const linkTitle = ref('')

            const showModal = async () => {
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }

            function handleCancel() {
                visible.value = false
                link.value = ''
                linkTitle.value = ''
            }

            const buttonDisabled = computed(
                () => !link.value || !isValidHttpUrl(link.value)
            )

            function onImageError() {
                console.log('image not found')
                imageNotFound.value = true
            }

            function onImageLoad() {
                // imageNotFound.value = false
            }

            function handleAdd() {
                localResource.value.link = link.value
                localResource.value.title = linkTitle.value
                handleAddResource()
                visible.value = false
                link.value = ''
                linkTitle.value = ''
            }

            const handleEmojiSelect = (emoji) => {
                console.log('emoji data', emoji)
                // form.value.logoType = 'emoji'
                // form.value.emoji = native
                // form.value.imageId = null
                // popOverVisible.value = false
            }

            function isValidHttpUrl(string) {
                let url

                try {
                    url = new URL(string)
                } catch (_) {
                    return false
                }

                return url.protocol === 'http:' || url.protocol === 'https:'
            }

            watch(link, () => {
                if (isValidHttpUrl(link.value)) {
                    console.log('fetching icon')
                    imageNotFound.value = false
                    faviconLink.value = `https://www.google.com/s2/favicons?domain=${link.value}&sz=64`
                }
            })

            return {
                linkTitle,
                link,
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
            }
        },
    })
</script>

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
