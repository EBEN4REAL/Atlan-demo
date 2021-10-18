// eslint-disable-next-line import/prefer-default-export
export const Metadata = {
    id: 'metadata',
    label: 'Metadata Overview',
    widgets: [
        {
            id: 'summary-assets',

            label: 'Summary',
            info: 'New Assets created',
            showHeader: false,
            class: 'col-span-6 h-40 border border-light p-3 rounded ',
            component: 'summary',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp',
                                calendar_interval: 'day',
                                time_zone:
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    maintainAspectRatio: false,
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
            id: 'new-assets',
            label: 'New Assets Distribution',
            info: 'New Assets created',
            class: 'col-span-6 h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp',
                                calendar_interval: 'day',
                                time_zone:
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    maintainAspectRatio: false,
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
            id: 'update-assets',
            label: 'Updated Assets',
            info: 'Assets Updated',
            class: 'col-span-6 h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp.date',
                                calendar_interval: 'day',
                                time_zone:
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
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
                },
                dataOptions: {
                    aggregationKey: 'group_by_date',
                    keyConfig: {
                        type: 'Date',
                    },
                },
            },
        },
    ],
}
