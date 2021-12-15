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
                                <a-tooltip :title="col.data_type">
                                    <component
                                        :is="images[getDataType(col.data_type)]"
                                        class="w-4 h-4 mr-1 cursor-pointer -mt-0.5"
                                    ></component>
                                </a-tooltip>
                                <Tooltip :tooltip-text="`${col.title}`" />
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
                                    : 'truncate '
                            "
                        >
                            {{ index + 1 }}
                        </td>

                        <td
                            v-for="(rowData, index) in row"
                            :key="index"
                            class="bg-white"
                            :class="{
                                'outline-primary bg-primary-light ':
                                    selectedData === rowData,
                                'cursor-pointer hover:bg-primary-light':
                                    variantTypeIndexes.includes(index),
                            }"
                        >
                            <div
                                v-if="variantTypeIndexes.includes(index)"
                                class="flex items-center justify-between overflow-ellipsis"
                                v-on:click="handleOpenModal(rowData)"
                            >
                                <div style="max-width: 70%">{{ rowData }}</div>
                                <AtlanIcon
                                    icon="Expand"
                                    class="h-4 w-auto mb-0.5"
                                />
                            </div>
                            <div v-else>
                                <Tooltip :tooltip-text="`${rowData}`" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <a-modal
        v-if="modalVisible"
        v-model:visible="modalVisible"
        :footer="null"
        :afterClose="() => (selectedData = null)"
        centered
        :destroyOnClose="true"
        :class="$style.variant_modal"
        width="600px"
    >
        <template #title>
            <div class="flex items-center text-gray-700 gap-x-1.5">
                <AtlanIcon
                    icon="Variant"
                    class="w-auto h-4 text-gray-500 mb-0.5"
                />
                Response Type
            </div>
        </template>
        <div
            class="overflow-auto border rounded border-gray-light variant_body"
        >
            <pre>
                <code>
                    {{selectedData}}
                </code>
            </pre>
        </div>
    </a-modal>
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
    import AtlanIcon from '../common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'AtlanTable',
        components: {
            Tooltip,
            AtlanIcon,
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
            const variantTypeIndexes = ref<Number[]>([])
            const selectedData = ref(null)
            const modalVisible = ref<boolean>(false)
            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

            watch([tableRef, dataList], () => {
                if (tableRef.value) {
                    /*  new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'contentArea',
                    }) */
                }
            })

            watch([tableRef, columns], () => {
                if (tableRef.value) {
                    /* new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'headerArea',
                    }) */
                }
            })

            const handleOpenModal = (data) => {
                modalVisible.value = true
                selectedData.value = data
            }

            onMounted(() => {
                columns.value.forEach((col, index) => {
                    if (
                        col.data_type.toLowerCase() === 'any' ||
                        col.data_type.toLowerCase() === 'variant'
                    ) {
                        variantTypeIndexes.value.push(index)
                    }
                })
            })

            return {
                tableRef,
                images,
                getDataType,
                variantTypeIndexes,
                selectedData,
                handleOpenModal,
                modalVisible,
            }
        },
    })
</script>

<style lang="less" module>
    .tableStyle {
        @apply rounded !important;
        td,
        th {
            max-width: 200px;
            min-width: 200px;
            text-align: left !important;
            height: 32px !important;
            padding: 0px 16px !important;
            font-size: 12px !important;
            @apply border border-gray-light !important;
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
            @apply text-gray-700 bg-gray-100;
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
</style>
