import bodybuilder from 'bodybuilder'
import { useWorkflowStore } from '~/workflowsv2/store'
import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

const workflowStore = useWorkflowStore()
const { packageType, name } = useWorkflowInfo()
const { source } = usePackageInfo()

export interface WidgetData {
    id: string
    label?: string
    info?: string
    showHeader?: boolean
    class?: string
    component: string
    componentData: any
}

export const Metadata: WidgetData[] = [
    {
        id: 'summary-assets',
        label: 'Summary',
        info: 'New Assets created',
        showHeader: false,
        class: 'col-span-4 h-48 border border-light px-5 py-3 rounded-lg bg-white',
        component: 'summary',
        componentData: {
            query: {
                size: 0,
                aggs: {
                    group_by_state: {
                        terms: {
                            field: '__state',
                            size: 5,
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
            filterQuery: (filters) => {
                const query = bodybuilder()
                if (filters?.packageId) {
                    const pkg = workflowStore.packageMeta?.[filters.packageId]
                    if (packageType(pkg) === 'connector') {
                        if (filters.workflowId) {
                            let prefix = filters.workflowId
                                ?.split(`${name(pkg)}-`)
                                .pop()
                            prefix = prefix.replaceAll('-', '/')
                            query.query('prefix', 'qualifiedName', prefix)
                        } else
                            query.filter('term', 'connectorName', source(pkg))
                    }
                }
                if (filters?.dateRange) {
                    query.filter('range', 'lastSyncRunAt', filters.dateRange)
                }

                return query.build()
            },
        },
    },
    {
        id: 'connector-assets',
        label: 'Top 5 Sources',
        info: 'Sources having the most number of assets',
        showHeader: true,
        class: 'col-span-8 border border-light px-5 py-3 rounded h-48 rounded-lg bg-white',

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
                                                connectorName: '',
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
                            field: 'connectorName',
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
                aggregationKey: 'group_by_connector',
            },
        },
    },
]
