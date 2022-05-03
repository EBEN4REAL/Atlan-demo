<template>
    <div
        class="px-5 pt-3 cursor-pointer hover:bg-primary-menu"
        @click="
            $router.push(
                `/workflows/profile/${workflowTemplateName(
                    run
                )}/runs?name=${name(run)}`
            )
        "
    >
        <div class="flex items-center gap-x-2">
            <span class="font-bold tracking-wide truncate text-primary">{{
                startedAt(run, false)
            }}</span>
            <AtlanIcon :icon="getRunIconByPhase(run)" class="mb-0.5" />
        </div>
        <div class="flex items-center mt-3 text-gray-500 gap-x-1">
            <template v-if="isCronRun(run)">
                <AtlanIcon icon="Schedule" class="text-success" />
                <span>Scheduled Run</span>
            </template>
            <template v-else>
                <AtlanIcon icon="Unscheduled" />
                <span>Manually Run by</span>
                <UserWrapper :username="creatorUsername(run)" @click.stop="" />
            </template>
        </div>
        <div class="flex items-center text-sm text-gray gap-x-1 mt-1.5">
            <AtlanIcon icon="Clock" class="mb-0.5" />
            <span v-if="phase(run) === 'Running'" class="italic"
                >In progress</span
            >
            <span v-else>{{ duration(run) }}</span>

            <AtlanIcon icon="DateTime" class="mb-0.5 ml-3" />
            <span>{{ startedAt(run, true) }}</span>
        </div>
        <div class="w-full h-0 mt-3 border-b" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'

    export default defineComponent({
        name: 'SidebarRunItem',
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
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                phase,
                getRunIconByPhase,
                workflowTemplateName,
                name,
            } = useWorkflowInfo()

            return {
                phase,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                getRunIconByPhase,
                workflowTemplateName,
                name,
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
