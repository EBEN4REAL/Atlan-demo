<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-3">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Workflows</span>
        </div>

        <a-input placeholder="Search workflows"></a-input>

        <template v-for="workflow in list" :key="workflow.metadata.name">
            <Item :item="workflow"></Item>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import Item from './item.vue'
    import { debouncedWatch } from '@vueuse/core'

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

            debouncedWatch(
                item.value?.metadata?.name,
                (prev) => {
                    console.log('change')
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
