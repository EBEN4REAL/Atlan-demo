<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-col px-4 py-4 border-b border-gray-200">
            <div class="flex flex-col">
                <span class="text-base font-semibold">
                    <Ellipsis
                        :tooltip-text="item.metadata.name"
                        :rows="1"
                        classes="text-primary cursor-pointer" />{{
                }}</span>
                <div class="flex items-center gap-x-2">
                    <span class="text-sm text-gray-500"
                        >created {{ creationTimestamp(item, true) }} ago</span
                    >
                </div>
            </div>
        </div>

        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            tab-position="left"
            :destroy-inactive-tab-pane="true"
            style="height: calc(100% - 74px)"
        >
            <a-tab-pane
                v-for="(tab, index) in filteredTabs"
                :key="index"
                :destroy-inactive-tab-pane="true"
            >
                <template #tab>
                    <PreviewTabsIcon
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :image="tab.image"
                        :emoji="tab.emoji"
                        :active-icon="tab.activeIcon"
                        :is-active="activeKey === index"
                    />
                </template>

                <component
                    :is="tab.component"
                    :item="item"
                    :key="item?.metadata.name"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        toRefs,
        computed,
        provide,
        defineAsyncComponent,
    } from 'vue'
    import Ellipsis from '@/common/ellipsis/index.vue'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            Ellipsis,
            PreviewTabsIcon,
            property: defineAsyncComponent(
                () => import('./property/index.vue')
            ),
            runs: defineAsyncComponent(() => import('./runs/index.vue')),
        },

        props: {
            item: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const activeKey = ref(1)
            const filteredTabs = [
                {
                    name: 'Property',
                    component: 'property',
                    icon: 'Property',
                    activeIcon: 'PropertyActive',
                    tooltip: 'Property',
                    scrubbed: false,
                    requiredInProfile: true,
                    analyticsKey: 'property',
                },
                {
                    name: 'Runs',
                    component: 'runs',
                    icon: 'Property',
                    activeIcon: 'PropertyActive',
                    tooltip: 'Runs',
                    scrubbed: false,
                    requiredInProfile: true,
                    analyticsKey: 'property',
                },
            ]

            const { item } = toRefs(props)
            const { creationTimestamp } = useWorkflowInfo()

            return { filteredTabs, activeKey, item, creationTimestamp }
        },
    })
</script>

<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-left) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                @apply justify-center;
            }

            :global(.ant-tabs-nav-wrap) {
                @apply pt-3;
            }

            :global(.ant-tabs-content) {
                @apply px-0 h-full !important;
            }
            :global(.ant-tabs-ink-bar) {
                @apply rounded-t-sm;
                margin-bottom: 1px;
            }
            :global(.ant-tabs-tabpane) {
                @apply px-0 !important;
                @apply pb-0 !important;
                @apply h-full !important;
            }

            :global(.ant-tabs-content-holder) {
                @apply h-full !important;
            }
        }
    }
</style>
