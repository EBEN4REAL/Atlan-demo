import {
    ref,
    toRaw,
    Ref,
    watch,
    callWithAsyncErrorHandling,
    computed,
} from 'vue'
import { useSSE } from '~/modules/useSSE'
import { map } from '~/services/sql/query/key'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'
// import HEKA_SERVICE_API from '~/services/heka/index'
import { Insights } from '~/services/sql/query'
import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import { message } from 'ant-design-vue'
import { useError } from './UseError'
import { canQueryAbort } from '~/components/insights/common/composables/getDialectInfo'

import { useTimer } from '~/components/insights/playground/resultsPane/result/timer/useTimer'
import insightsStore from '~/store/insights/index'

export default function useRunQuery() {
    const {
        getSchemaWithDataSourceName,
        getConnectionQualifiedName,
        getConnectorName,
    } = useConnector()
    // const { modifyActiveInlineTab, activeTabKey } = useInlineTab()

    const setColumns = (columnList: Ref<any>, columns: any) => {
        // console.log('columns: ', columns)
        if (columns.length > 0) {
            columnList.value = []
            columns.map((col: any, index) => {
                columnList.value.push({
                    title: col.columnName,
                    dataIndex: col.columnName + index,
                    key: index + 1,
                    data_type: col.type.name,
                })
            })
        }
    }

    let keys = ref(0)

    const setRows = (dataList: Ref<any>, columnList: Ref<any>, rows: any) => {
        rows.map((result: any, index1) => {
            dataList.value.push(result)
        })
    }

    const previewRun = ({
        guid,
        queryText,
        attributeValue,
        tabIndex,
        tabsArray,
        getData,
        limitRows,
    }: {
        guid: string
        queryText: string
        attributeValue: string
        getData: ({
            rows,
            columns,
            executionTime,
            previewTabIndex,
        }: {
            rows: any[]
            columns: any[]
            executionTime: number
            previewTabIndex: number
        }) => void
        limitRows?: Ref<{ checked: boolean; rowsCount: number }>
        tabsArray: Ref<activeInlineTabInterface[]>
        tabIndex: number
    }) => {
        const insights_Store = insightsStore()
        const previewTabIndex = computed(() =>
            insights_Store.previewTabs.findIndex((el) => el.asset.guid === guid)
        )
        // do not change this. This is a workaround for the issue
        //FIXME:
        let activeInlineTab = ref(tabsArray.value[tabIndex])

        let startTime = new Date()

        // setStartTime(new Date())

        const columnList: Ref<
            [
                {
                    title: string
                    dataIndex: string
                    width: string
                    key: any
                }
            ]
        > = ref([])
        const dataList = ref([])
        const { start, reset } = useTimer(
            activeInlineTab,
            insights_Store.activePreviewGuid
        )

        insights_Store.previewTabs[previewTabIndex.value].isQueryRunning =
            'loading'
        insights_Store.previewTabs[previewTabIndex.value].isQueryAborted = false

        /* Setting it undefined for new run */
        if (insights_Store.previewTabs[previewTabIndex.value]?.runQueryId) {
            insights_Store.previewTabs[previewTabIndex.value].runQueryId =
                undefined
        }

        // console.log('selected query: ', queryText)

        dataList.value = []

        const params = {
            length: 10,
        }
        const sqlBody = {
            sql: queryText,
            dataSourceName: getConnectionQualifiedName(
                attributeValue
            ) as string,
        }
        /* This means it is a saved query */
        if (getSchemaWithDataSourceName(attributeValue)) {
            sqlBody.defaultSchema = getSchemaWithDataSourceName(attributeValue)
        }
        /* This means it is a saved query */
        if (tabsArray.value[tabIndex]?.queryId) {
            params.savedQueryId = tabsArray.value[tabIndex]?.queryId
        }
        /* Adding a limit param if limit rows is checked and limit is passed*/
        if (limitRows?.value && limitRows?.value?.checked) {
            params['limit'] = limitRows.value.rowsCount
        }

        useAddEvent('insights', 'query', 'run', {
            saved_query: !!params.savedQueryId,
            visual_query: tabsArray.value[tabIndex].playground.isVQB,
            limit_100: !!params.limit,
        })

        let search_prms = generateQueryStringParamsFromObj(params)

        const pathVariables = {
            params: search_prms,
        }

        keys.value = 0

        // start timer
        start()

        insights_Store.previewTabs[previewTabIndex.value].abortQueryFn = reset

        const {
            eventSource,
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: map.insights.RUN_QUERY,
            includeAuthHeader: true,
            pathVariables,
            body: sqlBody,
        })
        insights_Store.previewTabs[previewTabIndex.value].eventSourceInstance =
            eventSource.value

        watch([isLoading, error], () => {
            try {
                if (!isLoading.value && error.value === undefined) {
                    // debugger
                    // if query aborted then don't show the midway fetched data
                    if (
                        insights_Store.previewTabs[previewTabIndex.value]
                            .isQueryAborted
                    )
                        return

                    const { subscribe } = sse.value
                    subscribe('', (message: any) => {
                        /* Saving the queryId */
                        if (
                            message?.queryId &&
                            !insights_Store.previewTabs[previewTabIndex.value]
                                .runQueryId
                        ) {
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].runQueryId = message?.queryId
                        }
                        // debugger

                        /* ---------------------------------- */
                        if (message?.columns)
                            setColumns(columnList, message.columns)
                        if (message?.rows)
                            setRows(dataList, columnList, message.rows)
                        if (message?.details.status === 'completed') {
                            getData({
                                rows: toRaw(dataList.value),
                                columns: toRaw(columnList.value),
                                executionTime: message?.details.executionTime,
                                previewTabIndex: previewTabIndex.value,
                            })
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            /* Query related data */
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].isQueryRunning = 'success'
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].executionTime = message?.details.executionTime
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].totalRowsCount =
                                message?.details.totalRowsStreamed
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].queryErrorObj = {}
                            /* Setting it undefined for new run */

                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].runQueryId = undefined

                            // insights_Store.previewTabs[previewTabIndex.value].tabQueryState =
                            //     activeTabKey.value === tabsArray.value[tabIndex].key
                            //         ? false
                            //         : true

                            let endTime = new Date()
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].executionTime = endTime - startTime
                            //IMP: connection need to be closed here
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            reset()

                            /* ------------------- */
                        }
                        if (message?.details?.status === 'error') {
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            /* Query related data */
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].queryErrorObj = message
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].totalRowsCount = -1
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].executionTime = -1
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].isQueryRunning = 'error'
                            /* Setting it undefined for new run */
                            insights_Store.previewTabs[
                                previewTabIndex.value
                            ].runQueryId = undefined
                            //IMP: connection need to be closed here
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            reset()
                        }
                    })
                } else if (
                    !isLoading.value &&
                    error.value !== undefined &&
                    !insights_Store.previewTabs[previewTabIndex.value]
                        .isQueryAborted
                ) {
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].runQueryId = undefined
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].totalRowsCount = -1
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].executionTime = -1
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].isQueryRunning = 'error'
                    /* ------------------- */
                    /* USE SSE ERROR */
                    if (error.value?.statusText) {
                        insights_Store.previewTabs[
                            previewTabIndex.value
                        ].queryErrorObj = {
                            requestId: '',
                            errorName: '',
                            errorMessage:
                                error.value?.statusText ??
                                'Oops! Something went wrong',
                            errorCode: error.value?.status,
                            developerMessage: error.value?.statusText,
                            errorDescription: 'Oops! Something went wrong',
                        }
                    } else if (error.value?.error) {
                        insights_Store.previewTabs[
                            previewTabIndex.value
                        ].queryErrorObj = {
                            requestId: '',
                            errorName: '',
                            errorMessage:
                                error.value?.error?.message?.toUpperCase() ??
                                'Oops! Something went wrong',
                            errorCode: '000',
                            developerMessage: error.value?.statusText,
                            errorDescription: 'Oops! Something went wrong',
                        }
                    }

                    /* Setting it undefined for new run */

                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].runQueryId = undefined

                    //IMP: connection need to be closed here
                    if (eventSource.value?.close) {
                        eventSource.value.close()
                    }
                    reset()
                }
            } catch (e) {
                debugger
                if (eventSource.value?.close) {
                    eventSource.value.close()
                }
                reset()
            }
        })
    }

    const abortQuery = (guid: string) => {
        const insights_Store = insightsStore()
        const previewTabIndex = computed(() =>
            insights_Store.previewTabs.findIndex((el) => el.asset.guid === guid)
        )

        if (
            insights_Store.previewTabs[previewTabIndex.value]
                .eventSourceInstance?.close
        ) {
            insights_Store.previewTabs[
                previewTabIndex.value
            ].eventSourceInstance?.close()
            // debugger
        }

        // stop timer

        if (insights_Store.previewTabs[previewTabIndex.value].abortQueryFn) {
            insights_Store.previewTabs[previewTabIndex.value].abortQueryFn()
            console.log('clock running abort timer stop 1')
        }

        // insights_Store.previewTabs[previewTabIndex.value].tabQueryState =
        //     false

        if (
            canQueryAbort(
                getConnectorName(
                    insights_Store.previewTabs[previewTabIndex.value].asset
                        .attributes.qualifiedName
                ) as string
            ) &&
            insights_Store.previewTabs[previewTabIndex.value].runQueryId
        ) {
            // stop timer

            /* Abort Query logic */
            insights_Store.previewTabs[previewTabIndex.value].buttonDisable =
                true
            const body = {
                queryId:
                    insights_Store.previewTabs[previewTabIndex.value]
                        .runQueryId,
                dataSourceName: getConnectionQualifiedName(
                    insights_Store.previewTabs[previewTabIndex.value].asset
                        .attributes.qualifiedName
                ),
            }

            /* Change loading state */
            Insights.AbortQuery(body)
                .then(() => {
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].isQueryRunning = ''
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].isQueryAborted = true

                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].eventSourceInstance = undefined

                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].buttonDisable = false
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].runQueryId = undefined
                })
                .catch((error) => {
                    /* Query related data */
                    /* 
        If errorCode -  exist error from backend 
        If errorCode - not exist, req did not reached server

        */
                    let errorCode = error?.response?.status
                    let errorMessage
                    if (errorCode) {
                        // backed error message
                        errorMessage =
                            error?.response?.data?.error?.message ??
                            'Query Abort Failed!'
                    } else {
                        errorCode = '000'
                        errorMessage = error?.message
                        // capitalizeFirstLetter
                        errorMessage =
                            errorMessage.charAt(0).toUpperCase() +
                            errorMessage.slice(1)
                    }

                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].queryErrorObj = insights_Store.previewTabs[
                        previewTabIndex.value
                    ].queryErrorObj = {
                        requestId:
                            insights_Store.previewTabs[previewTabIndex.value]
                                .runQueryId,
                        errorName: errorMessage,
                        errorMessage: errorMessage,
                        errorCode: errorCode,
                        developerMessage: error.value?.statusText,
                        errorDescription: '',
                    }
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].totalRowsCount = -1
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].executionTime = -1
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].isQueryRunning = 'error'
                    /* ------------------- */
                    /* Setting it undefined for new run */

                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].runQueryId = undefined
                    insights_Store.previewTabs[
                        previewTabIndex.value
                    ].buttonDisable = false
                })
        } else {
            // FIXME: code repetetion
            insights_Store.previewTabs[previewTabIndex.value].isQueryRunning =
                ''
            insights_Store.previewTabs[previewTabIndex.value].isQueryAborted =
                true

            insights_Store.previewTabs[
                previewTabIndex.value
            ].eventSourceInstance = undefined

            insights_Store.previewTabs[previewTabIndex.value].buttonDisable =
                false
            insights_Store.previewTabs[previewTabIndex.value].runQueryId =
                undefined
        }
    }

    return {
        abortQuery,

        previewRun,
    }
}
