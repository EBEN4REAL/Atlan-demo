<template>
    <div class="relative w-full h-full overflow-hidden rounded">
        <div
            class="relative flex flex-col justify-start w-full overflow-x-auto rounded  table_height"
        >
            <Loading v-if="isQueryRunning === 'loading'" />
            <!-- Error on running a query -->
            <!-- v-if="!LINE_ERROR_NAMES.includes(queryErrorObj.errorName)" -->

            <!-- ---------------------- -->

            <!-- ------------- -->
            <!-- Output table -->

            <table
                class="relative block w-full p-0 m-0 overflow-auto table-height"
                v-else-if="
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
            >
                <thead>
                    <tr>
                        <th
                            class="sticky top-0 w-8 px-4 py-2 text-sm font-normal text-gray-700 truncate bg-gray-100 border  border-gray-light"
                            style="width: 32px; min-width: 32px; z-index: 4"
                        >
                            #
                        </th>

                        <th
                            v-for="(col, index) in activeInlineTab.playground
                                .editor.columnList"
                            :key="index"
                            class="sticky top-0 px-4 py-2 text-sm font-normal text-gray-700 truncate bg-gray-100 border  border-gray-light"
                            style="z-index: 3"
                        >
                            {{ col.title }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(row, index) in activeInlineTab.playground.editor
                            .dataList"
                        :key="index"
                    >
                        <td
                            class="sticky left-0 w-8 px-4 py-2 text-xs text-gray-700 truncate bg-white border  border-gray-light"
                            style="width: 32px; min-width: 32px; z-index: 2"
                        >
                            {{ index + 1 }}
                        </td>
                        <td
                            v-for="(rowData, index) in row"
                            :key="index"
                            class="px-4 py-2 text-xs text-gray-700 truncate bg-white border  border-gray-light"
                        >
                            {{ rowData }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- --------------- -->

            <!-- First screen -->
            <div
                v-else-if="isQueryRunning === ''"
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <img :src="ResultsImg" class="text-white" :draggable="false" />
                <p class="mt-4 mb-0 text-base text-gray-700">
                    Your results will appear here
                </p>
            </div>
            <!-- 
                                v-if="
                    isQueryRunning === 'success' &&
                    LINE_ERROR_NAMES.includes(queryErrorObj.errorName)
                "
            -->
            <QueryError
                v-if="
                    isQueryRunning === 'error' &&
                    !LINE_ERROR_NAMES.includes(queryErrorObj.errorName)
                "
            />
            <LineError
                :errorDecorations="errorDecorations"
                v-else-if="
                    isQueryRunning === 'error' &&
                    LINE_ERROR_NAMES.includes(queryErrorObj.errorName)
                "
            />
            <!-- Loading on running a query -->

            <!-- Output pane footer -->

            <!-- <ResultPaneFooter /> -->
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        computed,
        PropType,
        ref,
        toRaw,
        watch,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import LoadingView from '@common/loaders/page.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import ResultsImg from '~/assets/images/insights/results.png'
    import QueryError from './queryError.vue'
    import Loading from './loading.vue'
    import ResultPaneFooter from './resultPaneFooter.vue'
    import LineError from './lineError.vue'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'

    export default defineComponent({
        components: {
            LineError,
            ResultPaneFooter,
            LoadingView,
            Tooltip,
            Loading,
            QueryError,
        },
        props: {
            dataList: {
                type: Object as PropType<any>,
                required: true,
            },
            columnList: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const editorInstance = inject('editorInstance') as Ref<any>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
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
            const errorDecorations =
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.errorDecorations

            // watch(queryErrorObj, () => {
            //     /* Resetting the red dot from the editor if it error is not line type */
            //     const editorI = toRaw(editorInstance.value)
            //     if (activeInlineTab.value) {
            //         activeInlineTab.value.playground.resultsPane.result.errorDecorations =
            //             editorI.deltaDecorations(
            //                 activeInlineTab.value?.playground?.resultsPane
            //                     ?.result?.errorDecorations,
            //                 []
            //             )
            //     }
            // })

            // console.log()

            // const printData = () => {
            //     console.log('table data: ', activeInlineTab)
            // }

            return {
                errorDecorations,
                LINE_ERROR_NAMES,
                isQueryRunning,
                queryErrorObj,
                rowCountErrObj,
                ResultsImg,
                outputPaneSize,
                queryExecutionTime,
                activeInlineTab,
                // printData
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .table_height {
        height: 100%;
    }

    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }

    table {
        td,
        th {
            // max-width: 150px;
            min-width: 150px;
        }
        tbody {
            font-family: Hack !important;
            font-weight: 400;
        }
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
