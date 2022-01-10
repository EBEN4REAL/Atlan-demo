<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg' : ''"
    >
        <div class="justify-end pb-3 mb-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <div
                    class="flex items-center flex-grow border-gray-200"
                    v-if="packageObject.metadata?.annotations"
                >
                    <div
                        class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                    >
                        <img
                            v-if="
                                packageObject.metadata?.annotations[
                                    'orchestration.atlan.com/icon'
                                ]
                            "
                            class="self-center w-6 h-6"
                            :src="
                                packageObject.metadata?.annotations[
                                    'orchestration.atlan.com/icon'
                                ]
                            "
                        />
                        <span
                            v-else-if="
                                packageObject.metadata?.annotations[
                                    'orchestration.atlan.com/emoji'
                                ]
                            "
                            class="self-center w-6 h-6"
                        >
                            {{
                                packageObject.metadata?.annotations[
                                    'orchestration.atlan.com/emoji'
                                ]
                            }}</span
                        >
                        <span v-else class="self-center w-6 h-6">
                            {{ '\ud83d\udce6' }}</span
                        >

                        <div
                            v-if="
                                packageObject.metadata?.labels[
                                    'orchestration.atlan.com/certified'
                                ] === 'true'
                            "
                            class="absolute -right-1 -top-2"
                        >
                            <a-tooltip title="Certified" placement="left">
                                <AtlanIcon
                                    icon="Verified"
                                    class="ml-1"
                                ></AtlanIcon>
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="flex flex-col w-2/3">
                        <div
                            class="flex items-center text-sm truncate overflow-ellipsis"
                        >
                            {{
                                packageObject.metadata?.annotations[
                                    'orchestration.atlan.com/name'
                                ]
                            }}
                            <a-tooltip
                                placement="bottomRight"
                                :title="
                                    packageObject.metadata?.annotations[
                                        'package.argoproj.io/description'
                                    ]
                                "
                            >
                                <AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                            ></a-tooltip>
                        </div>

                        <div class="flex text-gray-500">
                            {{
                                item.metadata.annotations[
                                    'package.argoproj.io/name'
                                ]
                            }}
                            ({{
                                item.metadata.labels[
                                    'package.argoproj.io/version'
                                ]
                            }})
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col mb-2">
            <span class="font-semibold leading-none">{{
                item.metadata.name
            }}</span>
            <div class="flex items-center gap-x-2">
                <span class="text-sm text-gray-500"
                    >created {{ creationTimestamp(item, true) }} ago</span
                >
            </div>
        </div>

        <div class="flex items-center justify-between mb-3">
            <LastRun :item="item" :runs="runs"></LastRun>
            <RunWidget :item="item" :runs="runs"></RunWidget>
        </div>
        <div class="flex items-center text-gray-500" v-if="cronString">
            <AtlanIcon icon="Refresh" class="mr-1 -mt-0.5"></AtlanIcon>
            {{ cronString }}
        </div>
        <div class="flex items-center text-gray-500" v-else>
            <AtlanIcon icon="Refresh" class="mr-1 -mt-0.5"></AtlanIcon>
            No Schedule
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, toRefs } from 'vue'
    import RunWidget from './run.vue'
    import LastRun from './lastRun.vue'
    import cronstrue from 'cronstrue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        components: { RunWidget, LastRun },
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

            const { creationTimestamp } = useWorkflowInfo()

            const runMap = inject('runMap')

            const runs = computed(() => {
                return runMap.value[item.value.metadata.name]
            })

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
            }
        },
    })
</script>

<style lang="less" scoped></style>
