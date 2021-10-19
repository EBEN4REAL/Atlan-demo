<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center" v-if="data.showHeader">
            <p class="mr-1 text-sm font-semibold text-gray-700">
                {{ data?.label }}
            </p>
            <a-tooltip placement="right">
                <template #title>{{ data?.info }}</template>

                <AtlanIcon icon="Info" class="w-4 h-4 my-auto"></AtlanIcon>
            </a-tooltip>
        </div>
        <component
            :is="componentType"
            :data="data"
            :class="data.showHeader ? 'graph-container' : 'h-full'"
        ></component>
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

    import { Widget } from '~/types/reporting/Dashboard'

    const Graph = defineAsyncComponent({
        loader: () => import('@/reporting/widgets/graph.vue'),
    })
    const Default = defineAsyncComponent({
        loader: () => import('@/reporting/widgets/default.vue'),
    })
    const Summary = defineAsyncComponent({
        loader: () => import('@/reporting/widgets/summary.vue'),
    })

    export default defineComponent({
        name: 'Home',
        props: {
            data: {
                type: Object as PropType<Widget>,
                default() {
                    return {}
                },
            },
        },
        components: {
            Graph,
            Default,
            Summary,
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

<style scoped>
    .graph-container {
        height: calc(100% - 10px);
    }
</style>
