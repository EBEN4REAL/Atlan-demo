<template>
    <div id="table-container" class="table_height clusterize">
        <div
            id="scrollArea"
            class="clusterize-scroll -mt-0.5 -ml-0.5"
            style="max-height: 101%; max-width: 101%"
        >
            <table
                ref="tableRef"
                :data-test-id="'output-table'"
                :class="$style.tableStyle"
            >
                <slot name="header" />

                <tbody id="contentArea" class="clusterize-content"></tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch, ref } from 'vue'
    import Clusterize from 'clusterize.js'

    export default defineComponent({
        name: 'AtlanTable',
        components: {},
        props: {
            dataList: {
                type: Array as PropType<any[]>,
                required: true,
            },
            showLoading: {
                type: Boolean,
                default: true,
                required: false,
            },
            rowClassNames: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props) {
            const { showLoading, dataList, rowClassNames } = toRefs(props)
            let tableRef = ref(null)
            const defaultRowClassNames =
                'truncate bg-gray-100 border border-gray-light'

            watch([tableRef, dataList], () => {
                // if (isQueryRunning === 'success') {
                if (tableRef.value) {
                    const data_here = dataList.value.map((row, index) => {
                        let rows = `<td class="${
                            rowClassNames.value !== ''
                                ? rowClassNames.value
                                : defaultRowClassNames
                        }">${index + 1}</td>`
                        for (const [key, value] of Object.entries(row)) {
                            rows += `<td class="truncate bg-white border border-gray-light">${
                                value == null ? '-' : value
                            }</td>`
                        }
                        const res = '<tr>' + rows + '</tr>'
                        return res
                    })

                    new Clusterize({
                        rows: data_here,
                        scrollId: 'scrollArea',
                        contentId: 'contentArea',
                    })
                }
            })

            return {
                tableRef,
            }
        },
    })
</script>

<style lang="less" module>
    .tableStyle {
        border-radius: 10px !important;
        td,
        th {
            max-width: 250px !important;
            min-width: 150px !important;
            width: 200px;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            text-align: left !important;
            height: 32px !important;
            padding: 0px 16px !important;
            font-size: 12px !important;
        }
        tbody {
            font-family: Hack !important;
            font-weight: 400;
        }

        th {
            position: sticky;
            top: 0;
            z-index: 4;
            font-size: 14px !important;
            @apply text-gray-700;
            font-weight: 400 !important;
        }
        td:first-child {
            max-width: 100px !important;
            min-width: 40px !important;
            width: 40px;
            left: 0;
            position: sticky;
            z-index: 4;
            font-size: 14px !important;
            @apply text-gray-500;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 40px !important;
            width: 40px;
            left: 0;
            z-index: 10;
            @apply text-gray-500;
        }
    }
</style>

<style lang="less" scoped>
    @import url('clusterize.js/clusterize.css');
    .button-shadow {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
    }
    .placeholder {
        background-color: #f4f4f4;
    }
    .table_height {
        height: 100% !important;
    }

    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }
</style>
