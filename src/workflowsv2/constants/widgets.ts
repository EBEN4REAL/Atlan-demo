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
        label: 'Newly crawled assets',
        showHeader: true,
        class: 'col-span-8 h-64',
        component: 'graph',
        componentData: {
            query: {
                size: 0,
            },
            graphType: 'area',
            graphConfig: {
                yField: 'count',
                xField: 'timestamp',
                yAxis: {
                    tickCount: 4,
                    grid: {
                        line: {
                            style: { stroke: '#F2F4F7' },
                        },
                    },
                },
                areaStyle: () => ({
                    fill: 'l(270) 0:#4A7ADF00 1:#4A7ADFFF',
                }),
                smooth: true,
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
                        extended_bounds: {
                            max: filters?.dateRange?.lt,
                            min: filters?.dateRange?.gt,
                        },
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
            graphConfig: {
                xField: 'doc_count',
                yField: 'key',
                seriesField: 'key',
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
