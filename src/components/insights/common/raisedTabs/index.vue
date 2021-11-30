<template>
    <div class="flex items-center justify-between px-3 rounded tab-button-box">
        <div
            v-for="item in data"
            :key="item.key"
            class="tab-btn"
            :class="{ active: item.key === active }"
            :disabled="disabled"
            @click="$emit('update:active', item.key)"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    interface TabConfig {
        key: string
        label: string
    }
    export default defineComponent({
        name: 'RaisedTab',
        props: {
            active: {
                type: String,
                required: true,
            },
            data: {
                type: Array as PropType<TabConfig[]>,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['update:active'],
    })
</script>

<style lang="less" scoped>
    .tab-button-box {
        width: 116px;
        height: 28px;

        background: #ffffff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }
    .tab-btn {
        @apply h-5;
        // @apply rounded;
        // @apply flex items-center justify-center flex-none;
        @apply outline-none;

        @apply bg-transparent;
        @apply text-gray-500 text-sm;

        &:hover {
            @apply opacity-90;
            @apply text-primary;
            cursor: pointer;
        }
        // &:focus-visible {
        //     @apply ring-2 ring-primary-focus;
        // }
        // &:active {
        //     box-shadow: 0px 3px 4px 0px #00000033 inset;
        // }

        &:disabled {
            @apply text-opacity-70;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.active {
            @apply bg-white text-primary font-bold;
            // @apply shadow;
        }
    }
</style>
