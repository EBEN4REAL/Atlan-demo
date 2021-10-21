<template>
    <LoadingView v-if="isLoading" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-else class="flex w-full h-full">
        <div class="flex flex-col w-full">
            <Header
                :workflow="data.asset"
                class="px-5 pt-3 bg-white"
                @open-logs="workflowLogsIsOpen = true"
            />
            <a-tabs
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectTab($event)"
            >
                <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
                    <component
                        v-if="workflowTemplate"
                        :is="tab.component"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
                        :selected-run-name="selectedRunName"
                        :workflow-template="workflowTemplate"
                        class="bg-transparent"
                        @change="handlePreview"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>

        <div class="border-l border-gray-300 preview-container">
            <ProfilePreview
                v-if="selected"
                :selected-workflow="selected"
                :selected-dag="selectedDag"
                :form-config="formConfig"
                @change="selectedRunName = $event"
            />
        </div>
        <WorkflowLogs
            ref="workflowLogs"
            :is-open="workflowLogsIsOpen"
            @close="workflowLogsIsOpen = false"
        />
    </div>
</template>
<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        defineAsyncComponent,
        watch,
        onMounted,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import EmptyView from '@common/empty/index.vue'
    import ProfilePreview from '@/workflows/profile/preview/preview.vue'
    import Header from '@/workflows/profile/header.vue'

    // Composables
    import {
        useWorkflowByName,
        getWorkflowConfigMap,
    } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        components: {
            EmptyView,
            Header,
            LoadingView,
            ErrorView,
            ProfilePreview,
            setup: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/setup/index.vue')
            ),
            monitor: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/monitor/index.vue')
            ),

            settings: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/settings/index.vue')
            ),
            WorkflowLogs: defineAsyncComponent(
                () => import('@/workflows/profile/workflowLogs.vue')
            ),
        },
        props: {
            id: {
                type: String,
                required: true,
            },
            tab: {
                type: String,
                required: true,
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            /** DATA */
            const activeKey = ref(1)
            const data = ref({})
            const selectedRunName = ref(null)
            const selected = ref(null)
            const selectedDag = ref('')
            const workflowTemplate = ref('')
            const workflowLogsIsOpen = ref(false)
            const refs: { [key: string]: any } = ref({})
            const tabs = [
                {
                    id: 1,
                    name: 'Setup',
                    component: 'setup',
                },
                {
                    id: 2,
                    name: 'Monitor',
                    component: 'monitor',
                },
                {
                    id: 3,
                    name: 'Settings',
                    component: 'settings',
                },
            ]

            /** UTILS */
            const router = useRouter()
            const route = useRoute()

            /** COMPUTED */
            const id = computed(() => route?.params?.id || '')

            const formConfig = computed(() => {
                try {
                    if (data.value?.uiConfig?.length) {
                        let configCopy =
                            data.value.uiConfig[0]?.data?.uiConfig || '{}'
                        configCopy = configCopy
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                        return JSON.parse(configCopy) ?? {}
                    }
                } catch {
                    return {}
                }
                return {}
            })

            const templateName = computed(() => data.value?.asset?.name)

            /** METHODS */
            // selectTab
            const selectTab = (val: number) => {
                activeKey.value = val
                const selectedTab = tabs.find((i) => i.id === val)
                router.replace(
                    `/workflows/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }

            // handlePreview
            const handlePreview = (item, is) => {
                if (is === 'dag') {
                    selectedDag.value = item
                } else selected.value = item
            }

            // fetchUIConfig
            const fetchUIConfig = () => {
                if (!templateName.value) return
                const {
                    data: config,
                    error: e,
                    isLoading: l,
                } = getWorkflowConfigMap(templateName.value)

                watch(config, (v) => {
                    if (config.value?.items)
                        data.value.uiConfig = config.value?.items
                })
            }

            const {
                workflow: response,
                error,
                isLoading,
                mutate,
            } = useWorkflowByName(id.value, false)
            // fetch
            const fetch = () => {
                if (selected.value) {
                    fetchUIConfig()
                    return
                }

                const filter = { name: `${id.value}` }

                const { workflow: response, error } = useWorkflowByName(
                    JSON.stringify(filter)
                )

                watch(response, (v) => {
                    console.log('tab v:', v)
                    // workflowTemplate.value =
                    //     v.records[0].workflowtemplate.spec.templates[0].dag.tasks[0].templateRef.name
                    workflowTemplate.value =
                        v.records[0].workflowtemplate.spec.workflowTemplateRef.name
                    data.value.asset = v.records[0]
                    data.value.error = error.value
                    fetchUIConfig()
                    handlePreview(data.value.asset, null)
                })
            }

            /** WATCHERS */
            watch(id, (n, o) => {
                if (n && !o) fetch()
            })

            /** LIFECYCLES */
            onMounted(async () => {
                await fetch()

                const tab = route?.params?.tab
                if (!tab) return
                const currTab = tabs.find(
                    (i) => i.name.toLowerCase() === tab.toLowerCase()
                )
                activeKey.value = currTab.id
            })

            watch(id, (n, o) => {
                if (n && !o) fetch()
            })

            return {
                isLoading,
                emit,
                activeKey,
                selected,
                selectedRunName,
                tabs,
                handlePreview,
                refs,
                selectedDag,
                data,
                selectTab,
                templateName,
                workflowTemplate,
                formConfig,
                workflowLogsIsOpen,
            }
        },
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 pl-7;
            @apply bg-white;
        }

        :global(.ant-tabs-tabpane) {
            height: 100vh !important;
            // height: calc(100vh - 170px) !important;
            overflow: auto !important;
            @apply pr-0;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 pb-0 !important;
        }
    }
</style>

<style lang="less" scoped>
    .facets {
        min-width: 264px;
        width: 20%;
    }

    .preview-container {
        width: 420px !important;
        min-width: 420px !important;
        max-width: 420px !important;
    }
</style>
