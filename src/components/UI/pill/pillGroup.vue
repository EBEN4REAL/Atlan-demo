<template>
    <div class="flex flex-wrap items-center flex-grow gap-x-1 gap-y-1.5">
        <template v-for="(item, index) in data">
            <a-popover
                v-if="popoverTrigger"
                :key="index"
                :mouse-enter-delay="0.3"
                placement="leftTop"
                :trigger="popoverTrigger"
            >
                <template #content>
                    <slot name="popover" :item="item" :index="index"></slot>
                </template>
                <Pill
                    :label="customRendererForLabel(item[labelKey])"
                    :has-action="!readOnly"
                    :prefix-icon="prefixIcons[index]"
                    :hovered-pill="hoveredPill"
                    :is-plain="isPlain"
                    @action="handleDelete(index)"
                    @click="handleClick(item, index)"
                >
                    <template #prefix>
                        <slot name="pillPrefix" :item="item"></slot>
                    </template>
                </Pill>
            </a-popover>
            <Pill
                v-else
                :key="item[labelKey] + index"
                :label="customRendererForLabel(item[labelKey])"
                :has-action="!readOnly"
                :prefix-icon="prefixIcons[index]"
                :hovered-pill="hoveredPill"
                :is-plain="isPlain"
                @action="handleDelete(index)"
                @click="handleClick(item, index)"
                ><template #prefix>
                    <slot name="pillPrefix" :item="item"></slot> </template
            ></Pill>
        </template>
        <slot name="suffix"></slot>
        <template v-if="!hasAddBtn">
            <Pill
                v-if="!readOnly"
                class="group"
                :is-plain="isPlain"
                @click="handleAdd"
                @blur="handleBlur"
            >
                <template #prefix>
                    <AtlanIcon
                        icon="Add"
                        class="h-4 -mx-1.5 text-gray group-hover:text-white"
                    />
                </template>
            </Pill>
        </template>
        <template v-if="hasAddBtn && !readOnly">
            <slot name="addBtn" :item="{ handleAdd, handleBlur }"></slot>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref } from 'vue'
    import Pill from './pill.vue'

    export default defineComponent({
        name: 'PillGroup',
        props: {
            prefixIcons: {
                type: Object as PropType<Array<String>>,
                default: () => [],
            },
            labelKey: {
                type: String,
                default: () => '',
            },
            hoveredPill: {
                type: Boolean,
                default: true,
            },
            readOnly: {
                type: Boolean,
                default: () => false,
            },
            data: {
                type: Array as PropType<any[]>,
                default: () => [],
            },
            popoverTrigger: {
                type: String as PropType<
                    '' | 'hover' | 'focus' | 'click' | 'contextmenu'
                >,
                default: () => '',
            },
            customRendererForLabel: {
                type: Function,
                required: false,
                default: (x: string) => x,
            },
            isPlain: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: ['delete', 'update:data', 'select', 'add', 'blur'],
        components: { Pill },
        setup(prop, { emit, slots }) {
            const { data, customRendererForLabel } = toRefs(prop)
            const hasAddBtn = ref(false)

            // Check if the slot exists by name and has content.
            // It returns an empty array if it's empty.
            if (slots.addBtn && slots.addBtn().length) {
                hasAddBtn.value = true
            }

            function handleDelete(index: number) {
                emit('delete', data.value[index])

                const newData = [...data.value]
                newData.splice(index, 1)
                emit('update:data', newData)
            }
            function handleClick(item: any, index: number) {
                emit('select', item, index)
            }
            function handleAdd() {
                emit('add')
            }
            function handleBlur() {
                emit('blur')
            }

            return {
                customRendererForLabel,
                handleDelete,
                hasAddBtn,
                handleClick,
                handleAdd,
                handleBlur,
            }
        },
    })
</script>
