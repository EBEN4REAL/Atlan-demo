<template>
    <div class="flex flex-col px-4 pt-2 pb-4 overflow-y-auto gap-y-1">
        <div
            class="px-3 py-2 rounded cursor-pointer"
            v-for="(item, index) in list"
            :class="[
                item[dataKey] === selected
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-light',
                disabled ? 'cursor-not-allowed opacity-70' : '',
            ]"
            :key="item[dataKey]"
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
            selected: String,
            disabled: { type: Boolean, default: () => false },
            dataKey: { type: String, required: true, default: () => 'guid' },
        },
        emits: ['update:selected', 'select'],
    })
</script>
