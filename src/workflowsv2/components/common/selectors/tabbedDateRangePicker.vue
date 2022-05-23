<template>
    <div
        class="box-border flex items-stretch h-8 overflow-hidden border border-gray-300 divide-x divide-gray-300 rounded-lg"
    >
        <a-tooltip
            v-for="item in dateRanges"
            :key="item.label"
            placement="top"
            color="#2A2F45"
            :mouse-enter-delay="0.5"
            :mouse-leave-delay="0"
        >
            <template v-if="item.hint" #title>
                <p class="text-xs font-semibold">
                    {{ item.hint?.split('/')[0] }}
                </p>
                <p class="text-xs mt-0.5 font-semibold">
                    {{ item.hint?.split('/')[1] }}
                </p>
                <p v-if="selected === item.label" class="mt-1 text-xs">
                    Click to remove filter
                </p>
            </template>
            <button
                class="tabbed-btn"
                :class="{ selected: selected === item.label }"
                @click="handleSelect(item.label, item.value)"
            >
                {{ item.label }}
            </button>
        </a-tooltip>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import { defineComponent, ref } from 'vue'
    import { dateRanges } from '~/workflowsv2/constants/filters'

    export default defineComponent({
        name: 'TabbedDateRangePicker',
        components: {},
        props: {
            value: { type: Object, required: false, default: () => undefined },
        },
        emits: ['update:value'],
        setup(_, { emit }) {
            const selected = ref(undefined)

            const handleSelect = (sel, val) => {
                if (sel === selected.value) {
                    emit('update:value', undefined)
                    selected.value = undefined
                } else {
                    emit('update:value', val)
                    selected.value = sel
                }
            }

            // Select today by default
            handleSelect('Last 24H', {
                gt: dayjs().subtract(1, 'day').valueOf(),
            })

            return { selected, dateRanges, handleSelect }
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

        &:hover:not(:disabled):not(.selected) {
            background-color: #f8f8f8;
        }

        &:disabled {
            @apply bg-gray-100;
            @apply opacity-75;
            @apply cursor-not-allowed;
            box-shadow: none !important;
        }

        &.selected {
            @apply bg-new-blue-400;
            @apply text-white;
        }

        &:focus-visible {
            @apply ring-2 ring-primary-focus;
        }
        &:active {
            box-shadow: 0px 3px 4px 0px #00000033 inset;
        }
    }
</style>
