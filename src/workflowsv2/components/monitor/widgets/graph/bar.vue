<template>
    <div :id="`viz-${options.id}`" class="w-full h-full"></div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, PropType, toRefs, watch } from 'vue'
    import { Bar } from '@antv/g2plot'

    export default defineComponent({
        name: 'AreaChart',
        props: {
            options: { type: Object, required: true },
            data: {
                type: Array as PropType<Record<string, any>[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props) {
            const { options, data } = toRefs(props)

            onMounted(() => {
                const bar = new Bar(`viz-${options.value.id}`, {
                    data: data.value,
                    renderer: 'svg',
                    minBarWidth: 20,
                    maxBarWidth: 20,
                    barStyle: {
                        radius: [4, 4, 0, 0],
                    },
                    legend: false,
                    ...options.value.componentData.graphConfig,
                })

                bar.render()

                watch(data, () => {
                    bar.changeData(data.value)
                })
            })
        },
    })
</script>
