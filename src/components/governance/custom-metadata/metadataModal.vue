<template>
    <a-modal
        v-model:visible="visible"
        class="add-metadata-modal"
        :closable="false"
        :destroy-on-close="true"
        :width="632"
    >
        <template #footer>
            <div class="flex items-center justify-end space-x-3">
                <a-button class="border-0" @click="visible = false"
                    >Cancel</a-button
                >
                <AtlanButton
                    color="primary"
                    padding="compact"
                    size="sm"
                    :loading="loading"
                    :disabled="!form.displayName"
                    @click="handleAddBusinessMetadata"
                >
                    {{ isEdit ? 'Update' : 'Create' }}
                </AtlanButton>
            </div>
        </template>
        <div class="h-32 p-4 space-y-2">
            <div class="flex items-center gap-x-1">
                <a-popover
                    v-model:visible="emojiVisibility"
                    :trigger="['click']"
                >
                    <div
                        class="cursor-pointer"
                        @click="emojiVisibility = !emojiVisibility"
                    >
                        <span
                            v-if="form.options.logoType === 'emoji'"
                            class="text-lg"
                            >{{ form.options.emoji }}</span
                        >
                        <img
                            v-else-if="form.options.logoType === 'image'"
                            class="w-5 h-5"
                            :src="my_photo"
                            alt=""
                        />
                        <div
                            v-else
                            class="flex items-center justify-center w-full h-full"
                        >
                            <AtlanIcon icon="NoAvatar" class="h-auto" />
                        </div>
                    </div>
                    <template #content
                        ><EmojiPicker
                            :emoji="form.options.emoji"
                            :image="imageFile"
                            @select="emojiSelect"
                            @remove="emojiRemove"
                            @upload="handleUpload"
                    /></template>
                </a-popover>
                <a-input
                    id="name-input"
                    v-model:value="form.displayName"
                    placeholder="Name"
                    class="p-0 text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                ></a-input>
            </div>
            <a-textarea
                v-model:value="form.description"
                placeholder="Add description..."
                class="p-0 text-gray-700 border-0 shadow-none outline-none resize-none"
            ></a-textarea>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import { Types } from '~/services/meta/types'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    // store
    import { useTypedefStore } from '~/store/typedef'

    import AtlanButton from '@/UI/button.vue'

    import EmojiPicker from '@/common/avatar/emojiPicker.vue'
    import useUploadImage from '~/composables/image/uploadImage'

    export default defineComponent({
        components: { AtlanButton, EmojiPicker },
        props: {
            isEdit: {
                type: Boolean,
                default: false,
            },
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            // data
            const store = useTypedefStore()
            const initializeForm = () => ({
                displayName: '',
                description: '',
                options: {},
            })
            const visible = ref(false)
            const loading = ref(false)
            const error = ref(null)
            const form = ref(initializeForm())

            // methods
            const open = () => {
                if (props.metadata) {
                    form.value = props.metadata
                } else {
                    form.value = initializeForm()
                }
                visible.value = true
                setTimeout(
                    () => document.getElementById('name-input')?.focus(),
                    500
                )
            }

            const hasName = () => !!form.value.displayName

            const handleBmUpdateSuccess = (serviceResponse: any[]) => {
                if (props.isEdit) {
                    store.updateCustomMetadata(serviceResponse[0])
                    store.tickForceRevalidate()
                    message.success('Metadata updated')
                } else {
                    store.appendCustomMetadata(serviceResponse)
                    store.tickForceRevalidate()
                    message.success('Metadata created')
                    emit('select', serviceResponse[0].guid)
                }
                console.log('analytics props.isEdit', props.isEdit)
                const eventName = props.isEdit ? 'updated' : 'created'
                useAddEvent('governance', 'custom_metadata', eventName)
            }

            const handleUpdateBMResponse = (apiResponse: Ref) => {
                watch(
                    () => apiResponse.value.data,
                    () => {
                        if (
                            apiResponse.value?.data?.businessMetadataDefs.length
                        ) {
                            visible.value = false
                            handleBmUpdateSuccess(
                                apiResponse.value.data.businessMetadataDefs
                            )
                        }

                        loading.value = false
                        // isUpdated.value = false
                    }
                )

                watch(
                    () => apiResponse.value.error,
                    (e) => {
                        loading.value = false
                        message.error('Error occured, try again')

                        console.log(
                            '🚀 ~ file: businessMetadataProfile.vue ~ handleAddBusinessMetadata ~ error',
                            e
                        )
                        if (e?.response?.data?.errorMessage) {
                            error.value = {
                                data: {
                                    errorMessage: e.response.data.errorMessage,
                                },
                            }
                        }
                    }
                )
            }

            const emojiVisibility = ref(false)
            const imageFile = ref()
            const my_photo = ref()

            // image uploader ======================================================
            const {
                data: imageUploadData,
                error: imageUploadError,
                isLoading: isUploading,
                upload,
            } = useUploadImage()

            const emojiSelect = ({ native }) => {
                emojiVisibility.value = false
                form.value.options.logoType = 'emoji'
                form.value.options.emoji = native
                form.value.options.imageId = null
                my_photo.value = null
                imageFile.value = null
            }

            const handleUpload = async (payload) => {
                emojiVisibility.value = false
                form.value.options.logoType = 'image'
                form.value.options.emoji = null
                console.log({ payload })
                const { file } = payload
                imageFile.value = file
                const data = URL.createObjectURL(imageFile.value)
                my_photo.value = data
            }

            const emojiRemove = () => {
                form.value.options.logoType = ''
                form.value.options.emoji = null
                form.value.options.imageId = null
            }

            const handleAddBusinessMetadata = async () => {
                // error.value = null
                const validatedBm = hasName(form.value.hasName)

                if (!validatedBm) {
                    message.error('Enter name')
                    return
                }

                loading.value = true
                const apiResponse = ref()
                if (props.isEdit)
                    apiResponse.value = Types.updateCustomMetadata(
                        // form.value.guid,
                        {
                            businessMetadataDefs: [form.value],
                        },
                        {
                            options: {
                                params: { type: 'BUSINESS_METADATA' },
                            },
                        }
                    )
                else {
                    if (
                        form.value.options.logoType === 'image' &&
                        imageFile.value
                    )
                        await upload(imageFile.value)
                    console.log({ imageUploadData, imageUploadError })

                    form.value.options.imageId = imageUploadData.value.id

                    apiResponse.value = Types.CreateTypedefs(
                        {
                            businessMetadataDefs: [form.value],
                        },
                        { options: { params: { type: 'BUSINESS_METADATA' } } }
                    )
                }
                handleUpdateBMResponse(apiResponse)
            }

            return {
                my_photo,
                emojiRemove,
                handleUpload,
                emojiSelect,
                emojiVisibility,
                // data
                visible,
                loading,
                form,
                // method
                open,
                handleAddBusinessMetadata,
            }
        },
    })
</script>

<style lang="less">
    .add-metadata-modal {
        .ant-input {
            border: none !important;
        }
    }
</style>
