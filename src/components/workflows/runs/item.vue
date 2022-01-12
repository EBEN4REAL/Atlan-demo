<template>
    <div
        class="flex flex-col px-3 py-3 border-b cursor-pointer hover:bg-primary-menu"
        :class="selectedValue === item?.metadata?.name ? 'bg-primary-menu' : ''"
    >
        <div class="flex items-center justify-between">
            <div class="flex flex-col">
                <span
                    class="text-base font-semibold tracking-wide"
                    :class="getRunTextClass(item)"
                    >{{ phase(item) }}</span
                >
                <div
                    class="text-xs text-gray-500"
                    v-if="phase(item) === 'Running'"
                >
                    <span>started {{ startedAt(item, true) }} ago </span>
                </div>
                <div class="text-xs text-gray-700" v-else>
                    <span
                        ><span class="font-semibold"></span>
                        {{ finishedAt(item, true) }} ago ({{
                            duration(item)
                        }})</span
                    >
                </div>
            </div>
            <div
                class="w-5 h-5 p-1 bg-gray-200 rounded"
                :class="getRunClass(item)"
            ></div>
        </div>
        <div class="flex mt-1 text-sm text-gray-500 cursor-pointer">
            <AtlanIcon icon="Link" class="mt-0.5 mr-1"></AtlanIcon>
            {{ shortName(item.metadata.name) }}

            <div class="ml-1 text-gray-500" v-if="isCronRun(item)">
                <span>via <span>Schedule</span></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import Ellipsis from '@/common/ellipsis/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { Ellipsis, AtlanIcon },
        props: {
            item: {
                type: Object,
                required: false,
            },
            selectedValue: {
                type: String,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item, selectedValue } = toRefs(props)

            const {
                creationTimestamp,
                isCronRun,
                getRunClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                getRunBorderClass,
                getRunTextClass,
            } = useWorkflowInfo()
            const shortName = (name) => {
                if (name) {
                    const split = name.split('-')
                    return split[split.length - 1]
                }
                return ''
            }

            return {
                item,
                creationTimestamp,
                isCronRun,
                getRunClass,
                getRunTextClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                shortName,
                getRunBorderClass,
                selectedValue,
            }
        },
    })
</script>
