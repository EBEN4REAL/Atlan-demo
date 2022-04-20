<template>
    <div class="wf-list-item" :class="{ selected }">
        <div class="flex items-center gap-x-2">
            <PackageIcon :package="workflow" />
            <div class="truncate">
                <template v-if="minimal">
                    <p class="text-sm font-bold truncate text-new-gray-700">
                        {{ name(workflow) }}
                        <AtlanIcon
                            v-if="dName"
                            icon="CaretRight"
                            class="-ml-1 -mr-0.5 mb-0.5"
                        />
                        <span class="text-primary">{{ dName }}</span>
                    </p>

                    <div
                        class="flex items-center mt-1 text-sm leading-none text-gray-500 gap-x-1"
                    >
                        <template v-if="isCronWorkflow(workflow)">
                            <AtlanIcon icon="Schedule" class="text-success" />
                            <span class="ml-1 pt-0.5">{{
                                cronString(workflow)
                            }}</span>
                        </template>
                        <template v-else>
                            <AtlanIcon icon="User" />
                            <span class="ml-1 pt-0.5">Manual Run</span>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div class="flex items-center gap-x-1">
                        <span class="text-gray-500 truncate">{{
                            name(workflow)
                        }}</span>
                        <div v-if="type(workflow)" class="badge">
                            <span style="margin-top: 1px">{{
                                type(workflow)
                            }}</span>
                        </div>
                    </div>

                    <div class="flex items-center mt-1 gap-x-1">
                        <router-link
                            :to="`/workflows/profile/${wfName(workflow)}`"
                        >
                            <span
                                class="font-bold tracking-wide truncate cursor-pointer text-primary hover:underline"
                                >{{ dName }}</span
                            >
                        </router-link>
                        <span class="italic truncate text-grey-500">
                            ({{ wfName(workflow) }})
                        </span>
                    </div>
                </template>
            </div>
        </div>

        <div
            v-if="!minimal"
            class="flex items-center mt-3 text-sm leading-none text-gray-500 gap-x-1"
        >
            <template v-if="isCronWorkflow(workflow)">
                <AtlanIcon icon="Schedule" class="text-success" />
                <span class="ml-1 pt-0.5">{{ cronString(workflow) }}</span>
            </template>
            <template v-else>
                <AtlanIcon icon="User" />
                <span class="ml-1 pt-0.5">Manually Run</span>
            </template>
            <CreateUpdateInfo
                :created-at="workflow.metadata?.creationTimestamp"
                :created-by="creatorUsername(workflow)"
            />
        </div>
        <a-divider class="my-3" />
        <RunIndicators :workflow="wfName(workflow)" :runs="runs" />
        <LastRunSummary :runs="runs" :loading="isRunLoading" class="mt-2" />
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
            minimal: {
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
            } = useWorkflowInfo()

            const { name, icon, emoji, type, identifier } = usePackageInfo()

            const pkg = computed(
                () =>
                    workflowStore.packageMeta?.[identifier(workflow.value)] ||
                    {}
            )

            const dName = computed(() =>
                displayName(pkg.value, workflow.value?.metadata?.name)
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
            }
        },
    })
</script>
<style lang="less" scoped>
    .wf-list-item {
        @apply bg-white rounded-lg p-4;
        @apply cursor-pointer;
        @apply transition-colors duration-300;
        @apply border border-transparent;

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
