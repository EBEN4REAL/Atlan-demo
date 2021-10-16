<template>
    <template v-if="selectedTab === 'setup'">
        <div v-if="formConfig[selectedDag]" class="flex flex-col h-full">
            <div class="flex-grow m-3">
                <FormBuilder
                    ref="formRef"
                    :config="formConfig[selectedDag]"
                    @change="handleChange"
                    :defaultValues="defaultValues"
                />
            </div>
            <AtlanButton
                class="m-2"
                size="sm"
                color="primary"
                padding="compact"
                @click="updateWorkflow"
            >
                Save
            </AtlanButton>
        </div>
        <div v-else class="flex flex-col items-center">
            <img :src="emptyScreen" alt="No Runs" class="w-2/5 m-auto mb-4" />
            <span class="text-gray-500">No Form found</span>
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
                class="flex flex-col"
                :style="{ height: 'calc(100vh - 7.8rem)' }"
            >
                <div
                    class="flex items-center justify-between px-4 pt-2 mt-2 text-lg font-semibold text-gray-700 "
                >
                    {{ tab.name }}
                </div>

                <component
                    :is="tab.component"
                    :selected-workflow="selectedWorkflow"
                    :is-loaded="isLoaded"
                    @change="emit('change', $event)"
                ></component>
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
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { useRoute } from 'vue-router'
    import { message } from 'ant-design-vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import AtlanButton from '@/UI/button.vue'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import FormBuilder from '@/common/formGenerator/index.vue'
    import { updateWorkflowByName } from '~/composables/workflow/useWorkFlowList'
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'ProfileWorkflowPreview',
        components: {
            Tooltip,
            AssetLogo,
            StatusBadge,
            SidePanelTabHeaders,
            AtlanButton,
            FormBuilder,
            info: defineAsyncComponent(() => import('./tabs/info/infoTab.vue')),
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
        },
        emits: ['assetMutation', 'closeSidebar', 'change'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)

            const formRef = ref()

            const route = useRoute()
            const selectedTab = computed(() => route?.params?.tab || '')

            const filteredTabs = [
                {
                    name: 'Overview',
                    component: 'info',
                    icon: 'Overview',
                    tooltip: 'Overview',
                },
                {
                    name: 'Run History',
                    component: 'runs',
                    icon: 'RunHistory',
                    tooltip: 'Run History',
                },
            ]

            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            function init() {
                isLoaded.value = false
            }

            const body = ref(selectedWorkflow.value.workflowtemplate)

            const { workflow, error, isLoading, mutate, isReady } =
                updateWorkflowByName(selectedWorkflow.value.name, body, false)

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
                        if (workflow.value && !error.value && !isLoading.value)
                            message.success({
                                content: `Saved!`,
                                duration: 2,
                                key: `${props.selectedDag}`,
                            })
                        else if (error.value) {
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
            const handleChange = (v) => {
                Object.entries(v).forEach(([key, value]) => {
                    const index =
                        body.value.spec.arguments.parameters.findIndex(
                            (e) => e.name === key
                        )
                    if (index > -1)
                        body.value.spec.arguments.parameters[index].value =
                            value
                    else
                        body.value.spec.arguments.parameters.push({
                            name: key,
                            value,
                        })
                })
            }

            const defaultValues = computed(() => {
                const temp = {}
                const valueArr =
                    selectedWorkflow.value?.workflowtemplate?.spec?.arguments
                        ?.parameters
                valueArr.forEach((v) => {
                    const some = props.formConfig[props.selectedDag].some(
                        (c) => c.id === v.name
                    )
                    // eslint-disable-next-line no-prototype-builtins
                    if (some && v.hasOwnProperty('value') && v.value !== '')
                        temp[v.name] = v.value
                })
                return temp
            })

            return {
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
                emptyScreen,
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
</style>
