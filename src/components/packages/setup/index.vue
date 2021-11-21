<template>
    <div class="flex w-full h-full">
        <div class="flex flex-1 border-r border-gray-200">
            <div class="flex flex-col w-full">
                <div
                    class="flex flex-col w-full px-6 py-3 border-b border-gray-200 "
                    v-if="workflowTemplate"
                >
                    <div class="mb-1 text-xl font-bold uppercase">
                        Setup Workflow
                    </div>
                    <div
                        class="flex items-center mb-1"
                        v-if="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations
                        "
                    >
                        <img
                            v-if="
                                workflowTemplate?.workflowtemplate.metadata
                                    .annotations['com.atlan.orchestration/icon']
                            "
                            class="self-center w-5 h-auto mr-2"
                            :src="
                                workflowTemplate?.workflowtemplate.metadata
                                    .annotations['com.atlan.orchestration/icon']
                            "
                        />
                        <div class="text-base truncate overflow-ellipsis">
                            {{
                                workflowTemplate?.workflowtemplate.metadata
                                    .annotations['workflows.argoproj.io/name']
                            }}
                        </div>
                    </div>
                </div>
                <div class="flex-1 h-full p-12 bg-primary-light">
                    <div class="flex flex-col p-2 bg-white border rounded-lg">
                        <div class="flex-1 p-4">
                            <DynamicForm
                                :config="formConfig[selectedStep]"
                            ></DynamicForm>
                            <!-- {{ configMap }} -->
                        </div>
                        <div class="flex justify-end p-3 border-t">
                            <a-button type="primary">Next</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-1/3">
            <div
                class="flex flex-col w-full px-6 py-3 mb-3"
                v-if="workflowTemplate"
            >
                <div
                    class="flex items-center mb-1"
                    v-if="
                        workflowTemplate?.workflowtemplate.metadata.annotations
                    "
                >
                    <img
                        v-if="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['com.atlan.orchestration/icon']
                        "
                        class="self-center w-5 h-auto mr-2"
                        :src="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['com.atlan.orchestration/icon']
                        "
                    />
                    <div class="text-base font-bold truncate overflow-ellipsis">
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['workflows.argoproj.io/name']
                        }}
                    </div>
                </div>

                <div class="text-sm line-clamp-4">
                    <span
                        v-if="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations
                        "
                    >
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations[
                                'workflows.argoproj.io/description'
                            ]
                        }}</span
                    >
                </div>
                <div
                    class="flex mt-1 text-gray-500"
                    v-if="
                        workflowTemplate?.workflowtemplate.metadata.annotations
                    "
                >
                    <div class="text-sm truncate overflow-ellipsis">
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations[
                                'com.atlan.orchestration/packageName'
                            ]
                        }}
                    </div>
                    <div class="text-sm truncate overflow-ellipsis">
                        (v{{
                            workflowTemplate?.labels[
                                'org.argopm.package.version'
                            ]
                        }})
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <SetupGraph
                    ref="graphRef"
                    :is-allowto-run="isAllowtoRun"
                    :graph-data="tasks"
                    @change="handleChange($event, 'dag')"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, watch, toRefs, computed } from 'vue'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import SetupGraph from './setupGraph.vue'
    import DynamicForm from '@/common/dynamicForm/index.vue'
    // Composables
    import { useWorkflowTemplateByName } from '~/composables/workflow/useWorkflowList'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph, EmptyView, DynamicForm },
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
            },
            configMap: {
                type: Object,
                required: false,
            },
        },
        emits: ['change', 'openLog', 'handleSetLogo'],
        setup(props, { emit }) {
            const graphRef = inject('graphRef')
            const { workflowTemplate, configMap } = toRefs(props)
            const tasks = computed(() => {
                if (workflowTemplate.value?.workflowtemplate) {
                    const { entrypoint } =
                        workflowTemplate.value?.workflowtemplate.spec
                    return workflowTemplate.value?.workflowtemplate.spec.templates.find(
                        (t) => t.name === entrypoint
                    ).dag.tasks
                }
                return []
            })

            const formConfig = computed(() => {
                try {
                    if (configMap.value.configmap.data.uiConfig) {
                        let configCopy =
                            configMap.value.configmap.data.uiConfig || '{}'
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

            /** DATA */
            // const { data, isLoading } = useWorkflowTemplateByName(
            //     workflowTemplate.value
            // )

            // watch(isLoading, (newVal) => {
            //     emit('setLoadingFetchPod', newVal)
            // })

            const isAllowtoRun = computed(() => {
                let allow = true
                // const data = formConfig.value
                // for (const prop in data) {
                //     const pod = data[prop]
                //     pod.forEach((el) => {
                //         if (el.type !== 'template') {
                //             el.rules?.forEach((elc) => {
                //                 if (elc.type === 'required') {
                //                     const defaultValue =
                //                         dataProp.value?.asset?.workflowtemplate
                //                             ?.spec?.templates[0]?.dag?.tasks[0]
                //                             ?.arguments?.parameters
                //                     const finded = defaultValue.find(
                //                         (d) => d.name === el.id
                //                     )
                //                     if (!finded?.value) {
                //                         allow = false
                //                     }
                //                 }
                //             })
                //         }
                //     })
                // }
                return allow
            })

            const selectedStep = ref('')
            const handleChange = (event) => {
                console.log(event)
                selectedStep.value = event
            }
            // watch(data, (newVal) => {
            //     const meta =
            //         newVal?.workflowtemplate?.metadata?.annotations || {}
            //     const urlLogo = meta['com.atlan.orchestration/logo'] || ''
            //     emit('handleSetLogo', urlLogo)
            //     const { entrypoint } = newVal.workflowtemplate.spec
            //     tasks.value = newVal.workflowtemplate.spec.templates.find(
            //         (t) => t.name === entrypoint
            //     ).dag.tasks
            // })

            return {
                tasks,
                emit,
                graphRef,
                isAllowtoRun,
                workflowTemplate,
                handleChange,
                configMap,
                formConfig,
                selectedStep,
            }
        },
    })
</script>
