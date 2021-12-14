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

                <tbody
                    v-if="columns.length > 0"
                    id="contentArea"
                    class="clusterize-content"
                >
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
                            :class="{
                                'hover:bg-primary-light cursor-pointer':
                                    variantTypeIndexes.indexOf(0) !== -1,
                                'outline-primary bg-primary-light ':
                                    selectedData === rowData,
                            }"
                        >
                            <div
                                v-if="variantTypeIndexes.indexOf(0) !== -1"
                                @click="handleOpenModal(rowData)"
                                class=""
                            >
                                {{ variantTypeIndexes }}
                            </div>
                            <div v-else>
                                {{ rowData === null ? '-' : rowData }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <a-modal
        v-model:visible="modalVisible"
        :footer="null"
        :afterClose="() => (selectedData = '')"
        centered
        width="800px"
        :destroyOnClose="true"
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
            class="flex items-center justify-center p-4 m-4 overflow-auto border rounded border-gray-light variant_modal"
        >
            {{ selectedData }}
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch, ref } from 'vue'
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
            const variantTypeIndexes = ref<Number[]>([0])
            const selectedData = ref('')
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
                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'contentArea',
                    })
                }
            })

            watch([tableRef, columns], () => {
                if (tableRef.value) {
                    columns.value.forEach((col, index) => {
                        if (
                            col.data_type.toLowerCase() === 'any' ||
                            col.data_type.toLowerCase() === 'variant'
                        ) {
                            variantTypeIndexes.value.push(index)
                        }
                    })
                    console.log(variantTypeIndexes.value)

                    new Clusterize({
                        scrollId: 'scrollArea',
                        contentId: 'headerArea',
                    })
                }
            })

            const handleOpenModal = (data) => {
                modalVisible.value = true
                selectedData.value = data
            }

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

    .variant_modal {
        max-height: 400px;
        max-width: 600px;
    }
</style>
