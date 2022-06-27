<template>
    <div :id="`viz-${options.id}`" class="w-full h-full"></div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, PropType, toRefs, watch } from 'vue'
    import { Area } from '@antv/g2plot'

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
                const area = new Area(`viz-${options.value.id}`, {
                    data: data.value,
                    ...options.value.componentData.graphConfig,
                })

                area.render()

                watch(data, () => {
                    area.changeData(data.value)
                })
            })
        },
    })
</script>
