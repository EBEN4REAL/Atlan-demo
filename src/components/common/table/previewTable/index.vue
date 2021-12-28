<template>
    <div id="table-container" class="table_height clusterize">
        <div id="scrollArea" class="max-w-full max-h-full clusterize-scroll">
            <table
                ref="tableRef"
                :data-test-id="'output-table'"
                :class="$style.tableStyle"
            >
                <thead id="headerArea" class="clusterize-content">
                    <tr>
                        <th class="truncate">#</th>
                        <th v-for="(col, index) in columns" :key="index">
                            <div class="flex items-center">
                                <component
                                    :is="images[getDataType(col.data_type)]"
                                    :data-tooltip="col.data_type"
                                    class="w-4 h-4 mr-1 cursor-pointer -mt-0.5"
                                    style="min-width: 1rem"
                                ></component>

                                <!-- <Tooltip :tooltip-text="`${col.title}`" /> -->
                                <span class="truncate">{{ col.title }}</span>
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
                                v-if="showExpand === `${key}.${index}`"
                                class="flex items-center"
                            >
                                <div style="max-width: 80%" class="truncate">
                                    {{ rowData }}
                                </div>
                                <AtlanIcon
                                    icon="Expand"
                                    class="h-4 w-auto mb-0.5"
                                />
                            </div>
                            <div v-else class="truncate">
                                {{ rowData }}
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
                            showExpand.value = `${td.dataset.key}.${td.dataset.index}`
                        }
                    }
                    tbody.onmouseout = function (e) {
                        let td = e.target.closest('td')
                        if (!td) return
                        if (!tbody.contains(td)) return
                        hoverTD.value = td
                        hoverTD.value.classList.remove('hover-state')
                        showExpand.value = ''
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
                        // if we have tooltip HTML...
                        let tooltipContent = svg.dataset.tooltip
                        if (!tooltipContent) return

                        // ...create the tooltip element

                        hoverTH.value = document.createElement('div')
                        hoverTH.value.className = 'tooltip'
                        hoverTH.value.innerHTML = tooltipContent
                        document.body.append(hoverTH.value)

                        // position it above the annotated element (top-center)
                        let coords = svg.getBoundingClientRect()

                        let left =
                            coords.left +
                            (svg.offsetWidth - hoverTH.value.offsetWidth) / 2
                        if (left < 0) left = 0 // don't cross the left window edge

                        let top = coords.top - hoverTH.value.offsetHeight - 5
                        if (top < 0) {
                            // if crossing the top window edge, show below instead
                            top = coords.top + svg.offsetHeight + 5
                        }

                        hoverTH.value.style.top = top + 'px'
                        hoverTH.value.style.left = left + 'px'

                        console.log(hoverTH.value)
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
                        variantTypeIndexes.value.push(col.title)
                    }
                })
            })

            watch(modalVisible, () => {
                if (!modalVisible.value) {
                    handleModalClose()
                }
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
            }
        },
    })
</script>

<style lang="less" module>
    .tableStyle {
        @apply rounded overflow-x-auto !important;
        td,
        th {
            max-width: 200px;
            min-width: 200px;
            text-align: left !important;
            height: 32px !important;
            padding: 0px 16px !important;
            font-size: 12px !important;
            @apply border border-gray-light  !important;
        }
        tbody {
            font-family: Hack !important;
            font-weight: 400;
        }

        th {
            position: sticky;
            top: 0;
            border-top: 0;
            z-index: 4;
            font-size: 14px !important;
            @apply text-gray-700 bg-gray-100 border-r border-gray-light;
            font-weight: 400 !important;
        }
        td:first-child {
            max-width: 100px !important;
            min-width: 30px !important;
            width: 30px;
            left: 0;
            border-left: 0;
            position: sticky;
            z-index: 4;
            font-size: 14px !important;
            @apply text-gray-500 bg-gray-100;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 30px !important;
            width: 30px;
            border-left: 0;
            left: 0;
            z-index: 10;
            @apply text-gray-500;
        }
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
        @apply bg-black text-white px-6 py-3 rounded opacity-80 fixed z-50 !important;
    }
</style>
