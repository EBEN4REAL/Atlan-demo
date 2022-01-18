<template>
    <div class="table_height">
        <regular-table ref="tableRef" class="regular_table"></regular-table>
    </div>
    <!-- <VariantModal
        v-if="modalVisible"
        v-model:visible="modalVisible"
        :data="selectedData"
    /> -->
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        watch,
        ref,
        onMounted,
    } from 'vue'
    // import Clusterize from 'clusterize.js'
    import Tooltip from '@common/ellipsis/index.vue'
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import VariantModal from './variantModal.vue'
    import { useTimeEvent } from '~/components/insights/common/composables/useTimeEvent'
    // import VueVirtualTable from 'vue-virtual-table'

    export default defineComponent({
        name: 'AtlanTable',
        components: {
            Tooltip,
            AtlanIcon,
            VariantModal,
            // VueVirtualTable,
        },
        props: {
            dataList: {
                type: Array as PropType<any[]>,
                required: true,
            },
            columns: {
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
            const { dataList, columns } = toRefs(props)
            const tableRef = ref(null)
            const variantTypeIndexes = ref<String[]>([])
            const selectedData = ref('')
            const showExpand = ref('')
            const selectedTD = ref(null)
            const hoverTD = ref(null)
            const hoverTH = ref()

            const modalVisible = ref<boolean>(false)
            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

            const { setRenderTime } = useTimeEvent()

            function handleClick(td) {
                if (selectedTD.value) {
                    handleModalClose()
                }
                selectedTD.value = td
                handleOpenModal(td.innerText)
            }

            // watch([dataList], () => {
            //     // init()
            //     const tbody = document.getElementsByTagName('tbody')[0]

            //     tbody.onclick = function (e) {
            //         let td = e.target.closest('td')
            //         if (!td) return
            //         if (!tbody.contains(td)) return
            //         if (
            //             variantTypeIndexes.value.includes(
            //                 td.dataset.key.toString()
            //             )
            //         ) {
            //             handleClick(td)
            //         }
            //     }
            //     tbody.onmouseover = function (e) {
            //         let td = e.target.closest('td')
            //         if (!td) return
            //         if (!tbody.contains(td)) return
            //         if (
            //             variantTypeIndexes.value.includes(
            //                 td.dataset.key.toString()
            //             )
            //         ) {
            //             if (hoverTD.value) {
            //                 hoverTD.value.classList.remove('hover-state')
            //             }
            //             hoverTD.value = td
            //             hoverTD.value.classList.add('hover-state')

            //             // Decreasing text width on hover
            //             hoverTD.value.childNodes[0].childNodes[0].style.maxWidth =
            //                 '85%'

            //             // Showing Expand Icon
            //             hoverTD.value.childNodes[0].childNodes[1].classList.add(
            //                 'block'
            //             )
            //             hoverTD.value.childNodes[0].childNodes[1].classList.remove(
            //                 'hidden'
            //             )
            //         }
            //     }
            //     tbody.onmouseout = function (e) {
            //         let td = e.target.closest('td')
            //         if (!td) return
            //         if (!tbody.contains(td)) return
            //         hoverTD.value = td
            //         hoverTD.value.classList.remove('hover-state')

            //         hoverTD.value.childNodes[0].childNodes[0].style.maxWidth =
            //             '100%'

            //         hoverTD.value.childNodes[0].childNodes[1].classList.remove(
            //             'block'
            //         )
            //         hoverTD.value.childNodes[0].childNodes[1].classList.add(
            //             'hidden'
            //         )
            //     }
            // })

            // watch([columns], () => {
            //     // init()
            //     const thead = document.getElementsByTagName('thead')[0]

            //     thead.onmouseover = function (e) {
            //         let svg = e.target.closest('svg')
            //         if (!svg) return
            //         if (!thead.contains(svg)) return

            //         let tooltipContent = svg.dataset.tooltip
            //         if (!tooltipContent) return

            //         hoverTH.value = document.createElement('div')
            //         hoverTH.value.className =
            //             'bg-black text-white px-3 py-1 rounded opacity-80 absolute z-50 top-7 mx-auto'
            //         hoverTH.value.innerHTML = tooltipContent

            //         svg.parentElement.append(hoverTH.value)
            //     }

            //     thead.onmouseout = function (e) {
            //         let svg = e.target.closest('svg')
            //         if (!svg) return
            //         if (!thead.contains(svg)) return

            //         hoverTH.value.remove()
            //         hoverTH.value = null
            //     }
            // })

            watch(tableRef, () => {
                setRenderTime(new Date())
            })

            const handleOpenModal = (data) => {
                modalVisible.value = true
                selectedData.value = data
                selectedTD.value.classList.add('selected-state')
            }

            const handleModalClose = () => {
                selectedData.value = ''
                selectedTD.value.classList.remove('selected-state')
            }

            onMounted(() => {
                init()

                // columns.value.forEach((col) => {
                //     if (
                //         col.data_type.toLowerCase() === 'any' ||
                //         col.data_type.toLowerCase() === 'variant' ||
                //         col.data_type.toLowerCase() === 'object' ||
                //         col.data_type.toLowerCase() === 'struct'
                //     ) {
                //         variantTypeIndexes.value.push(col.dataIndex.toString())
                //     }
                // })
            })

            watch(modalVisible, () => {
                if (!modalVisible.value) {
                    handleModalClose()
                }
            })

            const alignment = (data_type) => {
                let align = 'justify-start'

                switch (data_type) {
                    case 'Number':
                    case 'DateTime':
                    case 'Geography':
                    case 'Decimal':
                    case 'Boolean':
                        align = 'justify-end'
                        break

                    default:
                        align = 'justify-start'
                        break
                }
                console.log('align: ', align)
                return align
            }

            const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]))

            function range(x0, x1, f) {
                return Array.from(Array(x1 - x0).keys()).map((x) => f(x + x0))
            }

            function dataListener(num_rows, num_columns) {
                return (x0, y0, x1, y1) => {
                    console.log('data here: ', {
                        num_rows,
                        num_columns,
                        column_headers: range(x0, x1, group_header.bind(null)),
                        data: range(x0, x1, (x) =>
                            range(y0, y1, (y) => `A+${x} + B+${y}`)
                        ),
                    })
                    return {
                        num_rows,
                        num_columns,
                        column_headers: range(x0, x1, group_header.bind(null)),
                        data: range(x0, x1, (x) =>
                            range(y0, y1, (y) => `A+${x} + B+${y}`)
                        ),
                    }
                }
            }

            function group_header(i, name) {
                let title = columns.value[i]?.title.toUpperCase()
                return [`${title}`]
            }

            const dataHere = (transposed) => {
                // debugger
                return (x0, y0, x1, y1) => ({
                    num_rows: dataList.value.length,
                    num_columns: columns.value.length,
                    column_headers: range(x0, x1, group_header.bind(null)),
                    data: range(x0, x1, (x) =>
                        range(y0, y1, (y) => transposed[y][x])
                    ),
                })
            }

            function init() {
                const table = document.getElementsByTagName('regular-table')[0]

                let transposed = dataList.value
                // debugger

                table?.setDataListener(dataHere(transposed))
                table?.draw()
            }

            onMounted(() => {
                init()
            })

            return {
                tableRef,
                images,
                getDataType,
                variantTypeIndexes,
                selectedData,
                handleOpenModal,
                modalVisible,
                handleModalClose,
                showExpand,
                alignment,
            }
        },
    })
