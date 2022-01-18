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
            :class="['dropdown-container flex w-full flex-col']"
            style="min-height: 0"
        >
            <div class="px-4 py-3 border-b border-gray-300 dropdown-container">
                <div
                    class="flex items-center justify-between w-full"
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
                class="flex w-full dropdown-container"
                :class="isTableLoading ? 'flex-col' : ''"
                style="min-height: 0"
            >
                <div
                    class="w-full overflow-y-auto"
                    :class="[
                        tableDropdownOption.length === 0
                            ? 'flex justify-center items-center'
                            : '',
                    ]"
                    style="min-height: 0"
                >
                    <template
                        v-for="(item, index) in tableDropdownOption"
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
                                class="flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                @click="(e) => onSelectItem(item, e)"
                                :class="
                                    modelValue === item.value
                                        ? 'bg-primary-light'
                                        : 'bg-white'
                                "
                            >
                                <div
                                    class="flex items-center justify-between w-full truncate parent-ellipsis-container"
                                >
                                    <div
                                        class="flex items-center truncate parent-ellipsis-container"
                                    >
                                        <AtlanIcon
                                            :icon="
                                                getEntityStatusIcon(
                                                    assetType(item),
                                                    certificateStatus(item)
                                                )
                                            "
                                            class="w-4 h-4 mr-2 -mt-0.5"
                                            style="min-width: 16px"
                                        />
                                        <span
                                            class="parent-ellipsis-container-base"
                                            >{{ item?.label }}
                                        </span>
                                    </div>
                                    <div
                                        v-if="modelValue !== item.value"
                                        class="text-gray-500 parent-ellipsis-container-extension"
                                    >
                                        {{ item?.columnCount }}
                                    </div>
                                </div>
                                <AtlanIcon
                                    icon="Check"
                                    class="ml-2 text-primary parent-ellipsis-container-base"
                                    v-if="modelValue === item.value"
                                />
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
            <Loader
                v-if="isTableLoading"
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

    export default defineComponent({
        name: 'Multi Column Select',
        components: { PopoverAsset, Loader, CustomInput, ColumnKeys },
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedItem: {
                type: Object,
                required: true,
            },

            modelValue: {
                type: String,
                required: true,
            },
            selectedTableData: {
                type: Object as PropType<{
                    certificateStatus: string | undefined
                    assetType: string | undefined
                }>,
            },
        },
        emits: ['update:modelValue', 'change', 'update:selectedTableData'],

        setup(props, { emit }) {
            const { disabled, selectedItem } = toRefs(props)
            const { modelValue, selectedTableData } = useVModels(props)
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<number>
            const tableQueryText = inject('tableQueryText') as Ref<String>

            const TableList = inject('TableList') as Ref<any[]>
            const getTableInitialBody = inject(
                'getTableInitialBody'
            ) as Function
            const replaceTableBody = inject('replaceTableBody') as Function
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
                let data = `Search from ${totalTablesCount.value} columns`
                if (isTableLoading.value) {
                    data = 'Loading...'
                }

                return data
            })

            const tableDropdownOption = computed(() => {
                let data = TableList.value.map((ls) => ({
                    ...ls,
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    certificateStatus: ls.attributes.certificateStatus,
                    value: ls.attributes?.qualifiedName,
                    item: ls,
                }))
                return data
            })

            const actionClick = (event, t) => {
                openAssetInSidebar(event, t, activeInlineTab, inlineTabs)
            }

            const onSelectItem = (item, event) => {
                // qualifiedName
                console.log(item.value)

                emit('update:modelValue', item.value)
                emit('change', item)
                const copySelectedTableData = JSON.parse(
                    JSON.stringify(selectedTableData.value)
                )
                copySelectedTableData.certificateStatus =
                    certificateStatus(item)
                copySelectedTableData.assetType = assetType(item)
                copySelectedTableData.item = item
                emit('update:selectedTableData', copySelectedTableData)
                isAreaFocused.value = false
                updateVQB(activeInlineTab, inlineTabs)
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            /* ----------------------------------------- */

            watch(
                isAreaFocused,
                (newIsAreaFocused) => {
                    if (newIsAreaFocused)
                        replaceTableBody(getTableInitialBody())
                },
                { immediate: true }
            )

            watch(tableQueryText, () => {
                replaceTableBody(getTableInitialBody())
            })

            return {
                modelValue,
                onSelectItem,
                getDataTypeImage,
                actionClick,
                isTableLoading,
                placeholder,
                tableQueryText,
                selectedItem,
                isAreaFocused,
                disabled,
                tableDropdownOption,
                getTableInitialBody,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
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
