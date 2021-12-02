<template>
    <template v-if="selectedTab === 'setup'">
        <div class="relative w-full h-full">
            <div
                v-if="loadingFetchPod"
                class="absolute flex items-center justify-center w-full h-full"
            >
                <AtlanIcon icon="Loader" class="h-5 animate-spin" />
            </div>

            <div
                v-else-if="formConfig[selectedDag]"
                class="flex flex-col h-full"
            >
                <div class="flex-grow m-3">
                    <h3 class="mb-3 text-2xl">{{ selectedDag }}</h3>

                    <FormBuilder
                        ref="formRef"
                        :config="formConfig[selectedDag]"
                        :default-values="defaultValues"
                        :global-values="selectedWorkflow"
                        @change="handleChange"
                    />
                </div>
                <AtlanButton
                    v-if="formChanged"
                    v-auth="access.UPDATE_WORKFLOW"
                    class="m-2"
                    size="sm"
                    color="primary"
                    padding="compact"
                    @click="updateWorkflow"
                >
                    Save
                </AtlanButton>
            </div>
            <div v-else class="flex flex-col items-center h-full">
                <EmptyState
                    empty-screen="EmptyDiscover"
                    desc="No UI config found."
                    desc-class="w-56 text-center"
                />
            </div>
        </div>
    </template>
    <a-tabs
        v-else
        v-model:activeKey="activeKey"
        :class="$style.previewtab"
        tab-position="left"
    >
        <a-tab-pane
            v-for="(tab, index) in filteredTabs"
            :key="index"
            class="overflow-y-auto"
        >
            <template #tab>
                <SidePanelTabHeaders
                    :title="tab.tooltip"
                    :icon="tab.icon"
                    :is-active="activeKey === index"
                />
            </template>

            <div
                class="relative flex flex-col"
                :style="{ height: 'calc(100vh - 3rem)' }"
            >
                <div
                    class="flex items-center justify-between px-4 pt-2 mt-2 text-lg font-semibold text-gray-700"
                >
                    {{ tab.name }}
                </div>

                <component
                    :is="tab.component"
                    :selected-workflow="selectedWorkflow"
                    :is-loaded="isLoaded"
                    @change="emit('change', $event)"
                />
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        ref,
        Ref,
        toRefs,
        watch,
        computed,
        onErrorCaptured,
        provide,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'

    import StatusBadge from '@common/badge/status/index.vue'
    import { useRoute } from 'vue-router'
    import { message } from 'ant-design-vue'
    import access from '~/constant/accessControl/map'
    import EmptyState from '~/components/common/empty/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import AtlanButton from '@/UI/button.vue'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import FormBuilder from '@/common/formGenerator/index.vue'
    import { updateWorkflowByName } from '~/composables/workflow/useWorkflowList'
    import useWorkflowStore from '~/store/workflows'

    export default defineComponent({
        name: 'ProfileWorkflowPreview',
        components: {
            Tooltip,
            EmptyState,
            AssetLogo,
            StatusBadge,
            SidePanelTabHeaders,
            AtlanButton,
            FormBuilder,
            info: defineAsyncComponent(
                () => import('@/workflows/shared/infoTab.vue')
            ),
            runs: defineAsyncComponent(() => import('./tabs/runs/runsTab.vue')),
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
            selectedDag: {
                type: String,
                required: true,
            },
            formConfig: {
                type: Object,
                required: false,
                default: null,
            },
            loadingFetchPod: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['assetMutation', 'closeSidebar', 'change', 'updateSelected'],
        setup(props, { emit }) {
            const { selectedWorkflow, selectedDag, loadingFetchPod } =
                toRefs(props)

            const formRef = ref()

            const route = useRoute()

            const selectedTab = computed(() => route?.params?.tab || '')
            const selectedPreviewTab = computed(() => route?.query?.tab || '')

            const filteredTabs = [
                // {
                //     name: 'Overview',
                //     component: 'info',
                //     icon: 'Overview',
                //     tooltip: 'Overview',
                // },
                {
                    name: 'Run History',
                    component: 'runs',
                    icon: 'ActivityLogs',
                    tooltip: 'Run History',
                },
            ]

            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)
            const formChanged = ref(false)
            provide('creatorDetails', {})
            if (selectedPreviewTab.value === 'runs') activeKey.value = 1

            watch(selectedPreviewTab, (n) => {
                if (n === 'runs') activeKey.value = 1
            })

            function init() {
                isLoaded.value = false
            }

            const body = ref(selectedWorkflow.value)

            const { workflow, error, isLoading, mutate, isReady } =
                updateWorkflowByName(
                    selectedWorkflow.value.metadata.name,
                    body,
                    false
                )

            watch(selectedWorkflow, init, { deep: true })
            onMounted(init)
            const updateWorkflow = async () => {
                const isValid = await formRef.value.validate()
                if (isValid) {
                    message.loading({
                        content: 'Saving ... ',
                        key: `${props.selectedDag}`,
                    })
                    mutate()
                    watch([workflow, error], () => {
                        if (
                            workflow.value &&
                            !error.value &&
                            !isLoading.value
                        ) {
                            message.success({
                                content: `Saved!`,
                                duration: 2,
                                key: `${props.selectedDag}`,
                            })
                            // update the selected workflow
                            emit(
                                'updateSelected',
                                {
                                    ...selectedWorkflow.value,
                                    workflowtemplate: workflow.value,
                                },
                                'success',
                                selectedDag.value
                            )
                        } else if (error.value) {
                            const errMsg = error.value?.response?.data?.message
                            message.error({
                                content: `${errMsg || `Failed to save."`}`,
                                duration: 5,
                                key: `${props.selectedDag}`,
                            })
                        }
                    })
                }
            }
            const handleChange = (v, isInit) => {
                if (!isInit) {
                    formChanged.value = true
                }
                Object.entries(v).forEach(([key, value]) => {
                    const index =
                        body.value.spec?.templates[0]?.dag?.tasks[0]?.arguments?.parameters.findIndex(
                            (e) => e.name === key
                        )
                    if (index > -1)
                        body.value.spec.templates[0].dag.tasks[0].arguments.parameters[
                            index
                        ].value = value
                    else
                        body.value.spec?.templates[0]?.dag?.tasks[0]?.arguments?.parameters?.push(
                            {
                                name: key,
                                value,
                            }
                        )
                })
            }

            const defaultValues = computed(() => {
                const temp = {}
                const { entrypoint } = selectedWorkflow.value.spec
                const valueArr = selectedWorkflow.value.spec.templates.find(
                    (t) => t.name === entrypoint
                ).dag.tasks[0].arguments.parameters
                if (valueArr?.length)
                    valueArr.forEach((v) => {
                        const some = props.formConfig[props.selectedDag]?.find(
                            (c) => c.id === v.name
                        )

                        // eslint-disable-next-line no-prototype-builtins
                        if (some && v.hasOwnProperty('value') && v.value !== '')
                            temp[v.name] = some.stringifyValue
                                ? JSON.parse(v.value)
                                : v.value
                    })
                return temp
            })
            const storeWorkflow = useWorkflowStore()

            onErrorCaptured((err) => {
                const errorMessage = err.message
                storeWorkflow.setError(errorMessage)
                storeWorkflow.setErrorVisible(true)
            })

            return {
                access,
                defaultValues,
                updateWorkflow,
                isReady,
                handleChange,
                selectedTab,
                formRef,
                workflow,
                isLoading,
                isLoaded,
                body,
                activeKey,
                filteredTabs,
                emit,
                formChanged,
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
            display: flex;
            justify-content: center;
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
</style>
