<template>
    <p>Pie</p>
    <PieChart :chartData="data" :options="options" />
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { PieChart } from 'vue-chart-3'

    export default defineComponent({
        components: { PieChart },
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
            console.log('pie')
            return { data, options }
        },
    })
</script>
