<template>
    <div
        class="w-full h-32 pt-2 mb-10 rounded"
        :class="{
            'border-l-4 border-success': percentage === 100 && !errorCount,
            'border-l-4 border-error':
                (percentage === 100 && errorCount) || percentage === -1,
            hidden: !isVisible,
        }"
    >
        <!-- header  -->
        <div class="flex items-center justify-between px-3">
            {{ isWorkflowRunning }}
            <span
                v-if="percentage !== 100 && percentage !== -1"
                class="font-bold"
            >
                Upload progress</span
            >
            <span
                v-else-if="percentage === -1"
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
                <span class="mx-2 text-gray-400 mb-0.5">|</span>
                <span
                    class="font-normal"
                    :class="{
                        'text-success': !errorCount,
                        'text-error': errorCount,
                    }"
                    >{{ errorCount ? errorCount : 'no' }} issues detected</span
                >
            </span>

            <!-- <a-button
                v-if="percentage !== 100"
                class="bg-pink-100 text-error"
                size="small"
            >
                Cancel upload
            </a-button> -->
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
            class="mx-2"
        />
        <!-- upload failed state -->
        <div
            v-else-if="percentage === -1 && phase === 'Failed'"
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
            <a-divider class="mt-0 mb-5" />
            <div class="flex items-center px-3 mt-2 space-x-2">
                <div class="flex items-center">
                    <AtlanIcon icon="Approve" class="w-auto h-3 mr-2" />
                    <span class="border-0 shadow-none" size="small">
                        {{ totalCount }} terms updated
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
    import { isWorkflowRunning } from `@/glossary/modal/useBulkUpload.ts`

    export default defineComponent({
        name: 'BulkUploadProgress',
        components: { BulkModal },
        props: {},
        setup(props) {
            // data
            const percentage = ref(20)
            const workflowTemplate = ref()
            const totalCount = ref(-1)
            const errorCount = ref(-1)
            const isVisible = ref(true)
            const workflowName = ref()
            const phase = ref()
            const nodeName = ref()
            let nIntervId

            // methods
            // stop the interval to get progress
            const stopGetProgress = () => {
                clearInterval(nIntervId)
                nIntervId = null
            }
            watch(isWorkflowRunning, () => {
                console.log('is running ', isWorkflowRunning)
            })
            // get progress fn triggered every 30sec
            return {
                percentage: 100,
                totalCount: 1,
                errorCount: 0,
                isVisible,
                phase,
                isWorkflowRunning,
            }
        },
    })
</script>
