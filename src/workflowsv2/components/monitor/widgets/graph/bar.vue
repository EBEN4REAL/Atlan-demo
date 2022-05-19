<template>
    <BarChart :chart-data="data" :options="options" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { BarChart } from 'vue-chart-3'

    export default defineComponent({
        components: { BarChart },
        props: {
            data: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            options: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
    })
</script>
