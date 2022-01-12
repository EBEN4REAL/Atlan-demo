<template>
    <div class="flex flex-col">
        <SearchAdvanced
            ref="searchBox"
            v-model="queryText"
            :allow-clear="true"
            class="px-3 mb-0"
            placeholder="Search all runs"
            size="default"
        >
        </SearchAdvanced>

        <div class="flex flex-col overflow-auto">
            <template v-for="run in list" :key="run.metadata.name">
                <Item
                    :item="run"
                    class=""
                    @click="handleSelect(run?.metadata?.name)"
                    :selectedValue="selectedValue"
                ></Item>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    import Item from './item.vue'
    import { debouncedWatch } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        components: {
            Item,
            SearchAdvanced,
        },
        props: {
            workflowName: {
                type: Object,
                required: false,
            },
            modelValue: {
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

            const selectedValue = ref('')

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                workflowTemplate: workflowName.value,
            })
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const {} = useWorkflowInfo()
            const dependentKey = ref('default_runs_sidebar')
            const { list, quickChange } = useRunDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                preference,
            })

            const handleSelect = (val) => {
                selectedValue.value = val
                modelValue.value = val
                emit('change')
            }

            watch(list, () => {
                if (!selectedValue.value) {
                    if (list.value?.length > 0) {
                        handleSelect(list.value[0].metadata?.name)
                    }
                }
            })

            debouncedWatch(
                workflowName,
                (prev) => {
                    if (prev) {
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            return {
                workflowName,
                limit,
                offset,
                queryText,
                facets,
                list,
                quickChange,
                modelValue,
                selectedValue,
                handleSelect,
            }
        },
    })
</script>
