<template>
    <BarChart :chartData="data" :options="options" />
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { BarChart } from 'vue-chart-3'

    export default defineComponent({
        components: { BarChart },
        props: {
            data: {
                type: Object,
                required: false,
            },
            options: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { data, options } = toRefs(props)
            return { data, options }
        },
    })
</script>
