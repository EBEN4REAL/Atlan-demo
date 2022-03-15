<template>
    <div class="flex h-full overflow-y-hidden">
        <Loader v-if="isLoading" />
        <div
            v-else-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView />
        </div>

        <div
            v-else-if="configMap"
            class="flex-1 h-full overflow-y-hidden bg-white"
        >
            <Setup
                :workflowTemplate="packageObject"
                :workflowObject="workflowObject"
                :configMap="configMapParsed"
                :isEdit="true"
                :defaultValue="getGlobalArguments(workflowObject)"
            ></Setup>
        </div>
        <div
            style="min-width: 420px !important; max-width: 420px !important"
            class="bg-white border-l"
        >
            <div class="flex flex-col px-4 py-4 border-b border-gray-200">
                <div class="flex items-center" style="padding-bottom: 1px">
                    <div class="flex items-center justify-between">
                        <div
                            class="flex items-center flex-grow border-gray-200"
                            v-if="packageObject?.metadata?.annotations"
                        >
                            <div
                                class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                            >
                                <img
                                    v-if="
                                        packageObject?.metadata?.annotations[
                                            'orchestration.atlan.com/icon'
                                        ]
                                    "
                                    class="self-center w-6 h-6"
                                    :src="
                                        packageObject?.metadata?.annotations[
                                            'orchestration.atlan.com/icon'
                                        ]
                                    "
                                />
                                <span
                                    v-else-if="
                                        packageObject?.metadata?.annotations[
                                            'orchestration.atlan.com/emoji'
                                        ]
                                    "
                                    class="self-center w-6 h-6"
                                >
                                    {{
                                        packageObject?.metadata?.annotations[
                                            'orchestration.atlan.com/emoji'
                                        ]
                                    }}</span
                                >
                                <span v-else class="self-center w-6 h-6">
                                    {{ '\ud83d\udce6' }}</span
                                >

                                <div
                                    v-if="
                                        packageObject?.metadata?.labels[
                                            'orchestration.atlan.com/certified'
                                        ] === 'true'
                                    "
                                    class="absolute -right-1 -top-2"
                                >
                                    <a-tooltip
                                        title="Certified"
                                        placement="left"
                                    >
                                        <span>
                                            <AtlanIcon
                                                icon="Verified"
                                                class="ml-1"
                                            ></AtlanIcon
                                        ></span>
                                    </a-tooltip>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <div
                                    class="flex items-center text-base font-semibold leading-none truncate overflow-ellipsis"
                                >
                                    {{
                                        packageObject?.metadata?.annotations[
                                            'orchestration.atlan.com/name'
                                        ]
                                    }}
                                </div>

                                <div class="flex text-gray-500">
                                    {{
                                        packageObject?.metadata.annotations[
                                            'package.argoproj.io/name'
                                        ]
                                    }}
                                    ({{
                                        packageObject?.metadata.labels[
                                            'package.argoproj.io/version'
                                        ]
                                    }})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Preview :item="packageObject"></Preview>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, inject, toRefs } from 'vue'
    import Setup from '~/workflows/components/packages/setup/index.vue'
    import { useConfigMapByName } from '~/workflows/composables/package/useConfigMapByName'
    import Loader from '@/common/loaders/page.vue'
    import ErrorView from '@common/error/discover.vue'
    import Preview from '~/workflows/components/workflows/preview/property/index.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'WorkflowConfig',
        components: { Setup, Loader, ErrorView, Preview },
        // mixins: [WorkflowMixin],
        props: {
            workflowObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            packageObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            // selectedPod: {
            //     type: Object,
            //     required: true,
            // },
            // activeKey: {
            //     type: Number,
            //     required: true,
            // },
        },
        setup(props) {
            const { packageObject } = toRefs(props)
            const refetchWorkflowObject = inject<() => void>(
                'refetchWorkflowObject'
            )
            const isWorkflowDirty = inject('isWorkflowDirty')

            const { getGlobalArguments } = useWorkflowInfo()

            const { isLoading, configMap, error } = useConfigMapByName(
                `${packageObject.value.metadata.name}`,
                true
            )

            const configMapParsed = computed(() => {
                try {
                    return JSON.parse(configMap.value.data.config)
                } catch (e) {
                    console.log(e)
                    return {}
                }
            })

            if (isWorkflowDirty.value) {
                refetchWorkflowObject()
                isWorkflowDirty.value = false
            }

            return {
                configMap,
                isLoading,
                error,
                configMapParsed,
                getGlobalArguments,
            }
        },
    })
</script>

<style lang="less" scoped></style>
