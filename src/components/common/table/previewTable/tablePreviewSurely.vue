<template>
    <div class="table_height">
        <s-table
            :columns="columns"
            :data-source="dataList"
            :scroll="{ y: 500 }"
            :pagination="false"
            ref="tableRef"
        >
        </s-table>
    </div>
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
            // const { dataList, columns } = toRefs(props)
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

            let columns1 = []
            for (let i = 1; i < 83000; i++) {
                columns1.push({
                    title: `Column ${i}`,
                    dataIndex: 'address',
                    width: '200px',
                })
            }

            const data = []
            for (let i = 0; i < 300000; i++) {
                data.push({
                    key: i,
                    address: `London Park no. ${i}`,
                })
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
                columns1,
                data,
            }
        },
    })
</script>

<style lang="less" module>
    // .tableStyle {
    //     @apply overflow-x-auto !important;

    //     td,
    //     th {
    //         max-width: 200px;
    //         min-width: 200px;
    //         text-align: left !important;
    //         height: 28px !important;
    //         padding: 0px 16px !important;
    //         font-size: 14px !important;
    //         @apply border border-gray-light text-gray-700;
    //     }

    //     tbody {
    //         font-weight: 400;
    //     }

    //     th {
    //         position: sticky;
    //         top: 0;
    //         border-top: 0;
    //         height: 36px !important;
    //         z-index: 4;
    //         font-size: 14px !important;
    //         @apply border-r border-gray-light bg-white text-gray-700;

    //         font-weight: 700 !important;
    //     }
    //     td:first-child {
    //         max-width: 100px !important;
    //         min-width: 42px !important;
    //         width: 42px;
    //         left: 0;
    //         border-left: 0;
    //         position: sticky;
    //         z-index: 4;
    //         font-size: 14px !important;
    //         color: #a0a4b6;
    //         @apply bg-white border;
    //         // box-shadow: inset -1px 0 #f3f3f3;
    //         // border-top-left-radius: 8px !important;
    //         // border-bottom-left-radius: 8px !important;
    //     }

    //     th:first-child {
    //         max-width: 100px !important;
    //         min-width: 42px !important;
    //         width: 42px;
    //         border-left: 0;
    //         left: 0;
    //         z-index: 10;
    //         color: #a0a4b6;
    //         font-weight: 400 !important;
    //         @apply bg-white border-b-0;

    //         // border-top-left-radius: 8px;
    //     }
    //     // th {
    //     // box-shadow: inset 0 -1px 0 #f3f3f3;
    //     // }
    //     @apply rounded-none !important;

    //     // @apply border-8 border-gray-300 !important;
    // }
    .variant_modal {
        :global(.ant-modal-body) {
            padding: 1rem !important;
        }
    }
</style>

<style lang="less" scoped>
    // @import url('clusterize.js/clusterize.css');

    .table_height {
        height: 600px !important;
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
