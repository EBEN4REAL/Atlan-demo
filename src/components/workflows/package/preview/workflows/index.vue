<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-3">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Workflows</span>
        </div>

        <a-input placeholder="Search workflows"></a-input>

        <template v-for="workflow in list" :key="workflow.metadata.name">
            <Item :item="workflow" :packageObject="item"></Item>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, provide, ref, toRefs, watch } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import Item from './item.vue'
    import { debouncedWatch } from '@vueuse/core'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
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
                ui: true,
                packageName:
                    item.value?.metadata.annotations[
                        'package.argoproj.io/name'
                    ],
            })
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const {} = useWorkflowInfo()
            const dependentKey = ref('default_workflows_sidebar')
            const { list, quickChange } = useWorkflowDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
            })

            const dependentKeyRun = ref()
            const facetRun = ref({})
            const aggregationRun = ref(['status'])

            const { quickChange: quickChangeRun, runByWorkflowMap } =
                useRunDiscoverList({
                    isCache: false,
                    dependentKey: dependentKeyRun,
                    facets: facetRun,
                    limit: ref(0),
                    offset,
                    aggregations: aggregationRun,
                    queryText: ref(''),
                    source: ref({
                        excludes: ['spec'],
                    }),
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

            watch(list, () => {
                const map = list.value.map((i) => i?.metadata?.name)
                facetRun.value = {
                    workflowTemplates: map,
                }
                quickChangeRun()
            })

            provide('runMap', runByWorkflowMap)

            return {
                item,
                limit,
                offset,
                queryText,
                facets,
                list,
                quickChange,
                quickChangeRun,
                runByWorkflowMap,
            }
        },
    })
</script>
