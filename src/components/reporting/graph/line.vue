<template>
    <LineChart :chartData="data" :options="options" />
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { LineChart } from 'vue-chart-3'

    export default defineComponent({
        components: { LineChart },
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

            console.log('bar', data)

            return { data, options }
        },
    })
</script>
