<template>
    <div class="p-6">
        <p>{{ data.label }}</p>

        <div class="grid grid-cols-12 gap-4">
            <WidgetComponent
                v-for="item in data.widgets"
                :key="item.id"
                :data="item"
            >
            </WidgetComponent>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'
    import { BarChart } from 'vue-chart-3'
    import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
    import { Dashboard } from '~/types/reporting/Dashboard'

    import WidgetComponent from './widget.vue'

    Chart.register(...registerables)

    export default defineComponent({
        name: 'Home',
        props: {
            data: {
                type: Object as PropType<Dashboard>,
                default() {
                    return { id: 'sample', label: 'sample', widgets: [] }
                },
            },
        },
        components: { BarChart, WidgetComponent },
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
                    },
                    y: {
                        grid: {
                            display: false,
                        },
                    },
                },
            })

            const testData = {
                labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
                datasets: [
                    {
                        data: [30, 40, 60, 70, 5],
                        backgroundColor: [
                            '#77CEFF',
                            '#0079AF',
                            '#123E6B',
                            '#97B0C4',
                            '#A5C8ED',
                        ],
                    },
                ],
            }

            return { testData, options, data }
        },
    })
</script>
