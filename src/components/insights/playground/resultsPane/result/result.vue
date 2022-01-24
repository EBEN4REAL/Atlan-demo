<template>
    <div class="h-full overflow-y-hidden">
        <div
            class="flex flex-col h-full"
            :style="{
                background:
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    activeInlineTab.playground.editor.dataList.length > 0 &&
                    isQueryRunning === 'success'
                        ? '#fbfbfb'
                        : '#ffffff',
            }"
        >
            <div
                v-if="isQueryRunning === 'loading'"
                class="flex flex-col justify-center h-full"
            >
                <Loading v-if="isQueryRunning === 'loading'" />
                <QueryTimer :timerId="`${activeInlineTab.key}_timer`" />
                <div
                    class="flex justify-center mt-2"
                    v-if="
                        isQueryRunning === 'loading' &&
                        activeInlineTab.playground.resultsPane.result.runQueryId
                    "
                >
                    <AtlanBtn
                        class="flex items-center justify-between h-6 px-4 py-1 border button-shadow"
                        size="lg"
                        color="secondary"
                        padding="compact"
                        :disabled="
                            activeInlineTab.playground.resultsPane.result
                                .buttonDisable
                        "
                        @click="abortRunningQuery"
                    >
                        <span
                            v-if="
                                !activeInlineTab.playground.resultsPane.result
                                    .buttonDisable
                            "
                            class="text-gray-700"
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
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    activeInlineTab.playground.editor.dataList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
            >
                <AtlanPreviewTable
                    :dataList="activeInlineTab.playground.editor.dataList"
                    :columns="activeInlineTab.playground.editor.columnList"
                    :key="activeInlineTab.key"
                />
            </div>

            <div
                v-else-if="
                    (activeInlineTab.playground.editor.columnList.length ===
                        0 ||
                        activeInlineTab.playground.editor.dataList.length ===
                            0) &&
                    isQueryRunning === 'success'
                "
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <img :src="ResultsImg" class="text-white" :draggable="false" />
                <p class="mt-4 mb-0 text-base text-gray-700">No Rows/Columns</p>
            </div>

            <!-- --------------- -->

            <!-- First screen -->
            <QueryAbort v-else-if="isQueryRunning === '' && isQueryAborted" />

            <div
                v-else-if="isQueryRunning === ''"
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <!-- <img :src="ResultsImg" class="text-white" :draggable="false" /> -->
                <AtlanIcon class="w-36 h-28" icon="NoDataInsights" />
                <p class="mt-4 mb-0 text-base text-gray-700">
                    Your results will appear here
                </p>
            </div>

            <QueryError
                v-else-if="
                    isQueryRunning === 'error' && !haveLineNumber(queryErrorObj)
                "
            />

            <LineError
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
    import QueryError from './queryError.vue'
    import QueryAbort from './queryAbort.vue'
    import Loading from './loading.vue'
    import ResultPaneFooter from './resultPaneFooter.vue'
    import LineError from './lineError.vue'
    // import { LINE_ERROR_NAMES, SOURCE_ACCESS_ERROR_NAMES } from '~/components/insights/common/constants'
    import AtlanBtn from '~/components/UI/button.vue'
    import AtlanTable from '@/common/table/previewTable/index.vue'
    import AtlanPreviewTable from '@/common/table/previewTable/tablePreview.vue'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { useError } from '~/components/insights/playground/common/composables/UseError'
    import { useResultPane } from '~/components/insights/playground/resultsPane/common/composables/useResultPane'
    import QueryTimer from '~/components/insights/playground/resultsPane/result/timer/queryTimer.vue'
    // import { useTimer } from '~/components/insights/playground/resultsPane/result/timer/useTimer'

    export default defineComponent({
        components: {
            AtlanTable,
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
            const { abortQuery } = useRunQuery()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const editorInstance = inject('editorInstance') as Ref<any>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const { haveLineNumber } = useResultPane(inlineTabs)

            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.queryErrorObj
            )
            const rowCountErrObj = ref()
            const queryExecutionTime = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.executionTime
            )
            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.isQueryRunning
            )
            const isQueryAborted = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.isQueryAborted
            )
            const errorDecorations =
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.errorDecorations

            const { LINE_ERROR_NAMES, SOURCE_ACCESS_ERROR_NAMES } = useError()
            // let isQueryAborted = ref(false)

            const abortRunningQuery = () => {
                abortQuery(
                    activeInlineTab,
                    inlineTabs,
                    editorInstance,
                    monacoInstance
                )
                // isQueryAborted.value = true
            }

            return {
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
