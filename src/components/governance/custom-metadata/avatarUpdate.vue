<template>
    <div class="flex">
        <a-popover
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
                <EmojiPicker
                    :emoji="metadata.options.emoji"
                    :image="metadata.options.imageId"
                    @select="handleEmojiSelect"
                    @remove="removeAvatar"
                    @upload="handleUploadImage"
                    :loading="isUpdating"
                />
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

    import CustomMetadataAvatar from './CustomMetadataAvatar.vue'
    import EmojiPicker from '@/common/avatar/emojiPicker.vue'

    export default defineComponent({
        components: {
            EmojiPicker,
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
