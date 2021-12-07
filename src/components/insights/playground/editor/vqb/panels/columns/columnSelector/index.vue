<template>
    <div
        ref="container"
        @click="setFoucs"
        @focusout="handleContainerBlur"
        tabindex="0"
        style="height: 32px"
        class="relative flex items-center"
        :class="[
            isAreaFocused
                ? ' border-primary-focus border-2 border-minus'
                : 'border-gray-300 border border-plus',
            ,
            'flex flex-wrap items-center   mx-3 rounded selector-height px-3',
        ]"
        @click.stop="() => {}"
    >
        <template
            v-if="cols.length !== 0"
            v-for="(item, index) in cols"
            :key="item.label + index"
        >
            <div
                class="flex items-center px-3 py-0.5 my-1 justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
            >
                <span> {{ item.label }}</span>
            </div>
        </template>
        <a-input
            v-if="cols.length > 0"
            ref="inputRef"
            v-model:value="inputValue"
            @focus="
                () => {
                    isAreaFocused = true
                }
            "
            @change="inputChange"
            :placeholder="placeholder"
            :style="`width:${placeholder.length + 2}ch;`"
            class="p-0 pr-4 text-xs border-none shadow-none outline-none focus-none"
        />
        <a-input
            v-else
            v-model:value="inputValue"
            placeholder="Add columns to fetch results"
            class="w-full p-0 border-none shadow-none outline-none focus-none"
        />
        <div class="absolute right-2">
            <AtlanIcon
                icon="ChevronDown"
                class="w-4 h-4"
                v-if="!isAreaFocused"
            />
            <AtlanIcon v-else icon="Search" class="w-4 h-4" />
        </div>
        <!-- class="border-none shadow-none outline-none focus-none" -->
        <div
            v-if="isAreaFocused"
            @click.stop="() => {}"
            class="absolute z-10 pb-2 overflow-auto bg-white rounded custom-shadow position"
            :style="`width: 100%; height: 250px;top:${topPosShift}px`"
        ></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, nextTick, onMounted } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
        },
        props: {},

        setup(props, { emit }) {
            const { getDataTypeImage } = useColumn()
            const placeholder = 'Search from 6 columns'
            const inputRef = ref()
            const topPosShift = ref(0)
            const inputValue = ref('')
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const cols = ref([
                {
                    type: 'string',
                    label: 'Customer',
                },
                {
                    type: 'string',
                    label: 'Customer',
                },
            ])
            const setFoucs = () => {
                inputChange()
                isAreaFocused.value = true
                nextTick(() => {
                    inputRef?.value?.focus()
                })
            }
            const onBlur = () => {
                isAreaFocused.value = false
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

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                console.log(container.value)
            })
            const inputChange = () => {
                if (topPosShift.value !== container.value?.offsetHeight) {
                    topPosShift.value = container.value?.offsetHeight
                }
            }

            return {
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                inputValue,
                clickPos,
                handleDeleteColumn,
                onSelectedColumn,
                container,
                handleContainerBlur,
                onBlur,
                setFoucs,
                isAreaFocused,
                getDataTypeImage,
                cols,
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
</style>
