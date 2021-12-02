<template>
    <PreviewHeader
        :name="
            selectedWorkflow?.data.displayName ||
            selectedWorkflow?.metadata.name ||
            ''
        "
        type="workflow template"
        :show-utility-buttons="false"
        :icon="images.icon"
        :logo="images.logo"
    />
    <a-modal
        v-model:visible="visible"
        title="Create Workflow"
        :class="$style.input"
        :closable="false"
    >
        <div class="px-8 py-3">
            <a-input
                v-model:value="workflowName"
                :placeholder="`Untitled Workflow`"
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
            ></a-input>
            <p v-if="invalidName" class="mt-3 text-red-600">
                Name may consist of lower case alphanumeric characters, '-' or
                '.', and must start and end with an alphanumeric character
            </p>
        </div>
        <template #footer>
            <div class="flex items-center justify-end space-x-3">
                <AtlanButton color="minimal" @click="visible = false">
                    Cancel
                </AtlanButton>
                <AtlanButton
                    type="primary"
                    :loading="isLoading"
                    :disabled="invalidName || !workflowName"
                    @click="handleCreate"
                >
                    Create
                </AtlanButton>
            </div>
        </template>
    </a-modal>

    <div class="flex-grow">
        <Loader v-if="workflowTemplateLoading"></Loader>
        <ErrorView
            v-else-if="!workflowTemplateLoading && workflowTemplateError"
            :error="workflowTemplateError"
        ></ErrorView>
        <template v-else>
            <div
                class="flex items-center justify-between px-4 pt-2 mt-2 text-lg font-semibold text-gray-700"
            >
                Overview
            </div>
            <div
                v-if="Object.values(overview).length"
                class="w-full px-5 mt-2 overflow-y-auto"
                style="max-height: calc(100vh - 14rem)"
            >
                <div v-for="(v, k) in overview" :key="v" class="mb-3">
                    <p
                        class="mb-1 text-sm tracking-wide text-gray-500 capitalize"
                    >
                        {{
                            k
                                .split('/')
                                [k.split('/').length - 1].split(/(?=[A-Z])/g)
                                .join(' ')
                        }}:
                    </p>
                    <p v-linkified class="mb-0 text-gray-700 break-all">
                        {{
                            k === 'recommendedCronConfig'
                                ? `cronString: ${
                                      JSON.parse(v)?.cronString || ''
                                  }`
                                : v
                        }}
                    </p>
                </div>
            </div>
            <EmptyView
                v-else
                desc="
            No information available for this workflow template
        "
                desc-class="w-56 mb-24 text-center"
                empty-screen="WFEmptyTab"
            />
        </template>
    </div>
    <AtlanButton
        v-if="!workflowTemplateLoading && !workflowTemplateError"
        v-auth="access.CREATE_WORKFLOW"
        class="m-2"
        size="sm"
        color="primary"
        padding="compact"
        @click="handleSetupWorkflow"
    >
        Use this template <AtlanIcon icon="ArrowRight" class="inline" />
    </AtlanButton>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
        computed,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import Loader from '@common/loaders/page.vue'
    import ErrorView from '@common/error/index.vue'
    import { message } from 'ant-design-vue'
    import EmptyView from '@common/empty/index.vue'
    import {
        createWorkflow,
        useWorkflowTemplateByName,
    } from '~/composables/workflow/useWorkflowList'
    import AtlanButton from '@/UI/button.vue'
    import PreviewHeader from '@/workflows/shared/previewHeader.vue'
    import access from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'SetupWorkflowPreview',
        components: {
            AtlanButton,
            EmptyView,
            ErrorView,
            Loader,
            PreviewHeader,
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },

            showCrossIcon: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)

            const visible: Ref<boolean> = ref(false)
            const router = useRouter()

            const workflowName = ref('')

            const invalidName = computed(() => {
                if (!workflowName.value) return false
                const r =
                    /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
                return !r.test(workflowName.value)
            })

            const handleSetupWorkflow = () => {
                visible.value = true
            }

            const {
                workflowTemplate,
                error: workflowTemplateError,
                isLoading: workflowTemplateLoading,
                changeName,
            } = useWorkflowTemplateByName(
                selectedWorkflow.value.data?.templateName,
                true
            )
            const body = computed(() => ({
                metadata: {
                    name: workflowName.value,
                    labels: {
                        'com.atlan.orchestration/atlan-ui': 'true',
                    },
                },
                spec: {
                    templates: [
                        {
                            name: 'main',
                            dag: {
                                tasks: [
                                    {
                                        name: 'run',
                                        arguments: {
                                            parameters: [
                                                ...workflowTemplate.value?.spec.templates
                                                    ?.find(
                                                        (t) =>
                                                            t.name ===
                                                            workflowTemplate
                                                                .value?.spec
                                                                .entrypoint
                                                    )
                                                    ?.inputs?.parameters?.filter(
                                                        (p) =>
                                                            // eslint-disable-next-line no-prototype-builtins
                                                            !p.hasOwnProperty(
                                                                'value'
                                                            )
                                                    )
                                                    ?.map((e) => ({
                                                        name: e.name,
                                                        value: '',
                                                    })),
                                            ],
                                        },
                                        templateRef: {
                                            name: selectedWorkflow.value.data
                                                .templateName,
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

            const { data, error, isLoading, execute } = createWorkflow(
                body,
                false
            )
            const handleCreate = () => {
                visible.value = false
                message.loading({
                    content: 'Creating new workflow ...',
                    key: `${workflowName.value}`,
                })
                execute(false)

                watch([data, error], (v) => {
                    if (data.value && !error.value && data.value.metadata) {
                        message.success({
                            content: `${workflowName.value} created!`,
                            key: `${workflowName.value}`,
                            duration: 2,
                        })
                        router.push(
                            `/workflows/${data.value.metadata.name}/setup`
                        )
                    } else if (error.value) {
                        const errMsg = error.value?.response?.data?.message
                        message.error({
                            content: `${
                                errMsg ||
                                `Failed to create workflow: "${workflowName.value}"`
                            }`,
                            key: `${workflowName.value}`,
                            duration: 5,
                        })
                    }
                })
            }

            const overview = computed(() => {
                const info = {
                    ...selectedWorkflow.value.data,
                }
                delete info.templates
                delete info.uiConfig
                delete info.logo
                delete info.icon

                return info || {}
            })

            const images = computed(() => ({
                icon: selectedWorkflow.value.data.icon,
                logo: selectedWorkflow.value.data.logo,
            }))

            function init() {
                changeName(selectedWorkflow.value?.data?.templateName)
            }

            watch(selectedWorkflow, init, { deep: true })

            return {
                access,
                overview,
                invalidName,
                workflowTemplate,
                handleSetupWorkflow,
                handleCreate,
                isLoading,
                workflowTemplateError,
                workflowTemplateLoading,
                body,
                images,
                visible,
                workflowName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .icon-btn {
        @apply flex;
        @apply py-2 ml-2 px-3;
        @apply rounded;
        @apply text-gray;
        @apply border border-gray-300;
        @apply cursor-pointer;
        @apply hover:bg-gray-100;
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
            @apply p-0 !important;
        }

        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }

    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
