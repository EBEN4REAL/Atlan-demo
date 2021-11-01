<template>
    <div class="w-full">
        <a-tabs
            v-model:activeKey="localValue"
            class="w-full"
            :class="$style.assetbar"
            :tabBarGutter="2"
            @change="handleChange"
        >
            <a-tab-pane v-for="item in list" :key="item.id">
                <template #tab>
                    <div :class="{ active: item.id === localValue }">
                        <span>{{ item.label }}</span>
                        <span :class="$style.chip">{{
                            getCountString(item.count)
                        }}</span>
                    </div>
                </template>
            </a-tab-pane>
            <template #leftExtra>
                <slot></slot>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { getCountString } from '~/utils/number'

    export default defineComponent({
        name: 'AssetTypeTabs',
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { list } = toRefs(props)
            const { modelValue: localValue } = useVModels(props, emit)
            const handleChange = () => {
                emit('change')
            }
            return {
                list,
                localValue,
                getCountString,
                handleChange,
            }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        .chip {
            @apply ml-1;
            @apply tracking-wide;
            @apply text-xs;
            @apply font-bold;
            @apply text-gray-400;
        }

        .active {
            .chip {
                @apply text-primary;
            }
        }

        :global(.ant-tabs-bar) {
            @apply mb-0 border-0 !important;
        }
        :global(.ant-tabs-tab) {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;
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
    }
</style>
