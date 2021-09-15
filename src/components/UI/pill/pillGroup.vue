<template>
    <div class="flex flex-wrap items-center flex-grow w-10 gap-x-1 gap-y-1.5">
        <template v-for="(item, index) in data">
            <a-popover
                :mouseEnterDelay="0.3"
                v-if="popoverTrigger"
                placement="leftTop"
                :trigger="popoverTrigger"
            >
                <template #content>
                    <slot name="popover" :item="item" :index="index"></slot>
                </template>
                <Pill
                    :label="item[labelKey]"
                    @action="handleDelete(index)"
                    @click="handleClick(item, index)"
                    :has-action="!readOnly"
                >
                    <template #prefix>
                        <slot name="pillPrefix"></slot>
                    </template>
                </Pill>
            </a-popover>
            <Pill
                v-else
                :label="item[labelKey]"
                @action="handleDelete(index)"
                @click="handleClick(item, index)"
                :has-action="!readOnly"
                ><template #prefix> <slot name="pillPrefix"></slot> </template
            ></Pill>
        </template>
        <slot name="suffix"></slot>
        <Pill v-if="!readOnly" @click="handleAdd" class="group">
            <template #prefix>
                <AtlanIcon
                    icon="Add"
                    class="h-4 text-primary group-hover:text-white"
                />
            </template>
        </Pill>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import Pill from './pill.vue'
    export default defineComponent({
        name: 'PillGroup',
        props: {
            labelKey: {
                type: String,
                default: () => '',
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
        },
        emits: ['delete', 'update:data', 'select', 'add'],
        components: { Pill },
        setup(prop, { emit }) {
            const { data } = toRefs(prop)
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
            return { handleDelete, handleClick, handleAdd }
        },
    })
</script>
