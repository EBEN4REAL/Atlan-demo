<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center w-full z-1"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
        ]"
        @click.stop="() => {}"
    >
        <template
            v-if="enrichedSelectedItems.length !== 0"
            v-for="(item, index) in enrichedSelectedItems"
            :key="item + index"
        >
            <slot name="chip" :item="item"> </slot>
        </template>

        <a-input
            v-if="selectedItems.length > 0 && isAreaFocused"
            ref="inputRef"
            v-model:value="inputValue1"
            @focus="
                () => {
                    isAreaFocused = true
                }
            "
            @change="input1Change"
            :placeholder="placeholder"
            :style="`width:${placeholder.length + 2}ch;`"
            :class="[
                'p-0 pr-4 text-sm border-none shadow-none outline-none  focus-none',
            ]"
        />
        <a-input
            v-if="selectedItems.length == 0"
            ref="initialRef"
            v-model:value="inputValue2"
            @change="input2Change"
            :placeholder="placeholder"
            :class="[
                'w-full p-0  border-none shadow-none outline-none text-sm  focus-none',
            ]"
        />
        <div class="absolute right-2">
            <AtlanIcon
                v-if="
                    findVisibility(
                        'search',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedItems
                    )
                "
                icon="Search"
                class="w-4 h-4"
            />
            <AtlanIcon
                icon="ChevronDown"
                class="w-4 h-4"
                v-if="
                    findVisibility(
                        'chevronDown',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedItems
                    )
                "
            />
            <AtlanIcon
                icon="Cross"
                class="w-4 h-4 cursor-pointer"
                @click.stop="clearAllSelected"
                v-if="
                    findVisibility(
                        'cross',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedItems
                    )
                "
            />
        </div>

        <div
            v-if="isAreaFocused"
            @click.stop="() => {}"
            :style="`width: 100%;top:${topPosShift}px;`"
            :class="[
                'absolute z-10  pb-2  bg-white rounded custom-shadow position ',
            ]"
        >
            <!--  -->
            <div
                v-if="!tableSelected?.qualifiedName"
                style="height: 250px"
                :class="[
                    tableDropdownOption.length === 0
                        ? 'flex justify-center items-center'
                        : '',
                ]"
            >
                <Loader
                    v-if="isLoading"
                    style="min-height: 100px !important"
                ></Loader>
                <div
                    class="overflow-auto"
                    v-if="tableDropdownOption.length !== 0"
                >
                    <template
                        v-if="tableDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in tableDropdownOption"
                        :key="item?.label + index"
                    >
                        <div
                            class="flex items-center justify-between pl-4 pr-2 cursor-pointer h-9 truncanimate-spin hover:bg-primary-selected-focus"
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
                    </template>
                </div>
                <div
                    v-if="tableDropdownOption.length === 0 && !isLoading"
                    class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                >
                    No tables found
                </div>
            </div>
            <!-- For columns -->
            <div v-else>
                <div
                    class="flex items-center justify-between h-9 pl-2 pr-4 truncanimate-spin pt-0.5 border border-b bordery-gray-300"
                >
                    <div class="flex items-center truncate">
                        <AtlanIcon
                            icon="ChevronLeft"
                            class="w-4 h-4 -mt-0.5 text-gray-500"
                            @click="onUnselectTable"
                        />

                        <span class="ml-2 parent-ellipsis-container-base"
                            >{{ tableSelected?.label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center justify-between text-gray-500"
                    >
                        {{ tableSelected?.columnCount }}
                    </div>
                </div>
                <div
                    class="pl-2 pr-2 overflow-y-auto"
                    style="height: 250px"
                    :class="[
                        columnDropdownOption.length === 0
                            ? 'flex justify-center items-center'
                            : '',
                    ]"
                >
                    <Loader
                        v-if="isLoading"
                        style="min-height: 100px !important"
                    ></Loader>
                    <template
                        v-if="columnDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in columnDropdownOption"
                        :key="item?.label + index"
                    >
                        <a-checkbox
                            :checked="map[item.value]"
                            @change="
                                (checked) => onCheckboxChange(checked, item)
                            "
                            class="inline-flex flex-row-reverse items-center w-full px-2 py-1 rounded atlanReverse hover:bg-primary-light"
                        >
                            <div
                                class="justify-between parent-ellipsis-container"
                            >
                                <div class="parent-ellipsis-container">
                                    <component
                                        :is="getDataTypeImage(item.type)"
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
                                    v-if="item.isPrimary || item.isForeign"
                                >
                                    <div
                                        class="absolute right-0 flex items-center -top-2.5"
                                    >
                                        <AtlanIcon
                                            icon="PrimaryKey"
                                            style="color: #3ca5bc"
                                            class="w-4 h-4 mr-1"
                                        ></AtlanIcon>
                                        <span
                                            style="color: #3ca5bc"
                                            class="text-sm"
                                            >Pkey</span
                                        >
                                    </div>
                                    <div
                                        class="absolute flex items-center -top-2.5"
                                        :class="
                                            item.isPrimary
                                                ? 'right-14'
                                                : 'right-0'
                                        "
                                    >
                                        <AtlanIcon
                                            icon="ForeignKey"
                                            class="w-4 h-4 mr-1 text-purple-700"
                                        ></AtlanIcon>
                                        <span class="text-sm text-purple-700"
                                            >Fkey</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </a-checkbox>
                    </template>

                    <div
                        v-if="columnDropdownOption.length === 0 && !isLoading"
                        class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                    >
                        No columns found
                    </div>
                </div>
            </div>
            <!--  -->
        </div>
    </div>
</template>

<script lang="ts">
    import {
        nextTick,
        defineComponent,
        watch,
        toRefs,
        PropType,
        ref,
        computed,
        inject,
        ComputedRef,
        onMounted,
        onUpdated,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Loader from '@common/loaders/page.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useVModels } from '@vueuse/core'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Table Selector',
        emits: ['change'],
        components: {
            Loader,
        },
        props: {
            selectedColumn: {
                type: Object,
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
            selectedItems: {
                type: Object as PropType<string[]>,
                required: true,
            },
            selectedColumnsData: {
                type: Object as PropType<
                    Array<{
                        columnsQualifiedName: string
                        label: string
                        type: Number
                    }>
                >,
                required: true,
            },
            showSelectAll: {
                type: Boolean,
                required: false,
                default: () => true,
            },
        },
        setup(props, { emit }) {
            const {
                showColumnWithTable,
                selectedTablesQualifiedNames,
                showSelectAll,
            } = toRefs(props)
            const { getDataTypeImage } = useColumn()
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const tableText = ref('')
            const columnText = ref('')
            const queryText = ref('')

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

                        searchText: queryText.value,
                        tableQualifiedNames: selectedTablesQualifiedNames.value
                            ?.filter((x) => x !== null || undefined)
                            .map((t) => t.tableQualifiedName),
                    }),
                    attributes: [
                        'name',
                        'displayName',
                        'columnCount',
                        'certificateStatus',
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

            let tableSelected = ref(null)

            watch(queryText, () => {
                if (tableSelected?.value)
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
                }))

                // console.log('list: ', list)

                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
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
                    value: ls.attributes.qualifiedName,
                }))

                // console.log('list: ', list)

                data.sort((x, y) => {
                    if (x.order < y.order) return -1
                    if (x.order > y.order) return 1
                    return 0
                })
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
                        'columnCount',
                        'certificateStatus',
                        'dataType',
                        'order',
                        'isPrimary',
                        'isForeign',
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
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    columnQualifiedName: item.qualifiedName,
                }
                emit('change', item.qualifiedName)
            }

            const placeholder = computed(() => {
                if (isLoading.value) return 'Loading...'
                if (!tableSelected.value)
                    return `Search from ${totalCount.value} tables`
                else return `Search from ${totalCount.value} columns`
            })

            ////////////////////////////////////////

            const onCheckboxChange = (checked, item) => {
                const selectedColumnsDataCopy = JSON.parse(
                    JSON.stringify(selectedColumnsData.value)
                )
                if (checked.target.checked) {
                    map.value[item.value] = true
                    selectedColumnsDataCopy.push({
                        label: item.label,
                        type: item.type,
                        columnsQualifiedName: item.value,
                    })
                } else {
                    delete map.value[item.value]
                    const _index = selectedColumnsDataCopy.findIndex(
                        (t) => t.columnsQualifiedName === item.value
                    )
                    selectedColumnsDataCopy.splice(_index, 1)
                }
                selectedItems.value = [...Object.keys(map.value)]
                selectedColumnsData.value = selectedColumnsDataCopy
                setFocusedCusror()
            }

            const map = ref({})
            selectedItems.value?.forEach((selectedItem) => {
                map.value[selectedItem] = true
            })

            const enrichedSelectedItems = computed(() => {
                const data: any[] = []
                selectedItems.value.forEach((val) => {
                    if (val === 'all') {
                        data.push({
                            type: 'Columns',
                            label: 'All columns',
                        })
                    } else {
                        const t = selectedColumnsData.value.find(
                            (e) => e.columnsQualifiedName === val
                        )
                        data.push({
                            type: t?.type ?? 'Columns',
                            label: t?.label,
                        })
                    }
                })
                return data
            })

            const inputRef = ref()

            const initialRef = ref()
            const selectAll = ref(false)
            const mouseOver = ref(false)
            const topPosShift = ref(0)
            const inputValue1 = ref('')
            const inputValue2 = ref('')
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })

            const setFoucs = () => {
                // if (!tableQualfiedName.value) return
                isAreaFocused.value = true
                nextTick(() => {
                    console.log(inputRef?.value, 'he')
                    // if (tableQualfiedName.value)
                    inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                // if (!tableQualfiedName.value) return
                nextTick(() => {
                    // if (tableQualfiedName.value)
                    inputRef?.value?.focus()
                })
            }
            const input1Change = () => {
                setFoucs()
                queryText.value = inputValue1.value
                // emit('queryTextChange')
            }
            const input2Change = () => {
                setFoucs()
                queryText.value = inputValue2.value
                // emit('queryTextChange')
            }

            const handleContainerBlur = (event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (!container.value.contains(event.relatedTarget)) {
                    isAreaFocused.value = false
                    inputValue1.value = ''
                    inputValue2.value = ''
                    queryText.value = ''
                }
            }

            const inputChange = () => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            }
            const reComputeSelectedColumns = () => {
                //selectedTablesQualifiedNames
                const copySelectedItems: string[] = []

                // JSON.parse(
                //     JSON.stringify(selectedItems.value)
                // )
                selectedItems.value.forEach((columnQualifiedName: string) => {
                    selectedTablesQualifiedNames.value?.forEach((x) => {
                        if (
                            columnQualifiedName?.includes(x.tableQualifiedName)
                        ) {
                            copySelectedItems.push(columnQualifiedName)
                        }
                    })
                })

                const copyColumnsData: any = []

                selectedColumnsData.value.forEach((columnData) => {
                    let _t: any = undefined
                    copySelectedItems.forEach((columnQualifiedName) => {
                        if (
                            columnQualifiedName ===
                            columnData.columnsQualifiedName
                        ) {
                            _t = { ...columnData }
                        }
                    })
                    if (_t) {
                        copyColumnsData.push({
                            ..._t,
                        })
                    }
                })

                selectedItems.value = copySelectedItems
                selectedColumnsData.value = copyColumnsData
            }

            const findVisibility = (
                key: string,
                isAreaFocused,
                mouseHover,
                tableQualifiedName,
                selectedItems
            ) => {
                switch (key) {
                    case 'chevronDown': {
                        if (!isAreaFocused) {
                            if (selectedItems.length === 0 && mouseHover)
                                return true
                            if (selectedItems.length === 0 && !mouseHover)
                                return true
                            if (selectedItems.length !== 0 && !mouseHover)
                                return true
                        }
                        break
                    }
                    case 'cross': {
                        if (isAreaFocused) return false
                        if (
                            !isAreaFocused &&
                            selectedItems.length > 0 &&
                            mouseHover
                        )
                            return true
                        else return false
                        break
                    }
                    case 'search': {
                        if (!isAreaFocused) return false
                        if (tableQualifiedName) return true
                        break
                    }
                }
            }

            const handleMouseOver = () => {
                if (!mouseOver.value) mouseOver.value = true
            }
            const handleMouseOut = () => {
                if (mouseOver.value) mouseOver.value = false
            }
            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
            })
            onUpdated(() => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            })
            const clearAllSelected = () => {
                selectedItems.value = []
                map.value = {}
                selectedColumnsData.value = []
                console.log(map.value, 'destroy')
            }

            watch(queryText, () => {
                replaceBody(getTableInitialBody())
            })
            watch(tableSelected, () => {
                nextTick(() => {
                    // if (tableQualfiedName.value)
                    inputRef?.value?.focus()
                })
            })
            watch(isAreaFocused, () => {
                if (!isAreaFocused.value) {
                    if (tableSelected.value !== null) {
                        replaceBody(getTableInitialBody())
                        tableSelected.value = null
                    }
                }
            })
            watch(selectedTablesQualifiedNames, () => {
                replaceBody(getTableInitialBody())
                reComputeSelectedColumns()
            })

            return {
                map,
                showSelectAll,
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
                onCheckboxChange,
                enrichedSelectedItems,
                inputRef,
                initialRef,
                selectAll,
                mouseOver,
                topPosShift,
                inputValue1,
                inputValue2,
                isAreaFocused,
                container,
                clickPos,
                setFoucs,
                setFocusedCusror,
                handleContainerBlur,
                inputChange,
                findVisibility,
                handleMouseOver,
                handleMouseOut,
                queryText,
                input1Change,
                input2Change,
                getDataTypeImage,
                clearAllSelected,
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
</style>
<style lang="less" scoped>
    .border-plus {
        padding: 1px;
    }
    .border-minus {
        padding: 0px;
    }
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
    .selector-height {
        min-height: 34px;
    }
    .position {
        @apply right-0;
    }
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .box-shadow-focus {
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
    .px-3-1 {
        padding-left: 13px;
        padding-right: 13px;
    }
    .py-1-1 {
        padding-top: 7px;
        padding-bottom: 7px;
    }
    .chip-container {
        gap: 4px;
        max-width: 100% !important;
    }
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }
</style>
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
