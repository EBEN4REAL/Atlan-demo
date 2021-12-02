<template>
    <button
        :class="[size, color, padding]"
        :disabled="disabled"
        :data-test-id="dataTestId"
        class="flex items-center justify-center flex-none gap-x-1 atlan-btn"
    >
        <slot name="prefix" />
        <slot v-if="$slots.label" name="label" />
        <span
            v-else-if="isLoading"
            class="text-sm"
            :class="{ 'font-bold': bold }"
        >
            <AtlanIcon
                icon="CircleLoader"
                class="inline mb-0.5 animate-spin"
            ></AtlanIcon></span
        ><slot />
        <slot name="suffix" />
    </button>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    export default defineComponent({
        name: 'AtlanButton',
        props: {
            size: {
                type: String as PropType<'lg' | 'sm'>,
                default: () => 'lg',
                required: false,
            },
            color: {
                type: String as PropType<
                    'primary' | 'secondary' | 'light' | 'minimal' | 'danger'
                >,
                default: () => 'primary',
                required: false,
            },
            padding: {
                type: String as PropType<'large' | 'compact'>,
                default: () => 'large',
                required: false,
            },
            bold: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            disabled: {
                type: Boolean,
                default: () => false,
                required: false,
            },
            dataTestId: {
                type: String,
                default: () => 'atlan-btn',
                required: false,
            },
            isLoading: {
                type: Boolean,
                default: () => false,
                required: false,
            },
        },
        setup(prop, { emit }) {},
    })
</script>

<style lang="less" scoped>
    .atlan-btn {
        @apply box-content;
        @apply rounded;
        @apply flex items-center justify-center flex-none;
        @apply outline-none;
        @apply border border-primary;

        &.lg {
            @apply h-9;
        }

        &.sm {
            height: 30px;
        }

        &.large {
            @apply px-8;
        }

        &.compact {
            @apply px-3;
        }

        &.primary {
            @apply bg-primary;
            @apply text-white;
            &:hover {
                @apply bg-opacity-90;
            }
            &:focus-visible {
                @apply ring-2 ring-primary-focus;
            }
            &:active {
                box-shadow: 0px 3px 4px 0px #00000033 inset;
            }
        }

        &.secondary {
            @apply bg-white;
            @apply text-gray;
            @apply border border-gray-300;

            &:hover {
                @apply opacity-90;
            }
            &:focus-visible {
                @apply ring-2 ring-primary-focus;
            }
            &:active {
                box-shadow: 0px 3px 4px 0px #00000033 inset;
            }
        }

        &.light {
            @apply bg-primary-light;
            @apply text-primary;
            @apply border border-primary-light;

            &:hover {
                @apply opacity-90;
            }
            &:focus-visible {
                @apply ring-2 ring-primary-focus;
            }
            &:active {
                box-shadow: 0px 3px 4px 0px #00000033 inset;
            }
        }

        &.minimal {
            @apply border-0;
            &:focus-visible {
                @apply ring-2 ring-primary-focus;
            }
            &:active {
                box-shadow: 0px 3px 4px 0px #00000033 inset;
            }
        }

        &.danger {
            @apply bg-red-500;
            @apply text-white font-bold;
            @apply border-0;
        }

        &:disabled {
            @apply opacity-70 text-opacity-70;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }
    }
</style>

<!-- ///// Usage ////
        <AtlanBtn color="light">Hello</AtlanBtn>
        <AtlanBtn color="light" bold>Hello Bold</AtlanBtn>
        <AtlanBtn color="light">
            <template #prefix>
                <AtlanIcon icon="AddUser"></AtlanIcon>
            </template>
            Hello
            <template #suffix>
                <AtlanIcon
                    icon="ChevronDown"
                    :class="'transform rotate-180'"
                ></AtlanIcon>
            </template>
        </AtlanBtn>
        <AtlanBtn color="light" size="sm">Hello Small </AtlanBtn>
        <AtlanBtn color="light" size="sm" bold>Hello Small Bold</AtlanBtn>
        <AtlanBtn color="light" size="sm">
            <template #prefix>
                <AtlanIcon icon="AddUser"></AtlanIcon>
            </template>
            Hello Small
            <template #suffix>
                <AtlanIcon
                    icon="ChevronDown"
                    :class="'transform rotate-180'"
                ></AtlanIcon>
            </template>
        </AtlanBtn>
   -->
