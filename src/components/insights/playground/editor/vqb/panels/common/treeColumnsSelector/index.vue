<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center z-1"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container truncate',
        ]"
        @click.stop="() => {}"
        style="max-width: 98%"
    >
        <div
            v-if="selectedColumn?.label"
            style="max-width: 98%"
            class="flex items-center truncate"
        >
            <component
                :is="getDataTypeImage(selectedColumn?.type)"
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

        <div class="absolute right-2">
            <AtlanIcon
                v-if="
                    findVisibility(
                        'search',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedColumn
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
                        selectedColumn
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
                        selectedColumn
                    )
                "
            />
        </div>

        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click.stop="() => {}"
                :style="`width: ${containerPosition.width}px;top:${
                    containerPosition.top + containerPosition.height
                }px;left:${containerPosition.left}px`"
                :class="[
                    'absolute z-10  pb-2 overflow-auto bg-white rounded custom-shadow position',
                ]"
            >
                <div
                    :class="['flex  justify-center overflow-auto w-full']"
                    style="height: 250px"
                >
                    <Loader
                        v-if="isLoading"
                        style="min-height: 250px !important"
                    ></Loader>

                    <!--  Multiple table column selection-->
                    <div
                        class="w-full"
                        style="height: 250px"
                        :class="[
                            tableDropdownOption.length === 0
                                ? 'flex justify-center items-center'
                                : '',
                        ]"
                        v-if="
                            !tableSelected?.qualifiedName &&
                            tableDropdownOption.length !== 0 &&
                            !isLoading
                        "
                    >
                        <div class="overflow-auto">
                            <template
                                v-for="(item, index) in tableDropdownOption"
                                :key="item?.label + index"
                            >
                                <PopoverAsset
                                    :item="item.item"
                                    placement="right"
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
                                        class="flex items-center justify-between w-full pl-4 pr-2 cursor-pointer h-9 hover:bg-primary-selected-focus"
                                        @mousedown.stop="
                                            (e) => onSelectTable(item, e)
                                        "
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
                                                style="min-width: 16px"
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
                        </div>
                        <div
                            v-if="
                                tableDropdownOption.length === 0 && !isLoading
                            "
                            class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                        >
                            No tables found
                        </div>
                    </div>
                    <!-- For columns -->
                    <div
                        class="w-full"
                        v-if="tableSelected?.qualifiedName && !isLoading"
                    >
                        <div
                            class="flex items-center justify-between h-9 pl-2 pr-4 truncanimate-spin pt-0.5 border border-b bordery-gray-300"
                        >
                            <div class="flex items-center truncate">
                                <AtlanIcon
                                    icon="ChevronLeft"
                                    class="w-4 h-4 -mt-0.5 text-gray-500"
                                    @mousedown.stop="onUnselectTable"
                                />

                                <span
                                    class="ml-2 parent-ellipsis-container-base"
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
                            <template
                                v-for="(item, index) in columnDropdownOption"
                                :key="item.value + index + item.qualifiedName"
                            >
                                <PopoverAsset
                                    :item="item.item"
                                    placement="right"
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
                                        class="inline-flex items-center justify-between w-full px-4 rounded h-9 parent-ellipsis-container hover:bg-primary-light"
                                        @mousedown.stop="
                                            (e) => onSelectColumn(item, e)
                                        "
                                        :class="
                                            selectedColumn?.label === item.label
                                                ? 'bg-primary-light'
                                                : 'bg-white'
                                        "
                                    >
                                        <div
                                            class="flex items-center parent-ellipsis-container"
                                        >
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
                                            class="flex items-center parent-ellipsis-container-extension"
                                        >
                                            <div
                                                class="relative h-full w-14 parent-ellipsis-container-extension"
                                            >
                                                <ColumnKeys
                                                    :isPrimary="item.isPrimary"
                                                    :isForeign="item.isForeign"
                                                    :isPartition="
                                                        item.isPartition
                                                    "
                                                />
                                            </div>
                                            <AtlanIcon
                                                icon="Check"
                                                class="ml-2 text-primary parent-ellipsis-container-base"
                                                v-if="
                                                    selectedColumn?.label ===
                                                    item.label
                                                "
                                            />
                                            <div v-else class="w-4 ml-2"></div>
                                        </div>
                                    </div>
                                </PopoverAsset>
                            </template>

                            <div
                                v-if="
                                    columnDropdownOption.length === 0 &&
                                    !isLoading
                                "
                                class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                            >
                                No columns found
                            </div>
                        </div>
                    </div>
                    <!--  -->
                </div>
            </div>
        </teleport>
    </div>
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
        onUnmounted,
        nextTick,
        onUpdated,
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
                dataTypeImage: getDataTypeImage,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const inputRef = ref()
            const queryText = ref('')
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
                isAreaFocused.value = true
                nextTick(() => {
                    inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                nextTick(() => {
                    inputRef?.value?.focus()
                })
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
                selectedColumn
            ) => {
                switch (key) {
                    case 'chevronDown': {
                        if (!isAreaFocused) {
                            if (!selectedColumn?.label && mouseHover)
                                return true
                            if (!selectedColumn?.label && !mouseHover)
                                return true
                            if (selectedColumn?.label && !mouseHover)
                                return true
                        }
                        break
                    }
                    case 'cross': {
                        if (isAreaFocused) return false
                        if (
                            !isAreaFocused &&
                            selectedColumn?.label &&
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
                nextTick(() => {
                    initialRef.value?.focus()
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
            const clearAllSelected = () => {
                emit('change', {})
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

            const onSelectTable = (item, event) => {
                // console.log('selected table: ', item)
                tableSelected.value = item
                replaceBody(getColumnInitialBody(item))
                event.stopPropagation()
                event.preventDefault()
                return false
            }
            const onUnselectTable = (event) => {
                tableSelected.value = null
                columnDropdownOption.value = []
                replaceBody(getTableInitialBody())
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            const onSelectColumn = (item, event) => {
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
                event.stopPropagation()
                event.preventDefault()
                isAreaFocused.value = false
                return false
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

            return {
                container,
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
                dataType,
                assetType,
                certificateStatus,
                selectedColumn,
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                input1Change,
                input2Change,
                inputValue1,
                inputValue2,
                clearAllSelected,
                setFocusedCusror,
                handleMouseOver,
                handleMouseOut,
                findVisibility,
                setFoucs,
                handleContainerBlur,
                isAreaFocused,
                getDataTypeImage,
                containerPosition,
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
    .disable-bg {
        background-color: #fbfbfb;
    }
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
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
