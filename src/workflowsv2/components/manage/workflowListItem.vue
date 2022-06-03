<template>
    <div class="wf-list-item" :class="{ selected }">
        <div class="flex items-center gap-x-2">
            <PackageIcon :package="workflow" />
            <div class="truncate">
                <router-link :to="`/workflows/profile/${refName(workflow)}`">
                    <p
                        class="text-sm font-bold truncate text-new-gray-700 hover:underline"
                    >
                        {{ name(workflow) }}
                        <AtlanIcon
                            v-if="dName"
                            icon="CaretRight"
                            class="-ml-1 -mr-0.5 mb-0.5"
                        />
                        <span class="text-primary">{{ dName }}</span>
                    </p>
                </router-link>

                <div
                    class="flex items-center mt-1 text-sm leading-none text-gray-500 gap-x-1"
                >
                    <template v-if="isCronWorkflow(workflow)">
                        <AtlanIcon icon="Schedule" class="text-success" />
                        <span class="ml-1">{{ cronString(workflow) }}</span>
                    </template>
                    <template v-else>
                        <AtlanIcon icon="Unscheduled" />
                        <span class="ml-1">Manually Run</span>
                    </template>
                </div>
            </div>
        </div>
        <a-divider class="my-3" />
        <LastRunSummary :runs="runs" :loading="isRunLoading" />
        <RunIndicators :workflow="wfName(workflow)" :runs="runs" class="mt-3" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, toRefs } from 'vue'
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import RunIndicators from '~/workflowsv2/components/common/runIndicators.vue'
    import LastRunSummary from '~/workflowsv2/components/common/lastRunSummary.vue'
    import PackageIcon from '~/workflowsv2/components/common/packageIcon.vue'

    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'WorkflowListItem',
        components: {
            CreateUpdateInfo,
            RunIndicators,
            LastRunSummary,
            PackageIcon,
        },
        props: {
            workflow: {
                type: Object,
                default: () => {},
            },
            runs: {
                type: Array,
                default: () => [],
            },
            selected: {
                type: Boolean,
                default: () => false,
            },
            isRunLoading: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)

            const workflowStore = useWorkflowStore()

            const {
                displayName,
                isCronWorkflow,
                cronString,
                creatorUsername,
                name: wfName,
                refName,
            } = useWorkflowInfo()

            const { name, icon, emoji, type, identifier } = usePackageInfo()

            const pkg = computed(
                () =>
                    workflowStore.packageMeta?.[identifier(workflow.value)] ||
                    {}
            )

            const dName = computed(() =>
                displayName(
                    pkg.value,
                    wfName(workflow.value),
                    workflow.value?.spec
                )
            )

            return {
                dName,
                name,
                wfName,
                icon,
                emoji,
                type,
                isCronWorkflow,
                cronString,
                creatorUsername,
                pkg,
                refName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .wf-list-item {
        @apply bg-white rounded-lg p-4;
        @apply cursor-pointer;
        @apply transition-colors duration-300;
        @apply border border-new-gray-200;
        // box-shadow: 1px 2px 3px 0px rgba(0, 0, 0, 0.05);

        .badge {
            @apply flex items-center justify-center;
            @apply h-5 rounded uppercase px-2 mx-1;
            @apply text-xs tracking-wider bg-gray-200 text-gray;
        }

        .package-icon {
            @apply rounded-lg border bg-white p-2 flex-none;
        }

        &:hover {
            @apply border-primary;
        }

        &.selected {
            @apply bg-primary-menu border-primary;

            .package-icon {
                @apply border-gray-300;
            }

            .badge {
                @apply bg-white;
            }
        }
    }
</style>
