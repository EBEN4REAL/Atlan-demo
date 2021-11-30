<template>
    <a-tabs
        v-model:activeKey="activeTab"
        class="w-full"
        :class="$style.assetbar"
        :tabBarGutter="2"
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
        .chip {
        }

        .active {
            .chip {
                @apply text-primary;
            }
        }
        :global(.ant-tabs-tab) {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;

            &:hover {
                @apply bg-primary-light !important;
                @apply text-primary !important;
                @apply border-primary-light !important;
                .chip {
                    @apply text-primary !important;
                }
            }
        }
        :global(.ant-tabs-nav) {
            @apply mb-0;
        }

        :global(.ant-tabs-tab:first-child) {
        }

        :global(.ant-tabs-nav-container-scrolling) {
            padding-left: 24px;
            padding-right: 24px;
        }

        :global(.ant-tabs-tab-active) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;

            .chip {
                @apply text-primary !important;
            }
        }

        :global(.ant-tabs-ink-bar) {
            @apply hidden !important;
        }

        :global(.ant-tabs-nav-wrap) {
            @apply pb-1;
        }

        :global(.ant-tabs-extra-content) {
            @apply pb-1 pr-2   !important;
        }

        :global(.ant-tabs-tab-arrow-show) {
            margin-top: -3px;
            width: 24px !important;
        }

        :global(.ant-tabs-nav-more) {
            @apply px-2 py-1 !important;
        }

        :global(.ant-tabs-nav::before) {
            @apply border-0 !important;
        }

        :global(.ant-tabs-tab-btn:focus) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;
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
