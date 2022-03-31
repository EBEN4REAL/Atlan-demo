<template>
    <a-select
        class="w-52"
        allow-clear
        show-search
        :bordered="type !== 'minimal'"
        :value="value"
        :get-popup-container="(target) => target.parentNode"
        @update:value="$emit('update:value', $event)"
    >
        <template #suffixIcon>
            <AtlanLoader v-if="loading" />
            <AtlanIcon v-else icon="CaretDown" />
        </template>
        <template v-for="item in list" :key="item.id">
            <a-select-option :value="item.id">
                <div class="flex items-center truncate gap-x-2">
                    <div
                        v-if="item.colorDot"
                        :style="`background-color: ${item.colorDot}`"
                        class="dot"
                    />
                    <img v-if="item.icon" :src="item.icon" class="w-4 h-auto" />
                    <span v-else-if="item.emoji" class="text-xs">{{
                        item.emoji
                    }}</span>
                    {{ item.label }}
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    interface selectorOptions {
        id: string
        label: string
        icon?: string
        colorDot?: string
        emoji?: string
    }

    export default defineComponent({
        name: 'BaseSelector',
        components: {},
        props: {
            value: { type: String, default: () => undefined },
            list: {
                type: Array as PropType<selectorOptions[]>,
                required: true,
                default: () => [],
            },
            loading: { type: Boolean, default: () => false },
            type: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
        },
        emits: ['update:value'],
    })
</script>

<style scoped>
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
    }
</style>
