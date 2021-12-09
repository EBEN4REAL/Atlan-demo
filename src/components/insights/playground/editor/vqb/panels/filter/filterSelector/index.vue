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
        <template v-if="selectedFilter?.name">
            <!-- chips -->
            <div class="flex items-center">
                <span class="mb-0 ml-1 text-sm text-gray-700">
                    {{ selectedFilter.title }}
                </span>
            </div>
        </template>

        <a-input
            v-if="!selectedFilter?.name"
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
                        v-if="dropdownOption?.length !== 0"
                    >
                        <div
                            class="flex items-center justify-between w-full px-4 h-9 hover:bg-primary-light"
                            @click="onCheckChange(item)"
                            :class="
                                selectedFilter.name === item.key
                                    ? 'bg-primary-light'
                                    : 'bg-white'
                            "
                        >
                            <span>{{ item.label }}</span>
                            <AtlanIcon
                                icon="Check"
                                class="text-primary"
                                v-if="selectedFilter.name === item.key"
                            />
                        </div>
                    </template>

                    <span
                        class="flex items-center justify-center w-full mt-4 text-sm text-center text-gray-400"
                        v-if="dropdownOption.length == 0"
                    >
                        No functions found!
                    </span>
                </div>
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
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'
    import { useVModels } from '@vueuse/core'

    // import useBody from './useBody'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        // emits: ['checkChange', 'filterChange'],
        props: {
            selectedFilter: {
                type: Object,
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

            const { selectedFilter } = useVModels(props)

            const { filterList } = useFilter()

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

            const inputChange = () => {
                console.log('called')
                if (topPosShift.value !== container.value?.offsetHeight) {
                    topPosShift.value = container.value?.offsetHeight
                }
            }

            let filtersList = ref({})

            watch(
                [columnType],
                () => {
                    // console.log('filters:', {
                    //     type: columnType,
                    //     filtersList,
                    // })
                    filtersList.value = filterList(columnType.value)
                },
                {
                    immediate: true,
                }
            )

            // let filterName = ref('')

            const placeholder = computed(() => {
                if (columnName.value) {
                    return `Select filter function`
                }
                return `Select a column first`
            })
            // const totalCount = computed(
            //     () => aggregationList.value?.length || 0
            // )

            const dropdownOption = computed(() => {
                let data = filtersList?.value?.length
                    ? filtersList.value[0].functions.map((ls) => ({
                          label: ls.name,
                          value: ls.name,
                          key: ls.key,
                          type: ls.type,
                          name: ls.name,
                      }))
                    : []
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const onCheckChange = (checked) => {
                // inputChange()
                // console.log(checked)
                selectedFilter.value = {
                    ...selectedFilter.value,
                    name: checked.key,
                    type: checked.type,
                    value: undefined,
                    title: checked.name,
                }
                // filterName.value = checked.name
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
                onCheckChange,
                selectAll,
                dropdownOption,
                selectedFilter,
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                clickPos,
                container,
                handleContainerBlur,
                // filterName,
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
