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
                <a-popover :visibile="visibile" :trigger="['click']">
                    <CustomMetadataAvatar
                        class="hover:bg-gray-100"
                        :metadata="form"
                    />
                    <template #content
                        ><EmojiPicker
                            @select="emojiSelect"
                            @remove="emojiRemove"
                            @upload="handleUpload"
                    /></template>
                </a-popover>
                <!-- <AvatarUpdate :metadata="form" class="mb-1" /> -->
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
                class="p-0 font-bold text-gray-700 border-0 shadow-none outline-none resize-none"
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
    import CustomMetadataAvatar from './CustomMetadataAvatar.vue'

    export default defineComponent({
        components: { AtlanButton, EmojiPicker, CustomMetadataAvatar },
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
        emits: ['update:selected'],
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
                    emit('update:selected', serviceResponse[0].guid)
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
                else
                    apiResponse.value = Types.CreateTypedefs(
                        {
                            businessMetadataDefs: [form.value],
                        },
                        { options: { params: { type: 'BUSINESS_METADATA' } } }
                    )

                handleUpdateBMResponse(apiResponse)
            }

            const visibile = ref(false)

            const emojiSelect = (emoji) => {
                console.log({ emoji })
            }
            const handleUpload = (payload) => {
                console.log({ payload })
            }

            const emojiRemove = () => {}

            return {
                emojiRemove,
                handleUpload,
                emojiSelect,
                visibile,
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
