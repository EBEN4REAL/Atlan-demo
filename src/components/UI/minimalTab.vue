<template>
    <a-tabs
        :activeKey="active"
        @update:activeKey="$emit('update:active', $event)"
        class="flex-none w-full mt-2 minimal-tab-bar"
    >
        <a-tab-pane v-for="item in data" :key="item.key" :tab="item.label">
            <!-- TODO: Fix the slot if it aint't working -->
            <template v-if="$slots.label" #tab>
                <slot name="label" :data="data" />
            </template>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    interface TabConfig {
        key: string
        label: string
    }
    import { defineComponent, PropType } from 'vue'
    export default defineComponent({
        name: 'MinimalTab',
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

<style lang="less">
    .minimal-tab-bar {
        .ant-tabs-tab {
            padding-left: 2px !important;
            padding-right: 2px !important;
            padding-top: 8px !important;
            padding-bottom: 16px !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        .ant-tabs-tab:first-child {
            margin-left: 18px !important;
        }
        .ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child {
            @apply ml-0;
        }
        .ant-tabs-tab-active {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        .ant-tabs-bar {
            margin-bottom: 0px;
            @apply border-gray-300 !important;
        }
        .ant-tabs-content {
            padding-right: 0px;
        }
        .ant-tabs-ink-bar {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>
