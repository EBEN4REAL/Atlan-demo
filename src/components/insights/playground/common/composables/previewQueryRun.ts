import { ref, toRaw, Ref, watch, callWithAsyncErrorHandling } from 'vue'
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
        queryText,
        attributeValue,
        tabIndex,
        tabsArray,
        getData,
        limitRows,
        previewTabIndex,
    }: {
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
        previewTabIndex: number
    }) => {
        const insights_Store = insightsStore()
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

        insights_Store.previewTabs[previewTabIndex].isQueryRunning = 'loading'
        insights_Store.previewTabs[previewTabIndex].isQueryAborted = false

        /* Setting it undefined for new run */
        if (insights_Store.previewTabs[previewTabIndex]?.runQueryId) {
            insights_Store.previewTabs[previewTabIndex].runQueryId = undefined
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

        insights_Store.previewTabs[previewTabIndex].abortQueryFn = reset

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
        insights_Store.previewTabs[previewTabIndex].eventSourceInstance =
            eventSource.value

        watch([isLoading, error], () => {
            try {
                if (!isLoading.value && error.value === undefined) {
                    // if query aborted then don't show the midway fetched data
                    if (
                        insights_Store.previewTabs[previewTabIndex]
                            .isQueryAborted
                    )
                        return

                    const { subscribe } = sse.value
                    subscribe('', (message: any) => {
                        /* Saving the queryId */
                        if (
                            message?.queryId &&
                            !insights_Store.previewTabs[previewTabIndex]
                                .runQueryId
                        ) {
                            insights_Store.previewTabs[
                                previewTabIndex
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
                                previewTabIndex,
                            })
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            /* Query related data */
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].isQueryRunning = 'success'
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].executionTime = message?.details.executionTime
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].totalRowsCount =
                                message?.details.totalRowsStreamed
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].queryErrorObj = {}
                            /* Setting it undefined for new run */

                            insights_Store.previewTabs[
                                previewTabIndex
                            ].runQueryId = undefined

                            // insights_Store.previewTabs[previewTabIndex].tabQueryState =
                            //     activeTabKey.value === tabsArray.value[tabIndex].key
                            //         ? false
                            //         : true

                            let endTime = new Date()
                            insights_Store.previewTabs[
                                previewTabIndex
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
                                previewTabIndex
                            ].queryErrorObj = message
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].totalRowsCount = -1
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].executionTime = -1
                            insights_Store.previewTabs[
                                previewTabIndex
                            ].isQueryRunning = 'error'
                            /* Setting it undefined for new run */
                            insights_Store.previewTabs[
                                previewTabIndex
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
                    !insights_Store.previewTabs[previewTabIndex].isQueryAborted
                ) {
                    insights_Store.previewTabs[previewTabIndex].runQueryId =
                        undefined
                    insights_Store.previewTabs[previewTabIndex].totalRowsCount =
                        -1
                    insights_Store.previewTabs[previewTabIndex].executionTime =
                        -1
                    insights_Store.previewTabs[previewTabIndex].isQueryRunning =
                        'error'
                    /* ------------------- */
                    /* USE SSE ERROR */
                    if (error.value?.statusText) {
                        insights_Store.previewTabs[
                            previewTabIndex
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
                            previewTabIndex
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

                    insights_Store.previewTabs[previewTabIndex].runQueryId =
                        undefined

                    //IMP: connection need to be closed here
                    if (eventSource.value?.close) {
                        eventSource.value.close()
                    }
                    reset()
                }
            } catch (e) {
                if (eventSource.value?.close) {
                    eventSource.value.close()
                }
                reset()
            }
        })
    }

    const abortQuery = (previewTabIndex: number) => {
        const insights_Store = insightsStore()

        if (
            insights_Store.previewTabs[previewTabIndex].eventSourceInstance
                ?.close
        ) {
            insights_Store.previewTabs[
                previewTabIndex
            ].eventSourceInstance?.close()
            // debugger
        }

        // stop timer

        if (insights_Store.previewTabs[previewTabIndex].abortQueryFn) {
            insights_Store.previewTabs[previewTabIndex].abortQueryFn()
            console.log('clock running abort timer stop 1')
        }

        // insights_Store.previewTabs[previewTabIndex].tabQueryState =
        //     false

        if (
            canQueryAbort(
                getConnectorName(
                    insights_Store.previewTabs[previewTabIndex].asset.attributes
                        .qualifiedName
                ) as string
            ) &&
            insights_Store.previewTabs[previewTabIndex].runQueryId
        ) {
            // stop timer

            /* Abort Query logic */
            insights_Store.previewTabs[previewTabIndex].buttonDisable = true
            const body = {
                queryId: insights_Store.previewTabs[previewTabIndex].runQueryId,
                dataSourceName: getConnectionQualifiedName(
                    insights_Store.previewTabs[previewTabIndex].asset.attributes
                        .qualifiedName
                ),
            }

            /* Change loading state */
            Insights.AbortQuery(body)
                .then(() => {
                    insights_Store.previewTabs[previewTabIndex].isQueryRunning =
                        ''
                    insights_Store.previewTabs[previewTabIndex].isQueryAborted =
                        true

                    insights_Store.previewTabs[
                        previewTabIndex
                    ].eventSourceInstance = undefined

                    insights_Store.previewTabs[previewTabIndex].buttonDisable =
                        false
                    insights_Store.previewTabs[previewTabIndex].runQueryId =
                        undefined
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

                    insights_Store.previewTabs[previewTabIndex].queryErrorObj =
                        insights_Store.previewTabs[
                            previewTabIndex
                        ].queryErrorObj = {
                            requestId:
                                insights_Store.previewTabs[previewTabIndex]
                                    .runQueryId,
                            errorName: errorMessage,
                            errorMessage: errorMessage,
                            errorCode: errorCode,
                            developerMessage: error.value?.statusText,
                            errorDescription: '',
                        }
                    insights_Store.previewTabs[previewTabIndex].totalRowsCount =
                        -1
                    insights_Store.previewTabs[previewTabIndex].executionTime =
                        -1
                    insights_Store.previewTabs[previewTabIndex].isQueryRunning =
                        'error'
                    /* ------------------- */
                    /* Setting it undefined for new run */

                    insights_Store.previewTabs[previewTabIndex].runQueryId =
                        undefined
                    insights_Store.previewTabs[previewTabIndex].buttonDisable =
                        false
                })
        } else {
            // FIXME: code repetetion
            insights_Store.previewTabs[previewTabIndex].isQueryRunning = ''
            insights_Store.previewTabs[previewTabIndex].isQueryAborted = true

            insights_Store.previewTabs[previewTabIndex].eventSourceInstance =
                undefined

            insights_Store.previewTabs[previewTabIndex].buttonDisable = false
            insights_Store.previewTabs[previewTabIndex].runQueryId = undefined
        }
    }

    return {
        abortQuery,

        previewRun,
    }
}
