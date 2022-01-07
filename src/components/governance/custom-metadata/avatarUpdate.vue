<template>
    <div class="flex">
        <a-popover
            overlay-class-name="cm-avatar-update-modal"
            :visible="popOverVisible"
            :trigger="['click']"
            placement="bottom"
            destroy-on-close
            :on-visible-change="
                (e) => {
                    popOverVisible = e
                }
            "
        >
            <CustomMetadataAvatar
                class="hover:bg-gray-100"
                :metadata="metadata"
                :is-updating="isUpdating"
            />
            <template #content>
                <div style="width: 314px"></div>

                <a-tabs default-active-key="1" size="small">
                    <template
                        v-if="
                            metadata.options.emoji || metadata.options.imageId
                        "
                        #rightExtra
                    >
                        <a-button class="border-0" @click="removeAvatar">
                            <AtlanIcon
                                icon="Delete"
                                class="inline mr-1 text-gray-500"
                            />
                            <span class="text-gray-500 align-middle">
                                Remove
                            </span>
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
                            @select="handleEmojiSelect"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Upload Image" force-render>
                        <div class="p-3">
                            <div
                                class="p-3 text-center border border-dashed rounded"
                            >
                                <a-upload
                                    class="relative block w-full mb-3 metadata-avatar-uploader"
                                    name="file"
                                    accept="image/*"
                                    :multiple="false"
                                    :file-list="fileList"
                                    :show-upload-list="false"
                                    :custom-request="handleUploadImage"
                                >
                                    <a-button
                                        :loading="isUploading"
                                        type="primary"
                                        class="w-full"
                                    >
                                        {{
                                            isUploading
                                                ? 'Uploading...'
                                                : 'Upload an image'
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
                <!-- <pre>{{ metadata }}</pre> -->
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    // Emoji
    import data from 'emoji-mart-vue-fast/data/apple.json'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'

    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

    import CustomMetadataAvatar from './CustomMetadataAvatar.vue'
    const emojiIndex = new EmojiIndex(data)

    export default defineComponent({
        components: {
            Picker,
            CustomMetadataAvatar,
        },
        props: {
            metadata: {
                required: true,
                type: Object,
                default: () => {},
            },
        },
        setup(props) {
            /**
             * Store options as form
             * After image upload or emoji set, update form value
             * Watch form value update and if changed, update CM
             */

            const { metadata } = toRefs(props)

            const {
                popOverVisible,
                isUploading,
                imageUrl,
                isUpdating,
                fileList,
                handleUploadImage,
                handleEmojiSelect,
                removeAvatar,
            } = useCustomMetadataAvatar(metadata)

            return {
                emojiIndex,
                popOverVisible,
                isUploading,
                isUpdating,
                imageUrl,
                fileList,
                handleUploadImage,
                handleEmojiSelect,
                removeAvatar,
            }
        },
    })
</script>

<style lang="less">
    .cm-avatar-update-modal {
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
    }
    .metadata-avatar-uploader {
        .ant-upload.ant-upload-select {
            display: block;
        }
    }
    button.emoji-mart-emoji,
    .emoji-mart-category .emoji-mart-emoji span {
        cursor: pointer;
    }
</style>
