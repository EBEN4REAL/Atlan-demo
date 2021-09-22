import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
export const inlineTabsDemoData: activeInlineTabInterface[] = [
    {
        key: '1',
        label: 'ABCDE',
        isSaved: true,
        queryId: 'abcd-01-01',
        explorer: {
            schema: {
                connectors: {
                    connection: 'default/snowflake/vqaqufvr-i',
                    connector: 'snowflake',
                    selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC',
                    selectedDataSourceName: 'default/snowflake/vqaqufvr-i',
                },
            },
        },
        playground: {
            editor: {
                text: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                dataList: [],
                columnList: [],
            },
            resultsPane: {
                activeTab: 0,
                result: {
                    title: 'ABCDE Result',
                },
                metadata: {},
                queries: {},
                joins: {},
                filters: {},
                impersonation: {},
                downstream: {},
                sqlHelp: {},
            },
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
    {
        key: '2',
        label: 'ADBE',
        isSaved: false,
        queryId: undefined,
        explorer: {
            schema: {
                connectors: {
                    connection: 'default/snowflake/vqaqufvr-i',
                    connector: 'snowflake',
                    selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC',
                    selectedDataSourceName: 'default/snowflake/vqaqufvr-i',
                },
            },
        },
        playground: {
            editor: {
                text: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                dataList: [],
                columnList: [],
            },
            resultsPane: {
                activeTab: 0,
                result: {
                    title: 'ADBE Result',
                },
                metadata: {},
                queries: {},
                joins: {},
                filters: {},
                impersonation: {},
                downstream: {},
                sqlHelp: {},
            },
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
    {
        key: '3',
        label: 'BCDE',
        isSaved: false,
        queryId: undefined,
        explorer: {
            schema: {
                connectors: {
                    connection: 'default/snowflake/vqaqufvr-i',
                    connector: 'snowflake',
                    selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC',
                    selectedDataSourceName: 'default/snowflake/vqaqufvr-i',
                },
            },
        },
        playground: {
            editor: {
                text: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                dataList: [],
                columnList: [],
            },
            resultsPane: {
                activeTab: 0,
                result: {
                    title: 'BCDE Result',
                },
                metadata: {},
                queries: {},
                joins: {},
                filters: {},
                impersonation: {},
                downstream: {},
                sqlHelp: {},
            },
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
]
