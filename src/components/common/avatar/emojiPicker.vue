<template>
    <div style="width: 314px"></div>

    <a-tabs default-active-key="1" size="small">
        <template v-if="emoji || image" #rightExtra>
            <a-button class="border-0" @click="emit('remove')">
                <AtlanIcon icon="Delete" class="inline mr-1 text-gray-500" />
                <span class="text-gray-500 align-middle"> Remove </span>
            </a-button>
        </template>
        <a-tab-pane key="1" tab="Emoji">
            <Picker
                :data="emojiIndex"
                set="apple"
                auto-focus
                :show-preview="false"
                :emoji-tooltip="false"
                :infinite-scroll="true"
                @select="(o) => emit('select', o)"
            />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Upload Image" force-render>
            <div class="p-3">
                <div class="p-3 text-center border border-dashed rounded">
                    <a-upload
                        class="relative block w-full mb-3 metadata-avatar-uploader"
                        name="file"
                        accept="image/*"
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
                            {{ loading ? 'Uploading...' : 'Upload an image' }}
                        </a-button>
                    </a-upload>
                    <p class="text-sm text-gray-500">
                        Recommended size is 24 by 24 pixels
                    </p>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, ref, watch, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import data from 'emoji-mart-vue-fast/data/apple.json'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'
    import { FileItem } from '~/types/typedefs/customMetadata.interface'

    const emit = defineEmits(['select', 'remove', 'upload'])
    const props = defineProps({
        loading: { type: Boolean, required: false, default: false },
        emoji: { type: String, required: false, default: '' },
        image: { type: String, required: false, default: '' },
    })

    const emojiIndex = new EmojiIndex(data)

    // const { emoji, image } = useVModels(props, emit)

    const fileList = ref<FileItem[]>([])
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

    .ant-tabs-nav {
        padding-left: 15px;
        margin-bottom: 0;
    }
    .ant-upload.ant-upload-select {
        display: block;
    }
    button.emoji-mart-emoji,
    .emoji-mart-category .emoji-mart-emoji span {
        cursor: pointer;
    }
</style>
