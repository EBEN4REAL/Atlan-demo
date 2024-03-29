<template>
    <a-select
        class="w-52"
        allow-clear
        show-search
        :class="$style.baseSelector"
        :bordered="type !== 'minimal'"
        :value="value"
        :get-popup-container="(target) => target.parentNode"
        @update:value="$emit('update:value', $event)"
        dropdown-class-name="w-64"
    >
        <template #suffixIcon>
            <AtlanLoader v-if="loading" />
            <AtlanIcon v-else icon="CaretDown" />
        </template>
        <template v-for="item in list" :key="item.id">
            <a-select-option :value="item.id">
                <div class="flex items-center truncate gap-x-2">
                    <div
                        v-if="item.colorDot"
                        :style="`background-color: ${item.colorDot}`"
                        class="dot"
                    />
                    <img v-if="item.icon" :src="item.icon" class="w-4 h-auto" />
                    <span v-else-if="item.emoji" class="text-xs">{{
                        item.emoji
                    }}</span>
                    {{ item.label }}
                    <span v-if="item.count" class="text-gray-500"
                        >({{ item.count }})</span
                    >
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    interface selectorOptions {
        id: string
        label: string
        icon?: string
        colorDot?: string
        emoji?: string
        count?: number
    }

    export default defineComponent({
        name: 'BaseSelector',
        components: {},
        props: {
            value: { type: String, default: () => undefined },
            list: {
                type: Array as PropType<selectorOptions[]>,
                required: true,
                default: () => [],
            },
            loading: { type: Boolean, default: () => false },
            type: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
        },
        emits: ['update:value'],
    })
</script>

<style scoped>
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
    }
</style>

<style lang="less" module>
    .baseSelector {
        :global(.ant-select-selector) {
            @apply rounded-lg !important;
            box-shadow: 0px 1px 0px 0px hsla(0, 0%, 0%, 0.05);
        }
    }
</style>
