<template>
    <div class="table_height" v-bind="containerProps">
        <table>
            <thead>
                <td v-for="item in columns" :key="item.key">
                    {{ item.title }}
                </td>
            </thead>

            <tbody style="height: 600px" v-bind="wrapperProps">
                <tr
                    v-for="(item, index) in list"
                    :key="index"
                    style="height: 32px"
                >
                    <td v-for="col in columns" :key="col.dataIndex + index">
                        <p class="truncate w-44">
                            {{ item.data[col.dataIndex] }}
                        </p>
                    </td>
                    <!-- 
                    {{
                        item.data['product_name2']
                    }} -->
                </tr>
            </tbody>
        </table>
    </div>

    <!-- <div v-bind="containerProps" style="height: 600px">
        <div>
            <div v-bind="wrapperProps">
                <div
                    v-for="item in list"
                    :key="item.index"
                    style="height: 32px"
                >
                    {{ item.data['product_name2'] }}
                </div>
            </div>
        </div>
    </div> -->
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
    import { useVirtualList } from '@vueuse/core'

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

            const { list, containerProps, wrapperProps } = useVirtualList(
                dataList.value,
                {
                    itemHeight: 11,
                }
            )

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
                list,
                containerProps,
                wrapperProps,
            }
        },
    })
</script>

<style lang="less" module>
    td {
        // color: #1078d1;
        height: 32px !important;
        padding-left: 10px;
    }

    tbody th:last-of-type,
    thead tr:nth-child(2) th:nth-child(2),
    thead tr:first-child th:first-child {
        border-right: 1px solid #ddd;
    }

    // table {
    //     height: 600px !important;
    // }
</style>

<style lang="less" scoped>
    // @import url('clusterize.js/clusterize.css');

    .table_height {
        height: 100% !important;

        overflow: scroll;
    }
</style>
