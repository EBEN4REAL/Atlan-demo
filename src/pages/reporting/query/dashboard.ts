// eslint-disable-next-line import/prefer-default-export
export const Metadata = {
    id: 'metadata',
    label: 'Metadata Overview',
    widgets: [
        {
            id: 'total-queries',
            label: 'Total Queries over time',
            info: 'New Assets (last 7 days)',
            showHeader: true,
            class: 'col-span-8 h-40 border border-light px-5 py-3 rounded ',
            component: 'graph',
            queryIndex: 'logs',
            componentData: {
                query: {
                    size: 10,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: 'log.message.startTime',
                                calendar_interval: 'day',
                                offset: '-7d',
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            backgroundColor: '#fff',

                            borderColor: '#f4f6fd',
                            borderRadius: 25,
                            borderWidth: 0.5,
                            color: '#5277d7',
                            // backgroundColor: function (context) {
                            //     return context.dataset.backgroundColor
                            // },

                            clamp: true,
                            padding: {
                                top: 0,
                                bottom: 0,
                            },

                            formatter: Math.round,
                            offset: 20,

                            anchor: 'center',
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
                                display: false,
                                text: 'Date',
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_date',
                    keyConfig: {
                        type: 'Date',
                    },
                },
            },
        },
        {
            id: 'time-assets',
            label: 'Time Distrubution',
            info: 'New Assets (last 7 days)',
            showHeader: true,
            class: 'col-span-8 h-40 border border-light px-5 py-3 rounded ',
            component: 'graph',
            queryIndex: 'logs',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            histogram: {
                                field: 'log.message.totalTime',
                                interval: '100',
                                min_doc_count: 1,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },

                        title: {
                            display: false,
                        },
                    },
                    scales: {},
                },
                dataOptions: {
                    aggregationKey: 'group_by_date',
                    keyConfig: {
                        type: 'RANGE',
                        interval: 100,
                    },
                },
            },
        },
    ],
}
