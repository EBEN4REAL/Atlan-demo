import bodybuilder from 'bodybuilder'
import { useWorkflowStore } from '~/workflowsv2/store'
import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
import {
    findIntervalByDate,
    getFilterText,
} from '~/workflowsv2/composables/utils'

const workflowStore = useWorkflowStore()
const { packageType, name } = useWorkflowInfo()
const { source } = usePackageInfo()

export interface WidgetData {
    id: string
    label?: string
    showHeader?: boolean
    class?: string
    component: string
    componentData: any
}

export const Metadata: WidgetData[] = [
    {
        id: 'summary-assets',
        label: 'Total assets updated',
        class: 'col-span-4 h-64',
        component: 'summary',
        componentData: {
            query: {
                size: 0,
                aggs: {
                    group_by_state: {
                        terms: {
                            field: '__state',
                            min_doc_count: 0,
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
                mainStatText: 'Assets updated',
                mainStatKey: 'sum_state',
                aggregationKey: 'group_by_state',
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
            filterText: (filters: Record<string, any>) =>
                getFilterText({ dateRange: filters.dateRange }),
        },
    },
    {
        id: 'new-assets',
        label: 'New assets distribution',

        showHeader: true,
        class: 'col-span-8 h-64',
        component: 'graph',
        componentData: {
            query: {
                size: 0,
            },
            graphType: 'line',
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
                scales: {
                    x: {
                        grid: {
                            display: false,
                            borderColor: '#EFF1F5',
                        },
                        title: {
                            display: false,
                            text: 'Date',
                        },
                        ticks: {
                            maxTicksLimit: 12,
                        },
                    },
                    y: {
                        grid: {
                            display: true,
                            drawBorder: false,
                            borderColor: '#EFF1F5',
                            color: '#EFF1F5',
                        },
                        ticks: {
                            maxTicksLimit: 5,
                            display: true,
                        },
                    },
                },
                datasets: {},
                elements: {
                    line: {
                        borderColor: '#225BD2',
                        backgroundColor: '#4A7ADF22',
                        borderWidth: 2,
                        fill: true,
                    },
                    point: { pointRadius: 0 },
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            },
            dataOptions: {
                aggregationKey: 'group_by_date',
                keyConfig: {
                    type: 'Date',
                },
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
                    query.filter('range', '__timestamp.date', filters.dateRange)
                }

                query.aggregation(
                    'date_histogram',
                    {
                        field: '__timestamp.date',
                        calendar_interval: findIntervalByDate(
                            filters?.dateRange?.gt,
                            filters?.dateRange?.lt
                        ),
                        time_zone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    'group_by_date'
                )

                return query.build()
            },
            filterText: (filters: Record<string, any>) =>
                getFilterText({ dateRange: filters.dateRange }),
        },
    },
    {
        id: 'connector-assets',
        label: 'Assets by connector',
        showHeader: true,
        class: 'col-span-6 h-64',
        component: 'graph',
        componentData: {
            query: {
                size: 0,
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
                elements: {
                    bar: {
                        borderRadius: 4,
                        backgroundColor: '#3C71DF',
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            drawBorder: false,
                            borderColor: '#EFF1F5',
                            color: '#EFF1F5',
                        },
                        title: {
                            display: false,
                        },
                        ticks: {
                            display: true,
                            maxTicksLimit: 5,
                        },
                    },
                    y: {
                        grid: {
                            display: false,
                            borderColor: '#EFF1F5',
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
            filterQuery: (filters) => {
                const query = bodybuilder()
                query.notFilter('term', 'connectorName', '')

                if (filters?.dateRange) {
                    query.filter('range', 'lastSyncRunAt', filters.dateRange)
                }

                return query.build()
            },
            filterText: (filters: Record<string, any>) =>
                getFilterText({ dateRange: filters.dateRange }),
        },
    },
]
