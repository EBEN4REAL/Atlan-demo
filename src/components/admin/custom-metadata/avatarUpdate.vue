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
            <div
                v-if="metadata?.options?.imagePath || metadata?.options?.emoji"
                @click="popOverVisible = !popOverVisible"
            >
                <div
                    v-if="metadata?.options?.logoType === 'image'"
                    class="overflow-hidden bg-gray-100 rounded cursor-pointer"
                    style="width: 28px; height: 28px"
                >
                    <img
                        :src="imageUrl"
                        alt=""
                        class="object-cover w-full"
                        style="height: 28px"
                    />
                </div>
                <span v-else style="font-size: 28px">{{
                    metadata?.options?.emoji
                }}</span>
            </div>
            <div
                v-else
                class="flex items-center justify-center bg-gray-100 rounded cursor-pointer "
                style="width: 28px; height: 28px"
                @click="popOverVisible = !popOverVisible"
            >
                <a-spin v-if="isUpdating" />
                <AtlanIcon v-else icon="NoAvatar" />
            </div>
            <template #content>
                <div style="width: 314px"></div>

                <a-tabs default-active-key="1" size="small">
                    <a-tab-pane key="1" tab="Emoji">
                        <Picker
                            :data="emojiIndex"
                            set="twitter"
                            autoFocus
                            :showPreview="false"
                            :emojiTooltip="false"
                            :infiniteScroll="true"
                            @select="showEmoji"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Upload Image" force-render>
                        <div class="p-1">
                            <div
                                class="p-3 text-center border border-dashed rounded "
                            >
                                <a-upload
                                    class="relative block w-full mb-3  metadata-avatar-uploader"
                                    name="file"
                                    accept="image/*"
                                    :multiple="false"
                                    :file-list="fileList"
                                    :custom-request="uploadImage"
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
    import {
        defineComponent,
        toRefs,
        ref,
        watch,
        computed,
        onMounted,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'

    // Emoji
    import data from 'emoji-mart-vue-fast/data/twitter.json'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'

    import useUploadImage from '~/composables/image/uploadImage'
    import { Types } from '~/services/meta/types'
    import { useTypedefStore } from '~/store/typedef'

    let emojiIndex = new EmojiIndex(data)

    export default defineComponent({
        components: {
            Picker,
        },
        props: {
            metadata: {
                required: true,
                type: Object,
                default: () => {},
            },
        },
        setup(props) {
            const fileList = ref([])
            const popOverVisible = ref(false)
            const isUploading = ref(false)
            const isUpdating = ref(false)
            const imageResponse = ref({})
            const apiResponse = ref({})
            const store = useTypedefStore()

            //  image upload composable
            const {
                data: imageUploadData,
                error: imageUploadError,
                upload,
            } = useUploadImage()

            const uploadImage = (payload: { file: File }) => {
                if (!popOverVisible.value) return
                const { file } = payload
                isUploading.value = true
                upload(file)
            }

            const handleBmUpdateSuccess = (serviceResponse: any[]) =>
                store.updateCustomMetadata(serviceResponse[0])

            const handleUpdateBM = (newImage) => {
                isUpdating.value = true
                const tempBM = { ...props.metadata }
                tempBM.options.imagePath = `/images/${newImage.id}?ContentDisposition=inline&name=${newImage.id}`
                tempBM.options.logoType = 'image'
                apiResponse.value = Types.updateCustomMetadata(
                    {
                        businessMetadataDefs: [tempBM],
                    },
                    {
                        options: {
                            params: { type: 'BUSINESS_METADATA' },
                        },
                    }
                )

                watch(
                    () => apiResponse.value.data,
                    () => {
                        if (
                            apiResponse.value?.data?.businessMetadataDefs
                                ?.length
                        ) {
                            handleBmUpdateSuccess(
                                apiResponse.value.data.businessMetadataDefs
                            )
                            message.success('Metadata updated.')
                            isUpdating.value = false
                        }
                    }
                )
            }

            watch(
                [imageUploadData, imageUploadError],
                ([newImage, newError]) => {
                    if (newImage) {
                        imageResponse.value = newImage
                        isUploading.value = false
                        popOverVisible.value = false
                        message.success('Image uploaded.')
                        handleUpdateBM(newImage)
                    }
                    if (newError) {
                        message.error(' Error updating image.')
                    }
                }
            )

            const imageUrl = computed(
                () =>
                    `${window.location.origin}/api/service${props.metadata.options.imagePath}`
            )

            const showEmoji = (emoji) => {
                props.metadata.options.emoji = emoji.native
                props.metadata.options.logoType = 'emoji'
                popOverVisible.value = false
            }

            return {
                fileList,
                popOverVisible,
                isUploading,
                imageUrl,
                isUpdating,
                uploadImage,
                emojiIndex,
                showEmoji,
            }
        },
    })
</script>

<style lang="less">
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
