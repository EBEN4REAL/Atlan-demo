<template>
    <div class="flex items-center">
        <a-popover
            :visible="popOverVisible"
            :trigger="['click']"
            placement="bottom"
            :destroy-on-close="true"
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
                <IconPicker
                    :emoji="metadata.options.emoji"
                    :image="metadata.options.imageId"
                    :loading="isUpdating"
                    :picker-element-id="'CM-emoji-picker'"
                    :allow-image-upload="true"
                    @select="handleEmojiSelect"
                    @remove="removeAvatar"
                    @upload="handleUploadImage"
                />
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'
    import IconPicker from '~/components/common/IconPicker/IconPicker.vue'

    export default defineComponent({
        components: {
            IconPicker,
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
