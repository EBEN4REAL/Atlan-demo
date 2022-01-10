<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-3">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Runs</span>
        </div>

        <a-input placeholder="Search runs"></a-input>
        <div class="flex flex-col gap-y-3">
            <template v-for="run in list" :key="run.metadata.name">
                <Item :item="run"></Item>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    import Item from './item.vue'
    import { debouncedWatch } from '@vueuse/core'

    export default defineComponent({
        components: {
            Item,
        },
        props: {
            item: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                workflowTemplate: item.value?.metadata?.name,
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

            debouncedWatch(
                item.value?.metadata?.name,
                (prev) => {
                    if (prev) {
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            return { item, limit, offset, queryText, facets, list, quickChange }
        },
    })
</script>
