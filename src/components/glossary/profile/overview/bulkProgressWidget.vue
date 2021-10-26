<template>
    <div
        v-if="startUpload"
        class="px-3 py-2 mb-10 rounded shadow-sm"
        :class="{ 'border-l-4 border-success': percentage === 100 }"
    >
        <div class="flex items-center justify-between">
            <span v-if="percentage !== 100" class="font-bold">
                Upload progress</span
            >
            <span v-else class="flex items-center font-bold">
                <AtlanIcon icon="wip" class="w-auto h-4 mr-2" />
                Upload completed</span
            >
            <a-button
                v-if="percentage !== 100"
                class="bg-pink-100 text-error"
                size="small"
            >
                Cancel upload
            </a-button>
            <atlan-icon
                v-else
                icon="Cancel"
                class="w-auto h-4 text-gray-500 cursor-pointer"
                @click="startUpload = false"
            />
        </div>
        <span
            v-if="percentage !== 100"
            class="my-2 text-lg font-bold text-primary"
            >{{ percentage }}%</span
        >
        <a-progress
            v-if="percentage !== 100"
            :percent="percentage"
            status="active"
        />
        <div v-else class="mt-2">
            <a-divider class="mt-0 mb-5" />
            <div class="flex items-center mt-2 space-x-2">
                <a-button class="border-0 shadow-none" size="small">
                    30 terms updated
                </a-button>
                <span>|</span>
                <a-button class="border-0 shadow-none" size="small">
                    10 terms created
                </a-button>
                <span>|</span>
                <a-button class="border-0 shadow-none" size="small">
                    10 categories created
                </a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        computed,
        PropType,
        inject,
        watch,
        ref,
    } from 'vue'
    import useWorkflowLiveRun from '@/glossary/profile/overview/useWorkflowLiveRun'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            // data
            const bulkUploadTriggers = inject('bulkUploadTriggers')
            const percentage = ref(20)
            const workflowTemplate = ref()
            let nIntervId

            // methods
            // stop the interval to get progress
            const stopGetProgress = () => {
                clearInterval(nIntervId)
                nIntervId = null
            }
            // get progress fn triggered every 30sec
            const getProgress = () => {
                if (percentage.value < 80) percentage.value += 20
                const { data, error } = useWorkflowLiveRun(
                    workflowTemplate.value
                )
                watch([data, error], (v) => {
                    if (data.value && !error.value) {
                        if (
                            data.value.items[0] &&
                            data.value.items[0].status?.phase === 'Succeeded'
                        )
                            percentage.value = 100
                    } else {
                        console.log('error in getting live run')
                        stopGetProgress()
                    }
                })

                if (percentage.value >= 100) stopGetProgress()
            }
            const triggerUpload = (workflowName) => {
                percentage.value = 20
                workflowTemplate.value = workflowName
                if (!nIntervId) {
                    nIntervId = setInterval(getProgress, 45000)
                }
            }
            watch(
                bulkUploadTriggers?.startUpload,
                () => {
                    if (bulkUploadTriggers?.startUpload?.value) {
                        triggerUpload(bulkUploadTriggers?.workflowName?.value)
                    }
                },
                { immediate: true }
            )
            return {
                startUpload: bulkUploadTriggers?.startUpload,
                percentage,
            }
        },
    })
</script>
