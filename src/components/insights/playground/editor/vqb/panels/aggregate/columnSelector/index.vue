<template>
    <div
        ref="container"
        @click="setFocus"
        @focusout="handleContainerBlur"
        tabindex="0"
        class="relative flex items-center z-1"
        :class="[
            isAreaFocused
                ? ' border-primary-focus border-2 '
                : 'border-gray-300 border border-plus',
            ,
            'flex flex-wrap items-center rounded box-shadow selector-height px-3',
            !columnList?.length ? ' cursor-not-allowed disable-bg' : '',
        ]"
        @click.stop="() => {}"
    >
        <template v-if="selectedColumn?.label">
            <!-- chips -->
            <div class="flex items-center">
                <component
                    :is="getDataTypeImage(selectedColumn?.type)"
                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                ></component>
                <span class="mb-0 ml-1 text-sm text-gray-700">
                    {{ selectedColumn?.label }}
                </span>
            </div>
        </template>
        <a-input
            v-if="!selectedColumn?.key"
            :disabled="!columnList?.length"
            :placeholder="placeholder"
            :contenteditable="false"
            :class="[
                'w-full p-0  border-none shadow-none outline-none text-sm  focus-none',
                !columnList?.length ? $style.custom_input : '',
            ]"
        />
        <div class="absolute right-2">
            <AtlanIcon icon="ChevronDown" class="w-4 h-4" />
        </div>
        <div
            v-if="isAreaFocused"
            @click.stop="() => {}"
            :style="`width: 100%;top:${topPosShift}px`"
            :class="[
                'absolute z-10 overflow-auto bg-white rounded custom-shadow position',
            ]"
        >
            <div
                :class="['flex  justify-center overflow-auto']"
                style="max-height: 250px"
            >
                <div class="w-full">
                    <template
                        v-for="(item, index) in dropdownOption"
                        :key="item.value + index"
                        v-if="dropdownOption.length !== 0"
                    >
                        <div
                            class="flex items-center justify-between w-full px-4 h-9 hover:bg-primary-light"
                            @click="onCheckChange(item)"
                            :class="
                                selectedColumn?.key === item.key
                                    ? 'bg-primary-light'
                                    : 'bg-white'
                            "
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
                            <AtlanIcon
                                icon="Check"
                                class="text-primary"
                                v-if="selectedColumn?.key === item.key"
                            />
                        </div>
                    </template>
                </div>

                <span
                    class="w-full mt-4 text-sm text-center text-gray-400"
                    v-if="dropdownOption.length == 0"
                >
                    No columns selected!
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
        emits,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import Loader from '@common/loaders/page.vue'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    // import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: { Loader },
        props: {
            columnSubpanels: {
                type: Object as PropType<SubpanelColumn[]>,
                required: true,
                default: [],
            },
            selectedColumn: {
                type: Object,
                required: true,
                default: {},
            },
        },
        emits: ['change'],

        setup(props, { emit }) {
            const { columnSubpanels, selectedColumn } = useVModels(props)
            // let selectedColumn = ref({})

            const { getDataTypeImage } = useColumn()

            const inputRef = ref()
            const selectAll = ref(false)
            const topPosShift = ref(0)
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const setFocus = () => {
                isAreaFocused.value = true
            }

            const handleContainerBlur = (event) => {
                if (!container?.value?.contains(event?.relatedTarget)) {
                    isAreaFocused.value = false
                }
            }

            let columnList = computed(() => {
                let cols = []
                columnSubpanels.value.forEach((panel) => {
                    panel.columnsData?.forEach((col) => {
                        let qn = col.columnQualifiedName.split('/')
                        let table = qn[qn.length - 2]

                        cols.push({
                            ...col,
                            key: col.label,
                            value: col.label,
                            table: table,
                        })
                    })
                })
                return cols
            })

            const dropdownOption = computed(() => {
                let data = columnList.value

                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const onCheckChange = (checked) => {
                console.log('check: ', checked)
                // selectedColumn.value = checked
                emit('change', checked)
            }

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                console.log(container.value)
            })

            const placeholder = computed(() => {
                if (columnList.value.length) {
                    return `Select from ${columnList.value.length} columns`
                }
                return `Select a column first`
            })

            return {
                onCheckChange,
                selectAll,
                dropdownOption,
                placeholder,
                topPosShift,
                inputRef,
                clickPos,
                container,
                handleContainerBlur,
                setFocus,
                isAreaFocused,
                columnSubpanels,
                columnList,
                selectedColumn,
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
