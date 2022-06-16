<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg' : ''"
    >
        <div
            v-if="item.metadata?.annotations"
            class="flex items-center pb-3 mb-3 border-b border-gray-200"
        >
            <div
                class="relative flex-none w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
            >
                <img
                    v-if="
                        item.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                    class="self-center w-6 h-6"
                    :src="
                        item.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                />
                <span
                    v-else-if="
                        item.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    "
                    class="self-center w-6 h-6"
                >
                    {{
                        item.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    }}</span
                >
                <span v-else class="self-center w-6 h-6">
                    {{ '\ud83d\udce6' }}</span
                >

                <div
                    v-if="
                        item.metadata?.labels[
                            'orchestration.atlan.com/certified'
                        ] === 'true'
                    "
                    class="absolute -right-1 -top-2"
                >
                    <a-tooltip title="Certified" placement="left">
                        <AtlanIcon icon="Verified" class="ml-1"></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>
            <div class="flex flex-col flex-1 overflow-hidden">
                <div class="flex items-center font-semibold">
                    <span class="truncate line-clamp-1">
                        {{
                            item.metadata?.annotations[
                                'orchestration.atlan.com/name'
                            ]
                        }}</span
                    >

                    <a-tooltip
                        placement="right"
                        :title="
                            item.metadata?.annotations[
                                'package.argoproj.io/description'
                            ]
                        "
                    >
                        <AtlanIcon
                            icon="Info"
                            class="flex-none h-3 ml-1"
                        ></AtlanIcon
                    ></a-tooltip>
                </div>
                <span class="text-gray-500">
                    {{ item.metadata.annotations['package.argoproj.io/name'] }}
                </span>
            </div>
        </div>

        <div class="flex flex-col gap-y-2">
            <!-- <div class="text-sm text-gray-700" v-if="workflowList.length > 0">
                {{ workflowList.length }} workflows
            </div> -->

            <template
                v-for="(workflow, index) in workflowRestrictedList"
                :key="workflow"
            >
                <div class="flex flex-col" v-if="index < 2">
                    <div class="flex items-center">
                        <LastRun
                            :item="item"
                            :runs="runs(workflow)"
                            :workflow="workflow"
                        ></LastRun>
                    </div>
                </div>
            </template>

            <div
                class="text-xs text-primary"
                v-if="workflowList?.length - 2 > 0"
            >
                +{{ workflowList?.length - 2 }} more
                <span v-if="workflowList?.length - 2 === 1">workflow</span>
                <span v-else>workflows</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, toRefs } from 'vue'
    import cronstrue from 'cronstrue'
    import RunWidget from './run.vue'
    import LastRun from './lastRun.vue'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import Ellipsis from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'WorkflowItem',
        components: { LastRun, Ellipsis },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            packageObject: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            selectedItem: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const { item, selectedItem, packageObject } = toRefs(props)
            const isSelected = computed(
                () =>
                    item.value?.metadata.name ===
                    selectedItem.value?.metadata.name
            )

            const { creationTimestamp, packageType } = useWorkflowInfo()

            const runMap = inject('runMap')
            const workflowMap = inject('workflowMap')

            const workflowList = computed(() => {
                return workflowMap?.value[
                    item.value.metadata.annotations['package.argoproj.io/name']
                ]
            })

            const workflowRestrictedList = computed(() => {
                let temp = []
                workflowList.value?.forEach((workflow) => {
                    if (runs(workflow)?.length > 0) {
                        runs(workflow)[0].workflow = workflow
                        temp.push(runs(workflow)[0])
                    }
                })

                // temp = temp.sort((x, y) => {
                //     if (
                //         x?._source?.status?.startedAt >
                //         y?._source?.status?.startedAt
                //     )
                //         return -1
                //     if (
                //         x?._source?.status?.startedAt <
                //         y?._source?.status?.startedAt
                //     )
                //         return 0
                // })

                return temp.map((item) => item?.workflow)
            })

            const runs = (workflow) => {
                return runMap.value[workflow]
            }

            const cron = computed(() => {
                return item.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            })

            const cronString = computed(() => {
                if (cron.value) {
                    return cronstrue.toString(cron.value)
                }
            })

            return {
                item,
                isSelected,
                packageObject,
                runMap,
                runs,
                cronString,
                cron,
                creationTimestamp,
                workflowMap,
                workflowList,
                workflowRestrictedList,
                packageType,
            }
        },
    })
</script>

<style lang="less" scoped></style>
