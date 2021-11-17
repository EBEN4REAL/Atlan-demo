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
        </template>
        <!-- Modal body -->

        <div class="flex space-x-32">
            <FormGen :config="formConfig" @vchange="handleFormChange" />
            <span class="ml-12 text-gray-500"
                >Click the button on the left to upload a valid CSV file
                containing data.</span
            >
        </div>
        <!-- Modal footer -->
        <template #footer>
            <div class="flex items-center">
                <a-button class="px-2" @click="handleDownload"
                    >Download sample CSV template</a-button
                >
                <!-- TODO: Uncomment when doc for bulk is ready -->
                <!-- <span class="text-primary ml-7">Learn more</span> -->
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { useRouter } from 'vue-router'
    import { defineComponent, ref, inject, computed, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import {
        updateWorkflowByName,
        runWorkflowByName,
        createWorkflow,
    } from '~/composables/workflow/useWorkFlowList'

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
            // data
            const visible = ref<boolean>(false)
            const fileS3Key = ref('') // s3 key is what we get from the files api
            const body = computed(() => ({
                metadata: {
                    name: `atlan-gtc-bulk-upload-${props.entity.guid.slice(
                        -8
                    )}`,
                    namespace: 'default',
                    labels: {},
                },
                spec: {
                    arguments: {
                        parameters: [
                            {
                                name: 's3-file-key',
                                value: fileS3Key.value,
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
                                                    value: fileS3Key.value,
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
                    entrypoint: 'main',
                },
            }))

            // http on local https on production
            const getBasePath = function (): any {
                if (process.env.NODE_ENV === 'development')
                    return 'http://{{domain}}/api/service/files'
                return 'https://{{domain}}/api/service/files'
            }

            // TODO: this config will come from backend
            const formConfig = ref([
                {
                    type: 'upload',
                    id: 'test',
                    label: '',
                    isVisible: true,
                    requestConfig: {
                        url: getBasePath(),
                        formDataFormat: {
                            name: 'name',
                            file: '{{file}}',
                            prefix: 'prefix',
                        },
                    },
                },
            ])

            // function to show modal
            const showModal = async () => {
                visible.value = true
            }

            const handleCancel = () => {
                visible.value = false
            }
            // run workflow
            const run = (name) => {
                const runBody = {
                    namespace: 'default',
                    resourceKind: 'WorkflowTemplate',
                    resourceName: name,
                    submitOptions: {
                        entryPoint: 'main',
                        labels: '',
                        parameters: [],
                    },
                }

                const { data } = runWorkflowByName(runBody, true)

                watch(data, () => {
                    message.success({
                        content: `Starting bulk upload!`,
                        duration: 2,
                    })
                    visible.value = false
                })
            }

            // update workflow if already exists
            const updateWorkflow = () => {
                console.log('updating workflow')
                const { workflow, error, isLoading, mutate, isReady } =
                    updateWorkflowByName(
                        `atlan-gtc-bulk-upload-${props.entity.guid.slice(-8)}`,
                        body,
                        false
                    )
                mutate()
                watch([workflow, error], () => {
                    if (workflow.value && !error.value && !isLoading.value) {
                        run(
                            `atlan-gtc-bulk-upload-${props.entity.guid.slice(
                                -8
                            )}`
                        )
                    } else if (error.value) {
                        const errMsg = error.value?.response?.data?.message
                        handleCreateWorkflow()
                    }
                })
            }
            // create workflow on file upload
            const handleCreateWorkflow = (s3Key) => {
                const { data, error, isLoading, execute } = createWorkflow(
                    body,
                    false
                )
                execute(true)
                watch([data, error], (v) => {
                    if (data.value && !error.value) {
                        message.success({
                            content: `Starting bulk upload!`,
                            key: `bulkUpload`,
                            duration: 2,
                        })
                        visible.value = false
                    } else {
                        const errMsg = error.value?.response?.data?.message
                        message.error({
                            content: `${errMsg || `Failed to create workflow`}`,
                            key: `bulkUpload`,
                            duration: 5,
                        })
                    }
                })
            }
            const handleFormChange = (data) => {
                if (data.value.key) {
                    console.log(data.value.key)
                    fileS3Key.value = data.value.key
                    updateWorkflow()
                }
            }

            const handleDownload = () => {
                const link = window.document.createElement('a')
                link.setAttribute(
                    'href',
                    '/src/assets/samples/sample_terms.csv'
                )
                link.setAttribute('download', 'sample.csv')
                link.click()
            }
            return {
                handleCancel,
                showModal,
                visible,
                formConfig,
                handleFormChange,
                handleDownload,
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
