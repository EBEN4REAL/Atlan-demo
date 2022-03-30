<template>
    <a-skeleton
        v-if="loading"
        :title="false"
        :paragraph="{ rows: 1 }"
        active
        class="mt-2.5"
    />
    <div v-else class="flex text-gray-500 gap-x-5">
        <template v-if="run">
            <span>
                <AtlanIcon :icon="getRunIconByPhase(run)" class="mb-0.5" />
                Last run
                <span class="text-gray"> {{ startedAt(run, true) }} ago </span>
                by
                <span
                    class="cursor-pointer hover:underline"
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
            </span>

            <div class="flex items-center text-sm text-gray gap-x-1">
                <AtlanIcon icon="Clock" class="mb-0.5" />
                <span v-if="phase(run) === 'Running'" class="italic"
                    >In progress</span
                >
                <span v-else>{{ duration(run) }}</span>
            </div>
        </template>
        <span v-else class="italic">Last run info not available</span>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { avatarUrl } from '~/composables/user/useUsers'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        props: {
            runs: {
                type: Array,
                required: false,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: () => false,
            },
        },
        setup(props) {
            const { runs } = toRefs(props)
            const run = computed(() => runs.value?.[0]?._source || undefined)
            const showCreatorImage = ref(true)

            const {
                startedAt,
                creatorUsername,
                duration,
                phase,
                getRunIconByPhase,
            } = useWorkflowInfo()

            const { openUserSidebar } = useUserPreview()

            return {
                run,
                startedAt,
                creatorUsername,
                openUserSidebar,
                phase,
                showCreatorImage,
                avatarUrl,
                duration,
                getRunIconByPhase,
            }
        },
    })
</script>

<style lang="less" scoped></style>
