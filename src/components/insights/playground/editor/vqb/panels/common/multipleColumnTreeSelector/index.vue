<template>
    <div
        ref="container"
        @click="
            () => {
                if (!disabled) {
                    isAreaFocused = true
                }
            }
        "
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        class="relative flex items-center w-full z-1"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <template
            v-if="enrichedSelectedItems.length !== 0"
            v-for="(item, index) in enrichedSelectedItems"
            :key="item + index"
        >
            <slot name="chip" :item="item"> </slot>
        </template>
        <span v-else class="text-gray-500">
            {{ placeholder }}
        </span>

        <div class="absolute right-2">
            <AtlanIcon
                v-if="
                    findVisibility(
                        'search',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedItems
                    ) && !disabled
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
                @click="clearAllSelected"
                v-if="
                    findVisibility(
                        'cross',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedItems
                    ) && !disabled
                "
            />
        </div>
        <teleport to="body">
            <div
                v-if="isAreaFocused"
                :style="`width: ${containerPosition.width}px;top:${
                    containerPosition.top + containerPosition.height
                }px;left:${containerPosition.left}px`"
                :class="[
                    'absolute z-10  pb-2  bg-white rounded custom-shadow position dropdown-container',
                ]"
            >
                <!--  -->
                <div
                    :class="['w-full dropdown-container']"
                    style="min-height: 180px"
                >
                    <div
                        class="w-full dropdown-container"
                        v-if="!tableSelected?.qualifiedName"
                    >
                        <div
                            class="px-4 py-3 border-b border-gray-300 dropdown-container"
                        >
                            <div
                                class="flex items-center justify-between w-full dropdown-container"
                                style="min-width: 100%"
                            >
                                <CustomInput
                                    v-model:queryText="queryText"
                                    :placeholder="placeholder"
                                />
                            </div>
                        </div>
                        <div
                            v-if="!tableSelected?.qualifiedName && !isLoading"
                            style="height: 205px"
                            class="w-full overflow-y-auto dropdown-container"
                            :class="[
                                tableDropdownOption.length === 0
                                    ? 'flex justify-center items-center'
                                    : '',
                            ]"
                        >
                            <template
                                v-if="
                                    tableDropdownOption.length !== 0 &&
                                    !isLoading
                                "
                                v-for="(item, index) in tableDropdownOption"
                                :key="item?.label + index"
                            >
                                <PopoverAsset
                                    :item="item.item"
                                    placement="left"
                                    :mouseEnterDelay="0.85"
                                >
                                    <template #button>
                                        <AtlanBtn
                                            class="flex-none px-0"
                                            size="sm"
                                            color="minimal"
                                            padding="compact"
                                            style="height: fit-content"
                                            @click="
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
                                        @click="(e) => onSelectTable(item, e)"
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
                                </PopoverAsset>
                            </template>
                            <div
                                v-if="
                                    tableDropdownOption.length === 0 &&
                                    !isLoading
                                "
                                class="flex items-center justify-center h-full text-sm text-center text-gray-400 dropdown-container"
                            >
                                No tables found
                            </div>
                        </div>
                    </div>

                    <!-- For columns -->
                    <div
                        class="w-full dropdown-container"
                        v-if="
                            tableSelected?.qualifiedName &&
                            selectedTablesQualifiedNames.length >= 2
                        "
                    >
                        <div
                            class="flex items-center justify-between pt-3 pl-2 pr-4 truncanimate-spin dropdown-container"
                        >
                            <div
                                class="flex items-center text-gray-700 truncate dropdown-container"
                            >
                                <AtlanIcon
                                    icon="ChevronLeft"
                                    class="w-4 h-4 -mt-0.5"
                                    style="min-width: 16px"
                                    @click.stop="onUnselectTable"
                                />

                                <span
                                    class="ml-2 text-sm parent-ellipsis-container-base"
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
                            class="px-4 py-3 border-b border-gray-300 dropdown-container"
                        >
                            <div
                                class="flex items-center justify-between w-full"
                                style="min-width: 100%"
                            >
                                <CustomInput
                                    v-model:queryText="queryText"
                                    :placeholder="placeholder"
                                />
                            </div>
                        </div>

                        <div
                            v-if="!isLoading"
                            class="pl-2 pr-2 overflow-y-auto dropdown-container"
                            style="height: 205px"
                            :class="[
                                columnDropdownOption.length === 0
                                    ? 'flex justify-center items-center '
                                    : '',
                            ]"
                            @click.stop="() => {}"
                        >
                            <template
                                v-if="
                                    columnDropdownOption.length !== 0 &&
                                    !isLoading
                                "
                                v-for="(item, index) in columnDropdownOption"
                                :key="item?.label + index"
                            >
                                <PopoverAsset
                                    :item="item.item"
                                    placement="left"
                                    :mouseEnterDelay="0.85"
                                    class="dropdown-container"
                                >
                                    <template #button>
                                        <AtlanBtn
                                            class="flex-none px-0"
                                            size="sm"
                                            color="minimal"
                                            padding="compact"
                                            style="height: fit-content"
                                            @click="
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

                                    <a-checkbox
                                        :checked="map[item.value]"
                                        @change="
                                            (checked) =>
                                                onCheckboxChange(checked, item)
                                        "
                                        class="inline-flex flex-row-reverse items-center w-full px-2 py-1 rounded atlanReverse hover:bg-primary-light dropdown-container"
                                    >
                                        <div
                                            class="justify-between parent-ellipsis-container dropdown-container"
                                        >
                                            <div
                                                class="parent-ellipsis-container"
                                            >
                                                <component
                                                    :is="
                                                        getDataTypeImage(
                                                            item.type
                                                        )
                                                    "
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
                                                    :isPartition="
                                                        item.isPartition
                                                    "
                                                    topStyle="-top-2"
                                                />
                                            </div>
                                        </div>
                                    </a-checkbox>
                                </PopoverAsset>
                            </template>

                            <div
                                v-if="
                                    columnDropdownOption.length === 0 &&
                                    !isLoading
                                "
                                class="flex items-center justify-center h-full text-sm text-center text-gray-400 dropdown-container"
                            >
                                No columns found
                            </div>
                        </div>
                    </div>
                    <Loader
                        v-if="isLoading"
                        style="min-height: 205px !important"
                    ></Loader>

                    <!--  -->
                </div>
            </div>
        </teleport>
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
        onUnmounted,
        Ref,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Loader from '@common/loaders/page.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useVModels } from '@vueuse/core'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import ColumnKeys from '~/components/insights/playground/editor/vqb/panels/common/ColumnKeys/index.vue'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'

    import { attributes } from '~/components/insights/playground/editor/vqb/composables/VQBattributes'
    import AtlanBtn from '~/components/UI/button.vue'
    import useBody from './useBody'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import CustomInput from '../input/index.vue'

    export default defineComponent({
        name: 'Table Selector',
        emits: ['change'],
        components: {
            Loader,
            ColumnKeys,
            PopoverAsset,
            AtlanBtn,
            CustomInput,
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
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props, { emit }) {
            const {
                disabled,
                showColumnWithTable,
                selectedTablesQualifiedNames,
                showSelectAll,
            } = toRefs(props)
            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })
            const { getDataTypeImage } = useColumn()
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

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

            const getTableInitialBody = (
                selectedTablesQualifiedNames: selectedTables[]
            ) => {
                return {
                    dsl: useBody({
                        schemaQualifiedName:
                            activeInlineTab.value.playground.editor.context
                                .attributeValue,
                        context:
                            activeInlineTab.value.playground.editor.context,

                        searchText: queryText.value,
                        tableQualifiedNames: selectedTablesQualifiedNames
                            ?.filter((x) => x !== null || undefined)
                            .map((t) => t.tableQualifiedName),
                    }),
                    attributes: attributes,
                }
            }

            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )
            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    replaceBody(
                        getTableInitialBody(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                },
                {
                    immediate: true,
                }
            )

            let tableSelected = ref(null)

            const totalCount = computed(() => data.value?.approximateCount || 0)

            const tableDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    qualifiedName: ls.attributes?.qualifiedName,
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
                    qualifiedName: ls.attributes?.qualifiedName,
                    type: ls.attributes?.dataType,
                    attributes: ls.attributes,
                    order: ls.attributes?.order,
                    isPrimary: ls.attributes?.isPrimary,
                    isForeign: ls.attributes?.isForeign,
                    isPartition: ls.attributes?.isPartition,
                    value: ls.attributes?.qualifiedName,
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
                        searchText: queryText.value,
                    }
                } else if (item.typeName === 'View') {
                    data = {
                        viewQualifiedName: item?.qualifiedName,
                        searchText: queryText.value,
                    }
                }

                return {
                    dsl: useBody(data),
                    attributes: attributes,
                }
            }

            const onSelectTable = (item, event) => {
                // console.log('selected table: ', item)
                tableSelected.value = item
                queryText.value = ''
                inputValue1.value = ''
                inputValue2.value = ''
                replaceBody(getColumnInitialBody(item))
                // updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                return false
            }
            const onUnselectTable = () => {
                tableSelected.value = null
                columnDropdownOption.value = []
                replaceBody(
                    getTableInitialBody(
                        activeInlineTab.value.playground.vqb.selectedTables
                    )
                )
                updateVQB(activeInlineTabKey, inlineTabs)
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
                    JSON.stringify(selectedColumnsData.value ?? [])
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
                            ...t,
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
                if (disabled?.value) return
                isAreaFocused.value = true
                nextTick(() => {
                    if (disabled?.value) return
                    inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                if (disabled?.value) return
                nextTick(() => {
                    if (disabled?.value) return
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
                if (event.relatedTarget == null) {
                    isAreaFocused.value = false
                    inputValue1.value = ''
                    inputValue2.value = ''
                    queryText.value = ''
                }
                // if (!container.value.contains(event.relatedTarget)) {
                //     isAreaFocused.value = false
                //     inputValue1.value = ''
                //     inputValue2.value = ''
                //     queryText.value = ''
                // }
            }

            const inputChange = () => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            }
            const reComputeSelectedColumns = (
                selectedTablesQualifiedNames: selectedTables[]
            ) => {
                const copySelectedItems: string[] = []
                const uniqueSelectedItems = new Set(selectedItems.value)
                Array.from(uniqueSelectedItems).forEach(
                    (columnQualifiedName: string) => {
                        selectedTablesQualifiedNames?.forEach((x) => {
                            if (
                                columnQualifiedName?.includes(
                                    x.tableQualifiedName
                                )
                            ) {
                                copySelectedItems.push(columnQualifiedName)
                            }
                        })
                    }
                )

                const copyColumnsData: any = []

                selectedColumnsData.value?.forEach((columnData) => {
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
                selectedItems.value = Array.from(new Set(copySelectedItems))
                selectedColumnsData.value = Array.from(new Set(copyColumnsData))
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
                            if (disabled?.value) return true
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
                observer.value = new ResizeObserver(onResize).observe(
                    container.value
                )
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height

                document?.addEventListener('click', function (event) {
                    let isClickInside = container.value?.contains(event.target)

                    if (!isClickInside) {
                        isClickInside =
                            event?.target?.classList?.contains('ant-input')
                    }
                    if (!isClickInside) {
                        isClickInside =
                            event?.target?.classList?.contains(
                                'dropdown-container'
                            )
                    }

                    if (!isClickInside) {
                        isAreaFocused.value = false
                    }
                })
            })

            const onResize = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }
            onUpdated(() => {
                nextTick(() => {
                    const viewportOffset =
                        container.value?.getBoundingClientRect()
                    if (viewportOffset?.width)
                        containerPosition.value.width = viewportOffset?.width
                    if (viewportOffset?.top)
                        containerPosition.value.top = viewportOffset?.top
                    if (viewportOffset?.left)
                        containerPosition.value.left = viewportOffset?.left
                    if (viewportOffset?.height)
                        containerPosition.value.height = viewportOffset?.height
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            })
            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
            })
            const clearAllSelected = () => {
                selectedItems.value = []
                map.value = {}
                selectedColumnsData.value = []
                updateVQB(activeInlineTabKey, inlineTabs)

                console.log(map.value, 'destroy')
            }
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

            watch(queryText, () => {
                if (tableSelected?.value?.qualifiedName)
                    replaceBody(getColumnInitialBody(tableSelected?.value))
                else {
                    replaceBody(
                        getTableInitialBody(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                }
            })

            watch(tableSelected, () => {
                nextTick(() => {
                    // if (tableQualfiedName.value)
                    inputRef?.value?.focus()
                })
            })
            watch(isAreaFocused, (newAreaFocused) => {
                if (!newAreaFocused) {
                    if (tableSelected.value !== null) {
                        replaceBody(
                            getTableInitialBody(
                                activeInlineTab.value.playground.vqb
                                    .selectedTables
                            )
                        )
                        tableSelected.value = null
                        updateVQB(activeInlineTabKey, inlineTabs)
                    }
                }
            })
            watch(
                () => activeInlineTab.value.playground.vqb.selectedTables,
                () => {
                    replaceBody(
                        getTableInitialBody(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                    /* For removing the columns when table got removed */
                    // reComputeSelectedColumns(
                    //     activeInlineTab.value.playground.vqb.selectedTables
                    // )
                },
                { deep: true }
            )

            return {
                disabled,
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
                actionClick,
                containerPosition,
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
