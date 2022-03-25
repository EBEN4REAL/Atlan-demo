<template>
    <div
        class="box-border flex items-stretch h-8 overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded"
    >
        <button
            v-for="item in ranges"
            :key="item.label"
            class="tabbed-btn"
            :class="selected === item.label ? 'fake-bold selected' : ''"
            @click="handleSelect(item.label, item.value())"
        >
            {{ item.label }}
        </button>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'TabbedDateRangePicker',
        components: {},
        props: {
            value: { type: Number, required: false, default: () => undefined },
        },
        emits: ['update:value'],
        setup(_, { emit }) {
            const selected = ref(undefined)
            const ranges = [
                {
                    label: 'Today',
                    value: () => dayjs().startOf('day').valueOf(),
                },
                {
                    label: 'Yesterday',
                    value: () =>
                        dayjs().startOf('day').subtract(1, 'day').valueOf(),
                },
                {
                    label: '7 days',
                    value: () =>
                        dayjs().startOf('day').subtract(7, 'day').valueOf(),
                },
                {
                    label: '30 days',
                    value: () =>
                        dayjs().startOf('day').subtract(30, 'day').valueOf(),
                },
                // { label: 'Custom' },
            ]
            const handleSelect = (sel, val) => {
                if (sel === selected.value) {
                    emit('update:value', undefined)
                    selected.value = undefined
                } else {
                    emit('update:value', val)
                    selected.value = sel
                }
            }
            return { selected, ranges, handleSelect }
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
            @apply text-primary;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
</style>
