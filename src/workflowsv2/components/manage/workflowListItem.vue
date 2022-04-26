<template>
    <div class="wf-list-item" :class="{ selected }">
        <div class="flex items-center text-sm gap-x-1">
            <img
                v-if="icon(workflow)"
                :src="icon(workflow)"
                class="w-4 h-auto"
            />
            <span v-else class="w-4 text-xs"> {{ emoji(workflow) }}</span>
            <span class="text-gray-500 truncate">{{ name(workflow) }}</span>
            <div v-if="type(workflow)" class="badge">
                <span style="margin-top: 1px">{{ type(workflow) }}</span>
            </div>
        </div>

        <div class="flex items-center text-sm gap-x-1">
            <span
                class="font-bold tracking-wide truncate cursor-pointer text-primary hover:underline"
                >{{ dName }}</span
            >
            <span class="italic truncate text-grey-500">
                ({{ wfName(workflow) }})
            </span>
        </div>

        <div
            class="flex items-center mt-2 text-sm leading-none text-gray-500 gap-x-1"
        >
            <template v-if="isCronWorkflow(workflow)">
                <AtlanIcon icon="Schedule" class="text-success" />
                <span class="ml-1 pt-0.5">{{ cronString(workflow) }}</span>
            </template>
            <template v-else>
                <AtlanIcon icon="User" />
                <span class="ml-1 pt-0.5">Manual Run</span>
            </template>
            <CreateUpdateInfo
                :created-at="workflow.metadata?.creationTimestamp"
                :created-by="creatorUsername(workflow)"
            />
        </div>
        <a-divider class="my-2" />
        <RunIndicators :workflow="wfName(workflow)" :runs="runs" />
        <LastRunSummary :runs="runs" :loading="isRunLoading" class="mt-1" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, toRefs } from 'vue'
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import RunIndicators from '~/workflowsv2/components/common/runIndicators.vue'
    import LastRunSummary from '~/workflowsv2/components/common/lastRunSummary.vue'

    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'WorkflowListItem',
        components: { CreateUpdateInfo, RunIndicators, LastRunSummary },
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
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)

            const isRunLoading = inject<boolean>('isRunLoading')

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
                isRunLoading,
                pkg,
            }
        },
    })
</script>
<style lang="less" scoped>
    .wf-list-item {
        @apply flex flex-col gap-y-1;
        @apply bg-white rounded-lg p-4;
        @apply cursor-pointer;
        @apply transition-colors duration-300;
        @apply border border-transparent;

        .badge {
            @apply flex items-center justify-center;
            @apply h-5 rounded uppercase px-2 mx-1;
            @apply text-xs tracking-wider bg-gray-200 text-gray;
        }

        &:hover {
            @apply border-primary;
        }

        &.selected {
            @apply bg-primary-menu border-primary;
        }
    }
</style>