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
        tabindex="0"
        class="relative flex items-center z-1"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <template v-if="selectedItem?.label">
            <div class="flex items-center">
                <component
                    :is="getDataTypeImage(selectedItem?.type)"
                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                ></component>
                <span class="mb-0 ml-1 text-sm text-gray-700">
                    {{ selectedItem?.label }}
                </span>
            </div>
        </template>

        <a-input
            v-if="Object.keys(selectedItem).length > 0 && isAreaFocused"
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
                'p-0 pr-4 ml-2 text-sm border-none shadow-none outline-none  focus-none',
                disabled ? $style.custom_input : '',
            ]"
        />
        <a-input
            v-if="Object.keys(selectedItem).length == 0"
            :disabled="disabled"
            ref="initialRef"
            v-model:value="inputValue2"
            @change="input2Change"
            :placeholder="placeholder"
            :class="[
                'w-full p-0 ml-2  border-none shadow-none outline-none text-sm  focus-none',
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
                        selectedItem
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
                        selectedItem
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
                        selectedItem
                    ) && !disabled
                "
            />
        </div>
        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click="() => {}"
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

                    <!-- For single table select -->

                    <div
                        class="w-full"
                        v-if="
                            dropdownOption.length !== 0 &&
                            !isLoading &&
                            selectedTablesQualifiedNames.length < 2
                        "
                    >
                        <template
                            v-for="(item, index) in dropdownOption"
                            :key="item.value + index"
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
                                        @click.stop="
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
                                    class="inline-flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                    @click.stop="(e) => onSelectItem(item, e)"
                                    :class="
                                        selectedItem?.qualifiedName ===
                                        item.columnQualifiedName
                                            ? 'bg-primary-light'
                                            : 'bg-white'
                                    "
                                >
                                    <div class="flex items-center">
                                        <component
                                            :is="getDataTypeImage(item.type)"
                                            class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                                        ></component>
                                        <span
                                            class="mb-0 ml-1 text-sm text-gray-700"
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
                                                :isPartition="item.isPartition"
                                                topStyle="-top-2"
                                            />
                                        </div>
                                        <AtlanIcon
                                            icon="Check"
                                            class="ml-2 text-primary parent-ellipsis-container-base"
                                            v-if="
                                                selectedItem?.qualifiedName ===
                                                item.columnQualifiedName
                                            "
                                        />
                                        <div v-else class="w-4 ml-2"></div>
                                    </div>
                                </div>
                            </PopoverAsset>
                        </template>
                    </div>

                    <span
                        class="w-full mt-4 text-sm text-center text-gray-400"
                        v-if="
                            dropdownOption.length == 0 &&
                            !isLoading &&
                            selectedTablesQualifiedNames.length < 2
                        "
                    >
                        No Columns found!
                    </span>

                    <!-- -------------------------- -->

                    <!--  Multiple table column selection-->
                    <div
                        class="w-full"
                        v-if="
                            !isTableSelected &&
                            !isLoading &&
                            selectedTablesQualifiedNames.length >= 2
                        "
                        style="height: 250px"
                        :class="[
                            tableDropdownOption.length === 0
                                ? 'flex justify-center items-center'
                                : '',
                        ]"
                    >
                        <div
                            class="overflow-auto"
                            v-if="tableDropdownOption.length !== 0"
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
                                            @click.stop="
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
                                        @click.stop="
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
                        v-if="
                            isTableSelected &&
                            !isLoading &&
                            selectedTablesQualifiedNames.length >= 2
                        "
                    >
                        <div
                            class="flex items-center justify-between h-9 pl-2 pr-4 truncanimate-spin pt-0.5 border border-b bordery-gray-300"
                        >
                            <div class="flex items-center truncate">
                                <AtlanIcon
                                    icon="ChevronLeft"
                                    class="w-4 h-4 -mt-0.5 text-gray-500"
                                    @click.stop="onUnselectTable"
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
                                            @click.stop="
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
                                        @click.stop="
                                            (e) => onSelectItem(item, e)
                                        "
                                        :class="
                                            selectedItem?.qualifiedName ===
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
                                                    selectedItem?.qualifiedName ===
                                                    item.qualifiedName
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
        Ref,
        onUpdated,
        computed,
        watch,
        defineComponent,
        ref,
        nextTick,
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
    import { selectedTables } from '~/types/insights/VQB.interface'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import ColumnKeys from '~/components/insights/playground/editor/vqb/panels/common/ColumnKeys/index.vue'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { attributes } from '~/components/insights/playground/editor/vqb/composables/VQBattributes'
    import AtlanBtn from '~/components/UI/button.vue'

    import useBody from './useBody'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

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
        emits: ['change'],

        props: {
            selectedItem: {
                type: Object,
                required: true,
            },
            tableQualfiedName: {
                type: String,
                required: true,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
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
                selectedTablesQualifiedNames,
                disabled,
            } = toRefs(props)
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
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
            const queryText = ref('')
            const { selectedItem } = useVModels(props)

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
                    if (disabled?.value) inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                if (!disabled?.value) return
                nextTick(() => {
                    if (disabled?.value) inputRef?.value?.focus()
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

            const getInitialBody = (
                selectedTablesQualifiedNames: selectedTables[]
            ) => {
                /* IMP: If the selection is viewQualifiedName then set it as view */

                let data = {
                    searchText: queryText.value,
                    context: activeInlineTab.value.playground.editor.context,
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
                    attributes: attributes,
                }
            }
            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )

            const totalCount = computed(() => data.value?.approximateCount || 0)

            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    isPrimary: ls.attributes?.isPrimary,
                    isForeign: ls.attributes?.isForeign,
                    isPartition: ls.attributes?.isPartition,
                    type: ls.attributes?.dataType,
                    value: ls.attributes?.displayName || ls.attributes?.name,
                    columnQualifiedName: ls.attributes?.qualifiedName,
                    item: ls,
                }))
                return data
            })

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

            // let selectedColumn = ref({})

            const onSelectItem = (item, event) => {
                // selectedColumn.value = item
                emit('change', item)
                if (item.item.typeName === 'Column') {
                    isAreaFocused.value = false
                } else {
                    setFocusedCusror()
                }
                updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                return false
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
                selectedItem
            ) => {
                switch (key) {
                    case 'chevronDown': {
                        if (!isAreaFocused) {
                            if (
                                Object.keys(selectedItem).length === 0 &&
                                mouseHover
                            )
                                return true
                            if (
                                Object.keys(selectedItem).length === 0 &&
                                !mouseHover
                            )
                                return true
                            if (
                                Object.keys(selectedItem).length !== 0 &&
                                !mouseHover
                            )
                                return true

                            if (disabled?.value) return true
                        }
                        break
                    }
                    case 'cross': {
                        if (isAreaFocused) return false
                        if (
                            !isAreaFocused &&
                            Object.keys(selectedItem).length > 0 &&
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
                // selectedItem.value = {}
                emit('change', {})
                updateVQB(activeInlineTabKey, inlineTabs)
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

            //////////////////////////////////////
            let tableSelected = ref(null)

            const getColumnInitialBody = (item) => {
                let data = {}
                if (item.typeName === 'Table') {
                    data = {
                        tableQualfiedName: item?.qualifiedName,
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

            const getTableInitialBody = (
                selectedTablesQualifiedNames: selectedTables[]
            ) => {
                return {
                    dsl: useBody({
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

            const tableDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    qualifiedName: ls?.attributes?.qualifiedName,
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
                    qualifiedName: ls?.attributes?.qualifiedName,
                    type: ls.attributes?.dataType,
                    isPrimary: ls.attributes?.isPrimary,
                    isForeign: ls.attributes?.isForeign,
                    isPartition: ls.attributes?.isPartition,
                    attributes: ls.attributes,
                    order: ls.attributes?.order,
                    item: ls,
                }))

                // console.log('list: ', list)

                console.log('col: ', data)
                return data
            })

            const placeholder = computed(() => {
                if (isLoading.value) {
                    return 'Loading...'
                }
                if (
                    tableQualfiedName.value &&
                    activeInlineTab.value.playground.vqb.selectedTables
                        ?.length == 1
                ) {
                    return `Search from ${totalCount.value} columns`
                }
                if (
                    !isTableSelected.value &&
                    activeInlineTab.value.playground.vqb.selectedTables
                        ?.length > 1
                ) {
                    return `Search from ${totalCount.value} tables`
                }
                if (
                    isTableSelected.value &&
                    activeInlineTab.value.playground.vqb.selectedTables
                        ?.length > 1
                ) {
                    return `Search from ${totalCount.value} columns`
                }
                return `Select a table first`
            })

            const onSelectTable = (item, event) => {
                // console.log('selected table: ', item)
                isTableSelected.value = true
                tableSelected.value = item
                queryText.value = ''
                inputValue1.value = ''
                inputValue2.value = ''
                replaceBody(getColumnInitialBody(item))
                updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                return false
            }
            const onUnselectTable = (event) => {
                isTableSelected.value = false
                columnDropdownOption.value = []
                replaceBody(
                    getTableInitialBody(
                        activeInlineTab.value.playground.vqb.selectedTables
                    )
                )
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

            watch(queryText, () => {
                if (
                    activeInlineTab.value.playground.vqb.selectedTables
                        ?.length > 1
                ) {
                    if (selectedItem.value?.label && tableSelected?.value) {
                        // retain column view
                        isTableSelected.value = true
                        // debugger
                        replaceBody(getColumnInitialBody(tableSelected?.value))
                    } else {
                        replaceBody(
                            getTableInitialBody(
                                activeInlineTab.value.playground.vqb
                                    .selectedTables
                            )
                        )
                    }
                } else {
                    replaceBody(
                        getInitialBody(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                }
            })

            watch(
                () => [activeInlineTab.value.playground.vqb.selectedTables],
                () => {
                    /* Fetch only columns */
                    if (
                        activeInlineTab.value.playground.vqb.selectedTables
                            ?.length == 1
                    ) {
                        replaceBody(
                            getInitialBody(
                                activeInlineTab.value.playground.vqb
                                    .selectedTables
                            )
                        )
                    } else if (
                        activeInlineTab.value.playground.vqb.selectedTables
                            ?.length > 1
                    ) {
                        if (selectedItem.value?.label && tableSelected?.value) {
                            // retain column view
                            isTableSelected.value = true
                            // debugger
                            replaceBody(
                                getColumnInitialBody(tableSelected?.value)
                            )
                        } else {
                            replaceBody(
                                getTableInitialBody(
                                    activeInlineTab.value.playground.vqb
                                        .selectedTables
                                )
                            )
                        }
                    }
                },
                { immediate: true }
            )
            watch(isAreaFocused, () => {
                if (!isAreaFocused.value) {
                    if (
                        activeInlineTab.value.playground.vqb.selectedTables
                            ?.length > 1
                    ) {
                        if (selectedItem.value?.label && tableSelected?.value) {
                            // retain column view
                            isTableSelected.value = true
                            // debugger
                            replaceBody(
                                getColumnInitialBody(tableSelected?.value)
                            )
                        } else {
                            replaceBody(
                                getTableInitialBody(
                                    activeInlineTab.value.playground.vqb
                                        .selectedTables
                                )
                            )
                        }
                    }
                }
            })

            return {
                disabled,
                isTableSelected,
                containerPosition,
                initialRef,
                queryText,
                clearAllSelected,
                findVisibility,
                handleMouseOver,
                handleMouseOut,
                mouseOver,
                onSelectItem,
                // selectedColumn,
                isLoading,
                totalCount,
                selectAll,
                tableQualfiedName,
                dropdownOption,
                selectedItem,
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
                selectedTablesQualifiedNames,
                tableSelected,
                tableDropdownOption,
                columnDropdownOption,
                getEntityStatusIcon,
                assetType,
                certificateStatus,
                onSelectTable,
                onUnselectTable,
                actionClick,
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
</style>
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
