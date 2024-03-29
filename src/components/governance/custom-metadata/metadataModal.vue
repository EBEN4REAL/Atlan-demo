<template>
    <a-modal
        v-model:visible="visible"
        class="add-metadata-modal"
        :closable="false"
        :destroy-on-close="true"
        :width="632"
    >
        <template #footer>
            <div class="flex items-center justify-between space-x-3">
                <div v-if="!isEdit" class="flex items-center space-x-2">
                    <a-switch v-model:checked="createMore" size="small" />
                    <p class="p-0 m-0">Create more</p>
                </div>
                <div class="flex-grow"></div>
                <AtlanButton2
                    color="secondary"
                    label="Cancel"
                    @click="visible = false"
                />
                <AtlanButton2
                    :label="isEdit ? 'Update' : 'Create'"
                    :loading="loading"
                    :disabled="!form.displayName"
                    @click="handleAddBusinessMetadata"
                />
            </div>
        </template>
        <div class="h-32 p-4 space-y-2">
            <div class="flex items-center gap-x-1">
                <a-popover
                    v-model:visible="emojiVisibility"
                    :trigger="['click']"
                    destroy-on-close
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
                        <template v-else-if="form.options.logoType === 'image'">
                            <img
                                v-if="my_photo"
                                class="w-5 h-5"
                                :src="my_photo"
                                alt="IMG"
                            />
                            <img
                                v-else-if="imageUrl"
                                class="w-5 h-5"
                                :src="imageUrl"
                                alt="IMG"
                            />
                        </template>
                        <div
                            v-else
                            class="flex items-center justify-center w-full h-full"
                        >
                            <AtlanIcon icon="NoAvatar" class="h-auto" />
                        </div>
                    </div>
                    <template #content
                        ><IconPicker
                            :emoji="form.options.emoji"
                            :image="imageFile"
                            :picker-element-id="'update-CM-emoji-picker'"
                            :allow-image-upload="true"
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
    import IconPicker from '~/components/common/IconPicker/IconPicker.vue'
    import useUploadImage from '~/composables/image/uploadImage'
    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

    export default defineComponent({
        components: { AtlanButton, IconPicker },
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
            const createMore = ref(false)
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
                    message.success({
                        content: 'Metadata updated',
                        duration: 2,
                    })
                } else {
                    store.appendCustomMetadata(serviceResponse)
                    store.tickForceRevalidate()
                    message.success('Metadata created')
                    emit('select', serviceResponse[0].guid)
                }
                console.log('analytics props.isEdit', props.isEdit)
                const eventName = props.isEdit ? 'updated' : 'created'
                useAddEvent('governance', 'custom_metadata', eventName, {
                    title: serviceResponse[0].displayName,
                })
            }

            const handleUpdateBMResponse = (apiResponse: Ref) => {
                watch(
                    () => apiResponse.value.data,
                    () => {
                        if (
                            apiResponse.value?.data?.businessMetadataDefs.length
                        ) {
                            if (!createMore.value) visible.value = false
                            else form.value = initializeForm()
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
            const { imageUrl } = useCustomMetadataAvatar(form)

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
                imageUrl,
                createMore,
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
