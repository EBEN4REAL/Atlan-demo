<template>
    <div class="table_height">
        <regular-table
            ref="tableRef"
            class="regular_table"
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
    import { useTimeEvent } from '~/components/insights/common/composables/useTimeEvent'

    import number from '~/assets/images/dataType/number.svg'
    import float1 from '~/assets/images/dataType/float1.svg'
    import boolean from '~/assets/images/dataType/boolean.svg'
    import string from '~/assets/images/dataType/string.svg'
    import date from '~/assets/images/dataType/date.svg'
    import array from '~/assets/images/dataType/array.svg'
    import struct from '~/assets/images/dataType/struct.svg'
    import geography from '~/assets/images/dataType/geography.svg'
    import variant from '~/assets/images/dataType/variant.svg'

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

            const { setRenderTime } = useTimeEvent()

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

            watch(tableRef, () => {
                setRenderTime(new Date())
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
                // console.log(
                //     'url: ',
                //     new URL(
                //         `src/assets/images/icons/${name}.svg`,
                //         import.meta.url
                //     )
                // )
                return `~/assets/images/icons/${name}.svg`
                // return new URL(
                //     `src/assets/images/icons/${name}.svg`,
                //     import.meta.url
                // ).href
            }

            function styleListener() {
                // icons for table headers

                let rows = window.regularTable.querySelectorAll('tbody tr')
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
                                    span.innerHTML = `<img  class="inline-flex w-4 h-4 mr-4 mb-0.5 absolute top-1.5 hidden right-0" src='~/assets/images/icons/expand.svg'>`

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

                            // th.classList.add('number')
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
                        range(y0, y1, (y) => rows[y][x]?.data)
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
    regular-table tr:hover td {
        background: #fff;
    }

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
        // left: 0;
        // z-index: 10;
        color: #a0a4b6;
        font-weight: 400 !important;
        @apply bg-white border;
    }
    // thead th.number:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/number.svg');
    // }
    // thead th.decimal:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/float1.svg');
    // }
    // thead th.boolean:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/boolean.svg');
    // }
    // thead th.text:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/string.svg');
    // }
    // thead th.array:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/array.svg');
    // }
    // thead th.date:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/date.svg');
    // }
    // thead th.object:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/struct.svg');
    // }
    // thead th.geography:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/geography.svg');
    // }
    // thead th.variant:before {
    //     display: inline-block;
    //     width: 16px !important;
    //     height: 16px !important;
    //     content: url('src/assets/images/dataType/variant.svg');
    // }
</style>

<style lang="less" scoped>
    @font-face {
        font-family: Avenir;
        src: url('~/assets/fonts/avenir/Avenir-Roman.woff2');
    }
    .table_height {
        height: 600px !important;
        position: relative;
    }
    .regular_table {
        // height: 100% !important;
        @apply rounded-none p-0 !important;
    }

    .variant_body {
        max-height: 400px;
    }

    .selected-state {
        box-shadow: inset 0px 0px 0px 1px rgba(82, 119, 215) !important;
        @apply bg-primary-light !important;
    }
</style>
