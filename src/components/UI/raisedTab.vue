<template>
    <div class="flex items-center gap-x-0.5 p-0.5 rounded bg-gray-100">
        <button
            @click="$emit('update:active', item.key)"
            class="tab-btn"
            v-for="item in data"
            :class="{ active: item.key === active }"
        >
            {{ item.label }}
        </button>
    </div>
</template>

<script lang="ts">
    interface TabConfig {
        key: string
        label: string
    }
    import { defineComponent, PropType } from 'vue'
    export default defineComponent({
        name: 'RaisedTab',
        emits: ['update:active'],
        props: {
            active: {
                type: String,
                required: true,
            },
            data: {
                type: Array as PropType<TabConfig[]>,
                required: true,
            },
        },
    })
</script>

<style lang="less" scoped>
    .tab-btn {
        @apply h-8 px-2;
        @apply rounded;
        @apply flex items-center justify-center flex-none;
        @apply outline-none;

        @apply bg-transparent;
        @apply text-gray-500 text-sm;

        &:hover {
            @apply opacity-90;
            @apply text-primary;
        }
        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }

        &:disabled {
            @apply opacity-70 text-opacity-70;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.active {
            @apply bg-white text-primary font-bold;
            @apply shadow;
        }
    }
</style>
