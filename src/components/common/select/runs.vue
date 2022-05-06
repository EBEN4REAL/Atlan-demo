<template>
    <a-select
        v-model:value="selectedValue"
        :allow-clear="false"
        :show-search="true"
        :filter-option="false"
        :get-popup-container="(target) => target.parentNode"
        not-found-content="No runs found"
        :class="$style.runSelector"
        placeholder="Select a run"
        @search="handleSearch"
        @change="handleChange"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-1" />
        </template>
        <template v-for="item in list" :key="item.metadata?.name">
            <a-select-option :value="item.metadata?.name">
                <div class="flex flex-col overflow-x-hidden">
                    <div class="flex items-center mb-0 truncate gap-x-1">
                        <AtlanIcon
                            :icon="getRunIconByPhase(item)"
                            class="mb-0.5"
                        />

                        {{ startedAt(item, false) }}
                    </div>

                    <div class="text-gray-500" v-if="isCronRun(item)">
                        <span>via <span>Schedule</span></span>
                    </div>
                    <div class="text-gray-500" v-else>
                        manually run by {{ creatorUsername(item) }}
                    </div>
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { until, useVModels } from '@vueuse/core'
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { useRunDiscoverList } from '~/workflows/composables/package/useRunDiscoverList'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import Ellipsis from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { Ellipsis },
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            workflowName: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },

        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { workflowName } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const selectedValue = ref(modelValue.value)

            const limit = ref(20)
            const offset = ref(0)
            const retryCount = ref(2)

            const queryText = ref('')
            const facets = ref({
                workflowTemplate: workflowName.value,
            })

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const dependentKey = ref('default_runs_select')
            const { list, quickChange, isLoading } = useRunDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                preference,
            })

            // console.log(filteredList.value)

            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }

            const handleSearch = (val) => {
                queryText.value = val
                quickChange()
            }

            const shortName = (name) => {
                if (name) {
                    const split = name.split('-')
                    return split[split.length - 1]
                }
                return ''
            }

            const retryFetchList = async () => {
                const found = list.value.findIndex(
                    (ls) => ls?.metadata?.name === modelValue.value
                )

                if (found === -1 && retryCount.value) {
                    quickChange()
                    await until(isLoading).toBe(false)
                    selectedValue.value = modelValue.value
                    retryCount.value -= 1
                    retryFetchList()
                } else {
                    retryCount.value = 2
                }
            }

            watch(list, () => {
                if (!selectedValue.value) {
                    if (list.value?.length > 0) {
                        selectedValue.value = list.value[0].metadata?.name
                        handleChange(list.value[0].metadata?.name)
                    }
                }
            })

            watch(modelValue, () => {
                retryFetchList()
            })

            const {
                creationTimestamp,
                isCronRun,
                getRunIconByPhase,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                name,
                creatorUsername,
            } = useWorkflowInfo()

            return {
                list,
                selectedValue,
                handleChange,
                handleSearch,
                limit,
                offset,
                queryText,
                facets,
                name,
                creationTimestamp,
                isCronRun,
                getRunIconByPhase,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                shortName,
                creatorUsername,
                quickChange,
            }
        },
    })
</script>

<style lang="less" module>
    .runSelector {
        @apply rounded-lg;
        box-shadow: none;
        :global(.ant-select-selector) {
            @apply rounded-lg border-new-gray-300 !important;
            box-shadow: 0px 1px 0px 0px #0000000d;
        }
    }
</style>
