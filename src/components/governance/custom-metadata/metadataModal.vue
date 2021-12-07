<template>
    <a-modal
        v-model:visible="visible"
        class="add-metadata-modal"
        :closable="false"
        :footer="false"
        :destroy-on-close="true"
    >
        <div class="p-4">
            <a-input
                id="name-input"
                v-model:value="form.displayName"
                placeholder="Name the metadata"
                class="p-0 text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
            ></a-input>
            <a-textarea
                v-model:value="form.description"
                placeholder="Add description..."
                class="p-0 font-bold text-gray-700 border-0 shadow-none outline-none resize-none"
            ></a-textarea>
            <div class="flex items-center justify-end space-x-3">
                <a-button class="border-0" @click="visible = false"
                    >Cancel</a-button
                >
                <a-button
                    type="primary"
                    :loading="loading"
                    :disabled="!form.displayName"
                    @click="handleAddBusinessMetadata"
                    >{{ isEdit ? 'Update' : 'Create' }}</a-button
                >
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import { Types } from '~/services/meta/types'

    // store
    import { useTypedefStore } from '~/store/typedef'

    export default defineComponent({
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

            return {
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
