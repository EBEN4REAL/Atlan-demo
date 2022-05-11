<template>
    <a-drawer :visible="visible" :closable="false" :width="450">
        <div
            v-if="visible"
            class="left-auto bg-white close-btn-sidebar close-btn-drawer"
        >
            <AtlanIcon icon="Add" class="text-gray-700" />
        </div>
        <div class="px-4 py-5 border-b border-gray-200">
            <div class="text-lg font-bold">Data Analyst</div>
            <div class="text-gray-700 mt-3.5 flex items-center">
                <AtlanIcon icon="Term" class="mb-1 mr-1" />PERSONA
            </div>
        </div>
        <div class="content">
            <a-tabs
                v-model:activeKey="activeKey"
                :class="$style.widgetPreviewTabs"
                style="height: calc(100% - 84px)"
                tab-position="right"
                :destroy-inactive-tab-pane="true"
                class="w-full"
            >
                <a-tab-pane
                    v-for="(tab, index) in tabList"
                    :key="index"
                    :destroy-inactive-tab-pane="true"
                    :class="index === activeKey ? 'flex flex-col' : ''"
                >
                    <template #tab>
                        <PreviewTabsIcon
                            :title="tab.tooltip"
                            :icon="tab.icon"
                            :active-icon="tab.activeIcon"
                            :is-active="activeKey === index"
                        />
                    </template>

                    <component :is="tab.component" :tab="tab" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'DrawerWidgetPersonaPurpose',
        components: { PreviewTabsIcon },
        props: {
            visible: {
                type: Boolean,
                required: true,
            },
        },
        setup() {
            const tabList = ref([
                {
                    tooltip: 'assets',
                    icon: 'AssetsInactiveLight',
                    activeIcon: 'AssetsActiveLight',
                },
            ])
            const activeKey = ref(0)
            return { tabList, activeKey }
        },
    })
</script>

<style lang="less" scoped>
    .content {
        height: 100vh;
    }
    .close-btn-drawer {
        right: 466px;
    }
</style>

<style lang="less" module>
    .widgetPreviewTabs {
        &:global(.ant-tabs-right) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                margin: 16px 0px 0px !important;
                @apply justify-center;
            }

            :global(.ant-tabs-tab:first-child) {
                padding: 3px 8px !important;
                @apply mt-3 !important;

                @apply justify-center;
            }

            :global(.ant-tabs-content) {
                @apply px-0 h-full !important;

                :global(.ant-tabs-tab:first-child) {
                    @apply mt-0 !important;
                }
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
                @apply bg-white;
            }
        }
    }
</style>
