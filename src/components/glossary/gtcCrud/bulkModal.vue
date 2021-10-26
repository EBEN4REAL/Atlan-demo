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

        <div class="flex space-x-32">
            <FormGen :config="formConfig" @change="handleFormChange" />
            <span class="ml-12 text-gray-500"
                >Click the button on the left to upload a valid CSV file
                containing data. You’ll be able to clean up or remove any
                corrupted data before finalizing your upload.
            </span>
        </div>
        <!-- Modal footer -->
        <template #footer>
            <div class="flex items-center">
                <a-button class="px-2" @click="handleDownload"
                    >Download sample CSV template</a-button
                >
                <span class="text-primary ml-7">Learn more</span>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts">
    import { useRouter } from 'vue-router'
    import { defineComponent, ref, inject, computed, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import FormGen from '~/components/common/formGenerator/index.vue'
    import { createWorkflow } from '~/composables/workflow/useWorkFlowList'
    import redirect from '@/glossary/utils/redirectToProfile'

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
            const router = useRouter()
            const redirectToProfile = redirect(router)

            const formConfig = ref([
                {
                    type: 'upload',
                    id: 'test',
                    label: '',
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
                            content: `Starting bulk upload!`,
                            key: `${s3Key}`,
                            duration: 2,
                        })
                        visible.value = false
                        handleStartUpload(
                            `atlan-glossary-bulk-upload-${props.entity.guid.slice(
                                -8
                            )}`
                        )
                        setTimeout(() => {
                            redirectToProfile(
                                'AtlasGlossary',
                                props.entity?.guid,
                                {
                                    tab: 'overview',
                                }
                            )
                        }, 2000)
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
            const handleDownload = () => {
                window.open('/src/assets/samples/sample_terms.csv')
            }
            return {
                handleCancel,
                showModal,
                visible,
                fileList: ref([]),
                uploadStatus,
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
