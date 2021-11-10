<template>
    <div class="h-full overflow-y-hidden rounded">
        <div class="flex flex-col h-full rounded">
            <Loading v-if="isQueryRunning === 'loading'" />

            <!-- <LoadingView v-if="isQueryRunning === 'loading'" size="small" class="w-1 h-1 mr-4" /> -->
            <AtlanTable
                :columnsData="activeInlineTab.playground.editor.columnList"
                rowClassNames=""
                v-else-if="
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
                :dataList="activeInlineTab.playground.editor.dataList"
                :showLoading="false"
            />

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
                    class="flex items-center justify-between h-6 px-4 py-1 border  button-shadow"
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
    import Loading from './loading.vue'
    import ResultPaneFooter from './resultPaneFooter.vue'
    import LineError from './lineError.vue'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
    import AtlanBtn from '~/components/UI/button.vue'
    import AtlanTable from '~/components/UI/table.vue'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'

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
            const errorDecorations =
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.errorDecorations

            const abortRunningQuery = () => {
                abortQuery(
                    activeInlineTab,
                    inlineTabs,
                    editorInstance,
                    monacoInstance
                )
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