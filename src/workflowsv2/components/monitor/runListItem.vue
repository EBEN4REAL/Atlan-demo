<template>
    <div
        class="run-list-item hover:bg-primary-menu text-new-gray-800"
        @click="
            $router.push(
                `/workflows/profile/${workflowTemplateName(run)}/runs?name=${
                    run.metadata.name
                }`
            )
        "
    >
        <div class="flex flex-col items-start col-span-4 text-gray-500 gap-y-1">
            <span class="text-xs">{{ run.metadata.name }}</span>

            <div class="flex items-center gap-x-2">
                <span class="font-medium text-primary">{{
                    startedAt(run, false)
                }}</span>
            </div>
        </div>

        <div class="flex items-center justify-center col-span-1">
            <span
                class="status-badge"
                style="padding: 7px 12px 5px"
                :class="[getRunTextClass(run), getRunClassBgLight(run)]"
            >
                <div class="dot" :class="getRunClassBg(run)" />
                {{ runStatusMap[run.status.phase]?.label || run.status.phase }}
            </span>
        </div>

        <div class="col-span-1 text-new-gray-600">
            <template v-if="isCronRun(run)">
                <AtlanIcon icon="Schedule" class="mr-1 text-success" />
                <span>Scheduled Run</span>
            </template>
            <template v-else>
                <p>Manually Run by</p>
                <UserWrapper :username="creatorUsername(run)" @click.stop />
            </template>
        </div>

        <a-tooltip :title="startedAt(run, false)">
            <div class="flex items-center justify-end col-span-1">
                <span>{{ startedAt(run, true) }}</span>
            </div>
        </a-tooltip>

        <div class="flex items-center justify-end col-span-1">
            <span>{{ duration(run) }}</span>
        </div>
        <!-- <div class="col-span-2">Output</div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
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
                getRunClassBgLight,
                getRunClassBg,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
            } = useWorkflowInfo()

            return {
                getRunTextClass,
                getRunClassBgLight,
                getRunClassBg,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
                runStatusMap,
            }
        },
    })
</script>
<style lang="less" scoped>
    .run-list-item {
        padding: 14px 64px 14px 12px;
        @apply cursor-pointer;
        @apply grid grid-cols-8 items-center gap-x-4;
        @apply text-sm;
    }
    .status-badge {
        @apply flex items-center;
        @apply text-xs font-bold tracking-wider uppercase;
        @apply rounded-full;
    }
    .dot {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-bottom: 2px;
        margin-right: 6px;
    }
</style>
