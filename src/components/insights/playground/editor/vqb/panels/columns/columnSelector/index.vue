<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
            disabled ? ' cursor-not-allowed disable-bg' : '',
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
            :disabled="disabled"
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
                disabled ? $style.custom_input : '',
            ]"
        />
        <a-input
            v-if="selectedItems.length == 0"
            ref="initialRef"
            :disabled="disabled"
            v-model:value="inputValue2"
            @change="input2Change"
            :placeholder="placeholder"
            :class="[
                'w-full p-0  border-none shadow-none outline-none text-sm  focus-none',
                disabled ? $style.custom_input : '',
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
                @click.stop="clearAllSelected"
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
                @click.stop="() => {}"
                @mousedown.stop="cancelEventBlur"
                :style="`width: ${containerPosition.width}px;top:${
                    containerPosition.top + containerPosition.height
                }px;left:${containerPosition.left}px`"
                :class="[
                    'absolute z-10  pb-2 overflow-auto bg-white rounded custom-shadow position',
                ]"
            >
                <div class="border-b border-gray-300" v-if="showSelectAll">
                    <a-checkbox
                        v-model:checked="selectAll"
                        @mousedown.stop="cancelEventBlur"
                        @change="onSelectAll"
                        class="inline-flex flex-row-reverse items-center w-full px-4 py-1 rounded atlanReverse hover:bg-primary-light"
                    >
                        <div class="flex items-center">
                            <span class="mb-0 ml-1 text-sm text-gray-700">
                                Select All
                            </span>
                        </div>
                    </a-checkbox>
                </div>

                <div
                    :class="['flex  justify-center overflow-auto']"
                    style="height: 250px"
                >
                    <Loader
                        v-if="isLoading"
                        style="min-height: 250px !important"
                    ></Loader>
                    <div
                        class="w-full px-3"
                        v-if="dropdownOption.length !== 0 && !isLoading"
                    >
                        <template
                            v-for="(item, index) in dropdownOption"
                            :key="item.value + index"
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

                                <a-checkbox
                                    :checked="map[item.value]"
                                    @mousedown.stop="cancelEventBlur"
                                    @change="
                                        (checked) =>
                                            onCheckboxChange(
                                                checked,
                                                item.value
                                            )
                                    "
                                    class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded atlanReverse hover:bg-primary-light"
                                >
                                    <div
                                        class="justify-between parent-ellipsis-container"
                                    >
                                        <div class="parent-ellipsis-container">
                                            <component
                                                :is="
                                                    getDataTypeImage(item.type)
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
                                                :isPartition="item.isPartition"
                                            />
                                        </div>
                                    </div>
                                </a-checkbox>
                            </PopoverAsset>
                        </template>
                    </div>

                    <span
                        class="w-full mt-4 text-sm text-center text-gray-400"
                        v-if="dropdownOption.length == 0 && !isLoading"
                    >
                        No Columns found!
                    </span>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        onUpdated,
        computed,
        watch,
        defineComponent,
        ref,
        nextTick,
        Ref,
        onMounted,
        inject,
        PropType,
        ComputedRef,
        onUnmounted,
        toRefs,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import Loader from '@common/loaders/page.vue'
    import ColumnKeys from '~/components/insights/playground/editor/vqb/panels/common/ColumnKeys/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { selectedTables } from '~/types/insights/VQB.interface'

    import {
        InternalAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            Loader,
            TablesTree,
            ColumnKeys,
            PopoverAsset,
            AtlanBtn,
        },
        // emits: ['queryTextChange', 'checkboxChange'],
        props: {
            selectedItems: {
                type: Object as PropType<any[]>,
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
            tableQualfiedName: {
                type: String,
                required: true,
            },
            showSelectAll: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            selectedTableData: {
                type: Object as PropType<{
                    certificateStatus: string | undefined
                    assetType: string | undefined
                }>,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },

        setup(props, { emit }) {
            const {
                tableQualfiedName,
                showSelectAll,
                selectedTableData,
                selectedTablesQualifiedNames,
                disabled,
            } = toRefs(props)
            const queryText = ref('')
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const map = ref({})
            selectedItems.value.forEach((selectedItem) => {
                map.value[selectedItem] = true
            })
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()

            const { getDataTypeImage } = useColumn()
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

            const inputRef = ref()
            const initialRef = ref()
            const selectAll = ref(selectedItems.value.includes('all'))
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
                    console.log(inputRef?.value, 'he')
                    inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                if (disabled?.value) return
                nextTick(() => {
                    inputRef?.value?.focus()
                })
            }

            const handleContainerBlur = (event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (event.relatedTarget == null) {
                    inputValue1.value = ''
                    inputValue2.value = ''
                    queryText.value = ''
                    isAreaFocused.value = false
                }
            }

            const inputChange = () => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            }

            const getInitialBody = () => {
                let data = {
                    searchText: queryText.value,
                    assetType: selectedTableData.value?.assetType,
                }
                if (
                    activeInlineTab.value.playground.vqb?.panels[0]
                        ?.subpanels[0]?.tableData?.assetType === 'View'
                ) {
                    data.viewQualifiedName =
                        selectedTablesQualifiedNames?.length > 0
                            ? selectedTablesQualifiedNames[0].tableQualifiedName
                            : tableQualfiedName.value
                } else {
                    data.tableQualfiedName =
                        selectedTablesQualifiedNames?.length > 0
                            ? selectedTablesQualifiedNames[0].tableQualifiedName
                            : tableQualfiedName.value
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
            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )
            watch(
                [tableQualfiedName, queryText],
                () => {
                    replaceBody(getInitialBody())
                },
                {
                    immediate: true,
                }
            )
            watch(tableQualfiedName, () => {
                map.value = {}
                selectAll.value = true
            })
            const placeholder = computed(() => {
                if (tableQualfiedName.value) {
                    return `Select from ${totalCount.value} columns`
                }
                return `Select a table first`
            })
            const totalCount = computed(() => data.value?.approximateCount || 0)
            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    type: ls.attributes?.dataType,
                    isPrimary: ls.attributes?.isPrimary,
                    isForeign: ls.attributes?.isForeign,
                    isPartition: ls.attributes?.isPartition,
                    value: ls.attributes?.qualifiedName,
                    item: ls,
                }))

                return data
            })

            const onSelectAll = (e) => {
                /* checked */
                if (e?.target.checked) {
                    selectedItems.value = ['all']
                    map.value = {}
                    // emit('checkboxChange', ['all'])
                } else {
                    selectedItems.value = []
                    // emit('checkboxChange', [])
                }
                updateVQB(activeInlineTab, inlineTabs)
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

            const onCheckboxChange = (checked, id) => {
                selectAll.value = false
                if (checked.target.checked) {
                    map.value[id] = true
                } else {
                    delete map.value[id]
                }
                if (map.value?.all) {
                    delete map.value['all']
                }
                selectedItems.value = [...Object.keys(map.value)]

                console.log('columns: ', list.value)
                let columns = []
                Object.keys(map.value).forEach((col) => {
                    let x = list.value.find((el) => {
                        let label = el.attributes?.qualifiedName
                        return label === col
                    })
                    columns.push({
                        label:
                            x?.attributes?.displayName || x?.attributes?.name,
                        type: x?.attributes?.dataType,
                        columnsQualifiedName: x?.attributes.qualifiedName,
                    })
                })

                selectedColumnsData.value = [...columns]
                updateVQB(activeInlineTab, inlineTabs)

                // emit('checkboxChange', selectedItems.value)
                setFocusedCusror()
            }

            const handleMouseOver = () => {
                if (!mouseOver.value) mouseOver.value = true
            }
            const handleMouseOut = () => {
                if (mouseOver.value) mouseOver.value = false
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

            const clearAllSelected = () => {
                selectedItems.value = []
                map.value = {}
                selectAll.value = false
                selectedColumnsData.value = []
                updateVQB(activeInlineTab, inlineTabs)
                console.log(map.value, 'destroy')
            }
            onMounted(() => {
                observer.value = new ResizeObserver(onResize).observe(
                    container.value
                )
                topPosShift.value = container.value?.offsetHeight
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
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

            const cancelEventBlur = (event) => {
                // debugger
                event.stopPropagation()
                event.preventDefault()
                return false
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

            return {
                disabled,
                cancelEventBlur,
                containerPosition,
                actionClick,
                showSelectAll,
                initialRef,
                queryText,
                clearAllSelected,
                findVisibility,
                handleMouseOver,
                handleMouseOut,
                mouseOver,
                map,
                enrichedSelectedItems,
                onCheckboxChange,
                onSelectAll,
                isLoading,
                totalCount,
                selectAll,
                tableQualfiedName,
                dropdownOption,
                selectedItems,
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                input1Change,
                input2Change,
                inputValue1,
                inputValue2,
                clickPos,
                container,
                handleContainerBlur,
                setFoucs,
                isAreaFocused,
                getDataTypeImage,
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            }
        },
    })
</script>
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
        min-height: 32px;
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
