<template>
    <LoadingView v-if="data?.isLoading" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />
    <div v-else class="flex w-full h-full">
        <div class="flex flex-col w-full container-workFlow">
            <Header
                :id="id"
                :workflow="data.asset"
                :creator="creator"
                class="px-5 pt-3 bg-white"
                :logo="logo"
                @open-logs="workflowLogsIsOpen = true"
            />
            <a-tabs
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectTab($event)"
            >
                <a-tab-pane
                    v-for="t in tabs"
                    :key="t.id"
                    class="tabs-workflow"
                    :tab="t.name"
                >
                    <component
                        :is="t.component"
                        v-if="workflowTemplate"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[t.id] = el
                            }
                        "
                        :selected-run-name="selectedRunName"
                        :workflow-template="workflowTemplate"
                        :workflow="id"
                        class="bg-transparent"
                        :selected-dag="selectedDag"
                        :workflow-data="data.asset"
                        :selected-pod="selectedPod"
                        :active-key="activeKey"
                        :form-config="formConfig"
                        :data="data"
                        @change="updateSelected"
                        @openLog="openLog"
                        @setSelectedPod="setSelectedPod"
                        @setSelectedGraph="setSelectedGraph"
                        @set-loading-fetch-pod="setLoadingFetchPod"
                        @handleSetLogo="handleSetLogo"
                    />
                    <!-- <EmptyView
                        v-if="!workflowTemplate && !data?.isLoading"
                        :empty-screen="EmptyScreen"
                        class="-mt-20"
                    /> -->
                </a-tab-pane>
            </a-tabs>
        </div>
        <div
            v-if="isErrorVisible"
            class="border-l border-gray-300 preview-container"
        >
            <EmptyView
                empty-screen="EmptyDiscover"
                :desc="`Invalid config UI found: ${errorCaptured}`"
                desc-class="w-56 text-center"
            />
        </div>
        <div v-else class="border-l border-gray-300 preview-container">
            <ProfilePreview
                v-if="selected"
                :selected-workflow="selected"
                :selected-dag="selectedDag"
                :form-config="formConfig"
                :loading-fetch-pod="loadingFetchPod"
                @change="selectedRunName = $event"
                @updateSelected="updateSelected"
            />
        </div>

        <WorkflowLogs
            ref="workflowLogs"
            :is-open="workflowLogsIsOpen"
            :selected-pod="selectedPod"
            :selected-graph="selectedGraph"
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
        provide,
        ComputedRef,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import EmptyView from '@common/empty/index.vue'
    import { storeToRefs } from 'pinia'
    import ProfilePreview from '@/workflows/profile/preview/preview.vue'
    import Header from '@/workflows/profile/header.vue'
    import { useUsers } from '~/composables/user/useUsers'

    // Composables
    import {
        useWorkflowByName,
        getWorkflowConfigMapByName,
    } from '~/composables/workflow/useWorkflowList'

    import useWorkflowStore from '~/store/workflows'

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
            const graphRef: Ref<Element | null> = ref(null)
            provide('graphRef', graphRef)
            const logo = ref('')
            const activeKey = ref(1)
            const data = ref({})
            const selectedRunName = ref(null)
            const selected = ref(null)
            const selectedDag = ref('')
            const workflowTemplate = ref('')
            const workflowLogsIsOpen = ref(false)
            const refs: { [key: string]: any } = ref({})
            const selectedPod = ref({})
            const selectedGraph = ref({})
            const loadingFetchPod = ref(true)
            const creator = ref({})
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
            ]

            /** UTILS */
            const router = useRouter()
            const route = useRoute()

            /** COMPUTED */
            const id = computed(() => route?.params?.id || '')
            const tab = computed(() => route?.params?.tab || '')
            const formConfig = computed(() => {
                try {
                    if (data.value?.uiConfig) {
                        let configCopy = data.value?.uiConfig || '{}'
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
                } catch (error) {
                    return {}
                }
                return {}
            })

            const templateName = computed(
                () =>
                    data.value?.asset?.workflowtemplate.spec.templates[0].dag
                        .tasks[0].templateRef.name || ''
            )
            const handleSetLogo = (prop) => {
                logo.value = prop
            }
            /** METHODS */
            // selectTab
            const selectTab = (val: number) => {
                activeKey.value = val
                const selectedTab = tabs.find((i) => i.id === val)
                router.replace(
                    `/workflows/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }

            const storeWorkflow = useWorkflowStore()
            const { errorCaptured, isErrorVisible } = storeToRefs(storeWorkflow)
            const openLog = () => {
                workflowLogsIsOpen.value = true
            }
            // setloadingFetchPod

            const setLoadingFetchPod = (prop) => {
                loadingFetchPod.value = prop
            }
            // updateSelected
            const updateSelected = (item, is, current) => {
                if (isErrorVisible) {
                    storeWorkflow.setErrorVisible(false)
                    storeWorkflow.setError('')
                }
                if (is === 'success') {
                    const nodesShared = graphRef?.value?.nodesShared
                    const emitSelectionShared =
                        graphRef?.value?.emitSelectionShared
                    const findIndex = nodesShared.value.findIndex(
                        (el) => el.id === current
                    )
                    if (
                        findIndex !== -1 &&
                        findIndex + 1 <= nodesShared.value.length - 1
                    ) {
                        const nextId = nodesShared.value[findIndex + 1].id
                        emitSelectionShared(nextId)
                    }
                }

                if (is === 'dag') selectedDag.value = item
                else selected.value = item
            }

            // fetchUIConfig
            const fetchUIConfig = () => {
                if (!workflowTemplate.value) return
                const {
                    data: config,
                    error: e,
                    isLoading: l,
                } = getWorkflowConfigMapByName(workflowTemplate.value)

                watch(config, (v) => {
                    if (config.value?.records) {
                        // TODO: Temporary fix - API filter doesn't seem to work

                        const filteredRecords = config.value.records.filter(
                            (x) =>
                                x?.configmap?.data?.templateName ===
                                workflowTemplate.value
                        )

                        data.value.uiConfig =
                            filteredRecords[0]?.configmap?.data?.uiConfig
                    }
                })
            }

            const handleGetUser = (userId) => {
                const params: ComputedRef<{
                    limit?: number
                    offset?: number
                    filter?: any
                    sort?: string
                }> = {
                    limit: 1,
                    offset: 0,
                    sort: 'first_name',
                    filter: {
                        $and: [
                            {
                                $or: [
                                    {
                                        email_verified: true,
                                        id: userId,
                                    },
                                ],
                            },
                        ],
                    },
                }
                const { userList } = useUsers(params, null, {})
                watch(userList, (newVal) => {
                    creator.value = newVal[0]
                })
            }
            // fetch
            const fetch = () => {
                if (selected.value) {
                    fetchUIConfig()
                    return
                }

                const {
                    workflow: response,
                    error,
                    isLoading,
                } = useWorkflowByName(id.value)

                watch(response, (v) => {
                    // useWorkflowByName
                    const usrId =
                        v?.records[0]?.labels['workflows.argoproj.io/creator']
                    handleGetUser(usrId)
                    // getUserList()
                    // watch(userList, (newVal) => {
                    //   console.log(newVal, '<<<sdshdsgdgsdhjs')
                    // })
                    workflowTemplate.value =
                        v.records[0].workflowtemplate.spec?.templates[0]?.dag?.tasks[0]?.templateRef.name
                    data.value.asset = v.records[0]
                    data.value.error = error.value
                    data.value.isLoading = isLoading.value
                    fetchUIConfig()
                    updateSelected(data.value.asset, null, null)
                })
            }

            /** WATCHERS */
            watch(id, (n, o) => {
                if (n && !o) fetch()
            })

            watch(tab, (n, o) => {
                if (!n) return
                const currTab = tabs.find(
                    (i) => i.name.toLowerCase() === n.toLowerCase()
                )
                activeKey.value = currTab.id
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
            const setSelectedPod = (clickedPod) => {
                selectedPod.value = clickedPod
            }
            const setSelectedGraph = (graph) => {
                selectedGraph.value = graph
            }
            return {
                // isLoading,
                emit,
                activeKey,
                selected,
                selectedRunName,
                tabs,
                updateSelected,
                refs,
                selectedDag,
                data,
                selectTab,
                templateName,
                workflowTemplate,
                formConfig,
                workflowLogsIsOpen,
                errorCaptured,
                isErrorVisible,
                openLog,
                setSelectedPod,
                selectedPod,
                setSelectedGraph,
                selectedGraph,
                loadingFetchPod,
                setLoadingFetchPod,
                id,
                creator,
                logo,
                handleSetLogo,
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
            // margin-right: 0px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            // margin-right: 1.25rem;
            @apply ml-5;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-nav) {
            padding-left: 1.75rem;
            margin-bottom: 0px;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
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

<style lang="less">
    .container-workFlow {
        .ant-tabs-tab {
            margin-right: 0px;
        }
        .ant-tabs-tabpane-active {
            overflow: visible !important;
        }
    }
</style>
