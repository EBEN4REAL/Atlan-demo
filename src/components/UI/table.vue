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

                    // setTimeout(() => {
                    //     init()
                    // }, 500)

                    // if (tableRef.value) {
                    // const min = 150
                    // const columnTypeToRatioMap = 1.67
                    // const table = document.querySelector('table')
                    // const columns = []
                    // let headerBeingResized

                    // const onMouseMove = (e) =>
                    //     requestAnimationFrame(() => {
                    //         let horizontalScrollOffset =
                    //             document.getElementById(
                    //                 'table-container'
                    //             )?.scrollLeft

                    //         const width =
                    //             horizontalScrollOffset +
                    //             e?.clientX -
                    //             headerBeingResized?.offsetLeft

                    //         const column = columns?.find(
                    //             ({ header }) => header === headerBeingResized
                    //         )
                    //         column.size = Math.max(min, width) + 'px'
                    //         console.log(width, column, 'col')

                    //         table.style.gridTemplateColumns = columns
                    //             ?.map(({ header, size }) => size)
                    //             ?.join(' ')

                    // console.log(
                    //     table.style.gridTemplateColumns,
                    //     'solkumn'
                    // )
                    // })

                    // const onMouseUp = () => {
                    //     console?.log('mouseup')
                    //     window.removeEventListener('mousemove', onMouseMove)
                    //     window.removeEventListener('mouseup', onMouseUp)
                    //     headerBeingResized.classList?.remove(
                    //         'header--being-resized'
                    //     )
                    //     headerBeingResized = null
                    // }

                    // const initResize = ({ target }) => {
                    //     console.log('mouse down')
                    //     console.log('target: ', target)
                    //     headerBeingResized = target?.parentNode
                    //     console.log(headerBeingResized)
                    //     window.addEventListener('mousemove', onMouseMove)
                    //     window.addEventListener('mouseup', onMouseUp)
                    //     headerBeingResized.classList.add(
                    //         'header--being-resized'
                    //     )
                    // }

                    // function init() {
                    //     document.querySelectorAll('th').forEach((header) => {
                    //         const max = columnTypeToRatioMap + 'fr'
                    //         columns.push({
                    //             header,

                    //             size: `minmax(${min}px, ${max})`,
                    //         })
                    //         header
                    //             .querySelector('.resize-handle')
                    //             .addEventListener('mousedown', initResize)
                    //     })

                    //     table.style.gridTemplateColumns = columns
                    //         .map(({ header, size }) => size)
                    //         .join(' ')
                    // }

                    // init()
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

    // table {
    //     td,
    //     th {
    //         max-width: 100px !important;
    //         min-width: 50px !important;

    //         overflow: hidden !important;
    //         text-overflow: ellipsis !important;
    //         white-space: nowrap !important;
    //         text-align: left !important;
    //     }
    //     tbody {
    //         font-family: Hack !important;
    //         font-weight: 400;
    //     }
    // }

    // table {
    // display: grid;
    // border-collapse: collapse;
    // min-width: 100%;
    // grid-template-columns: repeat(20, minmax(150px, 2fr));
    // tbody {
    //     font-family: Hack !important;
    //     font-weight: 400;
    // }
    // }

    // thead,
    // tbody,
    // tr {
    //     display: contents;
    // }

    // thead tr th {
    //     position: sticky;
    // }

    // th,
    // td {
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     white-space: nowrap;
    // }

    // th {
    //     position: sticky !important;
    //     top: 0 !important;
    //     text-align: left;
    // }

    // .resize-handle {
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     background: black;
    //     opacity: 0;
    //     width: 3px;
    //     cursor: col-resize;
    // }

    // .resize-handle:hover,
    // .header--being-resized .resize-handle {
    //     opacity: 0.5;
    // }

    // th:hover .resize-handle {
    //     opacity: 0.3;
    // }

    // td {
    //   padding-top: 10px;
    //   padding-bottom: 10px;
    //   color: #808080;
    // }
</style>
