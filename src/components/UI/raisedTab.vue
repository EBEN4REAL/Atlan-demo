<template>
    <div class="flex items-center gap-x-0.5 p-0.5 rounded bg-gray-100">
        <button
            v-for="item in data"
            :key="item.key"
            class="tab-btn"
            :class="{
                active: item.key === active,
                'fake-bold': item.key === active,
            }"
            :disabled="disabled"
            :data-test-id="item?.key ?? 'atlan-btn'"
            @click="$emit('update:active', item.key)"
        >
            {{ item.label }}
            <span v-if="item.count" class="chip">{{ item.count }}</span>
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    interface TabConfig {
        key: string
        label: string
        count?: number
    }

    /**
     *  By default the Raised Tab will take up the entire width available,
     * If you want to use a compact version that only takes up the space
     * it needs, just add the `mr-auto` or `ml-auto` class.
     */
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
    .tab-btn {
        @apply h-8 px-2;
        @apply rounded;
        @apply flex items-center justify-center flex-shrink-0 flex-grow;
        @apply outline-none;
        @apply transition duration-300;
        @apply bg-transparent;
        @apply text-gray-500 text-sm;

        & .chip {
            padding: 3px 2px 1px;
            margin-left: 2px;
            @apply font-bold text-xs rounded bg-gray-200 text-gray-500;
            @apply transition duration-300;
        }

        &:hover {
            @apply opacity-90;
            @apply text-primary;
            & .chip {
                @apply bg-primary-menu text-primary;
            }
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }

        &:disabled {
            @apply text-opacity-70;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.active {
            @apply bg-white text-primary;
            @apply shadow;

            & .chip {
                @apply bg-primary-light text-primary;
            }
        }
    }
</style>
