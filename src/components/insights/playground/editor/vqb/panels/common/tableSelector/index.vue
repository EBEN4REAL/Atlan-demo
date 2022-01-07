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
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
        ]"
        style="min-height: 34px"
        @click.stop="() => {}"
    >
        <div
            class="flex items-center truncate parent-ellipsis-container"
            v-if="getTableNameFromTableQualifiedName(modelValue ?? '')"
        >
            <AtlanIcon
                :icon="
                    getEntityStatusIcon(
                        selectedTableData.assetType,
                        selectedTableData.certificateStatus
                    )
                "
                class="w-4 h-4 mr-2 -mt-0.5"
                style="min-width: 16px"
            />
            <span class="parent-ellipsis-container-base"
                >{{ getTableNameFromTableQualifiedName(modelValue ?? '') }}
            </span>
        </div>

        <a-input
            v-if="modelValue && isAreaFocused"
            ref="inputRef"
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
            ]"
        />
        <a-input
            v-if="!modelValue"
            ref="initialRef"
            v-model:value="inputValue2"
            @change="input2Change"
            :placeholder="placeholder"
            :style="`width:${placeholder.length + 2}ch;`"
            :class="[
                ' p-0 ml-2  border-none shadow-none outline-none text-sm  focus-none',
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
                        selectedItem
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
                        selectedItem
                    )
                "
            />
        </div>
        <div
            v-if="isAreaFocused"
            @click.stop="() => {}"
            :style="`width: 100%;top:${topPosShift}px`"
            :class="[
                'absolute z-10  pb-2 overflow-auto bg-white rounded custom-shadow position',
            ]"
        >
            <div
                :class="['flex  justify-center overflow-auto']"
                style="height: 250px"
            >
                <Loader
                    v-if="isLoading"
                    style="min-height: 250px !important"
                ></Loader>
                <div
                    class="w-full"
                    v-if="dropdownOption.length !== 0 && !isLoading"
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
                                class="flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                @click="(checked) => onSelectItem(item)"
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
                </div>

                <span
                    class="w-full mt-4 text-sm text-center text-gray-400"
                    v-if="dropdownOption.length == 0 && !isLoading"
                >
                    No Tables found!
                </span>
            </div>
        </div>
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
        toRefs,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useVModels } from '@vueuse/core'
    import Loader from '@common/loaders/page.vue'
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
            PopoverAsset,
        },
        emits: ['update:modelValue', 'change', 'update:selectedTableData'],

        props: {
            selectedItem: {
                type: Object,
                required: true,
            },
            tableQualfiedName: {
                type: String,
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

        setup(props, { emit }) {
            const { tableQualfiedName } = toRefs(props)
            const { assetType, certificateStatus } = useAssetInfo()
            const { getTableNameFromTableQualifiedName } = useUtils()
            const queryText = ref('')
            const { selectedItem, modelValue, selectedTableData } =
                useVModels(props)

            const { getDataTypeImage } = useColumn()
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
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
                isAreaFocused.value = true
                nextTick(() => {
                    inputRef?.value?.focus()
                    initialRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                nextTick(() => {
                    inputRef?.value?.focus()
                    initialRef?.value?.focus()
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
            const getInitialBody = () => {
                return {
                    dsl: useBody({
                        searchText: queryText.value,
                        context:
                            activeInlineTab.value.playground.editor.context,
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

            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    replaceBody(getInitialBody())
                },
                {
                    immediate: true,
                }
            )

            const totalCount = computed(() => data.value?.approximateCount || 0)
            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    ...ls,
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    certificateStatus: ls.attributes.certificateStatus,
                    value: ls.attributes.qualifiedName,
                    item: ls,
                }))
                return data
            })
            const placeholder = computed(() => {
                if (isLoading.value) return 'Loading...'
                if (
                    activeInlineTab.value.playground.editor.context
                        .attributeName
                )
                    return `Select from ${totalCount.value} tables`
                return `Select a table first`
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

            const onSelectItem = (item) => {
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
                emit('update:selectedTableData', copySelectedTableData)
                isAreaFocused.value = false
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
            }

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                nextTick(() => {
                    initialRef.value?.focus()
                })
            })
            onUpdated(() => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
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
                actionClick,
                selectedTableData,
                modelValue,
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
                getEntityStatusIcon,
                assetType,
                certificateStatus,
                getTableNameFromTableQualifiedName,
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
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
    .custom_input {
        background-color: #fbfbfb !important;
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