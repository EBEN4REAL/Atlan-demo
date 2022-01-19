<template>
    <div id="table-container" class="table_height clusterize">
        <div id="scrollArea" class="max-w-full max-h-full clusterize-scroll">
            <table
                ref="tableRef"
                :data-test-id="'output-table'"
                :class="$style.tableStyle"
                class="rounded-lg"
            >
                <thead id="headerArea" class="clusterize-content">
                    <tr>
                        <th class="truncate">#</th>
                        <th v-for="(col, index) in columns" :key="index">
                            <div
                                class="relative flex items-center"
                                :class="alignment(getDataType(col.data_type))"
                            >
                                <component
                                    :is="images[getDataType(col.data_type)]"
                                    :data-tooltip="col.data_type"
                                    class="w-4 h-4 mr-1 cursor-pointer -mt-0.5"
                                    style="min-width: 1rem; color: #919191"
                                ></component>

                                <!-- <Tooltip :tooltip-text="`${col.title}`" /> -->
                                <span class="truncate">{{ col.title }} </span>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody id="contentArea" class="clusterize-content">
                    <tr v-for="(row, index) in dataList" :key="index">
                        <td
                            :class="
                                rowClassNames !== ''
                                    ? rowClassNames
                                    : 'truncate'
                            "
                        >
                            {{ index + 1 }}
                        </td>

                        <td
                            v-for="(rowData, key) in row"
                            :key="key"
                            :data-key="key"
                            :data-index="index"
                            class="bg-white"
                        >
                            <div
                                class="flex items-center"
                                :class="
                                    alignment(getDataType(rowData.data_type))
                                "
                            >
                                <div class="truncate">
                                    {{ rowData?.data }}
                                </div>
                                <AtlanIcon
                                    icon="Expand"
                                    class="h-4 w-auto mb-0.5 hidden"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    import Clusterize from 'clusterize.js'
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
                if (tableRef.value) {
                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'contentArea',
                    })

                    const tbody = document.getElementById('contentArea')

                    tbody.onclick = function (e) {
                        let td = e.target.closest('td')
                        if (!td) return
                        if (!tbody.contains(td)) return
                        if (
                            variantTypeIndexes.value.includes(
                                td.dataset.key.toString()
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
                                td.dataset.key.toString()
                            )
                        ) {
                            if (hoverTD.value) {
                                hoverTD.value.classList.remove('hover-state')
                            }
                            hoverTD.value = td
                            hoverTD.value.classList.add('hover-state')

                            // Decreasing text width on hover
                            hoverTD.value.childNodes[0].childNodes[0].style.maxWidth =
                                '85%'

                            // Showing Expand Icon
                            hoverTD.value.childNodes[0].childNodes[1].classList.add(
                                'block'
                            )
                            hoverTD.value.childNodes[0].childNodes[1].classList.remove(
                                'hidden'
                            )
                        }
                    }
                    tbody.onmouseout = function (e) {
                        let td = e.target.closest('td')
                        if (!td) return
                        if (!tbody.contains(td)) return
                        hoverTD.value = td
                        hoverTD.value.classList.remove('hover-state')

                        hoverTD.value.childNodes[0].childNodes[0].style.maxWidth =
                            '100%'

                        hoverTD.value.childNodes[0].childNodes[1].classList.remove(
                            'block'
                        )
                        hoverTD.value.childNodes[0].childNodes[1].classList.add(
                            'hidden'
                        )
                    }
                }
            })

            watch([tableRef, columns], () => {
                if (tableRef.value) {
                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'headerArea',
                    })

                    const thead = document.getElementById('headerArea')

                    thead.onmouseover = function (e) {
                        let svg = e.target.closest('svg')
                        if (!svg) return
                        if (!thead.contains(svg)) return

                        let tooltipContent = svg.dataset.tooltip
                        if (!tooltipContent) return

                        hoverTH.value = document.createElement('div')
                        hoverTH.value.className =
                            'bg-black text-white px-3 py-1 rounded opacity-80 absolute z-50 top-7 mx-auto'
                        hoverTH.value.innerHTML = tooltipContent

                        svg.parentElement.append(hoverTH.value)
                    }

                    thead.onmouseout = function (e) {
                        let svg = e.target.closest('svg')
                        if (!svg) return
                        if (!thead.contains(svg)) return

                        hoverTH.value.remove()
                        hoverTH.value = null
                    }
                }
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

                    case 'Text':
                    case 'Array':
                    case 'Object':
                    case 'Variant':
                        align = 'justify-start'
                        break
                }
                console.log('align: ', align)
                return align
            }

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
    .tableStyle {
        @apply overflow-x-auto !important;

        td,
        th {
            max-width: 200px;
            min-width: 200px;
            text-align: left !important;
            height: 28px !important;
            padding: 0px 16px !important;
            font-size: 14px !important;
            @apply border border-gray-light text-gray-700;
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
            left: 0;
            border-left: 0;
            position: sticky;
            z-index: 4;
            font-size: 14px !important;
            color: #a0a4b6;
            @apply bg-white border;
            // box-shadow: inset -1px 0 #f3f3f3;
            // border-top-left-radius: 8px !important;
            // border-bottom-left-radius: 8px !important;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 42px !important;
            width: 42px;
            border-left: 0;
            left: 0;
            z-index: 10;
            color: #a0a4b6;
            font-weight: 400 !important;
            @apply bg-white border-b-0;

            // border-top-left-radius: 8px;
        }
        // th {
        // box-shadow: inset 0 -1px 0 #f3f3f3;
        // }
        @apply rounded-none !important;

        // @apply border-8 border-gray-300 !important;
    }
    .variant_modal {
        :global(.ant-modal-body) {
            padding: 1rem !important;
        }
    }
</style>

<style lang="less" scoped>
    @import url('clusterize.js/clusterize.css');

    .table_height {
        height: 100% !important;
    }

    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
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
