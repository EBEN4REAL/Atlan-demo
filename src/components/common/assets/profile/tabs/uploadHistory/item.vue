<template>
    <div class="w-full p-4 my-4 bg-white rounded-lg flex items-center">
        <atlan-icon icon="Upload" class="h-5 mr-2" />
        <div>
            <div class="flex items-center space-x-2">
                <span class="font-bold text-gray-500 font-base">{{
                    name(run)
                }}</span>
                <span
                    class="status-badge text-xs"
                    style="padding: 7px 12px 5px"
                    :class="[getRunTextClass(run), getRunClassBgLight(run)]"
                >
                    <div class="dot" :class="getRunClassBg(run)" />
                    {{
                        runStatusMap[run.status.phase]?.label ||
                        run.status.phase
                    }}
                </span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="flex items-center text-gray-500"
                    ><atlan-icon icon="User" class="h-4 mr-1 mb-0.5" />
                    Initiated by
                    <Avatar
                        :image-url="creatorUsername(run)"
                        :avatar-name="creatorUsername(run)"
                        :avatar-size="16"
                        avatar-shape="circle"
                        class="mx-1"
                    />

                    {{ creatorUsername(run) }}
                </span>
                <span class="text-gray-500 text-xs">{{
                    startedAt(run, true)
                }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        ref,
        PropType,
        computed,
        toRefs,
    } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
    // composables
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    // components
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'UploadHistoryItem',
        components: { Avatar },
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
        },
        setup(props) {
            const {
                displayName,
                getRunTextClass,
                getRunClassBgLight,
                getRunClassBg,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
                packageName,
                name,
            } = useWorkflowInfo()

            return {
                getRunClassBg,
                getRunClassBgLight,
                getRunTextClass,
                runStatusMap,
                startedAt,
                name,
                displayName,
                creatorUsername,
            }
        },
    })
</script>

<style lang="less" scoped>
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
