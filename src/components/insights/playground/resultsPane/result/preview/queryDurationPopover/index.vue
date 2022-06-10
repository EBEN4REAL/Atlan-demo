<template>
    <a-popover
        :trigger="'hover'"
        placement="top"
        overlay-class-name="query-duration-popover-insights"
    >
        <slot name="popoverContent"></slot>
        <template #content>
            <div class="flex p-4">
                <div class="w-1/4 pr-5">Duration</div>
                <div class="w-full">
                    <div>
                        <a-progress
                            :success="durationObj"
                            :trail-color="'#E6E6EB'"
                            :percent="durationObj.percent"
                        ></a-progress>
                    </div>

                    <div class="mt-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center pr-5">
                                <div
                                    class="w-2 h-2 mr-2 rounded-full bg-success"
                                ></div>
                                <div>Source execution time</div>
                            </div>
                            <div class="font-bold">
                                {{ durationDetails.executionTimeString }}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex items-center pr-5">
                                <div
                                    class="w-2 h-2 mr-2 bg-gray-300 rounded-full"
                                ></div>
                                <div>Total time</div>
                            </div>
                            <div class="font-bold">
                                {{ durationDetails.totalTimeString }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </a-popover>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        computed,
        PropType,
        ref,
        toRefs,
    } from 'vue'
    import { getDurationStringFromMilliSec } from '~/utils/time'

    // import { useTimer } from '~/components/insights/playground/resultsPane/result/timer/useTimer'

    export default defineComponent({
        components: {},
        props: {
            sourceExecutionTime: {
                type: Number,
                required: true,
            },
            executionTime: {
                type: Number,
                required: true,
            },
        },
        setup(props) {
            const { sourceExecutionTime, executionTime } = toRefs(props)

            const durationDetails = computed(() => {
                const result = {
                    executionTimeString: getDurationStringFromMilliSec(
                        sourceExecutionTime.value ?? ''
                    ),
                    totalTimeString: getDurationStringFromMilliSec(
                        executionTime.value ?? ''
                    ),
                }
                return result
            })

            const getDurationPercent = () => {
                if (sourceExecutionTime.value && executionTime.value) {
                    return (
                        (sourceExecutionTime.value / executionTime.value) *
                        100
                    ).toFixed()
                }
                return 0
            }

            const durationObj = computed(() => ({
                percent: getDurationPercent(),
                strokeColor: '#00A680',
            }))

            return { durationObj, durationDetails }
        },
    })
</script>

<style lang="less">
    .query-duration-popover-insights .ant-popover-content .ant-popover-inner {
        @apply rounded-lg !important;
    }
</style>
<style lang="less" module></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
