<template>
    <a-tabs
        :activeKey="active"
        @update:activeKey="$emit('update:active', $event)"
        class="flex-none w-full mt-2 minimal-tab-bar"
    >
        <a-tab-pane v-for="item in data" :key="item.key">
            <template #tab v-if="hasLabel">
                <slot name="label" :data="item" />
            </template>
            <!-- If no slot passed -->
            <template #tab v-else>
                <div v-if="!hasLabel">
                    {{ item.label }}
                </div>
            </template>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    interface TabConfig {
        key: string
        label: string
    }
    import { defineComponent, PropType, ref } from 'vue'
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
        setup(props, { slots }) {
            const hasLabel = ref(false)

            // Check if the slot exists by name and has content.
            // It returns an empty array if it's empty.
            if (slots.label && slots.label().length) {
                hasLabel.value = true
            }
            return {
                hasLabel,
            }
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
            @apply mr-6 ml-0 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
            transition: text-shadow 1s;
        }
        .ant-tabs-tab:first-child {
            margin-left: 18px !important;
        }
        .ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child {
            @apply ml-0;
        }
        .ant-tabs-tab-active {
            @apply text-gray !important;

            text-shadow: 0 0 0.01px;
        }
        .ant-tabs-content {
            padding-right: 0px;
        }
        .ant-tabs-nav {
            margin-bottom: 0 !important;
        }
        .ant-tabs-ink-bar {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>
<style lang="less" module></style>
