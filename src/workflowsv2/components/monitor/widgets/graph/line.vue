<template>
    <LineChart :chart-data="data" :options="options" />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { LineChart } from 'vue-chart-3'

    export default defineComponent({
        components: { LineChart },
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
