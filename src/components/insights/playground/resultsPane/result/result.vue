<template>
    <div class="h-full overflow-y-hidden rounded">
        <div class="flex flex-col h-full rounded">
            <Loading v-if="isQueryRunning === 'loading'" />

            <AtlanTable
                v-if="
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    activeInlineTab.playground.editor.dataList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
                :dataList="activeInlineTab.playground.editor.dataList"
            >
                <template #header>
                    <thead>
                        <tr>
                            <th
                                class="truncate bg-gray-100 border border-gray-light"
                            >
                                #
                                <!-- <span class="resize-handle"></span> -->
                            </th>

                            <th
                                v-for="(col, index) in activeInlineTab
                                    .playground.editor.columnList"
                                :key="index"
                                class="truncate bg-gray-100 border border-gray-light"
                            >
                                <div class="flex items-center">
                                    <a-tooltip>
                                        <template #title>{{
                                            col.type
                                        }}</template>
                                        <component
                                            :is="images[getDataType(col.type)]"
                                            class="w-4 h-4 mr-1.5 cursor-pointer -mt-0.5"
                                        ></component>
                                    </a-tooltip>
                                    <!-- {{ col.type }} -->
                                    <Tooltip :tooltip-text="`${col.title}`" />
                                </div>
                                <!-- <span class="resize-handle"></span> -->
                            </th>
                        </tr>
                    </thead>
                </template>
            </AtlanTable>

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
                v-else-if="
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

            <div
                class="flex justify-center"
                v-else-if="
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
    import QueryAbort from './queryAbort.vue'
    import Loading from './loading.vue'
    import ResultPaneFooter from './resultPaneFooter.vue'
    import LineError from './lineError.vue'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
    import AtlanBtn from '~/components/UI/button.vue'
    import AtlanTable from '~/components/UI/table.vue'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { images, dataTypeCategoryList } from '~/constant/dataType'

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
            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

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

                abortRunningQuery,
                isQueryAborted,
                getDataType,
                images,
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
