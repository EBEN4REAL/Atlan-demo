<template>
    <div
        tabindex="-1"
        :class="[
            'absolute z-10  overflow-auto bg-white rounded custom-shadow position dropdown-container',
        ]"
    >
        <div
            tabindex="-1"
            :class="['dropdown-container  w-full']"
            style="min-height: 180px"
        >
            <!--  Multiple table column selection-->
            <div class="w-full dropdown-container" v-if="!isTableSelected">
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
                    class="w-full overflow-auto dropdown-container"
                    style="height: 205px"
                    tabindex="-1"
                    :class="[
                        tableDropdownOption.length === 0
                            ? 'flex justify-center items-center'
                            : '',
                    ]"
                    v-if="
                        !isTableSelected &&
                        tableDropdownOption.length !== 0 &&
                        !isTableLoading
                    "
                >
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
                                    @click="(e) => actionClick(e, item.item)"
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
                    <div
                        v-if="
                            tableDropdownOption.length === 0 && !isTableLoading
                        "
                        class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                    >
                        No tables found
                    </div>
                </div>
            </div>

            <div class="w-full dropdown-container" v-if="isTableSelected">
                <div
                    class="flex items-center justify-between pt-3 pl-2 pr-4 truncanimate-spin dropdown-container"
                    @click.stop="() => {}"
                >
                    <div
                        class="flex items-center text-gray-700 truncate dropdown-container"
                    >
                        <AtlanIcon
                            icon="ChevronLeft"
                            class="w-4 h-4 -mt-0.5"
                            style="min-width: 16px"
                            @click="onUnselectTable"
                        />

                        <span
                            class="ml-2 text-sm parent-ellipsis-container-base"
                            >{{ tableSelected?.label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center justify-between text-gray-500 dropdown-container"
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
                    class="w-full dropdown-container"
                    v-if="isTableSelected && !isColumnLoading"
                >
                    <div
                        class="overflow-y-auto"
                        style="height: 180px"
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
                                    class="inline-flex items-center justify-between w-full px-4 rounded h-9 parent-ellipsis-container hover:bg-primary-light"
                                    @click="(e) => onSelectColumn(item, e)"
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
                                        class="flex items-center parent-ellipsis-container-extension"
                                    >
                                        <div
                                            class="relative h-full w-14 parent-ellipsis-container-extension"
                                        >
                                            <ColumnKeys
                                                :isPrimary="item.isPrimary"
                                                :isForeign="item.isForeign"
                                                :isPartition="item.isPartition"
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
                                        <div v-else class="w-4 ml-2"></div>
                                    </div>
                                </div>
                            </PopoverAsset>
                        </template>

                        <div
                            v-if="
                                columnDropdownOption.length === 0 &&
                                !isColumnLoading
                            "
                            class="flex items-center justify-center h-full text-sm text-center text-gray-400"
                        >
                            No columns found
                        </div>
                    </div>
                </div>
            </div>

            <Loader
                v-if="isColumnLoading || isTableLoading"
                style="min-height: 180px !important"
            ></Loader>
            <!--  -->
        </div>
    </div>
</template>
<script lang="ts">
    import {
        watch,
        computed,
        ComputedRef,
        inject,
        defineComponent,
        Ref,
        toRefs,
        ref,
    } from 'vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { attributes } from '~/components/insights/playground/editor/vqb/composables/VQBattributes'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import Loader from '@common/loaders/page.vue'

    import useBody from './useColumnBody'

    export default defineComponent({
        name: 'Sub panel',
        components: { PopoverAsset, Loader },
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            isAreaFocused: {
                type: Boolean,
                required: true,
                default: false,
            },
            isTableSelected: {
                type: Boolean,
                required: true,
                default: false,
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
            selectedColumn: {
                type: Object,
                required: true,
            },
            totalTablesCount: {
                type: Number,
                required: true,
            },
            totalColumnsCount: {
                type: Number,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { panelIndex, subIndex, rowIndex, disabled } = toRefs(props)
            const {
                isAreaFocused,
                selectedColumn,
                totalTablesCount,
                isTableSelected,
                totalColumnsCount,
            } = useVModels(props)
            const { allowedTablesInJoinSelector } = useJoin()
            const { openAssetInSidebar } = useUtils()
            const { updateVQB } = useVQB()
            const { getDataTypeImage } = useColumn()
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>
            const inlineTabs = inject('inlineTabs') as ComputedRef<
                activeInlineTabInterface[]
            >
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

            const {
                list: TableList,
                replaceBody: replaceTableBody,
                data: tablesData,
                isLoading: isTableLoading,
            } = useAssetListing('', false)
            const {
                list: ColumnList,
                replaceBody: replaceColumnBody,
                data: ColumnsData,
                isLoading: isColumnLoading,
            } = useAssetListing('', false)

            let tableSelected = ref(null)
            const queryText = ref('')

            watch(tablesData, () => {
                totalTablesCount.value = tablesData.value?.approximateCount || 0
            })
            watch(ColumnsData, () => {
                totalColumnsCount.value =
                    ColumnsData.value?.approximateCount || 0
            })

            const placeholder = computed(() => {
                let data = !isTableSelected.value
                    ? `${totalTablesCount.value} tables available`
                    : `Select from ${totalColumnsCount.value} columns`

                return data
            })

            const tableDropdownOption = computed(() => {
                let data = TableList.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    qualifiedName: ls.attributes?.qualifiedName,
                    attributes: ls.attributes,
                    typeName: ls.typeName,
                    item: ls,
                }))
                return data
            })

            const columnDropdownOption = computed(() => {
                let data = ColumnList.value.map((ls) => ({
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

            const onSelectTable = (item, event) => {
                tableSelected.value = item
                isTableSelected.value = true
                queryText.value = ''
                replaceColumnBody(getColumnInitialBody(item))
                // updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()

                return false
            }
            const onUnselectTable = (event) => {
                isTableSelected.value = false
                columnDropdownOption.value = []
                replaceTableBody(getTableInitialBody())
                // updateVQB(activeInlineTabKey, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
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

            const actionClick = (event, t) => {
                openAssetInSidebar(event, t, activeInlineTab, inlineTabs)
            }

            /* ----------------------------------------- */

            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    if (selectedColumn.value?.label && tableSelected?.value) {
                    } else {
                        replaceTableBody(getTableInitialBody())
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
                        replaceTableBody(getTableInitialBody())
                    }
                }
            )

            watch(isAreaFocused, (newIsAreaFocused) => {
                if (selectedColumn.value?.label && tableSelected?.value) {
                    // retain column view
                    isTableSelected.value = true
                    // debugger
                    replaceColumnBody(
                        getColumnInitialBody(tableSelected?.value)
                    )
                } else if (
                    !selectedColumn.value?.label &&
                    tableSelected.value
                ) {
                    isTableSelected.value = false
                    replaceTableBody(getTableInitialBody())
                } else {
                    replaceTableBody(getTableInitialBody())
                }
            })

            watch(queryText, (newQueryText) => {
                if (newQueryText !== '') {
                    if (selectedColumn.value?.label && isTableSelected?.value) {
                        replaceColumnBody(
                            getColumnInitialBody(tableSelected?.value)
                        )
                    } else {
                        replaceTableBody(getTableInitialBody())
                    }
                }
            })

            return {
                getDataTypeImage,
                actionClick,
                onSelectColumn,
                onUnselectTable,
                onSelectTable,
                isColumnLoading,
                isTableLoading,
                placeholder,
                queryText,
                isTableSelected,
                tableSelected,
                isAreaFocused,
                disabled,
                tableDropdownOption,
                columnDropdownOption,
                getColumnInitialBody,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
                certificateStatus,
                getTableInitialBody,
            }
        },
    })
</script>
<style lang="less" scoped></style>
