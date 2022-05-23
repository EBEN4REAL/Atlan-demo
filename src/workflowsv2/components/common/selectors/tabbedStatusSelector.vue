<template>
    <div
        class="box-border flex items-stretch h-8 overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded-lg"
    >
        <a-tooltip
            v-for="item in runStatuses"
            :key="item.label"
            placement="top"
            color="#2A2F45"
            :mouse-enter-delay="0.5"
            :mouse-leave-delay="0"
        >
            <template v-if="selected === item.label" #title>
                <p class="text-xs">Click to remove filter</p>
            </template>

            <button
                class="tabbed-btn"
                :class="{ selected: selected === item.label }"
                :style="
                    selected === item.label
                        ? `background-color:${item.colorDot}`
                        : ''
                "
                @click="handleSelect(item.label, item.value)"
            >
                <div
                    v-if="item.colorDot"
                    :style="`background-color: ${
                        selected === item.label ? '#fff' : item.colorDot
                    }`"
                    class="dot"
                />
                {{ item.label }}
            </button>
        </a-tooltip>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { runStatuses } from '~/workflowsv2/constants/filters'

    export default defineComponent({
        name: 'TabbedStatusSelector',
        components: {},
        props: {
            value: { type: String, required: false, default: () => undefined },
        },
        emits: ['update:value'],
        setup(_, { emit }) {
            const selected = ref<string | undefined>(undefined)

            const handleSelect = (sel, val) => {
                if (sel === selected.value) {
                    emit('update:value', undefined)
                    selected.value = undefined
                } else {
                    emit('update:value', val)
                    selected.value = sel
                }
            }

            return { selected, runStatuses, handleSelect }
        },
    })
</script>

<style lang="less" scoped>
    .tabbed-btn {
        @apply flex items-center;
        @apply box-border;
        @apply transition-colors;
        @apply outline-none;
        @apply px-3;
        @apply bg-white text-gray;

        &:hover:not(:disabled):not(.selected) {
            background-color: #f8f8f8;
        }

        &:hover.selected {
            @apply bg-opacity-70;
        }

        &:disabled {
            @apply bg-gray-100;
            @apply opacity-75;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.selected {
            @apply text-white;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
    .dot {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-bottom: 2px;
        margin-right: 6px;
    }
</style>
