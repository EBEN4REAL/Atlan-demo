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
                        class="mb-2 text-gray-500"
                        v-if="isCronRun(selectedRun)"
                    >
                        <span>via <span>Schedule</span></span>
                    </div>
                    <div
                        class="mb-2 text-gray-500"
                        v-else-if="creatorUsername(selectedRun)"
                    >
                        via
                        {{ creatorUsername(selectedRun) }}
                    </div>

                    <p class="text-gray-500">Reference</p>
                    <a :href="link" target="_blank" class="mb-2 text-primary">
                        {{ name(selectedRun) }}
                    </a>
                    {{ selectedPod.displayName }}
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="failed" tab="Failed Tasks">
            <div
                class="flex flex-col px-3 py-2 bg-white border-b border-l border-r"
            >
                <div v-for="pod in failedPods" :key="pod.name">
                    {{ pod.displayName }}
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, ref, toRefs } from 'vue'

    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'

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
        emits: ['setSelectedGraph', 'setSelectedPod', 'openLog'],
        setup(props, { emit }) {
            const activeKey = ref('summary')
            const { selectedPod, selectedRun } = toRefs(props)
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
            } = useWorkflowInfo()

            const icon = computed(() => {
                if (selectedPod.value.phase) {
                }
            })

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
                Object.keys(selectedRun.value?.status?.nodes).forEach((key) => {
                    if (
                        ['Failed', 'Errpr'].includes(
                            selectedRun.value?.status?.nodes[key].phase
                        )
                    ) {
                        temp.push(selectedRun.value?.status?.nodes[key])
                    }
                })
                console.log('failed', temp)
                return temp
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
