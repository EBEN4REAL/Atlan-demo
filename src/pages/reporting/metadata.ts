export const Metadata = {
    id: 'Connection',
    label: 'Connection',
    widgets: [
        {
            id: 'Widget A',
            label: 'Widget A',
            class: 'col-span-4 h-64 border border-gray-light',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp',
                                calendar_interval: 'day',
                            },
                        },
                    },
                },
                keyConfig: {
                    type: 'Date',
                },
                aggregationKey: 'group_by_date',
                graphType: 'bar',
                filter: [],
            },
        },
        {
            id: 'Widget B',
            label: 'Widget B',
            class: 'col-span-4 h-64 border border-gray-light',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_type: {
                            terms: {
                                field: '__typeName',
                            },
                        },
                    },
                },
                keyConfig: {
                    type: 'String',
                },
                aggregationKey: 'group_by_type',
                graphType: 'bar',
                filter: [],
            },
        },
        {
            id: 'Widget C',
            label: 'Widget C',
            class: 'col-span-4 h-64 border border-gray-light',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp',
                                calendar_interval: 'day',
                            },
                        },
                    },
                },
                keyConfig: {
                    type: 'Date',
                },
                aggregationKey: 'group_by_date',
                graphType: 'bar',
                filter: [],
            },
        },
    ],
}
