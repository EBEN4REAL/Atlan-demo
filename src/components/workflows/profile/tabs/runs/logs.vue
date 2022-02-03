<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-col h-full py-3 mt-3 bg-gray-100 border rounded">
            <div class="flex justify-between px-4 mb-2 text-gray-700">
                <span class="font-semibold">{{ selectedPod?.name }}</span>
            </div>
            <div
                v-if="status == 'CONNECTING'"
                class="flex items-center justify-center flex-grow"
            >
                <a-spin size="small" class="mr-1"></a-spin>Waiting for logs...
            </div>
            <div
                class="flex flex-col flex-grow px-4 overflow-y-auto text-gray-500"
                v-else
            >
                <div v-for="(log, id) in logArray" :key="id">
                    <span> {{ log }}</span>
                </div>
                <div
                    v-if="status == 'CONNECTED'"
                    class="flex items-center justify-center"
                >
                    <a-spin size="small" class="mr-1"></a-spin>Streaming Logs...
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        onBeforeUnmount,
    } from 'vue'
    import useWorkflowLogsDownload from '~/composables/package/useWorkflowLogsDownload'
    import useWorkflowLogsStream from '~/composables/package/useWorkflowLogsStream'

    export default defineComponent({
        // mixins: [WorkflowMixin],
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            selectedRun: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },

        setup(props, { emit }) {
            const { selectedRun, selectedPod } = toRefs(props)

            const { initClient, connect, logArray, status, error, disconnect } =
                useWorkflowLogsStream()

            // connect()
            watch(
                selectedPod,
                () => {
                    initClient(
                        selectedRun.value.metadata.name,
                        selectedPod.value.id
                    )
                    connect()
                },
                {
                    immediate: true,
                }
            )

            const handleDownload = () => {
                const { data: downloadedLogs } = useWorkflowLogsDownload(
                    {
                        id: selectedRun.value.metadata.name,
                    },
                    { podName: selectedPod.value.id },
                    true
                )
                watch(downloadedLogs, () => {
                    console.log('watch')
                    console.log(downloadedLogs.value)
                })
                // // // credit: https://www.bitdegree.org/learn/javascript-download
                // let logContent = downloadedLogs.value
                //     .map((log) => log?.content)
                //     .join('')
                // console.log(logContent)
                // let filename = `${selectedPod?.value?.name}.txt`
                // let element = document.createElement('a')
                // element.setAttribute(
                //     'href',
                //     'data:text/plain;charset=utf-8,' +
                //         encodeURIComponent(logContent)
                // )
                // element.setAttribute('download', filename)
                // element.style.display = 'none'
                // document.body.appendChild(element)
                // element.click()
                // document.body.removeChild(element)
            }

            onBeforeUnmount(() => {
                disconnect()
            })

            return {
                selectedPod,
                selectedRun,
                handleDownload,
                logArray,
                status,
                error,
                disconnect,
            }
        },
    })
</script>
