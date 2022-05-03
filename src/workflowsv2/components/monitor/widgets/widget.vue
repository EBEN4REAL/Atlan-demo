<template>
    <div
        class="flex flex-col px-5 py-4 bg-white border rounded-lg border-new-gray-300"
    >
        <div class="pb-3 mb-2 border-b border-new-gray-200 text-new-gray-700">
            <p class="text-base font-bold">
                {{ data?.label }}
            </p>
            <p class="text-sm">
                {{ data?.componentData?.filterText?.(filters) }}
            </p>
        </div>
        <component
            :is="componentType"
            :data="data"
            style="height: calc(100% - 64px)"
        />
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        inject,
        PropType,
        Ref,
        toRefs,
    } from 'vue'

    import { WidgetData } from '~/workflowsv2/constants/widgets'

    const Graph = defineAsyncComponent({
        loader: () => import('./widgets/graph.vue'),
    })
    const Default = defineAsyncComponent({
        loader: () => import('./widgets/default.vue'),
    })
    const Summary = defineAsyncComponent({
        loader: () => import('./widgets/summary.vue'),
    })

    export default defineComponent({
        name: 'WidgetWrapper',
        components: {
            Graph,
            Default,
            Summary,
        },
        props: {
            data: {
                type: Object as PropType<WidgetData>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const filters = inject<Ref<Record<string, any>>>('monitorFilters')!

            const componentType = computed(() => {
                if (data.value.component && data.value.component !== '') {
                    return data.value.component
                }
                return 'default'
            })

            return { data, componentType, filters }
        },
    })
</script>