</script>

<style lang="less" module>
    table {
        // @apply overflow-x-auto !important;
    }

    td,
    th {
        max-width: 200px;
        min-width: 200px;
        text-align: left !important;
        height: 28px !important;
        padding: 0px 16px !important;
        font-size: 14px !important;
        @apply border border-gray-light text-gray-700 bg-white;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    tbody {
        font-weight: 400;
    }

    th {
        position: sticky;
        top: 0;
        border-top: 0;
        height: 36px !important;
        z-index: 4;
        font-size: 14px !important;
        @apply border-r border-gray-light bg-white text-gray-700;

        font-weight: 700 !important;
    }
    td:first-child {
        max-width: 100px !important;
        min-width: 42px !important;
        width: 42px;
        // left: 0;
        border-left: 0;
        // position: sticky;
        // z-index: 4;
        font-size: 14px !important;
        color: #a0a4b6;
        @apply bg-white border;
    }

    th:first-child {
        max-width: 100px !important;
        min-width: 42px !important;
        width: 42px;
        border-left: 0;
        // left: 0;
        // z-index: 10;
        color: #a0a4b6;
        font-weight: 400 !important;
        @apply bg-white border-b-0;
    }
</style>

<style lang="less" scoped>
    .table_height {
        height: 600px !important;
        position: relative;
    }
    .regular_table {
        height: 600px;
        @apply rounded-none !important;
    }

    .variant_body {
        max-height: 400px;
    }

    .selected-state {
        box-shadow: inset 0px 0px 0px 1px rgba(82, 119, 215);
        @apply bg-primary-light !important;
    }

    .hover-state {
        @apply bg-primary-light cursor-pointer !important;
    }

    .tooltip {
        @apply bg-black text-white px-6 py-3 rounded opacity-80 absolute z-50 !important;
    }
</style>
