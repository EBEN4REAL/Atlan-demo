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
            <div
                class="flex flex-col w-full dropdown-container"
                v-if="
                    !dirtyIsTableSelected &&
                    selectedTablesQualifiedNames.length >= 2
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
                    selectedTablesQualifiedNames.length >= 2
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
                                    :checked="map[item?.value]"
                                    @change="
                                        (checked) =>
                                            onCheckboxChange(checked, item)
                                    "
                                    class="inline-flex flex-row-reverse items-center w-full px-4 py-1 rounded atlanReverse hover:bg-primary-light dropdown-container"
                                >
                                    <div
                                        class="justify-between parent-ellipsis-container dropdown-container"
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
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import Loader from '@common/loaders/page.vue'
    import CustomInput from '~/components/insights/playground/editor/vqb/panels/common/input/index.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import { pluralizeString } from '~/utils/string'
    import { selectedTables } from '~/types/insights/VQB.interface'

    export default defineComponent({
        name: 'Multi Column Select',
        components: { PopoverAsset, Loader, CustomInput, ColumnKeys },
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
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
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            selectedColumnsData: {
                type: Object as PropType<
                    Array<{
                        qualifiedName: string
                        label: string
                        type: Number
                    }>
                >,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { disabled, selectedTablesQualifiedNames } = toRefs(props)
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const isTableSelected = inject('isTableSelected') as Ref<Boolean>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<number>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<number>
            const columnQueryText = inject('columnQueryText') as Ref<String>
            const tableQueryText = inject('tableQueryText') as Ref<String>
            const tableSelected = inject('tableSelected') as Ref<Object>
            const map = inject('map') as Ref<Object>
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
                        data = 'Loading...'
                    } else {
                        data = `Search from ${
                            totalTablesCount.value
                        } ${pluralizeString(
                            'table',
                            totalTablesCount.value,
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
                    value: ls.attributes?.qualifiedName,
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

            const actionClick = (event, t) => {
                openAssetInSidebar(event, t, activeInlineTab, inlineTabs)
            }

            const onCheckboxChange = (checked, item) => {
                const selectedColumnsDataCopy = JSON.parse(
                    JSON.stringify(selectedColumnsData.value ?? [])
                )
                if (checked.target.checked) {
                    map.value[item.value] = true
                    selectedColumnsDataCopy.push({
                        label: item.label,
                        type: item.type,
                        qualifiedName: item.value,
                    })
                } else {
                    delete map.value[item.value]
                    const _index = selectedColumnsDataCopy.findIndex(
                        (t) => t.qualifiedName === item.value
                    )
                    selectedColumnsDataCopy.splice(_index, 1)
                }
                selectedItems.value = [...Object.keys(map.value)]
                selectedColumnsData.value = selectedColumnsDataCopy
                updateVQB(activeInlineTab, inlineTabs)
            }

            const clearAllSelected = () => {
                selectedItems.value = []
                map.value = {}
                selectedColumnsData.value = []
                updateVQB(activeInlineTab, inlineTabs)

                console.log(map.value, 'destroy')
            }

            /* ----------------------------------------- */

            watch(
                () => activeInlineTab.value.playground.editor.context,
                (newContext) => {
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
                },
                {
                    immediate: true,
                }
            )

            watch(
                isAreaFocused,
                (newIsAreaFocused) => {
                    if (newIsAreaFocused) {
                        dirtyTableSelected.value = toRaw(tableSelected.value)
                        dirtyIsTableSelected.value = toRaw(
                            isTableSelected.value
                        )

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
                },
                { immediate: true }
            )

            watch(tableQueryText, () => {
                if (!dirtyIsTableSelected?.value) {
                    replaceTableBody(
                        getTableInitialBody(selectedTablesQualifiedNames.value)
                    )
                }
            })
            watch(columnQueryText, () => {
                if (dirtyIsTableSelected?.value) {
                    replaceColumnBody(
                        getColumnInitialBody(
                            dirtyTableSelected.value,
                            'not_initial'
                        )
                    )
                }
            })

            return {
                map,
                getDataTypeImage,
                actionClick,
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
                onCheckboxChange,
                clearAllSelected,
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
