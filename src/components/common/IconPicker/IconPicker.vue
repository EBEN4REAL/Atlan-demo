<template>
    <div>
        <a-tabs
            :class="[
                $style.emojiPicker,
                allowImageUpload ? '' : $style['hide-nav-tabs-emoji-picker'],
            ]"
            default-active-key="1"
            size="small"
        >
            <template v-if="emoji || image" #rightExtra>
                <a-button class="border-0" @click="emit('remove')">
                    <AtlanIcon
                        icon="Delete"
                        class="inline mr-1 text-gray-500"
                    />
                    <span class="text-gray-500 align-middle"> Remove </span>
                </a-button>
            </template>
            <a-tab-pane key="1" tab="Emoji">
                <EmojiPicker
                    :picker-element-id="pickerElementId"
                    @select="emitSelectedEmoji"
                />
            </a-tab-pane>
            <a-tab-pane
                v-if="allowImageUpload"
                key="2"
                tab="Upload Image"
                force-render
            >
                <div class="p-3" style="width: 375px">
                    <div class="p-3 text-center border border-dashed rounded">
                        <a-upload
                            class="relative block w-full mb-3 metadata-avatar-uploader"
                            name="file"
                            accept=".png, .jpg, .jpeg"
                            :multiple="false"
                            :file-list="fileList"
                            :show-upload-list="false"
                            :custom-request="(p) => emit('upload', p)"
                        >
                            <a-button
                                :loading="loading"
                                type="primary"
                                class="w-full"
                            >
                                {{
                                    loading ? 'Uploading...' : 'Upload an image'
                                }}
                            </a-button>
                        </a-upload>
                        <p class="text-sm text-gray-500">
                            Recommended size is 24 by 24 pixels
                        </p>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { FileItem } from '~/types/typedefs/customMetadata.interface'
    import EmojiPicker from '~/components/common/IconPicker/EmojiPickerWrapper.vue'

    const emit = defineEmits(['select', 'remove', 'upload'])
    const props = defineProps({
        loading: { type: Boolean, required: false, default: false },
        emoji: { type: String, required: false, default: '' },
        image: { type: String, required: false, default: '' },
        pickerElementId: {
            type: String,
            default: 'emoji-picker',
        },
        allowImageUpload: {
            type: Boolean,
            default: false,
            required: false,
        },
    })
    const fileList = ref<FileItem[]>([])
    const emitSelectedEmoji = (emojiObject) => {
        emit('select', { native: emojiObject.unicode })
    }
</script>

<style lang="less" module>
    .emojiPicker {
        :global(.ant-tabs-nav) {
            padding-left: 15px;
            margin-bottom: 0;
        }
        :global(.ant-upload.ant-upload-select) {
            display: block;
        }
    }

    .hide-nav-tabs-emoji-picker {
        :global(.ant-tabs-nav) {
            display: none !important;
        }
    }
</style>
