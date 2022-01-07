<template>
    <a-popover placement="bottomLeft" :trigger="['click']">
        <div
            class="flex items-center px-2 overflow-hidden border border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px; width: 100%"
        >
            <div
                v-if="selectedColumn?.label"
                style="max-width: 98%"
                class="flex items-center truncate"
            >
                <component
                    :is="
                        dataTypeImage({
                            attributes: { dataType: selectedColumn?.type },
                        })
                    "
                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                ></component>
                <span
                    class="mb-0 ml-1 text-sm text-gray-700 parent-ellipsis-container-base"
                >
                    {{ placeholder }}
                </span>
            </div>
            <span v-else>
                {{ placeholder }}
            </span>
        </div>
        <template #content>
            <div v-if="!tableSelected?.qualifiedName">
                <a-input
                    v-model:value="tableText"
                    placeholder="Enter table name"
                    class="border-l-0 border-r-0 rounded-none outline-none input_styles"
                    style="height: 36px"
                >
                    <template #suffix>
                        <AtlanIcon
                            icon="Search"
                            class="text-gray-500"
                        ></AtlanIcon>
                    </template>
                </a-input>
                <div
                    style="height: 300px !important; width: 400px"
                    class="overflow-y-scroll"
                >
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                        style="margin-left: 175px; margin-top: 100px"
                    ></AtlanIcon>

                    <template
                        v-if="tableDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in tableDropdownOption"
                        :key="item?.label + index"
                    >
                        <PopoverAsset
                            :item="item.item"
                            :placement="subIndex === 0 ? 'right' : 'left'"
                            :mouseEnterDelay="0.85"
                        >
                            <template #button>
                                <AtlanBtn
                                    class="flex-none px-0"
                                    size="sm"
                                    color="minimal"
                                    padding="compact"
                                    style="height: fit-content"
                                    @mousedown.stop="
                                        (e) => actionClick(e, item.item)
                                    "
                                >
                                    <span
                                        class="cursor-pointer text-primary whitespace-nowrap"
                                    >
                                        Show Preview</span
                                    >
                                    <AtlanIcon
                                        icon="ArrowRight"
                                        class="text-primary"
                                    />
                                </AtlanBtn>
                            </template>

                            <div
                                class="flex items-center justify-between pl-4 pr-2 cursor-pointer h-9 truncanimate-spin hover:bg-primary-selected-focus"
                                style="width: 400px"
                                @click="onSelectTable(item)"
                            >
                                <div class="flex items-center truncate">
                                    <AtlanIcon
                                        :icon="
                                            getEntityStatusIcon(
                                                assetType(item),
                                                certificateStatus(item)
                                            )
                                        "
                                        class="w-4 h-4 -mt-0.5 parent-ellipsis-container-extension"
                                    ></AtlanIcon>

                                    <span
                                        class="ml-2 parent-ellipsis-container-base"
                                        style="width: 300px"
                                        >{{ item?.label }}
                                    </span>
                                </div>
                                <div
                                    class="flex items-center justify-between text-gray-500"
                                >
                                    {{ item?.columnCount }}

                                    <AtlanIcon
                                        icon="ChevronRight"
                                        class="w-4 h-4 ml-1 -mt-0.5 text-gray-500"
                                    />
                                </div>
                            </div>
                        </PopoverAsset>
                    </template>
                    <div
                        v-if="tableDropdownOption.length === 0 && !isLoading"
                        class="flex items-center justify-center h-full"
                    >
                        No tables found
                    </div>
                </div>
            </div>

            <div v-else>
                <div
                    class="flex items-center justify-between h-9 pl-2 pr-4 truncanimate-spin pt-0.5"
                    style="width: 400px"
                >
                    <div class="flex items-center truncate">
                        <AtlanIcon
                            icon="ChevronLeft"
                            class="w-4 h-4 -mt-0.5 text-gray-500"
                            @click="onUnselectTable"
                        />

                        <span
                            class="ml-2 parent-ellipsis-container-base"
                            style="width: 300px"
                            >{{ tableSelected?.label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center justify-between text-gray-500"
                    >
                        {{ tableSelected?.columnCount }}
                    </div>
                </div>
                <a-input
                    v-model:value="columnText"
                    placeholder="Enter column name"
                    class="border-l-0 border-r-0 rounded-none outline-none input_styles"
                    style="height: 36px"
                >
                    <template #suffix>
                        <AtlanIcon
                            icon="Search"
                            class="text-gray-500"
                        ></AtlanIcon>
                    </template>
                </a-input>
                <div style="height: 278px !important" class="overflow-y-scroll">
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                        style="margin-left: 175px; margin-top: 100px"
                    ></AtlanIcon>
                    <template
                        v-if="columnDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in columnDropdownOption"
                        :key="item?.label + index"
                    >
                        <PopoverAsset
                            :item="item.item"
                            :placement="subIndex === 0 ? 'right' : 'left'"
                            :mouseEnterDelay="0.85"
                        >
                            <template #button>
                                <AtlanBtn
                                    class="flex-none px-0"
                                    size="sm"
                                    color="minimal"
                                    padding="compact"
                                    style="height: fit-content"
                                    @mousedown.stop="
                                        (e) => actionClick(e, item.item)
                                    "
                                >
                                    <span
                                        class="cursor-pointer text-primary whitespace-nowrap"
                                    >
                                        Show Preview</span
                                    >
                                    <AtlanIcon
                                        icon="ArrowRight"
                                        class="text-primary"
                                    />
                                </AtlanBtn>
                            </template>

                            <div
                                class="flex items-center justify-between pl-4 pr-4 cursor-pointer h-9 truncanimate-spin hover:bg-primary-selected-focus"
                                style="width: 400px"
                                @click="onSelectColumn(item)"
                                :class="
                                    selectedColumn?.columnQualifiedName ===
                                    item?.qualifiedName
                                        ? 'bg-primary-light'
                                        : ''
                                "
                            >
                                <div class="flex items-center truncate">
                                    <component
                                        :is="dataTypeImage(item)"
                                        class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                                    ></component>
                                    <span
                                        class="mb-0 ml-1 text-sm text-gray-700 parent-ellipsis-container-base"
                                    >
                                        {{ item.label }}
                                    </span>
                                </div>
                                <div
                                    class="relative h-full w-14 parent-ellipsis-container-extension"
                                >
                                    <ColumnKeys
                                        :isPrimary="item.isPrimary"
                                        :isForeign="item.isForeign"
                                        :isPartition="item.isPartition"
                                        topStyle="top-2.5"
                                    />
                                </div>
                            </div>
                        </PopoverAsset>
                    </template>
                    <div
                        v-if="columnDropdownOption.length === 0 && !isLoading"
                        class="flex items-center justify-center h-full"
                    >
                        No columns found
                    </div>
                </div>
            </div>
        </template>
    </a-popover>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRefs,
        PropType,
        ref,
        Ref,
        computed,
        inject,
        ComputedRef,
        onMounted,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Loader from '@common/loaders/page.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useVModels } from '@vueuse/core'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import ColumnKeys from '~/components/insights/playground/editor/vqb/panels/common/ColumnKeys/index.vue'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'

    import {
        InternalAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection'
    import useBody from './useBody'

    export default defineComponent({
        name: 'Table Selector',
        emits: ['change'],
        components: {
            Loader,
            ColumnKeys,
            PopoverAsset,
        },
        props: {
            selectedColumn: {
                type: Object,
                required: true,
            },
            panelIndex: {
                type: Number,
                required: true,
            },
            rowIndex: {
                type: Number,
                required: true,
            },
            subIndex: {
                type: Number,
                required: true,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            showColumnWithTable: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props, { emit }) {
            const {
                showColumnWithTable,
                selectedTablesQualifiedNames,
                panelIndex,
                subIndex,
                rowIndex,
            } = toRefs(props)
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { allowedTablesInJoinSelector } = useJoin()

            const tableQualifiedNamesContraint: Ref<{
                allowed: string[]
                notAllowed: string[]
            }> = ref(
                allowedTablesInJoinSelector(
                    panelIndex.value,
                    rowIndex.value,
                    subIndex.value,
                    activeInlineTab.value
                )
            )
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const tableText = ref('')
            const columnText = ref('')

            const { selectedColumn } = useVModels(props)

            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const getTableInitialBody = () => {
                return {
                    dsl: useBody({
                        schemaQualifiedName:
                            activeInlineTab.value.playground.editor.context
                                .attributeValue,

                        searchText: tableText.value,
                        tableQualifiedNamesContraint:
                            tableQualifiedNamesContraint.value,
                    }),
                    attributes: [
                        'name',
                        'displayName',
                        'dataType',
                        'isPrimary',
                        'isForeign',
                        'isPartition',
                        'name',
                        'displayName',
                        'typeName',
                        'dataType',
                        'description',
                        'userDescription',
                        'certificateStatus',
                        'ownerUsers',
                        'ownerGroups',
                        'classifications',
                        'tableCount',
                        'viewCount',
                        'columnCount',
                        'connectorName',
                        ...InternalAttributes,
                        ...BasicSearchAttributes,
                    ],
                }
            }

            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )
            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    replaceBody(getTableInitialBody())
                },
                {
                    immediate: true,
                }
            )
            watch(tableText, () => {
                replaceBody(getTableInitialBody())
            })

            watch(
                () => activeInlineTab.value.playground.vqb.selectedTables,
                () => {
                    tableQualifiedNamesContraint.value =
                        allowedTablesInJoinSelector(
                            panelIndex.value,
                            rowIndex.value,
                            subIndex.value,
                            activeInlineTab.value
                        )
                    replaceBody(getTableInitialBody())
                }
            )

            let tableSelected = ref(null)

            watch(columnText, () => {
                replaceBody(getColumnInitialBody(tableSelected?.value))
            })

            const totalCount = computed(() => data.value?.approximateCount || 0)

            const tableDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    qualifiedName: ls.attributes.qualifiedName,
                    attributes: ls.attributes,
                    typeName: ls.typeName,
                    item: ls,
                }))

                // console.log('list: ', list)

                return data
            })

            const columnDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    qualifiedName: ls.attributes.qualifiedName,
                    type: ls.attributes.dataType,
                    attributes: ls.attributes,
                    order: ls.attributes.order,
                    isPrimary: ls.attributes?.isPrimary,
                    isForeign: ls.attributes?.isForeign,
                    isPartition: ls.attributes?.isPartition,
                    item: ls,
                }))

                // console.log('list: ', list)
                console.log('col: ', data)
                return data
            })

            const getColumnInitialBody = (item) => {
                let data = {}
                if (item.typeName === 'Table') {
                    data = {
                        tableQualifiedName: item?.qualifiedName,
                        searchText: columnText.value,
                    }
                } else if (item.typeName === 'View') {
                    data = {
                        viewQualifiedName: item?.qualifiedName,
                        searchText: columnText.value,
                    }
                }
                return {
                    dsl: useBody(data),
                    attributes: [
                        'name',
                        'displayName',
                        'dataType',
                        'isPrimary',
                        'isForeign',
                        'isPartition',
                        'name',
                        'displayName',
                        'typeName',
                        'dataType',
                        'description',
                        'userDescription',
                        'certificateStatus',
                        'ownerUsers',
                        'ownerGroups',
                        'classifications',
                        'tableCount',
                        'viewCount',
                        'columnCount',
                        'connectorName',
                        ...InternalAttributes,
                        ...BasicSearchAttributes,
                    ],
                }
            }

            const onSelectTable = (item) => {
                // console.log('selected table: ', item)
                tableSelected.value = item
                replaceBody(getColumnInitialBody(item))
            }
            const onUnselectTable = () => {
                tableSelected.value = null
                columnDropdownOption.value = []
                replaceBody(getTableInitialBody())
            }

            const onSelectColumn = (item) => {
                let qualifiedName = item?.qualifiedName.split('/')
                let size = qualifiedName?.length
                console.log(
                    'name: ',
                    `${qualifiedName[size - 2]}.${qualifiedName[size - 1]}`
                )
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    columnQualifiedName: item.qualifiedName,
                }
                emit('change', item.qualifiedName)
                activeInlineTab.value.playground.vqb.selectedTables =
                    JSON.parse(
                        JSON.stringify(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                //activeInlineTab.value.playground.vqb.selectedTables
            }

            const placeholder = computed(() => {
                if (selectedColumn?.value?.label) {
                    let data =
                        selectedColumn.value.columnQualifiedName.split('/')

                    if (showColumnWithTable)
                        return `${data[data.length - 2]}.${
                            data[data.length - 1]
                        }`
                    else return `${data[data.length - 1]}`
                }

                let data = !tableSelected.value?.qualifiedName
                    ? `select from ${totalCount.value} tables`
                    : `select from ${totalCount.value} columns`

                return data
            })

            const actionClick = (event, t) => {
                if (
                    activeInlineTab?.value &&
                    Object.keys(activeInlineTab?.value).length
                ) {
                    if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                        /* Close it if it is already opened */
                        closeAssetSidebar(activeInlineTab.value)
                    } else {
                        let activeInlineTabCopy: activeInlineTabInterface =
                            Object.assign({}, activeInlineTab.value)
                        activeInlineTabCopy.assetSidebar.assetInfo = t
                        activeInlineTabCopy.assetSidebar.isVisible = true
                        openAssetSidebar(activeInlineTabCopy, 'not_editor')
                    }
                }
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            // watch(
            //     tableDropdownOption,
            //     () => {
            //         if (rowIndex.value == 0 && subIndex.value == 0) {
            //             if (tableDropdownOption.value.length > 0) {
            //                 const items = JSON.parse(
            //                     JSON.stringify(tableDropdownOption.value)
            //                 )
            //                 onSelectTable(items[0])
            //             }
            //         }
            //     },
            //     {
            //         immediate: true,
            //     }
            // )

            return {
                subIndex,
                actionClick,
                totalCount,
                data,
                isLoading,
                tableDropdownOption,
                tableText,
                onSelectTable,
                onUnselectTable,
                tableSelected,
                columnText,
                columnDropdownOption,
                onSelectColumn,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                certificateStatus,
                selectedColumn,
                placeholder,
            }
        },
    })
</script>
<style lang="less" module>
    .selector {
        :global(.ant-select-selector) {
            height: 100% !important;
            @apply border border-gray-300 !important;
        }
        :global(.ant-select-selection-item::after) {
            display: none !important;
        }
    }
    // input::placeholder {
    //     color: #6f7590 !important;
    // }
</style>
<style lang="less" scoped>
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .input_styles {
        width: 100% !important;
        // padding: 5px;
        // margin: 0;
        -webkit-box-sizing: border-box !important;
        -moz-box-sizing: border-box !important;
        -o-box-sizing: border-box !important;
        -ms-box-sizing: border-box !important;
        box-sizing: border-box !important;
    }
</style>
