<template>
    <div class="relative w-full h-full p-3 overflow-hidden rounded">
        <div
            class="relative flex justify-center overflow-x-auto rounded  table_height"
        >
            <a-table
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
            />
            <div
                v-else
                class="flex flex-col items-center justify-center w-full h-full"
            >
                <AtlanIcon icon="NoDataInsights" class="text-white h-36 w-36" />
                <p class="mt-4 mb-0 text-base text-gray-700">
                    Your results will appear here
                </p>
            </div>
        </div>
        <div
            class="absolute left-0 flex w-full bg-white border-t  bottom_footer h-7"
            v-if="activeInlineTab.playground.editor.columnList.length > 0"
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
                    <div class="loader"></div>
                </div>
                <span class="mr-2 cursor-pointer" @click="getRowsCount" v-else
                    >{{ rowCount < 0 ? 'Get rows count ' : `${rowCount} rows` }}
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
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        PropType,
        toRefs,
        watch,
        ref,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import LoadingView from '@common/loaders/page.vue'

    export default defineComponent({
        components: {
            LoadingView,
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
            const queryExecutionTime = inject(
                'queryExecutionTime'
            ) as Ref<number>
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
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
            const getRowsCount = () => {
                queryRun(
                    activeInlineTab.value,
                    getData,
                    rowCountRunning,
                    undefined,
                    true
                )
            }
            return {
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
    .placeholder {
        background-color: #f4f4f4;
    }
    .table_height {
        height: 100%;
    }
    .bottom_footer {
        bottom: 10%;
    }
    .loader {
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
    .loader:before {
        width: 50%;
        height: 50%;
        background: #5277d7;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
    }
    .loader:after {
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
