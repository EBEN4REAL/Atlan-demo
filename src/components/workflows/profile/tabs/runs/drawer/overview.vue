<template>
    <div class="flex flex-col px-3 py-2 bg-white">
        <div class="flex flex-col">
            <p class="text-gray-500">Name</p>
            <div class="mb-2 text-gray-700">
                {{ selectedPod?.name }}
            </div>
        </div>
        <div class="flex flex-col">
            <p class="text-gray-500">Task Type</p>
            <div class="mb-2 text-gray-700">
                {{ selectedPod?.type }}
            </div>
        </div>
        <div class="flex mb-2 gap-x-3">
            <div class="flex flex-col w-full">
                <p class="text-gray-500">Status</p>
                <div class="flex justify-between w-full">
                    <div class="flex items-center">
                        <div
                            class="w-4 h-4 p-1 mr-1 bg-gray-200 rounded shadow"
                            :class="getRunClassByPhase(selectedPod?.phase)"
                        ></div>
                        <p
                            :class="getRunTextClassByPhase(selectedPod?.phase)"
                            class="font-semibold"
                        >
                            {{ selectedPod?.phase }}
                        </p>
                    </div>

                    <AtlanButton2
                        v-if="selectedPod?.type === 'Pod'"
                        label="Logs"
                        color="secondary"
                        @click="handleLogs"
                    />

                    <a-modal
                        :destroyOnClose="true"
                        v-model:visible="isLogVisible"
                        :closable="false"
                        width="80%"
                        :centered="true"
                        :bodyStyle="{
                            height: 'calc(100vh - 100px)',
                        }"
                    >
                        <div class="h-full px-6 py-3">
                            <WorkflowLogs
                                :selectedPod="selectedPod"
                                :selectedRun="selectedRun"
                            ></WorkflowLogs>
                        </div>
                        <template #footer> </template>
                    </a-modal>

                    <!-- <a-button
                        type="danger"
                        v-if="['Running'].includes(phase(selectedRun))"
                        @click="handleStop"
                        >Stop</a-button
                    >

                    <a-button
                        class="text-red-500"
                        v-if="['Failed', 'Error'].includes(phase(selectedRun))"
                        @click="handleRetry"
                        >Retry</a-button
                    > -->
                </div>
            </div>
        </div>
        <div
            v-if="selectedPod?.finishedAt && selectedPod?.startedAt"
            class="flex flex-col gap-y-2"
        >
            <div class="flex flex-col">
                <p class="text-gray-500">Duration</p>
                <p class="mb-2 text-gray-700">
                    {{
                        difference(
                            selectedPod?.startedAt,
                            selectedPod?.finishedAt
                        )
                    }}
                </p>
            </div>
            <div class="flex flex-col">
                <p class="text-gray-500">Started At</p>
                <p class="mb-2 text-gray-700">
                    {{ formatDate(selectedPod?.startedAt) }}
                </p>
            </div>
            <div class="flex flex-col" v-if="selectedPod?.finishedAt">
                <p class="text-gray-500">Finished At</p>
                <p class="mb-2 text-gray-700">
                    {{ formatDate(selectedPod?.finishedAt) }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-gray-500">Reference</p>
                <div class="mb-2 text-gray-700">
                    {{ selectedPod?.id }}
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
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import WorkflowLogs from '../logs.vue'

    export default defineComponent({
        name: 'NodeOverview',
        components: {
            WorkflowLogs,
        },
        // mixins: [WorkflowMixin],
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            selectedRun: {
                type: Object,
                required: true,
            },
        },

        setup() {
            const isLogVisible = ref(false)

            const {
                formatDate,
                difference,
                phase,
                phaseMessage,
                getRunClassByPhase,
                getRunBorderClassByPhase,
                getRunTextClassByPhase,
            } = useWorkflowInfo()

            const handleLogs = () => {
                isLogVisible.value = true
            }

            return {
                formatDate,
                difference,
                phase,
                phaseMessage,
                getRunClassByPhase,
                getRunBorderClassByPhase,
                getRunTextClassByPhase,
                handleLogs,
                isLogVisible,
            }
        },
    })
</script>
