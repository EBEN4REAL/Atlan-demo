<template>
    <div
        class="flex flex-col px-5 py-4 bg-white border rounded-lg border-new-gray-300"
    >
        <div class="pb-3 mb-2 border-b border-new-gray-200">
            <p class="text-base font-bold text-new-gray-700">
                {{ data?.label }}
            </p>
        </div>
        <component
            :is="componentType"
            :data="data"
            style="height: calc(100% - 44px)"
        />
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        PropType,
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

            const componentType = computed(() => {
                if (data.value.component && data.value.component !== '') {
                    return data.value.component
                }
                return 'default'
            })

            return { data, componentType }
        },
    })
</script>
