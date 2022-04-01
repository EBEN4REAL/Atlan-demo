<template>
    <div class="px-5 pt-3 cursor-pointer hover:bg-primary-menu">
        <div class="flex items-center gap-x-2">
            <span class="font-bold tracking-wide truncate text-primary">{{
                startedAt(run, false)
            }}</span>
            <AtlanIcon :icon="getRunIconByPhase(run)" class="mb-0.5" />
        </div>
        <div class="flex items-center mt-3 text-gray-500 gap-x-1">
            <template v-if="isCronRun(run)">
                <AtlanIcon icon="Schedule" class="text-success" />
                <span class="pt-0.5">Scheduled Run</span>
            </template>
            <template v-else>
                <span>Manual Run by</span>
                <span
                    class="hover:underline"
                    @click="() => openUserSidebar(creatorUsername(run))"
                >
                    <img
                        v-if="showCreatorImage"
                        :src="avatarUrl(creatorUsername(run))"
                        class="flex-none inline-block h-4 rounded-full"
                        @error="showCreatorImage = false"
                    />
                    {{ creatorUsername(run) }}
                </span>
            </template>
        </div>
        <div class="flex items-center text-sm text-gray gap-x-1 mt-1.5">
            <AtlanIcon icon="Clock" class="mb-0.5" />
            <span v-if="phase(run) === 'Running'" class="italic"
                >In progress</span
            >
            <span v-else>{{ duration(run) }}</span>

            <AtlanIcon icon="DateTime" class="mb-0.5 ml-3" />
            <span>{{ startedAt(run, true) }} ago</span>
        </div>
        <div class="w-full h-0 mt-3 border-b" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { avatarUrl } from '~/composables/user/useUsers'

    export default defineComponent({
        name: 'SidebarRunItem',
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
                getRunClass,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                phase,
                getRunIconByPhase,
            } = useWorkflowInfo()

            const { openUserSidebar } = useUserPreview()

            const showCreatorImage = ref(true)

            return {
                getRunClass,
                phase,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                useUserPreview,
                avatarUrl,
                openUserSidebar,
                showCreatorImage,
                getRunIconByPhase,
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
