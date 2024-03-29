<template>
    <div class="flex items-center">
        <div v-if="allowUpload">
            <a-upload
                accept="image/*"
                class="cursor-pointer"
                :custom-request="handleUploadAvatar"
                :show-upload-list="false"
            >
                <div
                    v-if="!isReady && uploadStarted"
                    class="hidden text-center bg-primary-light sm:block"
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

                <a-avatar
                    v-else
                    :key="uploadKey"
                    :shape="avatarShape"
                    :size="avatarSize"
                    class="hidden ant-tag-blue text-primary sm:block"
                    :class="avatarBgClass"
                    :src="updatedImageUrl"
                >
                    <template #icon>
                        <AtlanIcon icon="User"></AtlanIcon> </template
                ></a-avatar>
            </a-upload>
        </div>
        <div v-else>
            <a-avatar
                :key="uploadKey"
                :shape="avatarShape"
                :size="avatarSize"
                class="hidden ant-tag-blue text-primary sm:block"
                :class="avatarBgClass"
                :src="isAtlan ? atlanLogo : updatedImageUrl"
            >
                <template v-if="!initialName" #icon>
                    <AtlanIcon v-if="isGroup" icon="Group"></AtlanIcon>
                    <AtlanIcon v-else icon="User"></AtlanIcon>
                </template>
                <div
                    v-if="initialName"
                    class="flex items-center text-xs initial-text"
                    :style="`height: ${avatarSize}px`"
                >
                    {{ initialName }}
                </div>
                <!-- {{ getNameInitials(getNameInTitleCase(avatarName)) }} -->
            </a-avatar>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import uploadAvatar from '~/composables/avatar/uploadAvatar'
    import atlanLogo from '~/assets/images/source/atlan-logo.jpeg'

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
                type: [Number, String] as PropType<Number | String>,
                default: 56,
            },
            avatarBgClass: {
                type: String,
                default: 'bg-primary-light',
            },
            isGroup: {
                type: Boolean,
                default: false,
            },
            isAtlan: {
                type: Boolean,
                default: false,
            },
            initialName: {
                type: String,
                default: '',
            },
        },
        setup(props, context) {
            const uploadStarted = ref(false)
            const updatedImageUrl = ref(props.imageUrl)

            watch(
                () => props.imageUrl,
                () => {
                    updatedImageUrl.value = props.imageUrl
                }
            )
            const { upload, isReady, uploadKey, refreshImage } = uploadAvatar()
            const handleUploadAvatar = async (uploaded) => {
                upload(uploaded.file)
                uploadStarted.value = true
                updatedImageUrl.value = `${updatedImageUrl.value}?${uploadKey.value}`

                return true
            }
            watch(uploadKey, () => {
                context.emit('imageUpdated', updatedImageUrl)
            })
            return {
                handleUploadAvatar,
                isReady,
                uploadStarted,
                uploadKey,
                updatedImageUrl,
                getNameInitials,
                getNameInTitleCase,
                refreshImage,
                atlanLogo,
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
