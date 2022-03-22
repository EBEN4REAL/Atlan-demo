<template>
    <div class="wf-list-item">
        <div class="flex items-center text-sm gap-x-1">
            <span class="font-bold truncate text-primary">{{ dName }}</span>
            <!-- <span class="text-gray-500">({{ workflow?.metadata?.name }})</span> -->
        </div>

        <div class="flex items-center text-sm gap-x-1">
            <img
                v-if="icon(workflow)"
                :src="icon(workflow)"
                class="w-4 h-auto"
            />
            <span v-else class="w-4 text-xs"> {{ emoji(workflow) }}</span>
            <span class="truncate text-gray">{{ name(workflow) }}</span>
            <div v-if="type(workflow)" class="badge">
                <span style="margin-top: 1px">{{ type(workflow) }}</span>
            </div>
        </div>

        <div
            class="flex items-center mt-2 text-sm leading-none text-gray-500 gap-x-1"
        >
            <template v-if="isCronRun(workflow)">
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
        <RunIndicators :workflow="workflow" :runs="runs" class="mt-2" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import CreateUpdateInfo from '@/common/info/createUpdateInfo.vue'
    import RunIndicators from '~/workflowsv2/components/common/runIndicators.vue'

    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'WorkflowListItem',
        components: { CreateUpdateInfo, RunIndicators },
        props: {
            workflow: {
                type: Object,
                default: () => {},
            },
            runs: {
                type: Array,
                default: () => [],
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const workflowStore = useWorkflowStore()

            const { displayName, isCronRun, cronString, creatorUsername } =
                useWorkflowInfo()
            const { name, icon, emoji, type } = usePackageInfo()

            const pkg = computed(
                () =>
                    workflowStore.packageMeta?.[
                        workflow.value?.metadata?.['package.argoproj.io/name']
                    ] || {}
            )

            const dName = computed(() =>
                displayName(pkg.value, workflow.value?.metadata?.name)
            )

            return {
                dName,
                name,
                icon,
                emoji,
                type,
                isCronRun,
                cronString,
                creatorUsername,
            }
        },
    })
</script>
<style lang="less" scoped>
    .wf-list-item {
        height: 124px;
        @apply flex flex-col gap-y-1;
        @apply bg-white rounded-lg p-4;

        .badge {
            @apply flex items-center justify-center;
            @apply h-5 rounded uppercase px-2 mx-1;
            @apply text-xs bg-gray-200 text-gray;
        }
    }
</style>
