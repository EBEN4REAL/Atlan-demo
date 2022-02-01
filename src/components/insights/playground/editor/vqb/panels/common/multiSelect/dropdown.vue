<template>
    <div
        tabindex="-1"
        :class="[
            '  bg-white rounded custom-shadow flex flex-col  dropdown-container flex-1',
        ]"
        style="min-height: 0"
    >
        <div
            tabindex="-1"
            :class="[
                'dropdown-container flex w-full',
                isColumnLoading || isTableLoading ? 'flex-col' : '',
            ]"
            style="min-height: 0"
        >
            <!-- For single table select -->
            <div
                class="flex flex-col w-full"
                v-if="
                    isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled,
                        selectedTablesQualifiedNames
                    )
                "
            >
                <div
                    class="px-4 py-3 border-b border-gray-300 dropdown-container"
                    v-if="
                        isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled,
                            selectedTablesQualifiedNames
                        )
                    "
                >
                    <div
                        class="flex items-center justify-between w-full"
                        style="min-width: 100%"
                    >
                        <CustomInput
                            v-model:queryText="columnQueryText"
                            :placeholder="placeholder"
                            :autofocus="true"
                        />
                    </div>
                </div>

                <div
                    class="flex-1 w-full overflow-auto dropdown-container"
                    style="min-height: 0"
                    v-if="
                        columnDropdownOption.length !== 0 &&
                        !isColumnLoading &&
                        isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled,
                            selectedTablesQualifiedNames
                        )
                    "
                >
                    <template
                        v-for="(item, index) in columnDropdownOption"
                        :key="item.qualifiedName"
                    >
                        <PopoverAsset
                            :item="item.item"
                            placement="right"
                            :mouseEnterDelay="1"
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
                                class="inline-flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                @click="(e) => onSelectColumn(item, e)"
                                :class="
                                    selectedColumn?.qualifiedName ===
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
                                        class="flex-none w-auto h-4 text-gray-500 -mt-0.5 parent-ellipsis-container-extension"
                                    ></component>
                                    <span
                                        class="mb-0 ml-1 text-sm text-gray-700 truncate parent-ellipsis-container-base"
                                    >
                                        {{ item.label }}
                                    </span>
                                </div>
                                <div class="relative flex items-center h-full">
                                    <ColumnKeys
                                        :isPrimary="item.isPrimary"
                                        :isForeign="item.isForeign"
                                        :isPartition="item.isPartition"
                                    />

                                    <AtlanIcon
                                        icon="Check"
                                        class="ml-2 text-primary"
                                        v-if="
                                            selectedColumn?.qualifiedName ===
                                            item.qualifiedName
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
                        columnDropdownOption.length == 0 &&
                        !isColumnLoading &&
                        isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled,
                            selectedTablesQualifiedNames
                        )
                    "
                >
                    No Columns found!
                </span>
            </div>

            <!--  Multiple table column selection-->
            <div
                class="flex flex-col w-full dropdown-container"
                v-if="
                    !dirtyIsTableSelected &&
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled,
                        selectedTablesQualifiedNames
                    )
                "
            >
                <div
                    class="px-4 py-3 border-b border-gray-300 dropdown-container"
                >
                    <div
                        class="flex items-center justify-between w-full dropdown-container"
                        style="min-width: 100%"
                    >
                        <CustomInput
                            v-model:queryText="tableQueryText"
                            :placeholder="placeholder"
                            :autofocus="true"
                        />
                    </div>
                </div>

                <div
                    class="flex-1 w-full overflow-auto dropdown-container"
                    style="min-height: 0"
                    tabindex="-1"
                    :class="[
                        tableDropdownOption.length === 0
                            ? 'flex justify-center items-center'
                            : '',
                    ]"
                    v-if="!dirtyIsTableSelected && !isTableLoading"
                >
                    <template
                        v-for="(item, index) in tableDropdownOption"
                        :key="item?.label + index"
                    >
                        <PopoverAsset
                            :item="item.item"
                            placement="right"
                            :mouseEnterDelay="1"
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
                                class="flex items-center justify-between w-full px-4 cursor-pointer h-9 hover:bg-primary-light"
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
                                        class="ml-2 truncate parent-ellipsis-container-base"
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
                        class="flex items-center justify-center h-full pt-4 text-sm text-center text-gray-400"
                    >
                        No tables found!
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col w-full dropdown-container"
                v-if="
                    dirtyIsTableSelected &&
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled,
                        selectedTablesQualifiedNames
                    )
                "
            >
                <div
                    class="flex items-center justify-between pt-3 pl-2 pr-4 truncanimate-spin dropdown-container"
                    @click.stop="() => {}"
                >
                    <div
                        class="flex items-center text-gray-700 truncate dropdown-container"
                    >
                        <AtlanIcon
                            icon="ChevronLeft"
                            class="w-4 h-4 -mt-0.5 ml-1"
                            style="min-width: 16px"
                            @click="onUnselectTable"
                        />

                        <span
                            class="ml-2 text-sm font-bold text-gray-600 parent-ellipsis-container-base"
                        >
                            <AtlanIcon
                                :icon="
                                    getEntityStatusIcon(
                                        assetType(dirtyTableSelected),
                                        certificateStatus(dirtyTableSelected)
                                    )
                                "
                                class="w-4 h-4 -mt-0.5 parent-ellipsis-container-extension"
                                style="min-width: 16px"
                            ></AtlanIcon>

                            {{ dirtyTableSelected?.label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center justify-between text-gray-500 dropdown-container"
                    >
                        {{ dirtyTableSelected?.columnCount }}
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
                            v-model:queryText="columnQueryText"
                            :placeholder="placeholder"
                            :autofocus="true"
                        />
                    </div>
                </div>

                <div
                    class="flex w-full dropdown-container"
                    v-if="dirtyIsTableSelected && !isColumnLoading"
                    :class="isColumnLoading || isTableLoading ? 'flex-col' : ''"
                    style="min-height: 0"
                >
                    <div
                        class="w-full overflow-y-auto"
                        :class="[
                            columnDropdownOption.length === 0
                                ? 'flex justify-center items-center'
                                : '',
                        ]"
                        style="min-height: 0"
                    >
                        <template
                            v-for="(item, index) in columnDropdownOption"
                            :key="item.value + index + item.qualifiedName"
                        >
                            <PopoverAsset
                                :item="item.item"
                                placement="right"
                                :mouseEnterDelay="1"
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
                                    class="inline-flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                    @click="(e) => onSelectColumn(item, e)"
                                    :class="
                                        selectedColumn?.qualifiedName ===
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
                                            class="flex-none w-auto h-4 text-gray-500 -mt-0.5 parent-ellipsis-container-extension"
                                        ></component>
                                        <span
                                            class="mb-0 ml-1 text-sm text-gray-700 truncate parent-ellipsis-container-base"
                                        >
                                            {{ item.label }}
                                        </span>
                                    </div>
                                    <div
                                        class="relative flex items-center h-full"
                                    >
                                        <ColumnKeys
                                            :isPrimary="item.isPrimary"
                                            :isForeign="item.isForeign"
                                            :isPartition="item.isPartition"
                                        />

                                        <AtlanIcon
                                            icon="Check"
                                            class="ml-2 text-primary"
                                            v-if="
                                                selectedColumn?.qualifiedName ===
                                                item.qualifiedName
                                            "
                                        />
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
                v-if="isColumnLoading"
                style="min-height: 100px !important"
            ></Loader>
            <Loader
                v-if="isTableLoading && !dirtyIsTableSelected"
                style="min-height: 100px !important"
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
        toRaw,
        PropType,
        ref,
    } from 'vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import Loader from '@common/loaders/page.vue'
    import CustomInput from '~/components/insights/playground/editor/vqb/panels/common/input/index.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import { pluralizeString, getValidStringUsingCount } from '~/utils/string'
    import { selectedTables } from '~/types/insights/VQB.interface'

    export default defineComponent({
        name: 'Multi Select',
        components: { PopoverAsset, Loader, CustomInput, ColumnKeys },
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedColumn: {
                type: Object,
                required: true,
                default: () => {},
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            tableQualfiedName: {
                type: String,
                required: true,
            },
        },
        emits: ['change'],

        setup(props, { emit }) {
            const {
                disabled,
                tableQualfiedName,
                selectedTablesQualifiedNames,
            } = toRefs(props)
            const { selectedColumn } = useVModels(props)
            const isJoinPanelDisabled = inject(
                'isJoinPanelDisabled'
            ) as Ref<Boolean>
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const isTableSelected = inject('isTableSelected') as Ref<Boolean>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<number>
            const totalViewsCount = inject('totalViewsCount') as Ref<number>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<number>
            const columnQueryText = inject('columnQueryText') as Ref<String>
            const tableQueryText = inject('tableQueryText') as Ref<String>
            const tableSelected = inject('tableSelected') as Ref<Object>
            const dirtyTableSelected = inject(
                'dirtyTableSelected'
            ) as Ref<Object>
            const dirtyIsTableSelected = inject(
                'dirtyIsTableSelected'
            ) as Ref<Object>

            dirtyTableSelected.value = tableSelected.value
            dirtyIsTableSelected.value = isTableSelected.value

            const TableList = inject('TableList') as Ref<any[]>
            const ColumnList = inject('ColumnList') as Ref<any[]>
            const getTableInitialBody = inject(
                'getTableInitialBody'
            ) as Function
            const getColumnInitialBody = inject(
                'getColumnInitialBody'
            ) as Function
            const replaceTableBody = inject('replaceTableBody') as Function
            const replaceColumnBody = inject('replaceColumnBody') as Function
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const { isJoinPanelStateDisabledComputed } = useJoin()
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

            const placeholder = computed(() => {
                let data = ''
                if (
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled.value,
                        selectedTablesQualifiedNames.value
                    )
                ) {
                    if (dirtyIsTableSelected.value) {
                        if (isColumnLoading.value) {
                            data = 'Loading...'
                        } else {
                            data = `Search from ${
                                totalColumnsCount.value
                            } ${pluralizeString(
                                'column',
                                totalColumnsCount.value,
                                false
                            )}`
                        }
                    } else {
                        if (isTableLoading.value) {
                            data = 'Loading tables and views...'
                        } else {
                            data = `Search from ${
                                totalTablesCount.value
                            } ${pluralizeString(
                                'table',
                                totalTablesCount.value,
                                false
                            )} ${getValidStringUsingCount(
                                totalViewsCount.value,
                                `and ${totalViewsCount.value} ${pluralizeString(
                                    'view',
                                    totalViewsCount.value,
                                    false
                                )}`
                            )}`
                        }
                    }
                } else {
                    if (isColumnLoading.value) {
                        data = 'Loading columns...'
                    } else {
                        data = `Search from ${
                            totalColumnsCount.value
                        } ${pluralizeString(
                            'column',
                            totalColumnsCount.value,
                            false
                        )}`
                    }
                }

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

            const onSelectTable = (item, event) => {
                tableQueryText.value = ''

                replaceColumnBody(getColumnInitialBody(item, 'not_initial'))
                dirtyIsTableSelected.value = true
                dirtyTableSelected.value = item

                event.stopPropagation()
                event.preventDefault()

                return false
            }
            const onUnselectTable = (event) => {
                dirtyIsTableSelected.value = false
                dirtyTableSelected.value = null
                columnDropdownOption.value = []
                columnQueryText.value = ''
                replaceTableBody(
                    getTableInitialBody(selectedTablesQualifiedNames.value)
                )
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            const onSelectColumn = (item, event) => {
                tableSelected.value = dirtyTableSelected.value
                isTableSelected.value = true
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    qualifiedName: item.qualifiedName,
                    tableName: item.item.attributes.tableName,
                    column: item.item,
                    attributes: item.attributes,
                    isPrimary: item.item.attributes?.isPrimary,
                    isForeign: item.item.attributes?.isForeign,
                    isPartition: item.item.attributes?.isPartition,
                    item: item.item,
                }
                emit('change', item)
                event.stopPropagation()
                event.preventDefault()
                updateVQB(activeInlineTab, inlineTabs)
                isAreaFocused.value = false
                return false
            }

            const actionClick = (event, t) => {
                openAssetInSidebar(event, t, activeInlineTab, inlineTabs)
            }

            /* ----------------------------------------- */

            watch(
                () => activeInlineTab.value.playground.editor.context,
                (newContext) => {
                    if (
                        !isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled.value,
                            selectedTablesQualifiedNames.value
                        )
                    ) {
                        if (
                            !tableSelected.value?.attributes?.qualifiedName?.includes(
                                newContext.attributeValue
                            )
                        ) {
                            dirtyIsTableSelected.value = false
                            dirtyTableSelected.value = null
                            isTableSelected.value = false
                            tableSelected.value = null
                        }
                    }
                },
                {
                    immediate: true,
                }
            )

            watch(
                isAreaFocused,
                (newIsAreaFocused) => {
                    if (
                        !isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled.value,
                            selectedTablesQualifiedNames.value
                        )
                    ) {
                        if (newIsAreaFocused) {
                            dirtyTableSelected.value = toRaw(
                                tableSelected.value
                            )
                            dirtyIsTableSelected.value = toRaw(
                                isTableSelected.value
                            )
                            // debugger

                            if (!tableSelected.value) {
                                replaceTableBody(
                                    getTableInitialBody(
                                        selectedTablesQualifiedNames.value
                                    )
                                )
                            } else {
                                replaceColumnBody(
                                    getColumnInitialBody(
                                        tableSelected.value,
                                        'not_initial'
                                    )
                                )
                            }
                        } else {
                            dirtyTableSelected.value = null
                            dirtyIsTableSelected.value = false
                        }
                    } else {
                        replaceColumnBody(
                            getColumnInitialBody(
                                activeInlineTab.value.playground.vqb
                                    .selectedTables,
                                'initial'
                            )
                        )
                    }
                },
                { immediate: true }
            )

            watch(tableQueryText, () => {
                if (
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled.value,
                        selectedTablesQualifiedNames.value
                    )
                ) {
                    if (!dirtyIsTableSelected?.value) {
                        replaceTableBody(
                            getTableInitialBody(
                                selectedTablesQualifiedNames.value
                            )
                        )
                    }
                }
            })
            watch(columnQueryText, () => {
                if (
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled.value,
                        selectedTablesQualifiedNames.value
                    )
                ) {
                    if (dirtyIsTableSelected?.value) {
                        replaceColumnBody(
                            getColumnInitialBody(
                                dirtyTableSelected.value,
                                'not_initial'
                            )
                        )
                    }
                } else {
                    replaceColumnBody(
                        getColumnInitialBody(
                            activeInlineTab.value.playground.vqb.selectedTables,
                            'initial'
                        )
                    )
                }
            })

            return {
                isJoinPanelDisabled,
                tableQualfiedName,
                getDataTypeImage,
                actionClick,
                onSelectColumn,
                onUnselectTable,
                onSelectTable,
                isColumnLoading,
                isTableLoading,
                placeholder,
                columnQueryText,
                tableQueryText,
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
                dirtyTableSelected,
                dirtyIsTableSelected,
                selectedTablesQualifiedNames,
                isJoinPanelStateDisabledComputed,
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

    .selector-height {
        min-height: 32px;
    }

    .disable-bg {
        background-color: #fbfbfb;
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
