<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center py-1 group"
        :class="[
            isAreaFocused
                ? ' border-primary-focus border-2 '
                : 'border-gray-300 border border-plus',
            ,
            'flex flex-wrap items-center   mx-3 rounded box-shadow selector-height px-3',
            !tableQualfiedName ? ' cursor-not-allowed disable-bg' : '',
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
            :disabled="!tableQualfiedName"
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
                'p-0 pr-4 text-sm border-none shadow-none outline-none my-0.5 focus-none',
                !tableQualfiedName ? $style.custom_input : '',
            ]"
        />
        <a-input
            v-if="selectedItems.length == 0"
            :disabled="!tableQualfiedName"
            v-model:value="inputValue2"
            @change="input2Change"
            :placeholder="placeholder"
            :class="[
                'w-full p-0  border-none shadow-none outline-none text-sm  focus-none',
                !tableQualfiedName ? $style.custom_input : '',
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
                    )
                "
            />
        </div>
        <div
            v-if="isAreaFocused"
            @click.stop="() => {}"
            :style="`width: 100%;top:${topPosShift}px`"
            :class="[
                'absolute z-10 pb-2 overflow-auto bg-white rounded custom-shadow position',
            ]"
        >
            <div class="border-b border-gray-300">
                <a-checkbox
                    v-model:checked="selectAll"
                    @change="onSelectAll"
                    :class="$style.atlanReverse"
                    class="inline-flex flex-row-reverse items-center w-full px-4 py-1 rounded hover:bg-primary-light"
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
                        <a-checkbox
                            :checked="map[item.value]"
                            @change="
                                (checked) =>
                                    onCheckboxChange(checked, item.value)
                            "
                            class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded hover:bg-primary-light"
                            :class="$style.atlanReverse"
                        >
                            <div class="flex items-center">
                                <component
                                    :is="getDataTypeImage(item.type)"
                                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                                ></component>
                                <span class="mb-0 ml-1 text-sm text-gray-700">
                                    {{ item.label }}
                                </span>
                            </div>
                        </a-checkbox>
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
    </div>
</template>

<script lang="ts">
    import {
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
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import Loader from '@common/loaders/page.vue'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            Loader,
            TablesTree,
        },
        emits: ['queryTextChange', 'checkboxChange'],
        props: {
            selectedItems: {
                type: Object as PropType<any[]>,
                required: true,
            },
            queryText: {
                type: String,
                required: true,
                default: '',
            },
            tableQualfiedName: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { tableQualfiedName } = toRefs(props)
            const { selectedItems, queryText } = useVModels(props)
            const map = ref({})

            const { getDataTypeImage } = useColumn()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const inputRef = ref()
            const selectAll = ref(false)
            const mouseOver = ref(false)
            const topPosShift = ref(0)
            const inputValue1 = ref('')
            const inputValue2 = ref('')
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const setFoucs = () => {
                if (!tableQualfiedName.value) return
                inputChange()
                isAreaFocused.value = true
                nextTick(() => {
                    if (tableQualfiedName.value) inputRef?.value?.focus()
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
                if (topPosShift.value !== container.value?.offsetHeight) {
                    topPosShift.value = container.value?.offsetHeight
                }
            }

            const getInitialBody = () => {
                return {
                    dsl: useBody({
                        searchText: queryText.value,
                        tableQualfiedName: tableQualfiedName.value,
                    }),
                    attributes: ['name', 'displayName', 'dataType'],
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
            const placeholder = computed(() => {
                if (tableQualfiedName.value) {
                    return `Search from ${totalCount.value} columns`
                }
                return `Select a table first`
            })
            const totalCount = computed(() => data.value?.approximateCount || 0)
            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    type: ls.attributes?.dataType,
                    value: ls.attributes?.displayName || ls.attributes?.name,
                }))
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const onSelectAll = (e) => {
                inputChange()

                /* checked */
                if (e?.target.checked) {
                    selectedItems.value = ['all']
                    map.value = {}
                    emit('checkboxChange', ['all'])
                } else {
                    selectedItems.value = []
                    emit('checkboxChange', [])
                }
            }

            const input1Change = () => {
                setFoucs()
                queryText.value = inputValue1.value
                emit('queryTextChange')
            }
            const input2Change = () => {
                setFoucs()
                queryText.value = inputValue2.value
                emit('queryTextChange')
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
                        data.push({
                            type:
                                dropdownOption.value.find(
                                    (e) => e.label === val
                                )?.type ?? 'Columns',
                            label: val,
                        })
                    }
                })
                return data
            })

            const onCheckboxChange = (checked, id) => {
                inputChange()
                selectAll.value = false
                if (checked.target.checked) {
                    map.value[id] = true
                } else {
                    delete map.value[id]
                }
                selectedItems.value = [...Object.keys(map.value)]
                emit('checkboxChange', selectedItems.value)
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
                console.log(key, 'fxn Called')
                switch (key) {
                    case 'chevronDown': {
                        if (!isAreaFocused) {
                            if (selectedItems.length === 0 && mouseHover)
                                return true
                            if (selectedItems.length === 0 && !mouseHover)
                                return true
                            if (selectedItems.length !== 0 && !mouseHover)
                                return true
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
            }
            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                console.log(container.value)
            })

            return {
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
</style>
