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
            'flex flex-wrap items-center    rounded  selector-height chip-container truncate',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <div class="flex w-full">
            <component
                :is="getDataTypeImage(selectedColumn?.type)"
                class="flex-none w-auto h-4 mr-1 text-gray-500"
            ></component>
            <div class="w-full">
                <div
                    v-if="selectedColumn?.label"
                    style="max-width: 98%"
                    class="flex items-center text-xs truncate"
                >
                    <span
                        class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                    >
                        {{ selectedColumn?.label }}
                    </span>
                </div>
                <div v-else-if="subIndex == 0" class="text-gray-700">
                    LEFT TABLE
                </div>
                <div v-else-if="subIndex == 1" class="text-gray-700">
                    RIGHT TABLE
                </div>

                <div
                    class="mt-0.5 text-xs text-gray-500 truncate"
                    style="max-width: 90%"
                >
                    <span v-if="selectedColumn?.tableName" class="truncate">
                        {{ selectedColumn?.tableName }}
                    </span>
                    <span v-else>
                        {{ placeholder }}
                    </span>
                </div>
            </div>
            <!-- <span v-else>
            {{ placeholder }}
        </span> -->
        </div>

        <div class="absolute right-4">
            <AtlanIcon
                v-if="
                    findVisibility(
                        'search',
                        isAreaFocused,
                        mouseOver,
                        tableQualfiedName,
                        selectedColumn
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
                    ) && !disabled
                "
            />
        </div>

        <teleport to="body">
            <div
                tabindex="-1"
                v-if="isAreaFocused"
                :style="`width: ${containerPosition.width}px;top:${
                    containerPosition.top + containerPosition.height
                }px;left:${containerPosition.left}px`"
                :class="[
                    'absolute z-10  py-4 overflow-auto bg-white rounded custom-shadow position dropdown-container',
                ]"
            >
                <div>
                    <div class="px-4">
                        <div
                            class="flex items-center justify-between flex-grow py-1 border-b bordery-gray-300"
                        >
                            <AtlanIcon
                                icon="Search"
                                class="flex-none pr-1 text-gray-500"
                            />
                            <input
                                ref="inputRef"
                                v-model="queryText"
                                :placeholder="placeholder"
                                type="text"
                                class="flex-1 text-xs bg-transparent focus:outline-none child_input"
                                style="z-index: 10 !important"
                            />
                        </div>
                    </div>

                    <div
                        tabindex="-1"
                        :class="['flex  justify-center  overflow-auto w-full']"
                        style="height: 250px"
                    >
                        <Loader
                            v-if="isLoading"
                            style="min-height: 250px !important"
                        ></Loader>

                        <!--  Multiple table column selection-->
                        <div
                            class="w-full dropdown-container"
                            style="height: 250px"
                            tabindex="-1"
                            :class="[
                                tableDropdownOption.length === 0
                                    ? 'flex justify-center items-center'
                                    : '',
                            ]"
                            v-if="
                                !isTableSelected &&
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
                                                @click="
                                                    (e) =>
                                                        actionClick(
                                                            e,
                                                            item.item
                                                        )
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
                                            class="flex items-center justify-between w-full px-4 cursor-pointer h-9 hover:bg-primary-selected-focus"
                                            @click="
                                                (e) => onSelectTable(item, e)
                                            "
                                        >
                                            <div
                                                class="flex items-center truncate"
                                            >
                                                <AtlanIcon
                                                    :icon="
                                                        getEntityStatusIcon(
                                                            assetType(item),
                                                            certificateStatus(
                                                                item
                                                            )
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
                                    tableDropdownOption.length === 0 &&
                                    !isLoading
                                "
                                class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                            >
                                No tables found
                            </div>
                        </div>
                        <!-- For columns -->
                        <div
                            class="w-full"
                            v-if="isTableSelected && !isLoading"
                        >
                            <div class="px-4">
                                <div
                                    class="flex items-center justify-between h-9 truncanimate-spin pt-0.5 border-b border-gray-300"
                                >
                                    <div class="flex items-center truncate">
                                        <AtlanIcon
                                            icon="ChevronLeft"
                                            class="w-4 h-4 -mt-0.5 text-gray-500"
                                            @click="onUnselectTable"
                                        />

                                        <span
                                            class="ml-2 parent-ellipsis-container-base"
                                            >{{ tableSelected?.label }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between mr-2 text-gray-500"
                                    >
                                        {{ tableSelected?.columnCount }}
                                    </div>
                                </div>
                            </div>
                            <div
                                class="overflow-y-auto"
                                style="height: 250px"
                                :class="[
                                    columnDropdownOption.length === 0
                                        ? 'flex justify-center items-center'
                                        : '',
                                ]"
                            >
                                <template
                                    v-for="(
                                        item, index
                                    ) in columnDropdownOption"
                                    :key="
                                        item.value + index + item.qualifiedName
                                    "
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
                                                @click="
                                                    (e) =>
                                                        actionClick(
                                                            e,
                                                            item.item
                                                        )
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
                                            @click="
                                                (e) => onSelectColumn(item, e)
                                            "
                                            :class="
                                                selectedColumn?.columnQualifiedName ===
                                                item.qualifiedName
                                                    ? 'bg-primary-light'
                                                    : 'bg-white'
                                            "
                                        >
                                            <div
                                                class="flex items-center parent-ellipsis-container"
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
                                                class="flex items-center parent-ellipsis-container-extension"
                                            >
                                                <div
                                                    class="relative h-full w-14 parent-ellipsis-container-extension"
                                                >
                                                    <ColumnKeys
                                                        :isPrimary="
                                                            item.isPrimary
                                                        "
                                                        :isForeign="
                                                            item.isForeign
                                                        "
                                                        :isPartition="
                                                            item.isPartition
                                                        "
                                                    />
                                                </div>
                                                <AtlanIcon
                                                    icon="Check"
                                                    class="ml-2 text-primary parent-ellipsis-container-base"
                                                    v-if="
                                                        selectedColumn?.columnQualifiedName ===
                                                        item.qualifiedName
                                                    "
                                                />
                                                <div
                                                    v-else
                                                    class="w-4 ml-2"
                                                ></div>
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
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { attributes } from '~/components/insights/playground/editor/vqb/composables/VQBattributes'
    import AtlanBtn from '~/components/UI/button.vue'
    import useBody from './useBody'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    export default defineComponent({
        name: 'Table Selector',
        emits: ['change'],
        components: {
            Loader,
            ColumnKeys,
            PopoverAsset,
            AtlanBtn,
            SearchAndFilter,
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
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props, { emit }) {
            const {
                showColumnWithTable,
                selectedTablesQualifiedNames,
                panelIndex,
                subIndex,
                rowIndex,
                disabled,
            } = toRefs(props)
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

            let tableSelected = ref(null)

            const { selectedColumn } = useVModels(props)
            const { getDataTypeImage } = useColumn()

            const {
                isPrimary,
                dataTypeImageForColumn,
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
            const isTableSelected = ref(false)
            const inputRef = ref()
            const queryText = ref('')
            const mouseOver = ref(false)
            const inputValue1 = ref('')
            const inputValue2 = ref('')
            const isAreaFocused = ref(false)
            const container = ref()

            const setFocusedCusror = () => {
                nextTick(() => {
                    inputRef?.value?.focus()
                })
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
                            if (disabled.value) return true
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
                            event?.target?.classList?.contains('child_input')
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
                        context:
                            activeInlineTab.value.playground.editor.context,

                        searchText: queryText.value,
                        tableQualifiedNamesContraint:
                            tableQualifiedNamesContraint.value,
                    }),
                    attributes: attributes,
                }
            }
            const clearAllSelected = () => {
                emit('change', {})
                updateVQB(activeInlineTabKey, inlineTabs)
            }

            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )

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
                        context:
                            activeInlineTab.value.playground.editor.context,
                    }
                } else if (item.typeName === 'View') {
                    data = {
                        viewQualifiedName: item?.qualifiedName,
                        searchText: queryText.value,
                        context:
                            activeInlineTab.value.playground.editor.context,
                    }
                }
                return {
                    dsl: useBody(data),
                    attributes: attributes,
                }
            }

            const onSelectTable = (item, event) => {
                tableSelected.value = item
                isTableSelected.value = true
                queryText.value = ''
                replaceBody(getColumnInitialBody(item))
                // updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                setFocusedCusror()

                return false
            }
            const onUnselectTable = (event) => {
                isTableSelected.value = false
                columnDropdownOption.value = []
                replaceBody(getTableInitialBody())
                // updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                setFocusedCusror()
                return false
            }

            const onSelectColumn = (item, event) => {
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    columnQualifiedName: item.qualifiedName,
                    tableName: item.item.attributes.tableName,
                }
                emit('change', item.qualifiedName)
                activeInlineTab.value.playground.vqb.selectedTables =
                    JSON.parse(
                        JSON.stringify(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                isAreaFocused.value = false
                return false
            }

            const placeholder = computed(() => {
                let data = !isTableSelected.value
                    ? `Select from ${totalCount.value} tables`
                    : `Select from ${totalCount.value} columns`

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

            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    if (selectedColumn.value?.label && tableSelected?.value) {
                    } else {
                        replaceBody(getTableInitialBody())
                    }
                },
                {
                    immediate: true,
                }
            )

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

                    if (selectedColumn.value?.label && tableSelected?.value) {
                    } else {
                        replaceBody(getTableInitialBody())
                    }
                }
            )

            watch(isAreaFocused, (newIsAreaFocused) => {
                if (newIsAreaFocused) {
                    setFocusedCusror()
                }
                if (selectedColumn.value?.label && tableSelected?.value) {
                    // retain column view
                    isTableSelected.value = true
                    // debugger
                    replaceBody(getColumnInitialBody(tableSelected?.value))
                } else if (
                    !selectedColumn.value?.label &&
                    tableSelected.value
                ) {
                    isTableSelected.value = false
                    replaceBody(getTableInitialBody())
                } else {
                    replaceBody(getTableInitialBody())
                }
            })

            watch(queryText, (newQueryText) => {
                if (newQueryText !== '') {
                    if (selectedColumn.value?.label && isTableSelected?.value) {
                        replaceBody(getColumnInitialBody(tableSelected?.value))
                    } else {
                        replaceBody(getTableInitialBody())
                    }
                }
            })

            return {
                disabled,
                isTableSelected,
                queryText,
                container,
                subIndex,
                actionClick,
                totalCount,
                data,
                isLoading,
                tableDropdownOption,
                onSelectTable,
                onUnselectTable,
                tableSelected,
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
                inputRef,
                inputValue1,
                inputValue2,
                clearAllSelected,
                handleMouseOver,
                handleMouseOut,
                findVisibility,
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
