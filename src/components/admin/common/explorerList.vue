<template>
    <div class="flex flex-col px-4 pt-2 pb-4 overflow-y-auto gap-y-1">
        <div
            class="px-3 py-2 rounded cursor-pointer"
            v-for="(item, index) in list"
            :class="
                item[dataKey] === selected
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-light'
            "
            :key="item[dataKey]"
            @click="
                () => {
                    $emit('update:selected', item[dataKey])
                    $emit('select', item)
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
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'ExplorerList',
        props: {
            list: {
                type: Array as PropType<Any[]>,
                required: true,
                default: () => [],
            },
            selected: String,
            dataKey: { type: String, required: true, default: () => 'guid' },
        },
        emits: ['update:selected', 'select'],
    })
</script>
