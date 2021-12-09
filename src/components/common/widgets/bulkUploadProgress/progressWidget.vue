<template>
    <div
        v-if="workflowPhase !== ''"
        class="w-full pt-2 bg-white rounded"
        style="height: max-content"
        :class="{
            'border-l-4 border-success':
                workflowPhase === 'Succeeded' && !errorCount,
            'border-l-4 border-error':
                (workflowPhase === 'Failed' || workflowPhase === 'Error') &&
                errorCount,
            hidden: !isVisible,
        }"
    >
        <!-- header  -->
        <div class="flex items-center justify-between px-3">
            <span v-if="workflowPhase === 'Running'" class="font-bold">
                Upload progress</span
            >
            <span
                v-else-if="
                    workflowPhase === 'Error' || workflowPhase === 'Failed'
                "
                class="flex items-center font-bold"
            >
                <AtlanIcon icon="RunFailed" class="w-auto h-4 mr-2" />
                Upload not completed
            </span>
            <span
                v-else-if="percentage === 100"
                class="flex items-center font-bold"
            >
                <AtlanIcon
                    :icon="errorCount ? 'RunWarning' : 'RunSuccess'"
                    class="w-auto h-4 mr-2"
                />
                Upload completed
                <span v-if="errorCount !== -1" class="mx-2 text-gray-400 mb-0.5"
                    >|</span
                >
                <span
                    v-if="errorCount !== -1"
                    class="font-normal"
                    :class="{
                        'text-success': !errorCount,
                        'text-error': errorCount,
                    }"
                    >{{ errorCount ? errorCount : 'no' }} issues detected</span
                >
            </span>

            <atlan-icon
                icon="Cancel"
                class="w-auto h-4 text-gray-500 cursor-pointer"
                @click="isVisible = false"
            />
        </div>
        <!-- body -->
        <span
            v-if="percentage !== 100 && percentage !== -1"
            class="pt-3 pb-2 mx-3 text-lg font-bold text-primary"
            >{{ percentage }}%</span
        >
        <a-progress
            v-if="percentage !== 100 && percentage !== -1"
            :percent="percentage"
            status="active"
            class="p-2"
        />
        <!-- upload failed state -->
        <div
            v-else-if="workflowPhase === 'Error' || workflowPhase === 'Failed'"
            class="px-3 pb-5 bg-gray-100"
        >
            <a-divider class="mt-2 mb-5" />
            <span class="text-gray-500"
                >Your upload could not be completed due to an error.
            </span>
            <div class="flex items-center mt-4 space-x-2">
                <BulkModal :entity="entity">
                    <template #trigger>
                        <a-button type="primary" class="px-4 py-1">
                            Upload CSV
                        </a-button>
                    </template>
                </BulkModal>
            </div>
        </div>

        <div
            v-else
            class="px-0 pb-2 mt-2"
            :class="{ 'bg-gray-100': errorCount }"
        >
            <a-divider v-if="totalCount !== -1" class="mt-0 mb-5" />
            <div
                v-if="totalCount !== -1"
                class="flex items-center px-3 mt-2 space-x-2"
            >
                <div class="flex items-center">
                    <AtlanIcon icon="Approve" class="w-auto h-3 mr-2" />
                    <span class="border-0 shadow-none" size="small">
                        {{ totalCount }} terms uploaded
                    </span>
                </div>
                <span v-if="createdCount" class="px-4 text-gray-400 mb-0.5"
                    >|</span
                >
                <div v-if="createdCount" class="flex items-center">
                    <AtlanIcon icon="Approve" class="w-auto h-3 mr-2" />
                    <span class="border-0 shadow-none" size="small">
                        {{ createdCount }} terms created
                    </span>
                </div>
            </div>
            <a-divider class="mt-5 mb-5" v-if="errorCount" />
            <span class="px-3 text-gray-500" v-if="errorCount"
                >Follow the links below to download CSV file containing errors,
                then re-upload once you’re done.</span
            >
            <div
                class="flex items-center px-3 pb-4 mt-4 space-x-3"
                v-if="errorCount"
            >
                <a-button type="primary" class="px-4 py-1" @click="getArtifacts"
                    >Download CSV</a-button
                >
                <BulkModal :entity="entity">
                    <template #trigger>
                        <a-button class="px-4 py-1"> Upload CSV </a-button>
                    </template>
                </BulkModal>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import BulkModal from '~/components/glossary/modal/bulkUploadModal.vue'
    // import useWorkflowLiveRun from '@/glossary/profile/overview/useWorkflowLiveRun'
    // import useArtifacts from '@/glossary/profile/overview/useArtifacts'
    import { message } from 'ant-design-vue'
    import useBulkUpload from `@/glossary/modal/useBulkUpload.ts`
    import {
        isWorkflowRunning,
        workflowName,
        useArtifacts,
    } from `@/glossary/modal/useBulkUpload.ts`
    import { getRunList } from '~/composables/workflow/useWorkflowList'
    import useWorkFlowHelper from '~/composables/workflow/useWorkFlowHelper'

    export default defineComponent({
        name: 'BulkUploadProgress',
        components: { BulkModal },
        props: {
            entity: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            // data
            const percentage = ref(20)
            const workflowTemplateName = ref()
            // data to display after upload complete
            const totalCount = ref(-1)
            const createdCount = ref(-1)
            const updatedCount = ref(-1)
            const errorCount = ref(-1)
            // helpers
            const isVisible = ref(true)
            const workflowPhase = ref('')
            const nodeName = ref()
            let nIntervId
            const { progressPercent, name, phase } = useWorkFlowHelper()

            // methods
            // stop the interval to get progress
            const stopGetProgress = () => {
                clearInterval(nIntervId)
                nIntervId = null
                isWorkflowRunning.value = false
            }
            // returns data to be displayed after upload complete
            const getFinalStatus = (data) => {
                const createFinalCsvNode = Object.keys(data.nodes).find(
                    (el) => data.nodes[el].displayName === 'create-final-csv'
                )
                const finalStatus = data.nodes[
                    createFinalCsvNode
                ]?.outputs?.parameters.find((el) => (el.name = 'status'))
                const statusJson = JSON.parse(finalStatus?.value)
                console.log(statusJson)
                totalCount.value = statusJson.total_count
                errorCount.value = statusJson.error_count
                updatedCount.value = statusJson.updated_count
                createdCount.value = statusJson.created_count
                nodeName.value = data.nodes[createFinalCsvNode].name
            }

            // gets realtime progress of the upload
            const getProgress = () => {
                const { liveList } = getRunList(workflowName.value, false)

                watch(liveList, () => {
                    if (liveList.value?.items && liveList.value?.items[0]) {
                        percentage.value = Math.round(
                            progressPercent(liveList.value.items[0])
                        )
                        workflowPhase.value = phase(liveList.value?.items[0])
                        workflowTemplateName.value = name(
                            liveList.value?.items[0]
                        )
                        if (workflowPhase.value === 'Succeeded') {
                            stopGetProgress()
                            getFinalStatus(liveList.value?.items[0].status)
                        }
                        if (workflowPhase.value === 'Error') {
                            stopGetProgress()
                        }
                    } else {
                        stopGetProgress()
                    }
                })
            }

            const triggerUpload = () => {
                if (!nIntervId) {
                    nIntervId = setInterval(getProgress, 45000)
                    workflowPhase.value = 'Running'
                }
            }

            // gets and downloads the artifacts CSV on errors
            const getArtifacts = () => {
                const { data, error, isLoading, mutate } = useArtifacts({
                    nodeName: nodeName.value,
                    outputName: 'results',
                })
                watch(data, () => {
                    if (data.value && !error.value) {
                        const link = window.document.createElement('a')
                        link.setAttribute(
                            'href',
                            'data:text/csv;charset=utf-8,%EF%BB%BF' +
                                encodeURI(data.value)
                        )
                        link.setAttribute('download', 'upload_data.csv')
                        link.click()
                    } else {
                        message.error({
                            content: `Could not get file!`,
                            duration: 5,
                        })
                    }
                })
            }
            // starts the tracking process
            watch(isWorkflowRunning, () => {
                if (isWorkflowRunning.value === true) {
                    triggerUpload()
                }
            })

            return {
                percentage,
                totalCount,
                createdCount,
                errorCount,
                isVisible,
                workflowPhase,
                isWorkflowRunning,
                getArtifacts,
            }
        },
    })
</script>
