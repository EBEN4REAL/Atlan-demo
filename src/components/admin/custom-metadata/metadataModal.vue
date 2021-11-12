<template>
    <a-modal
        v-model:visible="visible"
        class="add-metadata-modal"
        :closable="false"
        :footer="false"
        :destroy-on-close="true"
    >
        <a-input
            id="name-input"
            v-model:value="form.displayName"
            placeholder="Name the metadata"
            class="p-0 text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
        ></a-input>
        <a-textarea
            v-model:value="form.description"
            placeholder="Add description..."
            class="p-0 font-bold text-gray-700 border-0 shadow-none outline-none resize-none "
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
        <!-- <pre>{{ isEdit }}</pre> -->
        <!-- <pre>{{ metadata }}</pre> -->
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { Types } from '~/services/meta/types'
    import { message } from 'ant-design-vue'

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
        emits: ['selectBm'],
        setup(props, { emit }) {
            // data
            const store = useTypedefStore()

            const visible = ref(false)
            const loading = ref(false)
            const form = ref({
                displayName: '',
                description: '',
            })

            // methods
            const open = () => {
                if (props.metadata) {
                    // const storeMetadata = store.getBusinessMetadataByGuid(
                    //     props.metadata.guid
                    // )
                    form.value = props.metadata
                }

                // if (props.isEdit) fillForm()
                visible.value = true
                setTimeout(
                    () => document.getElementById('name-input')?.focus(),
                    500
                )
            }

            const hasName = () => !!form.value.displayName

            const handleBmUpdateSuccess = (serviceResponse: any[]) => {
                if (props.isEdit) {
                    store.businessMetadataUpdateBM(serviceResponse[0])
                    message.success('Metadata updated')
                } else {
                    console.log(serviceResponse)

                    store.appendCustomMetadata(serviceResponse)
                    message.success('Metadata created')
                    emit('selectBm', serviceResponse[0])
                }
            }

            const handleUpdateBMResponse = (apiResponse: Ref) => {
                console.log(apiResponse)
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
                            console.log(error.value)
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
        .ant-modal-body {
            padding: 1rem;
        }
        .ant-input {
            border: none !important;
        }
    }
</style>
