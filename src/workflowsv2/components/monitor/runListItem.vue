<template>
    <div class="run-list-item">
        <div class="flex flex-col items-start col-span-5 gap-y-1">
            <span class="text-gray-500">{{ run.metadata.name }}</span>
            <div class="flex items-center gap-x-3">
                <span class="font-medium text-primary">{{
                    startedAt(run, false)
                }}</span>
                <span class="text-gray"
                    >Created by {{ creatorUsername(run) }}</span
                >
            </div>
        </div>
        <div class="flex items-center col-span-1">
            <span
                class="text-xs font-bold tracking-wider uppercase rounded"
                style="padding: 3px 8px 1px"
                :class="[getRunTextClass(run), getRunClass(run)]"
                >{{ run.status.phase }}
            </span>
        </div>
        <div class="col-span-1">{{ startedAt(run, true) }} ago</div>
        <div class="col-span-1">{{ duration(run) }}</div>
        <div class="col-span-2">Output</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        name: 'RunListItem',
        components: {},
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
        },
        emits: [],
        setup() {
            const {
                getRunTextClass,
                getRunClass,
                duration,
                startedAt,
                creatorUsername,
            } = useWorkflowInfo()

            return {
                getRunTextClass,
                getRunClass,
                duration,
                startedAt,
                creatorUsername,
            }
        },
    })
</script>
<style lang="less" scoped>
    .run-list-item {
        height: 70px;
        @apply px-3;
        @apply grid grid-cols-10 items-center;
        @apply text-sm;
    }
</style>
