<template>
    <div class="run-list-item hover:bg-primary-menu">
        <div
            class="flex flex-col items-start col-span-5 text-gray-500 cursor-pointer gap-y-1"
        >
            <router-link
                :to="`/workflowsv2/profile/${workflowTemplateName(
                    run
                )}/runs?name=${run.metadata.name}`"
            >
                <span class="text-xs hover:underline">{{
                    run.metadata.name
                }}</span>
            </router-link>
            <div class="flex items-center gap-x-2">
                <span class="font-medium text-primary">{{
                    startedAt(run, false)
                }}</span>
                <template v-if="isCronRun(run)">
                    <AtlanIcon icon="Schedule" class="ml-1 text-success" />
                    <span>Scheduled Run</span>
                </template>
                <template v-else>
                    <span>Manual Run by</span>
                    <UserWrapper :username="creatorUsername(run)" />
                </template>
            </div>
        </div>

        <div class="flex items-center justify-center col-span-1">
            <span
                class="text-xs font-bold tracking-wider uppercase rounded"
                style="padding: 3px 8px 1px"
                :class="[getRunTextClass(run), getRunClass(run)]"
                >{{ run.status.phase }}
            </span>
        </div>
        <a-tooltip :title="startedAt(run, false)">
            <div class="col-span-1">{{ startedAt(run, true) }}</div>
        </a-tooltip>

        <div class="col-span-1">{{ duration(run) }}</div>
        <!-- <div class="col-span-2">Output</div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    import UserWrapper from '~/workflowsv2/components/common/user.vue'

    export default defineComponent({
        name: 'RunListItem',
        components: { UserWrapper },
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
                cronString,
                isCronRun,
                workflowTemplateName,
            } = useWorkflowInfo()

            return {
                getRunTextClass,
                getRunClass,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .run-list-item {
        height: 70px;
        @apply px-3;
        @apply grid grid-cols-8 items-center;
        @apply text-sm;
    }
</style>
