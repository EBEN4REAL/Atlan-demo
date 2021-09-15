<template>
    <a-tabs
        v-model:activeKey="activeTab"
        class="w-full"
        :class="$style.assetbar"
        @change="handleChange"
    >
        <a-tab-pane v-for="item in requestTypeTabList" :key="item.id">
            <template #tab>
                <div :class="{ active: item.id === activeTab }">
                    <span>{{ item.id }}</span>
                    <!-- <span class="chip">{{ 123 }}</span> -->
                </div>
            </template>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import { requestTypeTabList } from './requestType'
    export default defineComponent({
        name: 'requestTypeTabs',
        props: {
            tab: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:tab'],
        setup(props, { emit }) {
            function handleChange(reqType: string) {
                const found = requestTypeTabList.find((ty) => ty.id === reqType)
                emit('update:tab', found?.value)
            }

            const activeTab = ref('All')
            return { requestTypeTabList, activeTab, handleChange }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        :global(.ant-tabs-tab) {
            padding-left: 2px !important;
            padding-right: 2px !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5 !important;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
        }
        :global(.ant-tabs-content) {
            padding-right: 0px;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>

<style scoped>
    .chip {
        @apply px-1 pt-0.5 pb-0.5 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-gray-500;
        @apply bg-gray-100;
    }
    .active .chip {
        @apply text-primary;
        @apply bg-primary-light;
    }
</style>
