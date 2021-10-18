<template>
    <PreviewHeader
        :name="selectedWorkflow.name"
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
        <a-input
            v-model:value="workflowName"
            :placeholder="`Untitled Workflow`"
            class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
        ></a-input>
        <template #footer>
            <div class="flex items-center justify-end space-x-3">
                <a-button @click="visible = false">Cancel</a-button>
                <a-button
                    type="primary"
                    :loading="isLoading"
                    @click="handleCreate"
                    >Create</a-button
                >
            </div>
        </template>
    </a-modal>

    <div class="flex-grow">
        <Loader v-if="configLoading"></Loader>
        <ErrorView
            v-else-if="!configLoading && configMapError"
            :error="configMapError"
        ></ErrorView>
        <template v-else>
            <div
                class="flex items-center justify-between px-4 pt-2 mt-2 text-lg font-semibold text-gray-700 "
            >
                Overview
            </div>
            <div
                class="w-full px-5 mt-2 overflow-y-auto"
                style="max-height: calc(100vh - 14rem)"
            >
                <span v-for="(v, k) in overview" :key="v" class="mb-2">
                    <div
                        class="mb-1 text-sm tracking-wide text-gray-500 capitalize "
                    >
                        {{ k.split('/')[k.split('/').length - 1] }}:
                    </div>
                    <div v-linkified class="mb-0 text-gray-700 break-all">
                        {{ v }}
                    </div>
                </span>
            </div>
        </template>
    </div>
    <!-- <div class=""> -->
    <AtlanButton
        class="m-2"
        size="sm"
        color="primary"
        padding="compact"
        @click="handleSetupWorkflow"
    >
        Use this template <AtlanIcon icon="ArrowRight" class="inline" />
    </AtlanButton>
    <!-- </div> -->
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
    import {
        createWorkflow,
        getWorkflowConfigMap,
    } from '~/composables/workflow/useWorkFlowList'
    import AtlanButton from '@/UI/button.vue'
    import PreviewHeader from '@/workflows/shared/previewHeader.vue'

    export default defineComponent({
        name: 'SetupWorkflowPreview',
        components: {
            AtlanButton,
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

            const handleSetupWorkflow = () => {
                visible.value = true
            }

            const body = computed(() => ({
                metadata: {
                    name: workflowName.value,
                },
                spec: {
                    arguments: {
                        parameters: [
                            ...selectedWorkflow.value?.workflowtemplate?.spec?.arguments?.parameters
                                // eslint-disable-next-line no-prototype-builtins
                                .filter((p) => !p.hasOwnProperty('value'))
                                .map((e) => ({ name: e.name, value: '' })),
                        ],
                    },
                    workflowTemplateRef: {
                        name: selectedWorkflow.value.name,
                        clusterScope: true,
                    },
                },
            }))

            const { data, error, isLoading, mutate } = createWorkflow(
                body,
                false
            )
            const handleCreate = () => {
                visible.value = false
                message.loading({
                    content: 'Creating new workflow ...',
                    key: `${workflowName.value}`,
                })
                mutate()

                watch([data, error], (v) => {
                    if (data.value && !error.value) {
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

            const {
                data: configMap,
                error: configMapError,
                isLoading: configLoading,
                changeName: mutateConfigMap,
            } = getWorkflowConfigMap(selectedWorkflow.value.name, true)

            const overview = computed(() => {
                const info = {
                    ...(configMap.value?.items?.length &&
                        configMap.value?.items[0]?.data),
                }
                delete info.templates
                delete info.uiConfig
                delete info.logo
                delete info.icon
                return info || {}
            })

            const images = computed(() => ({
                icon:
                    configMap.value?.items?.length &&
                    configMap.value?.items[0]?.data.icon,
                logo:
                    configMap.value?.items?.length &&
                    configMap.value?.items[0]?.data.logo,
            }))

            function init() {
                mutateConfigMap(selectedWorkflow.value.name)
            }

            watch(selectedWorkflow, init, { deep: true })

            return {
                overview,
                handleSetupWorkflow,
                handleCreate,
                configMap,
                isLoading,
                configMapError,
                configLoading,
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

        :global(.ant-tabs-bar) {
            margin-bottom: 0px !important;
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
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-4 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
