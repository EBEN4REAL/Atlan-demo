<template>
    <div>
        <BarChart :chartData="data" :options="options" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { BarChart } from 'vue-chart-3'
    import { Chart, registerables } from 'chart.js'

    Chart.register(...registerables)

    export default defineComponent({
        props: {
            data: {
                type: Object,
                required: false,
            },
        },
        components: { BarChart },
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const options = ref({
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },

                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        grid: {
                            display: false,
                        },
                    },
                },
            })

            // const testData = {
            //     labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
            //     datasets: [
            //         {
            //             data: [30, 40, 60, 70, 5],
            //             backgroundColor: [
            //                 '#77CEFF',
            //                 '#0079AF',
            //                 '#123E6B',
            //                 '#97B0C4',
            //                 '#A5C8ED',
            //             ],
            //         },
            //     ],
            // }

            return { data, options }
        },
    })
</script>
