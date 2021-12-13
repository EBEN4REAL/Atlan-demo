import { ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
    updateWorkflowByName,
    runWorkflowByName,
    createWorkflow,
} from '~/composables/workflow/useWorkflowList'
import { Workflows } from '~/services/service/workflows'

export const isWorkflowRunning = ref(false)
export const workflowName = ref('')
const useBulkUpload = ({
    guid = '',
    fileS3Key = '',
    glossaryName = '',
} = {}) => {
    const body = computed(() => ({
        metadata: {
            name: `atlan-gtc-bulk-upload-${guid.slice(-8)}`, // will be static for this usecase
            namespace: 'default',
            labels: {
                'com.atlan.orchestration/atlan-ui': 'true',
            },
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
                        value: guid,
                    },
                    {
                        name: 'glossary-type',
                        value: 'term', // signifies what can be uploaded : term || categories
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
                                            value: guid,
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

    // run workflow after updating
    // can be removed if update workflow endpoint gets ( submit = true attribute)
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
            isWorkflowRunning.value = true
            message.success({
                content: `Starting bulk upload!`,
                duration: 2,
            })
        })
    }

    // create workflow if update worklow fails
    const handleCreateWorkflow = () => {
        const { data, error, execute } = createWorkflow(body, false)
        execute(true)
        watch([data, error], (v) => {
            if (data.value && !error.value) {
                message.success({
                    content: `Starting bulk upload!`,
                    key: `bulkUpload`,
                    duration: 2,
                })
                isWorkflowRunning.value = true
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
    // update workflow on file upload
    const updateWorkflow = () => {
        console.log('updating workflow')
        const { workflow, error, isLoading, mutate } = updateWorkflowByName(
            `atlan-gtc-bulk-upload-${guid.slice(-8)}`,
            body,
            false
        )
        mutate()
        watch([workflow, error], () => {
            if (workflow.value && !error.value && !isLoading.value) {
                run(`atlan-gtc-bulk-upload-${guid.slice(-8)}`)
            } else if (error.value) {
                handleCreateWorkflow()
            }
        })
    }

    const startUpload = () => {
        // CODEFLOW:
        // update workflow -> if error then create workflow ( with submit=true ) and show messgaes accordingly-> if success then run workflow -> show messages accordingly
        updateWorkflow()
        workflowName.value = `atlan-gtc-bulk-upload-${guid.slice(-8)}`
    }

    return { startUpload }
}
export function useArtifacts({ nodeName, outputName, WFRunName }) {
    const params = ref(new URLSearchParams())
    const pathVariables = ref({})

    pathVariables.value = {
        workflowName: WFRunName,
        nodeName,
        outputName,
    }

    const { data, error, isLoading, mutate } = Workflows.getArtifacts({
        pathVariables,
        params,
    })

    return { data, error, isLoading, mutate }
}

export default useBulkUpload
