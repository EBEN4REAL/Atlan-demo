<template>
    <a-tabs
        v-model:activeKey="activeKey"
        type="card"
        :class="$style.previewtab"
    >
        <a-tab-pane key="summary" tab="Summary">
            <div
                class="flex flex-col px-3 py-2 bg-white border-b border-l border-r"
            >
                <div class="flex flex-col">
                    <div class="flex mb-2 gap-x-3">
                        <div class="flex flex-col">
                            <p class="text-gray-500">Status</p>
                            <div class="flex items-center">
                                <div
                                    class="w-4 h-4 p-1 mr-1 bg-gray-200 rounded shadow"
                                    :class="getRunClass(selectedRun)"
                                ></div>
                                <p
                                    :class="getRunTextClass(selectedRun)"
                                    class="font-semibold"
                                >
                                    {{ phase(selectedRun) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p class="text-gray-500">Started At</p>
                    <p class="mb-2 text-gray-700">
                        {{ startedAt(selectedRun, false) }}
                    </p>

                    <p class="text-gray-500">Finished At</p>
                    <p class="mb-2 text-gray-700">
                        {{ finishedAt(selectedRun, false) }}
                    </p>
                    <p class="text-gray-500">Duration</p>
                    <p class="mb-2 text-gray-700">
                        {{ duration(selectedRun, false) }}
                    </p>

                    <p class="text-gray-500">Run Mode</p>
                    <div
                        class="mb-2 text-gray-700"
                        v-if="isCronRun(selectedRun)"
                    >
                        <span>via <span>Schedule</span></span>
                    </div>
                    <div
                        class="mb-2 text-gray-700"
                        v-else-if="creatorUsername(selectedRun)"
                    >
                        via
                        {{ creatorUsername(selectedRun) }}
                    </div>

                    <p class="text-gray-500">Reference</p>
                    <a :href="link" target="_blank" class="mb-2 text-primary">
                        {{ name(selectedRun) }}
                    </a>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="failed" tab="Failed Tasks">
            <div
                class="flex flex-col px-3 py-2 bg-white border-b border-l border-r"
            >
                <div class="flex flex-col gap-y-2">
                    <div class="flex w-full mb-2 gap-x-2">
                        <div class="flex-grow">
                            <a-select
                                ref="select"
                                class="w-full"
                                v-model:value="selectedPodName"
                            >
                                <a-select-option
                                    v-for="pod in failedPods"
                                    :key="pod.name"
                                    >{{ pod.displayName }}</a-select-option
                                >
                            </a-select>
                        </div>

                        <a-button>Logs</a-button>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-gray-500">Name</p>
                        <div class="mb-2 text-gray-700">
                            {{ selectedPod?.name }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-gray-500">Started At</p>
                        <p class="mb-2 text-gray-700">
                            {{ formatDate(selectedPod?.startedAt) }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-gray-500">Finished At</p>
                        <p class="mb-2 text-gray-700">
                            {{ formatDate(selectedPod?.finishedAt) }}
                        </p>
                    </div>
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
                        <p class="text-gray-500">Reference</p>
                        <div class="mb-2 text-gray-700">
                            {{ selectedPod?.id }}
                        </div>
                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'

    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        // mixins: [WorkflowMixin],
        props: {
            selectedRun: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: ['setSelectedGraph', 'openLog'],
        setup(props, { emit }) {
            const selectedPodName = ref('')
            const activeKey = ref('summary')
            const { selectedRun } = toRefs(props)
            const {
                phase,
                startedAt,
                finishedAt,
                duration,
                name,
                isCronRun,
                creatorUsername,
                phaseMessage,
                getRunClass,
                getRunTextClass,
                podFinishedAt,
                difference,
                formatDate,
            } = useWorkflowInfo()

            const link = computed(
                () =>
                    `${
                        window.location.origin
                    }/api/orchestration/workflows/default/${name(
                        selectedRun.value
                    )}`
            )

            const failedPods = computed(() => {
                const temp = []
                if (selectedRun?.value?.metadata?.name) {
                    Object.keys(selectedRun?.value?.status?.nodes).forEach(
                        (key) => {
                            if (
                                ['Failed', 'Error'].includes(
                                    selectedRun.value?.status?.nodes[key].phase
                                ) &&
                                selectedRun.value?.status?.nodes[key].type ===
                                    'Pod'
                            ) {
                                temp.push(selectedRun.value?.status?.nodes[key])
                            }
                        }
                    )
                }

                console.log('failed', temp)
                return temp
            })

            watch(failedPods, () => {
                if (failedPods.value.length > 0) {
                    selectedPodName.value = failedPods.value[0]?.name
                }
            })

            const selectedPod = computed(() => {
                if (selectedPodName.value) {
                    return failedPods.value.find(
                        (i) => i?.name === selectedPodName?.value
                    )
                }
                return {}
            })

            return {
                selectedPod,
                phase,
                startedAt,
                finishedAt,
                duration,
                selectedRun,
                activeKey,
                name,
                link,
                creatorUsername,
                isCronRun,
                phaseMessage,
                getRunClass,
                getRunTextClass,
                failedPods,
                podFinishedAt,
                formatDate,
                difference,
                selectedPodName,
            }
        },
    })
</script>

<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-card) {
            :global(.ant-tabs-tab:not(.ant-tabs-tab-active)) {
                @apply bg-transparent border-0 !important;
            }
            :global(.ant-tabs-tab:first-child) {
                @apply ml-0 !important;
            }
        }
    }
</style>
