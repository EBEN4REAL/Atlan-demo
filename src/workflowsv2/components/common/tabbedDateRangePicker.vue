<template>
    <div
        class="box-border flex items-stretch h-8 overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded"
    >
        <button
            v-for="item in ranges"
            :key="item.label"
            class="tabbed-btn"
            :class="{ selected: value === item.label }"
            @click="$emit('update:value', item.label)"
        >
            {{ item.label }}
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'TabbedDateRangePicker',
        components: {},
        props: {
            value: { type: String, required: false, default: () => undefined },
        },
        emits: ['update:value'],
        setup() {
            const ranges = [
                { label: 'Today' },
                { label: 'Yesterday' },
                { label: '7 days' },
                { label: '30 days' },
                { label: 'Custom' },
            ]

            return { ranges }
        },
    })
</script>

<style lang="less" scoped>
    .tabbed-btn {
        @apply box-border;
        @apply transition-colors;
        @apply outline-none;
        @apply px-4;
        @apply bg-white text-gray;

        &:hover:not(:disabled) {
            background-color: #f8f8f8;
        }

        &:disabled {
            @apply bg-gray-100;
            @apply opacity-75;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.selected {
            @apply bg-primary-light;
            @apply text-primary font-bold;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
</style>
