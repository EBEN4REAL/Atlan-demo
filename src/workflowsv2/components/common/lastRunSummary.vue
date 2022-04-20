<template>
    <a-skeleton
        v-if="loading"
        :title="false"
        :paragraph="{ rows: 1 }"
        active
        style="height: 22px"
    />
    <div v-else class="flex text-gray-500 gap-x-5">
        <template v-if="run">
            <span>
                <AtlanIcon :icon="getRunIconByPhase(run)" class="mb-0.5" />
                Last run
                <span class="text-gray"> {{ startedAt(run, true) }} </span>
                <template v-if="creatorUsername(run) !== 'argo'">
                    by
                    <UserWrapper :username="creatorUsername(run)" />
                </template>
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
    import { computed, defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'

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
        components: { UserWrapper },
        setup(props) {
            const { runs } = toRefs(props)
            const run = computed(() => runs.value?.[0]?._source || undefined)

            const {
                startedAt,
                creatorUsername,
                duration,
                phase,
                getRunIconByPhase,
            } = useWorkflowInfo()

            return {
                run,
                startedAt,
                creatorUsername,
                phase,
                duration,
                getRunIconByPhase,
            }
        },
    })
</script>

<style lang="less" scoped></style>
