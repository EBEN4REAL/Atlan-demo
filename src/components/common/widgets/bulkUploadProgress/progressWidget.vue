<template>
    <div
        v-if="workflowPhase !== ''"
        class="w-full bg-white rounded"
        style="height: max-content"
        :class="{
            'border-l-4 border-success':
                workflowPhase === 'Succeeded' &&
                !errorCount &&
                !categoryErrorCount,
            'border-l-4 border-alert':
                (workflowPhase === 'Succeeded' && errorCount) ||
                (workflowPhase === 'Succeeded' && categoryErrorCount),
            'border-l-4 border-error':
                workflowPhase === 'Failed' || workflowPhase === 'Error',
            'border border-gray-200': workflowPhase === 'Running',
            hidden: !isVisible,
        }"
    >
        <!-- header  -->
        <div
            class="flex items-center justify-between px-4 py-2"
            :class="{
                'border-t border-r border-gray-200':
                    workflowPhase !== 'Running',
            }"
        >
            <span v-if="workflowPhase === 'Running'" class="font-bold">
                Upload progress</span
            >
            <span
                v-else-if="
                    workflowPhase === 'Error' || workflowPhase === 'Failed'
                "
                class="flex items-center font-bold"
            >
                <!-- <AtlanIcon icon="RunFailed" class="w-auto h-4 mr-2" /> -->
                Upload Failed
            </span>
            <span
                v-else-if="percentage === 100"
                class="flex items-center font-bold"
            >
                <!-- <AtlanIcon
                    :icon="errorCount ? 'Warning' : 'RunSuccess'"
                    class="w-auto h-4 mr-2"
                /> -->
                Upload completed
                <span
                    v-if="errorCount !== -1 && errorCount !== 0"
                    class="p-0.5 ml-2 text-xs font-normal border-gray-100 border"
                >
                    <AtlanIcon icon="Warning" class="w-auto h-3 mb-0.5" />
                    {{ errorCount }}</span
                >
            </span>
            <span
                class="text-xs text-gray-500 cursor-pointer mt-0.5"
                @click="isVisible = false"
                >CLOSE</span
            >
        </div>
        <!-- body -->
        <!-- WF running state -->
        <span
            v-if="
                percentage !== 100 &&
                percentage !== -1 &&
                workflowPhase === 'Running'
            "
            class="pt-3 pb-2 mx-4 text-lg font-bold text-primary"
            >{{ percentage }}%</span
        >
        <a-progress
            v-if="
                percentage !== 100 &&
                percentage !== -1 &&
                workflowPhase === 'Running'
            "
            :percent="percentage"
            status="active"
            class="p-2 pt-1 pb-3"
        />
        <!-- WF running state end here-->
        <!-- upload failed state -->
        <div
            v-else-if="workflowPhase === 'Error' || workflowPhase === 'Failed'"
            class="px-4 pb-5 bg-gray-100"
        >
            <a-divider class="mt-2 mb-5" />
            <span class="text-gray-500"
                >Sorry, your upload wasn’t completed successfully.
            </span>
            <div class="flex items-center mt-4 space-x-2">
                <BulkModal :entity="entity">
                    <template #trigger>
                        <a-button type="primary" class="px-4 py-1">
                            Retry
                        </a-button>
                    </template>
                </BulkModal>
            </div>
        </div>
        <!-- upload failed state ends here-->

        <div v-else class="px-0 bg-gray-100 border-b border-r border-gray-200">
            <a-divider
                v-if="totalCount !== -1 || categoryCount !== -1"
                class="my-0"
            />
            <div
                v-if="totalCount !== -1"
                class="flex items-center px-4 py-4 space-x-2"
                :class="{ 'pb-3': categoryCount !== -1 }"
            >
                <div class="flex items-center">
                    <AtlanIcon
                        :icon="errorCount ? 'Warning' : 'RunSuccess'"
                        class="w-auto h-3.5 mr-2"
                    />
                    <span
                        class="font-bold text-gray-500 border-0 shadow-none"
                        size="small"
                    >
                        {{ totalCount }} terms uploaded
                    </span>
                </div>
                <span
                    v-if="createdCount || updatedCount || errorCount"
                    class="text-gray-400 mb-0.5 font-bold"
                    >-</span
                >
                <div v-if="updatedCount" class="flex items-center">
                    <span
                        class="text-gray-500 border-0 shadow-none"
                        size="small"
                    >
                        {{ updatedCount }}
                        {{ `${updatedCount > 1 ? 'terms' : 'term'}` }} updated
                    </span>
                </div>
                <span
                    v-if="createdCount && updatedCount"
                    class="px-1 text-gray-400 mb-0.5 text-lg"
                    >|</span
                >
                <div v-if="createdCount" class="flex items-center">
                    <span
                        class="text-gray-500 border-0 shadow-none"
                        size="small"
                    >
                        {{ createdCount }}
                        {{ createdCount > 1 ? 'terms' : 'term' }} created
                    </span>
                </div>
                <span
                    v-if="errorCount && (createdCount || updatedCount)"
                    class="px-1 text-gray-400 mb-0.5 text-lg"
                    >|</span
                >
                <div v-if="errorCount" class="flex items-center">
                    <span
                        class="text-gray-500 border-0 shadow-none text-error"
                        size="small"
                    >
                        {{ errorCount }} Failed
                    </span>
                </div>
            </div>

            <!-- category info row -->
            <div
                v-if="categoryCount > 0"
                class="flex items-center px-4 pb-4 space-x-2"
            >
                <div class="flex items-center">
                    <AtlanIcon
                        :icon="categoryErrorCount ? 'Warning' : 'RunSuccess'"
                        class="w-auto h-3.5 mr-2"
                    />
                    <span
                        class="font-bold text-gray-500 border-0 shadow-none"
                        size="small"
                    >
                        {{ categoryCount }} new categories detected
                    </span>
                </div>
                <span
                    v-if="categoryCreatedCount || categoryErrorCount"
                    class="text-gray-400 mb-0.5 font-bold"
                    >-</span
                >
                <div v-if="categoryCreatedCount" class="flex items-center">
                    <span
                        class="text-gray-500 border-0 shadow-none"
                        size="small"
                    >
                        {{ categoryCreatedCount }} created
                    </span>
                </div>
                <span
                    v-if="categoryErrorCount && createdCount"
                    class="px-1 text-gray-400 mb-0.5 text-lg"
                    >|</span
                >
                <div v-if="categoryErrorCount" class="flex items-center">
                    <span
                        class="text-gray-500 border-0 shadow-none text-error"
                        size="small"
                    >
                        {{ categoryErrorCount }} Failed
                    </span>
                </div>
            </div>

            <span
                class="px-3 text-gray-500"
                v-if="errorCount || categoryErrorCount"
                >Follow the links below to download CSV file containing errors,
                then re-upload once you’re done.</span
            >
            <div
                class="flex items-center px-3 pb-4 mt-4 space-x-3"
                v-if="errorCount || categoryErrorCount"
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
    import { defineComponent, ref, watch ,onMounted,inject} from 'vue'
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
    import { downloadFile } from '~/utils/library/download'

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
            // default to -1 as they can be 0 as well
            const totalCount = ref(-1)
            const updatedCount = ref(-1)
            const errorCount = ref(-1)
            const createdCount = ref(-1)
            const categoryCount = ref(-1)
            const categoryCreatedCount=ref(-1)
            const categoryErrorCount=ref(-1)
            // helpers
            const isVisible = ref(true)
            const workflowPhase = ref('')
            const nodeName = ref()
            const WFRunName=ref()
            const reInitTree=inject('reInitTree')
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
                // gives node containing counts of terms
                const createFinalCsvNode = Object.keys(data.nodes).find(
                    (el) => data.nodes[el].displayName === 'create-final-csv'
                )
                // gives node containing counts of categories
                const extractCategoryStatusNode=Object.keys(data.nodes).find(
                    (el) => data.nodes[el].displayName === 'extract-category-status'
                )
                const finalCategoryStatus=data.nodes[extractCategoryStatusNode]?.outputs?.parameters.find((el) => (el.name = 'status'))
                const finalStatus = data.nodes[
                    createFinalCsvNode
                ]?.outputs?.parameters.find((el) => (el.name = 'status'))
                const statusJson = JSON.parse(finalStatus?.value)
                const categoryStatusJson=JSON.parse(finalCategoryStatus?.value)
                console.log(statusJson)
                console.log(categoryStatusJson)
                // for terms
                totalCount.value = statusJson?.total_count
                errorCount.value = statusJson?.error_count
                updatedCount.value = statusJson?.updated_count
                createdCount.value= statusJson?.created_count
                // for categories
                categoryCount.value =categoryStatusJson?.total_count
                categoryCreatedCount.value=categoryStatusJson?.created_count
                categoryErrorCount.value=categoryStatusJson?.error_count
                nodeName.value = data.nodes[createFinalCsvNode].name
            }
            const resetHelper=()=>{
              totalCount.value = -1
                errorCount.value = -1
                updatedCount.value =-1
                createdCount.value=-1
                // for categories
                categoryCount.value =-1
                categoryCreatedCount.value= -1
                categoryErrorCount.value=-1
                nodeName.value = ''
                percentage.value=20

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
                            WFRunName.value=liveList.value?.items[0]?.metadata?.name
                            getFinalStatus(liveList.value?.items[0].status)
                            reInitTree()
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
                    WFRunName:WFRunName.value,
                    nodeName: nodeName.value,
                    outputName: 'results',
                })
                watch(data, () => {
                    if (data.value && !error.value) {
                   const fileName='Results CSV'
                    downloadFile(data.value, fileName)
                    } else {
                        message.error(
                            `Could not get file!`,
                             5,
                        )
                    }
                })
            }
            // starts the tracking process
            watch(isWorkflowRunning, () => {
                 if (isWorkflowRunning.value === true) {
                    resetHelper()
                    triggerUpload()
                    console.log("triggering")
                }
            })
           onMounted(()=>{
                const { liveList } = getRunList(`atlan-gtc-bulk-upload-${props?.entity?.guid.slice(-8)}` ,false)
                 watch(liveList, () => {
                    if (liveList.value?.items && liveList.value?.items[0]) {
                        const WFPhase= phase(liveList.value?.items[0])
                        console.log(WFPhase)
                        if(WFPhase==='Running')
                        {
                            workflowName.value=`atlan-gtc-bulk-upload-${props?.entity?.guid.slice(-8)}`
                            triggerUpload()
                            percentage.value = Math.round(
                               progressPercent(liveList.value.items[0])
                               )
                            isWorkflowRunning.value='Running'
                            }
                        }
                    // getFinalStatus(liveList.value?.items[0].status)
                    })
            })
            return {
                percentage,
                totalCount,
                createdCount,
                errorCount,
                updatedCount,
                categoryCreatedCount,
                categoryCount ,
                categoryErrorCount,
                isVisible,
                workflowPhase,
                isWorkflowRunning,
                getArtifacts,
                reInitTree
            }
        },
    })
</script>
