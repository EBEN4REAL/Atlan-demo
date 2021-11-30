<template>
    <a-drawer
        :visible="isOpen"
        :closable="false"
        :width="720"
        class="drawer-workflow-logs"
        @close="$emit('close')"
    >
        <div
            :class="`close-icon ${!isOpen && 'closed'}`"
            @click="$emit('close')"
        >
            <AtlanIcon
                class="mt-2 ml-2"
                icon="ChevronRight"
                style="width: 24px; height: 24px"
            />
        </div>
        <div class="flex items-center justify-between p-4" style="height: 60px">
            <div class="flex items-center">
                <AtlanIcon
                    class="mr-2"
                    icon="RunHistory"
                    style="width: 24px; height: 24px"
                />
                <h1 class="mr-4 text-lg font-bold">
                    {{ selectedPod?.displayName }}
                </h1>
                <div class="flex text-sm text-gray-500">
                    <span class="mr-2 text-gray-500"
                        >{{ selectedPod?.timecalc }}
                    </span>
                    <div style="color: rgb(196, 196, 196)" class="mr-2">•</div>
                    <span class="text-gray-500">{{
                        podFinishedAt(selectedPod.finishedAt)
                    }}</span>
                    <span>{{ status }}</span>
                </div>
            </div>
            <a-button
                v-if="!isEmptyLogs"
                :disabled="isLoading"
                size="small"
                type="link"
                @click="downloadFile"
                >{{ isDownloading ? 'Downloading...' : 'Download logs' }}
                <AtlanIcon
                    v-if="!isDownloading"
                    icon="ArrowDown"
                    class="inline ml-2"
            /></a-button>
        </div>
        <div class="h-full px-4 clusterize">
            <!-- <div class="flex justify-between p-4 mb-4 border">
                <div>
                    <label class="mr-2" for="">{{
                        isLiveRun ? 'Live' : 'Archived'
                    }}</label>
                    <a-switch @change="isLiveRun = !isLiveRun" />
                </div>
                <div>
                    <a-input-search
                        allow-clear
                        placeholder="Enter run id"
                        enter-button="Fetch"
                        size="large"
                        :default-value="runId"
                        @search="fetchLogs($event)"
                    />
                </div>
            </div> -->
            <div
                v-if="isLoading && !response"
                class="flex items-center justify-center h-full"
            >
                <AtlanIcon icon="Loader" class="h-5 animate-spin" />
            </div>
            <EmptyView
                v-else-if="isEmptyLogs || (!response && !isLoading)"
                :desc="!error ? 'There are no logs for this run. ' : error"
                :empty-screen="
                    isEmptyLogs && !error ? 'EmptyLogs' : 'ErrorLogs'
                "
                desc-class="w-56 text-center"
            />

            <div
                v-else
                id="scrollArea-log"
                class="pb-4 clusterize-scroll"
                style="height: calc(100vh - 70px)"
            >
                <pre
                    id="contentArea-log"
                    class="w-full h-full p-4 font-mono whitespace-normal bg-gray-100 border border-gray-300 rounded-md  clusterize-content"
                >
                  <span v-for="(item, index) in response" :key="index">
                  <span class="no">{{index + 1}}</span>
                  {{item}}
                  </span>
                </pre>
            </div>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import Clusterize from 'clusterize.js'
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import { useArchivedWorkflowRunLogs } from '~/composables/workflow/useWorkflowList'
    import useWorkflowLogsStream from '~/composables/workflow/useWorkflowLogsStream'

    // import WorkflowMixin from '~/mixins/workflow'
    import useWorkFlowHelper from '~/composables/workflow/useWorkFlowHelper'

    export default defineComponent({
        components: { EmptyView },
        // mixins: [WorkflowMixin],
        props: {
            isOpen: { type: Boolean, default: false },
            run: { type: Object, default: () => {} },
            selectedPod: {
                type: Object,
                required: true,
            },
            selectedGraph: {
                type: Object,
                required: false,
                default: () => {},
            },
        },

        emits: ['close'],
        setup(props) {
            const isLiveRun = ref(true)
            const { selectedPod, selectedGraph, isOpen } = toRefs(props)
            const runId = ref('')
            const response = ref([])
            const error = ref(null)
            const isLoading = ref(false)
            const isEmptyLogs = ref(true)

            const { getLiveLogs, status } = useWorkflowLogsStream(
                runId.value
                // '4b7ff4db-1a67-461f-a3dd-68bd163d2fb5'
                // '6032e476-bce5-42fb-a993-f6ffc42d46e9'
            )

            // const fetchLogs = (theId) => {
            //     if (isLiveRun.value) getLiveLogs(theId)
            //     else getLogs(runId.value, podId.value)
            // }

            watch(isOpen, () => {
                if (isOpen.value) {
                    isLoading.value = true
                    isEmptyLogs.value = false
                    response.value = ''
                    const idPod = selectedPod.value.id
                    const idGraph = selectedGraph.value.uid
                    const {
                        data,
                        error: err,
                        // loading,
                        // mutate,
                        // getLogs,
                    } = useArchivedWorkflowRunLogs(true, idGraph, idPod)
                    watch(data, (newVal) => {
                        error.value = ''
                        const formated =
                            typeof newVal === 'string'
                                ? newVal
                                : JSON.stringify(newVal)
                        const longRow = 66
                        const chunks = []
                        for (
                            let i = 0, charsLength = formated.length;
                            i < charsLength;
                            i += longRow
                        ) {
                            chunks.push(formated.substring(i, i + longRow))
                        }
                        response.value = chunks
                        isLoading.value = false
                        setTimeout(() => {
                            // eslint-disable-next-line no-new
                            new Clusterize({
                                scrollId: 'scrollArea-log',
                                contentId: 'contentArea-log',
                            })
                        }, 200)
                        if (!newVal) isEmptyLogs.value = true
                    })

                    watch(err, (newVal) => {
                        isEmptyLogs.value = true
                        isLoading.value = false
                        error.value = newVal
                    })
                }
            })

            // Handling downloads
            const isDownloading = ref(false)
            function downloadString(text, fileType, fileName) {
                isDownloading.value = true
                const blob = new Blob([text], { type: fileType })

                const a = document.createElement('a')
                a.download = fileName
                a.href = URL.createObjectURL(blob)
                a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                setTimeout(() => {
                    URL.revokeObjectURL(a.href)
                    isDownloading.value = false
                }, 1500)
            }

            const downloadFile = () => {
                downloadString(
                    JSON.stringify(response.value),
                    'text/csv',
                    `${
                        selectedPod.value?.displayName
                    }-timestamp-${new Date().getTime()}.txt`
                )
            }

            return {
                status,
                // Archived
                error,
                isLoading,
                response,
                downloadFile,
                isDownloading,
                // settings
                isLiveRun,
                runId,
                selectedPod,
                selectedGraph,
                isEmptyLogs,
                ...useWorkFlowHelper(),
            }
        },
    })
</script>
<style lang="css">
    @import url('clusterize.js/clusterize.css');
</style>
<style lang="less">
    .drawer-workflow-logs {
        .close-icon {
            &.closed {
                display: none;
            }
            background-color: white;
            position: fixed;
            height: 49px;
            width: 23px;
            top: 100px;
            margin-left: -23px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -5px 1px 6px 0px #0000000d;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            cursor: pointer;
        }
        .ant-drawer-body {
            height: 100%;
        }
    }
    pre {
        .clusterize-extra-row {
            display: none;
        }
        counter-reset: line;
        span {
            display: block;
            line-height: 1.5rem;
        }
    }

    pre {
        span {
            .no {
                counter-increment: line;
                content: counter(line);
                display: inline-block;
                //   border-right: 1px solid #ddd;
                padding: 0 0.5em;
                margin-right: 0.5em;
                color: #888;
            }
        }
    }
    .clusterize-scroll {
        max-height: calc(100vh - 60px);
    }
</style>
