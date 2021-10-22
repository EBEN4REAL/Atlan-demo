<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        width="800px"
        :class="$style.modalStyles"
    >
        <!-- modal title -->
        <template #title>
            <span class="text-base font-bold text-gray-700"
                >Bulk Upload Terms from CSV</span
            >
            {{ uploadStatus }}
        </template>
        <!-- Modal body -->

        <!-- <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleUploadChange"
            :showUploadList="false"
            accept=".pdf,.xlsx"
        >
            <div
                v-if="uploadStatus === 'uploading'"
                class="flex flex-col items-center justify-center h-52"
            >
                <a-spin />
                <span class="text-gray-500">Importing your data....</span>
            </div>
            <div v-else class="flex items-center px-12 h-52">
                <div>
                    <a-button type="primary" class="mb-2"
                        >Upload data from file</a-button
                    >
                    <span class="text-gray-500"
                        >.csv and .tcsv file formats supported</span
                    >
                </div>
                <span class="ml-12 text-gray-500"
                    >Click the button on the left or drag and drop here to
                    upload a valid CSV file containing data. You’ll be able to
                    clean up or remove any corrupted data before finalizing your
                    upload.
                </span>
            </div>
        </a-upload-dragger> -->
        <!-- Modal footer -->
        <FormGen :config="formConfig" @change="handleFormChange" />
        <template #footer>
            <div class="flex items-center">
                <a-button class="px-2">Download sample CSV template</a-button>
                <span class="text-primary ml-7">Learn more</span>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, inject, computed, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import { createWorkflow } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        components: { FormGen },
        props: {
            entity: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
        emits: [],
        setup(props, { emit }) {
            const visible = ref<boolean>(false)
            const uploadStatus = ref()
            const handleStartUpload = inject('handleStartUpload')

            const formConfig = ref([
                {
                    type: 'upload',
                    id: 'test',
                    label: 'Uploader',
                    isVisible: true,
                    requestConfig: {
                        url: 'http://{{domain}}/api/service/files',
                        formDataFormat: {
                            name: 'name',
                            file: '{{file}}',
                            prefix: 'prefix',
                        },
                    },
                },
            ])

            const showModal = async () => {
                visible.value = true
            }

            const handleCancel = () => {
                visible.value = false
            }

            const handleUploadChange = (info: FileInfo) => {
                const { status } = info.file
                uploadStatus.value = status
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (status === 'done') {
                    message.success(
                        `${info.file.name} file uploaded successfully.`
                    )
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)
                    handleStartUpload()
                }
            }
            const handleCustomRequest = () => {
                console.log('custom upload request goes in this function')
                handleStartUpload()
            }

            const handleFormChange = (data) => {
                console.log(data.key)
                if (data.key) handleCreateWorkflow(data.key)
            }
            const handleCreateWorkflow = (s3Key) => {
                const body = computed(() => ({
                    metadata: {
                        name: `atlan-glossary-bulk-upload-${props.entity.guid.slice(
                            -8
                        )}`,
                    },
                    spec: {
                        arguments: {
                            parameters: [
                                {
                                    name: 's3-file-key',
                                    value: s3Key,
                                },
                                {
                                    name: 'glossary-guid',
                                    value: props.entity.guid,
                                },
                                {
                                    name: 'glossary-type',
                                    value: 'term',
                                },
                            ],
                        },
                        templates: [
                            {
                                name: 'main',
                                dag: {
                                    tasks: [
                                        {
                                            name: 'run',
                                            arguments: {
                                                parameters: [
                                                    {
                                                        name: 's3-file-key',
                                                        value: s3Key,
                                                    },
                                                    {
                                                        name: 'glossary-guid',
                                                        value: props.entity
                                                            .guid,
                                                    },
                                                    {
                                                        name: 'glossary-type',
                                                        value: 'term',
                                                    },
                                                ],
                                            },
                                            templateRef: {
                                                name: 'atlan-glossary-bulk-upload',
                                                template: 'main',
                                                clusterScope: true,
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                }))

                console.log(body)

                const { data, error, isLoading, mutate } = createWorkflow(
                    body,
                    false
                )
                message.loading({
                    content: 'Creating new workflow ...',
                    key: `${s3Key}`,
                })

                mutate()
                watch([data, error], (v) => {
                    if (data.value && !error.value) {
                        console.log(data)
                        message.success({
                            content: `created!`,
                            key: `${s3Key}`,
                            duration: 2,
                        })
                    } else {
                        console.log({ error: error.value })
                        const errMsg = error.value?.response?.data?.message
                        message.error({
                            content: `${errMsg || `Failed to create workflow`}`,
                            key: `${s3Key}`,
                            duration: 5,
                        })
                    }
                })
            }
            return {
                handleCancel,
                showModal,
                visible,
                handleUploadChange,
                fileList: ref([]),
                handleCustomRequest,
                uploadStatus,
                formConfig,
                handleFormChange,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4 pt-6  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 py-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-7  py-2 !important;
        }
        :global(.ant-upload-drag-container) {
            @apply bg-white !important;
        }
        :global(.ant-upload-drag) {
            @apply bg-white !important;
        }
    }
</style>
