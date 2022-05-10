<template>
    <button :disabled="disabled" class="atlan-icon-btn">
        <AtlanIcon :icon="icon" />
    </button>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import iconMap from '@/common/icon/iconMap'

    export default defineComponent({
        name: 'IconButton',
        props: {
            icon: {
                type: String as PropType<keyof typeof iconMap>,
                required: true,
            },

            disabled: {
                type: Boolean,
                default: () => false,
                required: false,
            },
        },
    })
</script>

<style lang="less" scoped>
    .atlan-icon-btn {
        @apply box-border;
        @apply rounded;
        @apply flex items-center justify-center flex-none gap-x-1;
        @apply transition;
        @apply outline-none border border-gray-300;
        @apply bg-white text-gray;
        @apply h-8 w-8;

        &:hover:not(:disabled) {
            box-shadow: 0px 1px 3px 0px #00000029;
        }

        &:disabled {
            @apply opacity-60;
            @apply bg-gray-100;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
</style>
