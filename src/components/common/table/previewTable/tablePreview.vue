<template>
    <div ref="tableHeightRef" class="table_height">
        <regular-table
            id="regularTable"
            ref="tableRef"
            :class="$style.regular_table"
        ></regular-table>
    </div>
    <VariantModal
        v-if="modalVisible"
        v-model:visible="modalVisible"
        :data="selectedData"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        watch,
        ref,
        onMounted,
        onUnmounted,
    } from 'vue'
    import 'regular-table'
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import VariantModal from './variantModal.vue'

    import Expand from '~/assets/images/icons/expand.svg?url'

    import {
        setRowHeaderStyle,
        setCellTextStyle,
        setVariantCellStyle,
    } from './regulartable-utils.js'

    export default defineComponent({
        name: 'AtlanTable',
        components: {
            VariantModal,
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
            const tableHeightRef = ref(null)
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

            function handleClick(td) {
                if (selectedTD.value) {
                    handleModalClose()
                }
                selectedTD.value = td
                handleOpenModal(td.innerText)
            }

            watch([tableRef, dataList], () => {
                const tbody = document.getElementsByTagName('tbody')[0]

                tbody.onclick = function (e) {
                    const td = e.target.closest('td')
                    if (!td) return
                    if (!tbody.contains(td)) return
                    if (
                        variantTypeIndexes.value.includes(
                            td?.dataset?.key?.toString()
                        )
                    ) {
                        handleClick(td)
                    }
                }
                tbody.onmouseover = function (e) {
                    const td = e.target.closest('td')
                    if (!td) return
                    if (!tbody.contains(td)) return
                    if (
                        variantTypeIndexes.value.includes(
                            td?.dataset?.key?.toString()
                        )
                    ) {
                        if (hoverTD.value) {
                            // hoverTD.value.classList.remove('hover-state')
                            hoverTD.value.classList.remove(
                                'bg-primary-light',
                                'cursor-pointer'
                            )
                            // td.style.paddingRight = '16px !important'
                            td.classList.add('pr-4')
                        }
                        hoverTD.value = td

                        // hoverTD.value.classList.add('hover-state')
                        hoverTD.value.classList.add(
                            'bg-primary-light',
                            'cursor-pointer'
                        )
                        // td.style.paddingRight = '28px !important'
                        td.classList.remove('pr-4')
                        td.classList.add('pr-10')

                        hoverTD.value.childNodes[1].childNodes[0].classList.remove(
                            'hidden'
                        )
                    }
                }
                tbody.onmouseout = function (e) {
                    const td = e.target.closest('td')
                    if (!td) return
                    if (!tbody.contains(td)) return
                    hoverTD.value = td
                    // hoverTD?.value?.classList?.remove('hover-state')
                    hoverTD.value.classList.remove(
                        'bg-primary-light',
                        'cursor-pointer'
                    )
                    td.classList.remove('pr-10')
                    td.classList.add('pr-4')
                    hoverTD?.value?.childNodes[1]?.childNodes[0]?.classList?.add(
                        'hidden'
                    )
                }
            })

            watch([tableRef, columns], () => {
                // init()
                const thead = document.getElementsByTagName('thead')[0]

                thead.onmouseover = function (e) {
                    const img = e.target.closest('img')
                    if (!img) return
                    if (!thead.contains(img)) return

                    const tooltipContent = img.dataset.tooltip
                    if (!tooltipContent) return

                    // create tooltip and set it's  style and content
                    hoverTH.value = document.createElement('div')
                    hoverTH.value.className =
                        'absolute bg-black text-white px-3 py-1 rounded opacity-80'
                    hoverTH.value.style.maxWidth = `fit-content`
                    hoverTH.value.style.maxHeight = `fit-content`
                    // fit content for firefox
                    hoverTH.value.style.height = '-moz-max-content'
                    hoverTH.value.style.width = '-moz-max-content'

                    hoverTH.value.innerHTML = tooltipContent

                    // calculate tooltip position
                    const table = document.getElementById('regularTable')
                    const tableRect = table.getBoundingClientRect()
                    const elemRect = img.parentElement.getBoundingClientRect()
                    const offsetTop = elemRect.top - tableRect.top
                    const offsetLeft = elemRect.left - tableRect.left

                    // set tooltip position
                    hoverTH.value.style.top = `${offsetTop + 17}px`
                    hoverTH.value.style.left = `${offsetLeft}px`

                    // tooltip has to be a direct child of table to prevent it being hidden under table data. z-index doesn't work. //TODO: find out why

                    table?.appendChild(hoverTH.value)
                }

                thead.onmouseout = function (e) {
                    const img = e.target.closest('img')
                    if (!img) return
                    if (!thead.contains(img)) return

                    hoverTH?.value?.remove()
                    hoverTH.value = null
                }
            })

            const handleOpenModal = (data) => {
                modalVisible.value = true
                selectedData.value = data
                selectedTD.value.classList.add('selected-state')
                // selectedTD.value.classList.add(
                //     'bg-primary-light',
                //     'shadow',
                //     'shadow-primary'
                // )
            }

            const handleModalClose = () => {
                selectedData.value = ''
                selectedTD.value.classList.remove('selected-state')
                // selectedTD.value.classList.remove(
                //     'bg-primary-light',
                //     'border',
                //     'border-primary'
                // )
            }

            onMounted(() => {
                init()

                columns.value.forEach((col) => {
                    if (
                        col.data_type.toLowerCase() === 'any' ||
                        col.data_type.toLowerCase() === 'variant' ||
                        col.data_type.toLowerCase() === 'object' ||
                        col.data_type.toLowerCase() === 'struct' ||
                        col.data_type.toLowerCase() === 'json'
                    ) {
                        variantTypeIndexes.value.push(col.dataIndex.toString())
                    }
                })
            })

            watch(modalVisible, () => {
                if (!modalVisible.value) {
                    handleModalClose()
                }
            })

            function range(x0, x1, f) {
                return Array.from(Array(x1 - x0).keys()).map((x) => f(x + x0))
            }

            function column_header(i) {
                const title = columns.value[i]?.title
                    ? columns.value[i]?.title
                    : '-'
                return [`${title}`]
            }

            function row_header(i) {
                return [`${i + 1}`]
            }

            const dataHere = (rows) => (x0, y0, x1, y1) => ({
                num_rows: dataList.value.length,
                num_columns: columns.value.length,
                column_headers: range(x0, x1, column_header.bind(null)),
                row_headers: range(y0, y1, row_header.bind(null)),
                data: range(x0, x1, (x) => range(y0, y1, (y) => rows[y][x])),
            })

            function init() {
                const table = document.getElementsByTagName('regular-table')[0]

                const rows = dataList.value

                table?.setDataListener(dataHere(rows))

                table?.addStyleListener(() => {
                    // style all the table column headers
                    window?.regularTable
                        .querySelectorAll('thead th')
                        .forEach((th) => {
                            setRowHeaderStyle(th, columns)
                        })

                    // style all the column cells
                    window?.regularTable
                        .querySelectorAll('tbody tr')
                        .forEach((row) => {
                            setCellTextStyle(row, columns)
                        })

                    // style all variant type cells
                    window?.regularTable
                        .querySelectorAll('thead tr th')
                        .forEach((th) => {
                            setVariantCellStyle(
                                th,
                                columns,
                                window.regularTable.querySelectorAll(
                                    'tbody tr'
                                ),
                                variantTypeIndexes.value
                            )
                        })
                })
                // hide tooltips (if visible) on hover
                table?.addEventListener('scroll', () => {
                    hoverTH?.value?.remove()
                    hoverTH.value = null
                })

                table?.draw()
            }

            const observer = ref()

            const onResize = () => {
                init()
            }

            onMounted(() => {
                observer.value = new ResizeObserver(onResize).observe(
                    tableHeightRef.value
                )
            })

            onUnmounted(() => {
                observer?.value?.unobserve(tableHeightRef?.value)
            })

            return {
                tableRef,
                tableHeightRef,
                images,
                getDataType,
                variantTypeIndexes,
                selectedData,
                handleOpenModal,
                modalVisible,
                handleModalClose,
                showExpand,
            }
        },
    })
