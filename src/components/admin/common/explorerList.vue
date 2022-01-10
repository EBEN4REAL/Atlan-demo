<template>
    <div
        class="flex flex-col px-4 pt-2 pb-4 overflow-y-auto gap-y-1"
        v-if="list?.length > 0"
    >
        <div
            v-for="(item, index) in list"
            :key="item[dataKey]"
            :class="[
                item[dataKey] === selected ? 'bg-primary-menu' : '',
                disabled ? 'cursor-not-allowed opacity-70' : '',
            ]"
            class="px-3 py-2 rounded cursor-pointer"
            @click="
                () => {
                    if (!disabled) {
                        $emit('update:selected', item[dataKey])
                        $emit('select', item)
                    }
                }
            "
        >
            <slot
                :item="item"
                :index="index"
                :isSelected="selected === item[dataKey]"
            ></slot>
        </div>
    </div>
    <div class="flex flex-col px-4 pt-2 pb-4 overflow-y-auto gap-y-1" v-else>
        <span class="text-center text-gray-500">No {{ type }} found!</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    export default defineComponent({
        name: 'ExplorerList',
        props: {
            list: {
                type: Array as PropType<any[]>,
                required: true,
                default: () => [],
            },
            type: {
                type: String,
                default: '',
                required: true,
            },
            selected: String,
            disabled: { type: Boolean, default: () => false },
            dataKey: { type: String, required: true, default: () => 'guid' },
        },
        emits: ['update:selected', 'select'],
    })
</script>
