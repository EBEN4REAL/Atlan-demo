<template>
    <div class="h-full overflow-y-hidden">
        <div
            class="flex flex-col h-full"
            :style="{
                background:
                    columnList.length > 0 &&
                    dataList.length > 0 &&
                    isQueryRunning === 'success'
                        ? '#f6f7f9'
                        : '#ffffff',
            }"
        >
            <div
                v-if="isQueryRunning === 'loading'"
                class="flex flex-col justify-center h-full"
            >
                <Loading
                    v-if="isQueryRunning === 'loading'"
                    :isQueryRunning="isQueryRunning"
                />
                <QueryTimer
                    :timerId="`${insights_Store.activePreviewGuid}_timer`"
                    v-if="!buttonDisable"
                />
                <div
                    class="flex justify-center mt-2"
                    v-if="isQueryRunning === 'loading'"
                >
                    <AtlanBtn
                        class="flex items-center justify-between h-6 px-4 py-1 border button-shadow"
                        size="lg"
                        color="secondary"
                        padding="compact"
                        :disabled="buttonDisable"
                        @click="abortRunningQuery"
                    >
                        <span v-if="!buttonDisable" class="text-gray-700"
                            >Abort</span
                        >
                        <span v-else class="text-gray-700">Aborting</span>
                    </AtlanBtn>
                </div>
            </div>

            <!-- <a-spin v-if="isQueryRunning === 'loading'" /> -->
            <div
                class="flex flex-col h-full m-2 mb-0 overflow-hidden border rounded-lg border-gray-light"
                v-if="
                    columnList.length > 0 &&
                    dataList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
            >
                <AtlanPreviewTable
                    :dataList="dataList"
                    :columns="columnList"
                    :key="insights_Store.activePreviewGuid"
                />
            </div>

            <div
                v-else-if="
                    (columnList.length === 0 || dataList.length === 0) &&
                    isQueryRunning === 'success'
                "
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <img :src="ResultsImg" class="text-white" :draggable="false" />
                <p class="mt-4 mb-0 text-base text-gray-700">No Rows/Columns</p>
            </div>

            <!-- --------------- -->

            <!-- First screen -->

            <QueryAbort
                :isQueryRunning="isQueryRunning"
                :isQueryAborted="isQueryAborted"
                v-else-if="isQueryRunning === '' && isQueryAborted"
            />

            <div
                v-else-if="isQueryRunning === ''"
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <!-- <img :src="ResultsImg" class="text-white" :draggable="false" /> -->
                <AtlanIcon
                    class="w-36 h-28 min-icon-height"
                    icon="NoDataInsights"
                />
                <p class="mt-4 mb-0 text-base text-gray-700">
                    Your results will appear here
                </p>
            </div>

            <QueryError
                :queryErrorObj="queryErrorObj"
                :isQueryRunning="isQueryRunning"
                v-else-if="
                    isQueryRunning === 'error' && !haveLineNumber(queryErrorObj)
                "
            />

            <LineError
                :queryErrorObj="queryErrorObj"
                :errorDecorations="errorDecorations"
                v-else-if="
                    isQueryRunning === 'error' && haveLineNumber(queryErrorObj)
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, computed, PropType, ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import LoadingView from '@common/loaders/page.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import ResultsImg from '~/assets/images/insights/results.png'
    import QueryError from '../queryError.vue'
    import QueryAbort from '../queryAbort.vue'
    import Loading from '../loading.vue'
    import ResultPaneFooter from '../resultPaneFooter.vue'
    import LineError from '../lineError.vue'
    // import { LINE_ERROR_NAMES, SOURCE_ACCESS_ERROR_NAMES } from '~/components/insights/common/constants'
    import AtlanBtn from '~/components/UI/button.vue'
    import AtlanPreviewTable from '@/common/table/previewTable/tablePreview.vue'
    import useRunQuery from '~/components/insights/playground/common/composables/previewQueryRun'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { useError } from '~/components/insights/playground/common/composables/UseError'
    import { useResultPane } from '~/components/insights/playground/resultsPane/common/composables/useResultPane'
    import QueryTimer from '~/components/insights/playground/resultsPane/result/timer/queryTimer.vue'
    import { canQueryAbort } from '~/components/insights/common/composables/getDialectInfo'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import insightsStore from '~/store/insights/index'

    // import { useTimer } from '~/components/insights/playground/resultsPane/result/timer/useTimer'

    export default defineComponent({
        components: {
            LineError,
            ResultPaneFooter,
            LoadingView,
            Tooltip,
            Loading,
            QueryError,
            AtlanBtn,
            QueryAbort,
            AtlanIcon,
            AtlanPreviewTable,
            QueryTimer,
        },
        props: {
            dataList: {
                type: Object as PropType<any>,
                required: false,
            },
            columnList: {
                type: Object as PropType<any>,
                required: false,
            },
        },
        setup(props) {
            const insights_Store = insightsStore()
            const { abortQuery } = useRunQuery()
            const { getConnectorName } = useConnector()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const monacoInstance = inject('monacoInstance') as Ref<any>
            const editorInstance = inject('editorInstance') as Ref<any>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const { haveLineNumber } = useResultPane(inlineTabs)

            const dataList = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.rows ?? []
            )
            const columnList = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.columns ?? []
            )
            const buttonDisable = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ].buttonDisable
            )

            const queryErrorObj = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.queryErrorObj
            )
            const rowCountErrObj = ref()
            const queryExecutionTime = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.executionTime
            )
            const isQueryRunning = computed(() => {
                const x =
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.isQueryRunning
                return x
            })
            const isQueryAborted = computed(
                () =>
                    insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.isQueryAborted
            )
            const errorDecorations = []

            const { LINE_ERROR_NAMES, SOURCE_ACCESS_ERROR_NAMES } = useError()
            // let isQueryAborted = ref(false)

            const abortRunningQuery = () => {
                const index = insights_Store.previewTabs.findIndex(
                    (el) => el.asset.guid === insights_Store.activePreviewGuid
                )

                abortQuery(insights_Store.previewTabs[index].asset.guid)
            }

            return {
                insights_Store,
                buttonDisable,
                dataList,
                columnList,
                getConnectorName,
                canQueryAbort,
                haveLineNumber,
                errorDecorations,
                LINE_ERROR_NAMES,
                SOURCE_ACCESS_ERROR_NAMES,
                isQueryRunning,
                queryErrorObj,
                rowCountErrObj,
                ResultsImg,
                outputPaneSize,
                queryExecutionTime,
                activeInlineTab,
                abortRunningQuery,
                isQueryAborted,
                // printData
            }
        },
    })
</script>

<style lang="less" scoped>
    .button-shadow {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
    }
    // thead tr th {
    //     position: sticky;
    // }
    // th {
    //     position: sticky;
    //     top: 0;
    //     text-align: left;
    //     position: relative;
    // }
    .placeholder {
        background-color: #f4f4f4;
    }
    .min-icon-height {
        min-width: 9rem;
        min-height: 7rem;
    }
</style>
<style lang="less" module>
    .result_tab {
        :global(.ant-table-placeholder) {
            border-bottom: none !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
