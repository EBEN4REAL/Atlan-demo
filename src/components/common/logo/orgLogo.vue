<template>
    <div class="flex items-center">
        <div
            v-if="allowUpload"
            :class="bordered ? 'border-gray-200 rounded px-2 pt-2 border' : ''"
            :style="{ height: `${avatarSize}px` }"
        >
            <a-upload
                accept=".png, .jpg, .jpeg"
                class="cursor-pointer"
                :custom-request="handleUploadAvatar"
                :show-upload-list="false"
            >
                <div
                    v-if="!isReady && uploadStarted && !error"
                    class="hidden text-center bg-primary-light sm:block"
                    :class="[
                        bordered ? 'mb-2' : '',
                        avatarShape === 'circle' ? 'rounded-full' : '',
                    ]"
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
                        :class="$style.orglogo"
                        class="hidden ant-tag-blue text-primary bg-primary-light sm:block"
                        :src="updatedImageUrl"
                        >{{ getNameInitials(getNameInTitleCase(avatarName)) }}
                    </a-avatar>
                    <div
                        :class="`overlay-edit-avatar absolute top-0 flex items-center justify-center w-full h-full transition-opacity bg-gray-700 opacity-0 bg-opacity-70 group-hover:opacity-100 ${
                            avatarShape === 'circle' && 'rounded-full'
                        }`"
                    >
                        <span class="font-bold text-white">Edit</span>
                    </div>
                </div>
            </a-upload>
        </div>
        <div v-else>
            <a-avatar
                :key="uploadKey"
                :shape="avatarShape"
                :size="avatarSize"
                :class="$style.orglogo"
                class="hidden ant-tag-blue text-primary bg-primary-light sm:block"
                :src="updatedImageUrl"
                >{{ getNameInitials(getNameInTitleCase(avatarName)) }}</a-avatar
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, watch, PropType } from 'vue'
    import { message } from 'ant-design-vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import { useTenantStore } from '~/store/tenant'
    import uploadLogo from '~/composables/avatar/updateLogo'

    export default {
        name: 'OrgLogo',
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
                type: String as PropType<Number | String>,
                default: 56,
            },
            bordered: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, context) {
            const tenantStore = useTenantStore()

            const uploadStarted = ref(false)
            const updatedImageUrl = ref(props.imageUrl)

            watch(
                () => props.imageUrl,
                () => {
                    updatedImageUrl.value = props.imageUrl
                }
            )

            const { upload, isReady, uploadKey, error } = uploadLogo()
            const handleUploadAvatar = async (uploaded) => {
                console.log('handle Upload', uploaded)
                uploadStarted.value = true
                await upload(uploaded.file)
                if (error.value) {
                    const errMsg = error.value?.response?.data?.message
                    message.error({
                        key: 'upload',
                        content:
                            errMsg ?? 'Image upload failed, please try again.',
                    })
                } else if (isReady?.value)
                    message.success({
                        key: 'upload',
                        content: 'Image uploaded',
                    })
                updatedImageUrl.value = `${updatedImageUrl.value}?${uploadKey.value}`
                tenantStore.setLogo(
                    `${updatedImageUrl.value}?${uploadKey.value}`
                )

                return true
            }
            watch(uploadKey, () => {
                context.emit('imageUpdated', updatedImageUrl)
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
            }
        },
    }
</script>

<style lang="less" module>
    .orglogo {
        img {
            @apply object-contain px-1;
        }
    }
</style>
