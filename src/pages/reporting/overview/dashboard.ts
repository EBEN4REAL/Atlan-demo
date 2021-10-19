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
            class: 'col-span-4 h-40 border border-light px-5 py-3 rounded ',
            component: 'summary',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_state: {
                            terms: {
                                field: '__state',
                                size: 20,
                            },
                        },
                        sum_state: {
                            sum_bucket: {
                                buckets_path: 'group_by_state._count',
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_state',
                    subAggregationKey: 'group_by_time',
                    sumAggregationValue: 'sum_state',
                    sumAggregationValueDataType: 'int',
                },
            },
        },
        {
            id: 'new-assets',
            label: 'New Assets Distribution(last 7 days)',
            info: 'New Assets (last 7 days)',
            showHeader: true,
            class: 'col-span-8 h-40 border border-light px-5 py-3 rounded ',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_date: {
                            date_histogram: {
                                field: '__timestamp.date',
                                calendar_interval: 'day',
                                offset: '-7d',
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
            id: 'type-assets',
            label: 'SQL Asset Types',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',

            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    query: {
                        terms: {
                            '__typeName.keyword': [
                                'Table',
                                'Column',
                                'Database',
                                'Schema',
                                'View',
                                'MaterialisedView',
                                'ParititionTable',
                            ],
                        },
                    },
                    aggs: {
                        group_by_typename: {
                            terms: {
                                field: '__typeName.keyword',
                                size: 50,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },

                            title: {
                                display: false,
                                text: 'Date',
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_typename',
                },
            },
        },
        {
            id: 'connector-assets',
            label: 'Top 5 Sources',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',

            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    query: {
                        bool: {
                            filter: [
                                {
                                    bool: {
                                        must_not: [
                                            {
                                                term: {
                                                    'Asset.connectorName': '',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    aggs: {
                        group_by_connector: {
                            terms: {
                                field: 'Asset.connectorName',
                                size: 50,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_connector',
                },
            },
        },
        {
            id: 'connection-assets',
            label: 'Top 5 Connections',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    query: {
                        bool: {
                            filter: [
                                {
                                    bool: {
                                        must_not: [
                                            {
                                                term: {
                                                    'Asset.connectionName': '',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    aggs: {
                        group_by_connector: {
                            terms: {
                                field: 'Asset.connectionName',
                                size: 50,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_connector',
                },
            },
        },
        {
            id: 'classification-assets',
            label: 'Top 5 classifications',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_traits: {
                            terms: {
                                field: '__traitNames',
                                size: 20,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_traits',
                },
            },
        },
        {
            id: 'created-assets',
            label: 'Top 5 Creators',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_traits: {
                            terms: {
                                field: '__createdBy',
                                size: 5,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_traits',
                },
            },
        },
        {
            id: 'terms-assets',
            label: 'Top 5 terms',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_traits: {
                            terms: {
                                field: '__meanings',
                                size: 20,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_traits',
                },
            },
        },
        {
            id: 'certificate-assets',
            label: 'Top 5 terms',
            info: 'Asset Types',
            showHeader: true,
            class: 'col-span-6 border border-light px-5 py-3 rounded h-64',
            component: 'graph',
            componentData: {
                query: {
                    size: 0,
                    aggs: {
                        group_by_traits: {
                            terms: {
                                field: 'Asset.certificateStatus',
                                size: 20,
                            },
                        },
                    },
                },
                graphType: 'bar',
                graphOptions: {
                    indexAxis: 'y',
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
                                drawBorder: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                            },
                        },
                    },
                },
                dataOptions: {
                    aggregationKey: 'group_by_traits',
                },
            },
        },
    ],
}
