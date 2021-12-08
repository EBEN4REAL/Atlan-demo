<template>
    <div
        ref="container"
        @click="setFocus"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center group"
        :class="[
            isAreaFocused
                ? ' border-primary-focus border-2 '
                : 'border-gray-300 border border-plus',
            ,
            'flex flex-wrap items-center  rounded box-shadow selector-height px-3',
            !columnName ? ' cursor-not-allowed disable-bg' : '',
        ]"
        @click.stop="() => {}"
    >
        <template
            v-if="enrichedSelectedItems.length !== 0"
            v-for="(item, index) in enrichedSelectedItems"
            :key="item + index"
        >
            <!-- chips -->
            <div
                class="flex items-center px-3 py-0.5 my-1 justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
            >
                <span> {{ item.label }}</span>
            </div>
        </template>

        <a-input
            v-if="selectedItems.length == 0"
            :disabled="!columnName"
            :placeholder="placeholder"
            :contenteditable="false"
            :class="[
                'w-full p-0  border-none shadow-none outline-none text-sm  focus-none',
                !columnName ? $style.custom_input : '',
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
                'absolute z-10 pb-2 overflow-auto bg-white rounded custom-shadow position',
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
                                map[item.value]
                                    ? 'bg-primary-light'
                                    : 'bg-white'
                            "
                        >
                            <span>{{ item.label }}</span>
                            <AtlanIcon
                                icon="Check"
                                class="text-primary"
                                v-if="map[item.value]"
                            />
                        </div>
                    </template>
                </div>

                <span
                    class="w-full mt-4 text-sm text-center text-gray-400"
                    v-if="dropdownOption.length == 0"
                >
                    No functions found!
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
    import { useAggregate } from '~/components/insights/playground/editor/vqb/composables/useAggregate'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'

    // import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        emits: ['checkChange'],
        props: {
            selectedItems: {
                type: Object as PropType<any[]>,
                required: true,
            },
            columnName: {
                type: String,
                required: true,
            },
            columnType: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { columnName, columnType } = toRefs(props)

            const { selectedItems } = useVModels(props)
            const map = ref({})

            const { aggregateList } = useAggregate()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const inputRef = ref()
            const selectAll = ref(false)
            const topPosShift = ref(0)
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const setFocus = () => {
                if (!columnType.value) return
                // inputChange()
                isAreaFocused.value = true
                // nextTick(() => {
                //     if (columnType.value) inputRef?.value?.focus()
                // })
            }

            const handleContainerBlur = (event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (!container.value.contains(event.relatedTarget)) {
                    isAreaFocused.value = false
                }
            }
            const handleDeleteColumn = (index: any) => {
                cols.value.splice(index, 1)
            }

            const onSelectedColumn = (node: any) => {
                console.log(node, 'node')
                const label = node?.dataRef?.name
                const type = node?.dataRef?.dataType?.toLowerCase()
                cols.value.push({ type, label })
            }

            const inputChange = () => {
                console.log('called')
                if (topPosShift.value !== container.value?.offsetHeight) {
                    topPosShift.value = container.value?.offsetHeight
                }
            }

            let aggregationList = ref([])
            watch(
                [columnType],
                () => {
                    aggregationList.value = aggregateList(columnType.value)
                },
                {
                    immediate: true,
                }
            )
            const placeholder = computed(() => {
                if (columnName.value) {
                    return `Select functions`
                }
                return `Select a column first`
            })
            // const totalCount = computed(
            //     () => aggregationList.value?.length || 0
            // )

            const dropdownOption = computed(() => {
                let data = aggregationList.value.map((ls) => ({
                    label: ls.label,
                    value: ls.key,
                    key: ls.key,
                }))
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const enrichedSelectedItems = computed(() => {
                const data: any[] = []
                selectedItems.value.forEach((key) => {
                    let item = aggregationList.value.find(
                        (el) => el.key === key
                    )
                    data.push({
                        label: item.label,
                    })
                    // }
                })
                return data
            })

            const onCheckChange = (checked) => {
                // inputChange()
                console.log('options: ', { checked, map: map.value })
                selectAll.value = false
                if (!(checked.key in map.value)) {
                    map.value[checked.key] = true
                } else {
                    delete map.value[checked.key]
                }
                selectedItems.value = [...Object.keys(map.value)]
                emit('checkChange', selectedItems.value)
            }

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                console.log(container.value)
            })

            const mouseOver = ref(false)
            const handleMouseOver = () => {
                if (!mouseOver.value) mouseOver.value = true
            }
            const handleMouseOut = () => {
                if (mouseOver.value) mouseOver.value = false
            }

            return {
                map,
                enrichedSelectedItems,
                onCheckChange,
                selectAll,
                dropdownOption,
                selectedItems,
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                clickPos,
                handleDeleteColumn,
                onSelectedColumn,
                container,
                handleContainerBlur,
                setFocus,
                isAreaFocused,
                columnName,
                columnType,
                handleMouseOver,
                handleMouseOut,
                mouseOver,
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
