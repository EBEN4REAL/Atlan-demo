<template>
    <div class="relative w-full h-full overflow-hidden rounded">
        <div
            class="relative flex flex-col justify-start w-full overflow-x-auto rounded  table_height"
        >
            <!-- <a-table
                v-if="
                    activeInlineTab.playground.editor.columnList.length > 0 ||
                    isQueryRunning === 'loading'
                        ? true
                        : false
                "
                class="w-full overflow-x-auto"
                :loading="isQueryRunning === 'loading' ? true : false"
                :class="$style.result_tab"
                :data-source="activeInlineTab.playground.editor.dataList"
                :scroll="{ x: 500 }"
                :columns="activeInlineTab.playground.editor.columnList"
            /> -->
            <div
                class="flex flex-col items-center justify-center w-full h-full"
                v-if="isQueryRunning === 'error'"
            >
                <AtlanIcon icon="queryErorrIllus" class="w-36 h-28" />
                <div
                    style="width: 300px"
                    class="flex flex-col items-center justify-center mt-4"
                >
                    <p class="mb-0 text-base text-center text-gray-700">
                        {{ queryErrorObj?.errorMessage }}
                    </p>
                    <p class="mt-2 mb-0 text-base text-gray-500">
                        {&nbsp;{{ queryErrorObj?.errorCode }}&nbsp;}
                    </p>
                </div>
            </div>
            <div
                class="flex items-center justify-center w-full h-full"
                v-if="isQueryRunning === 'loading'"
            >
                <div class="flex flex-col items-center justify-center">
                    <div class="loader_65"></div>
                    <p class="mb-0 -mt-8 text-base text-gray-700">
                        Crunching Data
                    </p>
                </div>
            </div>
            <table
                class="relative block w-full p-0 m-0 overflow-auto table-height"
                v-if="
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    isQueryRunning === 'success'
                        ? true
                        : false
                "
            >
                <thead>
                    <tr>
                        <th
                            v-for="(col, index) in activeInlineTab.playground
                                .editor.columnList"
                            :key="index"
                            class="sticky top-0 px-4 py-2 text-sm font-normal text-gray-700 truncate bg-gray-100 border  border-gray-light"
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
                            v-for="(rowData, index) in row"
                            :key="index"
                            class="px-4 py-2 text-xs text-gray-700 truncate bg-white border  border-gray-light"
                        >
                            {{ rowData }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div
                v-if="isQueryRunning === ''"
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <img :src="ResultsImg" class="text-white" :draggable="false" />
                <p class="mt-4 mb-0 text-base text-gray-700">
                    Your results will appear here
                </p>
            </div>
            <div
                class="left-0 flex w-full bg-white border-t bottom_footer h-7"
                v-if="
                    activeInlineTab.playground.editor.columnList.length > 0 &&
                    isQueryRunning === 'success'
                "
            >
                <div class="flex items-center px-3 text-gray-500">
                    <span class="mr-2">
                        {{
                            activeInlineTab.playground.editor.columnList.length
                        }}&nbsp;Columns
                    </span>
                    <div class="w-1 h-1 mx-2 bg-gray-500 rounded-full"></div>
                    <div
                        class="flex items-center justify-center mx-2"
                        v-if="rowCountRunning == 'loading'"
                    >
                        <div class="loader_16"></div>
                    </div>
                    <span
                        class="mr-2 cursor-pointer"
                        @click="getRowsCount"
                        v-else
                        >{{
                            rowCount < 0
                                ? 'Get rows count '
                                : `${rowCount} rows`
                        }}
                    </span>
                    <!-- Execution Time will be shown when it is >0 -->
                    <div
                        v-if="queryExecutionTime > 0"
                        class="w-1 h-1 mx-2 bg-gray-500 rounded-full"
                    ></div>
                    <span v-if="queryExecutionTime > 0" class="mr-2">
                        Took Time: {{ queryExecutionTime }}ms
                    </span>
                    <!-- -------------------------------------------- -->
                </div>
            </div>
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
        toRefs,
        watch,
        ref,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import LoadingView from '@common/loaders/page.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import ResultsImg from '~/assets/images/insights/results.png'

    export default defineComponent({
        components: {
            LoadingView,
            Tooltip,
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
            const { queryRun } = useRunQuery()
            const rowCountRunning = ref('')
            const rowCount = ref(-1)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .queryErrorObj
            )
            const rowCountErrObj = ref()
            const queryExecutionTime = inject(
                'queryExecutionTime'
            ) as Ref<number>
            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            watch(queryExecutionTime, () => {
                rowCount.value = -1
            })
            // callback fxn
            const getData = (dataList) => {
                if (dataList.length > 0) {
                    console.log(dataList, 'countt')
                    rowCount.value = dataList[0].COUNT
                }
            }
            const cllback = (status: string) => {
                rowCountRunning.value = status
            }
            const getRowsCount = () => {
                rowCountRunning.value = 'loading'
                queryRun(activeInlineTab, getData, undefined, cllback)
            }
            return {
                queryErrorObj,
                rowCountErrObj,
                ResultsImg,
                outputPaneSize,
                rowCount,
                getRowsCount,
                rowCountRunning,
                queryExecutionTime,
                isQueryRunning,
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .table-height {
        height: 80%;
    }

    .placeholder {
        background-color: #f4f4f4;
    }
    .table_height {
        height: 100%;
    }
    .bottom_footer {
        height: 8%;
    }
    .loader_16 {
        font-size: 10px;
        margin: 50px auto;
        text-indent: -9999em;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #5277d7;
        background: -moz-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -webkit-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -o-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -ms-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: linear-gradient(
            to right,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        position: relative;
        -webkit-animation: load3 1.4s infinite linear;
        animation: load3 1.4s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }
    .loader_16:before {
        width: 50%;
        height: 50%;
        background: #5277d7;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }
    .loader_16:after {
        background: #ffff;
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .loader_65 {
        font-size: 10px;
        margin: 50px auto;
        text-indent: -9999em;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: #5277d7;
        background: -moz-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -webkit-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -o-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: -ms-linear-gradient(
            left,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        background: linear-gradient(
            to right,
            #5277d7 10%,
            rgba(255, 255, 255, 0) 42%
        );
        position: relative;
        -webkit-animation: load3 1.4s infinite linear;
        animation: load3 1.4s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
    }
    .loader_65:before {
        width: 50%;
        height: 50%;
        background: #5277d7;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }
    .loader_65:after {
        background: #ffff;
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    @-webkit-keyframes load3 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load3 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
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

        // td:first-child,
        // th:first-child {
        //     @apply bg-gray-100 text-center !important;
        //     width: 35px;
        //     min-width: 35px;
        // }
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
