<template>
    <button
        :class="[color]"
        :disabled="disabled || loading"
        :data-test-id="dataTestId"
        class="atlan-btn"
    >
        <AtlanIcon v-if="prefixIcon" :icon="prefixIcon" />
        <!-- Main content: Use Label if present or use slot for custom stuff -->
        <span
            v-if="label"
            class="text-sm leading-none"
            :class="{ 'font-bold': bold }"
            >{{ label }}</span
        >

        <slot />

        <AtlanIcon v-if="suffixIcon" :icon="suffixIcon" />

        <!-- Loader -->
        <AtlanIcon
            v-if="loading"
            icon="CircleLoader"
            class="inline mb-0.5 animate-spin"
        ></AtlanIcon>
    </button>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import iconMap from '@/common/icon/iconMap'

    export default defineComponent({
        name: 'AtlanButtonNew',
        props: {
            color: {
                type: String as PropType<
                    'primary' | 'secondary' | 'light' | 'minimal' | 'danger'
                >,
                default: () => 'primary',
                required: false,
            },
            disabled: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            loading: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            prefixIcon: {
                type: String as PropType<keyof typeof iconMap>,
                required: false,
                default: () => '',
            },
            suffixIcon: {
                type: String as PropType<keyof typeof iconMap>,
                required: false,
                default: () => '',
            },
            label: { type: String, required: false, default: () => '' },
            bold: { type: Boolean, required: false, default: false },
            dataTestId: {
                type: String,
                default: () => 'atlan-btn',
                required: false,
            },
        },
    })
</script>

<style lang="less" scoped>
    .atlan-btn {
        @apply box-border;
        @apply rounded;
        @apply flex items-center justify-center flex-none gap-x-1;
        @apply transition-colors;
        @apply outline-none border;
        @apply px-4;
        @apply h-8;
        min-width: 32px;

        &.primary {
            @apply bg-primary border-primary;
            @apply text-white;

            &:hover:not(:disabled) {
                background-color: #3c64cd;
                border-color: #3c64cd;
            }
        }

        &.secondary {
            @apply bg-white border-gray-300;
            @apply text-gray;

            &:hover:not(:disabled) {
                background-color: #f8f8f8;
            }

            &:disabled {
                @apply opacity-60;
                @apply bg-gray-100;
            }
        }

        &.link {
            @apply bg-white border-none;
            @apply text-primary;

            &:hover:not(:disabled) {
                color: #3c64cd;
            }
        }

        &:disabled {
            @apply opacity-75;
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
