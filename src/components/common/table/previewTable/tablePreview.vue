<template>
    <div class="table_height">
        <regular-table
            ref="tableRef"
            :class="$style.regular_table"
            id="regularTable"
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
    } from 'vue'

    import Tooltip from '@common/ellipsis/index.vue'
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import VariantModal from './variantModal.vue'

    export default defineComponent({
        name: 'AtlanTable',
        components: {
            Tooltip,
            AtlanIcon,
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
                // init()
                const tbody = document.getElementsByTagName('tbody')[0]

                tbody.onclick = function (e) {
                    let td = e.target.closest('td')
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
                    let td = e.target.closest('td')
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
                    let td = e.target.closest('td')
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
                    let img = e.target.closest('img')
                    if (!img) return
                    if (!thead.contains(img)) return

                    let tooltipContent = img.dataset.tooltip
                    if (!tooltipContent) return

                    hoverTH.value = document.createElement('div')
                    hoverTH.value.className =
                        'fixed bg-black text-white px-3 py-1 rounded opacity-80 z-50 mx-auto'
                    hoverTH.value.innerHTML = tooltipContent

                    img.parentElement.append(hoverTH.value)
                }

                thead.onmouseout = function (e) {
                    let img = e.target.closest('img')
                    if (!img) return
                    if (!thead.contains(img)) return

                    hoverTH.value.remove()
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
                        col.data_type.toLowerCase() === 'struct'
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

            const alignment = (data_type) => {
                let align = 'text-left'

                switch (data_type) {
                    case 'Number':
                    case 'DateTime':
                    case 'Geography':
                    case 'Decimal':
                    case 'Boolean':
                        align = 'text-right'
                        break

                    case 'Text':
                    case 'Array':
                    case 'Object':
                    case 'Variant':
                        align = 'text-left'
                        break
                }
                // console.log('align: ', { data_type, align })
                return align
            }

            // const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]))

            function range(x0, x1, f) {
                return Array.from(Array(x1 - x0).keys()).map((x) => f(x + x0))
            }

            function group_header(i, name) {
                let title = columns.value[i]?.title.toUpperCase()
                return [`${title}`]
            }

            const imageMap = {
                Number: 'number',
                Decimal: 'float1',
                Boolean: 'boolean',
                Text: 'string',
                DateTime: 'date',
                Array: 'array',
                Object: 'struct',
                Geography: 'geography',
                Variant: 'variant',
            }

            function getImageUrl(name) {
                return `/dataType/${name}.svg`
            }

            function styleListener() {
                // icons for table headers

                let rows = window.regularTable.querySelectorAll('tbody tr')

                // rows.forEach((row) => {
                //     row.childNodes.forEach((col, i) => {
                //         if (i !== 0) {
                //             let column = columns.value[i]
                //             console.log('col: ', column)
                //             col.classList.add(alignment('Number'))
                //         }
                //     })
                //     // console.log('row: ', row)
                // })

                for (const [i, th] of window.regularTable
                    .querySelectorAll('thead tr th')
                    .entries()) {
                    if (i !== 0) {
                        const { x } = window.regularTable.getMeta(th)
                        const column = columns.value[x]
                        // console.log('x: ', x)

                        if (
                            column.data_type.toLowerCase() === 'any' ||
                            column.data_type.toLowerCase() === 'variant' ||
                            column.data_type.toLowerCase() === 'object' ||
                            column.data_type.toLowerCase() === 'struct'
                        ) {
                            // th.setAttribute('id', column.dataIndex.toString())

                            rows.forEach((element, i) => {
                                if (element?.children?.length - 1 > x) {
                                    element?.children[x + 1]?.setAttribute(
                                        'key',
                                        column.dataIndex.toString()
                                    )
                                    element?.children[x + 1]?.setAttribute(
                                        'data-key',
                                        column.dataIndex.toString()
                                    )
                                    const span = document.createElement('span')
                                    span.setAttribute('id', 'expandIcon')
                                    span.innerHTML = `<img  class="inline-flex w-4 h-4 mr-4 mb-0.5 absolute top-1.5 hidden right-0" src='/dataType/expand.svg'>`

                                    if (
                                        !element.children[x + 1]?.querySelector(
                                            '#expandIcon > img'
                                        )
                                    ) {
                                        element.children[x + 1]?.append(span)
                                    }
                                }
                            })
                        }

                        // here, order in which operation is performed is important
                        if (column?.key !== 0) {
                            const span = document.createElement('span')
                            span.setAttribute('id', 'icon')
                            span.innerHTML = `<img data-tooltip=${
                                column.data_type
                            }  class="cursor-pointer inline-flex w-4 h-4 mr-1 mb-0.5" src="${getImageUrl(
                                imageMap[getDataType(column.data_type)]
                            )}">`

                            if (!th.querySelector('#icon > img')) {
                                th.prepend(span)
                            }

                            // console.log('child: ', th.childNodes[1])

                            // th.childNodes[1].classList.add(
                            //     alignment(getDataType(column.data_type))
                            // )
                        }
                    }
                }
            }

            function row_header(i) {
                return [`${i + 1}`]
            }

            const dataHere = (rows) => {
                return (x0, y0, x1, y1) => ({
                    num_rows: dataList.value.length,
                    num_columns: columns.value.length,
                    column_headers: range(x0, x1, group_header.bind(null)),
                    row_headers: range(y0, y1, row_header.bind(null)),
                    data: range(x0, x1, (x) =>
                        range(y0, y1, (y) => rows[y][x])
                    ),
                })
            }

            function init() {
                const table = document.getElementsByTagName('regular-table')[0]

                let rows = dataList.value

                table?.setDataListener(dataHere(rows))
                table?.addStyleListener(styleListener)
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
    .regular_table {
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
            @apply border border-gray-light text-gray-700 bg-white;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-family: Avenir !important;
            padding-top: 5px !important;
            position: relative;
        }

        tbody {
            font-weight: 400;
        }

        th {
            border-top: 0;
            height: 36px !important;
            font-size: 14px !important;
            @apply border-r border-gray-light bg-white text-gray-700;
            font-weight: 700 !important;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 42px !important;
            width: 42px;
            border-left: 0;
            height: 28px !important;
            color: #a0a4b6;
            font-weight: 400 !important;
            @apply bg-white border;
        }
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
</style>
