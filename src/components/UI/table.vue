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
                <thead id="headerArea" class="clusterize-content">
                    <tr>
                        <th
                            class="truncate bg-gray-100 border border-gray-light"
                        >
                            #
                        </th>
                        <th
                            v-for="(col, index) in columns"
                            :key="index"
                            class="truncate bg-gray-100 border border-gray-light"
                        >
                            <div class="flex items-center">
                                <a-tooltip>
                                    <template #title>{{
                                        col.data_type
                                    }}</template>
                                    <component
                                        :is="images[getDataType(col.data_type)]"
                                        class="w-4 h-4 mr-1 cursor-pointer -mt-0.5"
                                    ></component>
                                </a-tooltip>

                                {{ col.title }}
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
                                    : 'truncate bg-gray-100 border border-gray-light'
                            "
                        >
                            {{ index + 1 }}
                        </td>

                        <td
                            v-for="(rowData, key) in row"
                            :key="key"
                            class="truncate bg-white border border-gray-light"
                        >
                            {{ rowData === null ? '-' : rowData }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch, ref } from 'vue'
    import Clusterize from 'clusterize.js'
    import Tooltip from '@common/ellipsis/index.vue'
    import { images, dataTypeCategoryList } from '~/constant/dataType'

    export default defineComponent({
        name: 'AtlanTable',
        components: { Tooltip },
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

            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

            watch([tableRef, dataList], () => {
                if (tableRef.value) {
                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'contentArea',
                    })
                }
            })

            watch([tableRef, columns], () => {
                if (tableRef.value) {
                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'headerArea',
                    })
                }
            })

            return {
                tableRef,
                images,
                getDataType,
            }
        },
    })
</script>

<style lang="less" module>
    .tableStyle {
        border-radius: 10px !important;

        td,
        th {
            width: 200px;
            max-width: 250px !important;
            min-width: 150px !important;
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
            min-width: 30px !important;
            width: 30px;
            left: 0;
            position: sticky;
            z-index: 4;
            font-size: 14px !important;
            @apply text-gray-500;
        }

        th:first-child {
            max-width: 100px !important;
            min-width: 30px !important;
            width: 30px;
            left: 0;
            z-index: 10;
            @apply text-gray-500;
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
</style>
