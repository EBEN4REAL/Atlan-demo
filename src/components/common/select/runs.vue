<template>
    <a-select
        placeholder="Select a run"
        v-model:value="selectedValue"
        :allowClear="true"
        :showSearch="true"
        :filterOption="false"
        @search="handleSearch"
        @change="handleChange"
        :get-popup-container="(target) => target.parentNode"
        notFoundContent="No runs found"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-1" />
        </template>
        <template v-for="item in list" :key="item.metadata?.name">
            <a-select-option :value="item.metadata?.name">
                <div class="flex flex-col">
                    {{ shortName(item.metadata?.name) }}
                    <div class="flex items-center mb-0">
                        <div
                            class="w-4 h-4 p-1 bg-gray-200 rounded shadow"
                            :class="getRunClass(item)"
                        ></div>

                        <div class="flex flex-col flex-grow ml-2">
                            {{ phase(item) }}
                        </div>
                    </div>
                    <div class="text-gray-500" v-if="phase(item) === 'Running'">
                        <span> {{ startedAt(item, true) }} ago </span>
                    </div>
                    <div class="text-gray-700" v-else>
                        <span
                            >{{ finishedAt(item, true) }} ago ({{
                                duration(item)
                            }})</span
                        >
                    </div>

                    <div class="text-gray-500" v-if="isCronRun(item)">
                        <span>via <span>Schedule</span></span>
                    </div>
                    <div>
                        {{ item.metadata.name }}
                    </div>
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
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
            const queryText = ref('')
            const facets = ref({
                workflowTemplate: workflowName.value,
            })

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const dependentKey = ref('default_runs_select')
            const { list, quickChange } = useRunDiscoverList({
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

            const {
                creationTimestamp,
                isCronRun,
                getRunClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                name,
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
                getRunClass,
                getRunTooltip,
                phase,
                finishedAt,
                duration,
                startedAt,
                shortName,
            }
        },
    })
</script>

<style lang="less" scoped></style>
