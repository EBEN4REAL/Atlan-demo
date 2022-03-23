<template>
    <div class="run-list-item">
        <div class="flex flex-col items-start col-span-5 text-gray-500 gap-y-1">
            <span>{{ run.metadata.name }}</span>
            <div class="flex items-center gap-x-2">
                <span class="font-medium text-primary">{{
                    startedAt(run, false)
                }}</span>
                <template v-if="isCronRun(run)">
                    <AtlanIcon icon="Schedule" class="text-success" />
                    <span class="pt-0.5">Scheduled Run</span>
                </template>
                <template v-else>
                    <span class="pt-0.5">Manual Run by</span>
                    <span
                        class="cursor-pointer hover:underline"
                        @click="() => handleClickUser(createdBy)"
                    >
                        <img
                            v-if="showCreatorImage"
                            :src="imageUrl(creatorUsername(run))"
                            class="flex-none inline-block h-4 rounded-full"
                            @error="showCreatorImage = false"
                        />
                        {{ creatorUsername(run) }}
                    </span>
                </template>
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
    import { defineComponent, PropType, ref } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { useUserPreview } from '~/composables/user/showUserPreview'
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
                cronString,
                isCronRun,
            } = useWorkflowInfo()

            const showCreatorImage = ref(true)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            return {
                getRunTextClass,
                getRunClass,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                useUserPreview,
                imageUrl,
                showCreatorImage,
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
