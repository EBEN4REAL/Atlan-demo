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
                        v-model:queryText="columnQueryText"
                        :placeholder="placeholder"
                        :autofocus="true"
                    />
                </div>
            </div>

            <div
                class="flex w-full dropdown-container"
                v-if="!isColumnLoading"
                :class="isColumnLoading ? 'flex-col' : ''"
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
                            :mouseEnterDelay="1"
                            class="dropdown-container"
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

                            <a-checkbox
                                :checked="map[item?.value]"
                                @change="
                                    (checked) => onCheckboxChange(checked, item)
                                "
                                class="inline-flex flex-row-reverse items-center w-full px-4 py-1 rounded atlanReverse hover:bg-primary-light dropdown-container"
                            >
                                <div
                                    class="justify-between parent-ellipsis-container dropdown-container"
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
            <Loader
                v-if="isColumnLoading"
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
            selectedItems: {
                type: Object as PropType<string[]>,
                required: true,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            tableQualfiedName: {
                type: String,
                required: true,
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
            const {
                disabled,
                selectedTablesQualifiedNames,
                tableQualfiedName,
            } = toRefs(props)
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<number>
            const columnQueryText = inject('columnQueryText') as Ref<String>
            const map = inject('map') as Ref<Object>

            const ColumnList = inject('ColumnList') as Ref<any[]>
            const getColumnInitialBody = inject(
                'getColumnInitialBody'
            ) as Function
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
                let data = `Select a table first`
                if (tableQualfiedName.value) {
                    data = `Search from ${totalColumnsCount.value} columns`
                    if (isColumnLoading.value) {
                        data = 'Loading...'
                    } else {
                        data = `Search from ${totalColumnsCount.value} columns`
                    }
                }
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
                        item: item,
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
                isAreaFocused,
                (newIsAreaFocused) => {
                    if (newIsAreaFocused)
                        replaceColumnBody(getColumnInitialBody())
                },
                { immediate: true }
            )

            watch(columnQueryText, () => {
                replaceColumnBody(getColumnInitialBody())
            })

            return {
                map,
                getDataTypeImage,
                actionClick,
                isColumnLoading,
                placeholder,
                columnQueryText,

                isAreaFocused,
                disabled,
                columnDropdownOption,
                getColumnInitialBody,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
                certificateStatus,
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
