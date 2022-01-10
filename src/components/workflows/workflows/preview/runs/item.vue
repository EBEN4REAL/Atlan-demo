<template>
    <div class="">
        <div class="flex items-center mb-0">
            <a-tooltip :title="getRunTooltip(item)">
                <div
                    class="w-4 h-4 p-1 bg-gray-200 rounded shadow"
                    :class="getRunClass(item)"
                ></div>
            </a-tooltip>
            <div
                class="flex flex-col flex-grow ml-2 font-semibold cursor-pointer text-primary"
            >
                <Ellipsis
                    :tooltip-text="item.metadata.name"
                    :rows="1"
                    classes="text-primary cursor-pointer"
                />
            </div>
        </div>
        <div class="text-gray-500" v-if="phase(item) === 'Running'">
            <span>{{ phase(item) }} from {{ startedAt(item, true) }} ago </span>
        </div>
        <div class="text-gray-700" v-else>
            <span
                ><span class="font-semibold">{{ phase(item) }}</span
                >, {{ finishedAt(item, true) }} ago ({{ duration(item) }})</span
            >
        </div>

        <div class="text-gray-500" v-if="isCronRun(item)">
            <span>via <span>Schedule</span></span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import Ellipsis from '@/common/ellipsis/index.vue'
    import AtlanIcon from '../../../../common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { Ellipsis, AtlanIcon },
        props: {
            item: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const {
                creationTimestamp,
                isCronRun,
                getRunClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
            } = useWorkflowInfo()

            return {
                item,
                creationTimestamp,
                isCronRun,
                getRunClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
            }
        },
    })
</script>