</script>

<style lang="less" module>
    .regular_table {
        overflow: overlay;
        border: none;
        tr:hover td {
            background: #fff;
        }
        @apply rounded-none p-0 !important;
        td,
        th {
            max-width: 200px;
            min-width: 200px;
            text-align: left !important;
            height: 28px !important;
            padding: 0px 16px !important;
            font-size: 14px !important;
            @apply border border-gray-light  bg-white;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-family: Avenir !important;
            padding-top: 5px !important;
            position: relative;
            color: #3e4359 !important;
            // text-align: right !important;
        }

        tbody {
            font-weight: 400;
        }

        th {
            border-top: 0;
            height: 36px !important;
            font-size: 14px !important;
            @apply border-r border-gray-light bg-white;
            font-weight: 700 !important;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 42px !important;
            width: 42px;
            border-left: 0;
            height: 28px !important;
            color: #a0a4b6 !important;
            font-weight: 400 !important;
            @apply bg-white border;
            padding: 0 !important;
            text-align: center !important;
        }

        tr th {
            border-bottom: 1px solid #f3f3f3 !important;
        }
        // & ::-webkit-scrollbar {
        //     display: none;
        // }
    }
</style>

<style lang="less" scoped>
    // regular-table
    @font-face {
        font-family: Avenir;
        src: url('~/assets/fonts/avenir/Avenir-Roman.woff2');
    }
    .table_height {
        height: 100% !important;
        position: relative;
    }
    .variant_body {
        max-height: 400px;
    }

    .selected-state {
        box-shadow: inset 0px 0px 0px 1px rgba(82, 119, 215) !important;
        @apply bg-primary-light !important;
    }
    #icon {
        color: red !important;
    }
    // ::-webkit-scrollbar {
    //     display: none;
    // }
</style>
