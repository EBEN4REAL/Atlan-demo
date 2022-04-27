<template>
    <div class="flex items-center">
        <div v-if="allowUpload">
            <a-upload
                accept=".png, .jpg, .jpeg"
                class="cursor-pointer"
                :custom-request="handleUploadAvatar"
                :show-upload-list="false"
            >
                <div
                    v-if="!isReady && uploadStarted && !error"
                    class="hidden text-sm text-center bg-primary-light sm:block"
                    :style="{
                        width: avatarSize + 'px',
                        height: avatarSize + 'px',
                    }"
                >
                    <a-spin
                        wrapper-class-name="test"
                        size="small"
                        class="flex items-center justify-center w-full h-full"
                    ></a-spin>
                </div>
                <div v-else class="relative group">
                    <a-avatar
                        :key="uploadKey"
                        :shape="avatarShape"
                        :size="avatarSize"
                        class="hidden text-sm ant-tag-blue text-primary bg-primary-light sm:block"
                        :src="updatedImageUrl"
                    >
                        {{ getNameInitials(getNameInTitleCase(avatarName)) }}
                    </a-avatar>
                    <div
                        class="absolute top-0 flex items-center justify-center w-full h-full transition-opacity bg-gray-700 rounded-full opacity-0 bg-opacity-70 group-hover:opacity-100"
                    >
                        <span class="font-bold text-white">Change avatar</span>
                    </div>
                    <div
                        class="absolute bottom-0 p-1 bg-white rounded-full left-20"
                    >
                        <div
                            class="p-1 bg-gray-100 border border-gray-300 rounded-full px-1 py-0.5 text-gray-500"
                        >
                            <AtlanIcon icon="Pencil" />
                        </div>
                    </div>
                </div>
            </a-upload>
        </div>
        <div v-else>
            <a-avatar
                :key="uploadKey"
                :shape="avatarShape"
                :size="avatarSize"
                class="hidden text-sm ant-tag-blue text-primary bg-primary-light sm:block"
                :src="updatedImageUrl"
            >
                {{ getNameInitials(getNameInTitleCase(avatarName)) }}</a-avatar
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType, toRefs, unref } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import uploadAvatar from '~/composables/avatar/uploadAvatar'
    import { message } from 'ant-design-vue'

    export default {
        name: 'Avatar',
        props: {
            avatarName: {
                type: String,
                default: '',
            },
            allowUpload: {
                type: Boolean,
                default: false,
            },
            imageUrl: {
                type: String,
                default: '',
            },
            avatarShape: {
                type: String,
                default: 'square',
            },
            avatarSize: {
                type: [String, Number] as PropType<Number | String>,
                default: 56,
            },
        },
        emits: ['imageUpdated'],
        setup(props, { emit }) {
            const { imageUrl } = toRefs(props)
            const updatedImageUrl = ref(unref(imageUrl))
            const uploadStarted = ref(false)

            watch(
                () => props.imageUrl,
                () => {
                    updatedImageUrl.value = props.imageUrl
                }
            )
            const { upload, isReady, uploadKey, refreshImage, error } =
                uploadAvatar()
            const handleUploadAvatar = async (uploaded) => {
                console.log('handle Upload', uploaded)
                uploadStarted.value = true
                await upload(uploaded.file)
                if (error.value) {
                    message.error({
                        key: 'upload',
                        content: 'Image upload failed, please try again.',
                    })
                } else if (isReady?.value)
                    message.success({
                        key: 'upload',
                        content: 'Image uploaded',
                    })
                updatedImageUrl.value = `${updatedImageUrl.value}?${uploadKey.value}`

                return true
            }
            watch(uploadKey, () => {
                emit('imageUpdated', updatedImageUrl)
            })
            return {
                error,
                handleUploadAvatar,
                isReady,
                uploadStarted,
                uploadKey,
                updatedImageUrl,
                getNameInitials,
                getNameInTitleCase,
                refreshImage,
            }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
