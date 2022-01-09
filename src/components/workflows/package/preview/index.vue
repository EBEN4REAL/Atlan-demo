<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-col px-4 py-4 border-b border-gray-200">
            <div
                class="flex items-center mb-1"
                style="padding-bottom: 1px"
            ></div>
        </div>

        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            tab-position="left"
            :destroy-inactive-tab-pane="true"
        >
            <a-tab-pane
                v-for="(tab, index) in filteredTabs"
                :key="index"
                :destroy-inactive-tab-pane="true"
            >
                <template #tab>
                    <!-- <PreviewTabsIcon
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :image="tab.image"
                        :emoji="tab.emoji"
                        :active-icon="tab.activeIcon"
                        :is-active="activeKey === index"
                        :is-scrubbed="isScrubbed(selectedAsset) && tab.scrubbed"
                        @click="onClickTabIcon(tab)"
                    /> -->
                </template>

                <!-- <component
                    :is="tab.component"
                    v-else-if="tab.component"
                    :key="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :is-drawer="isDrawer"
                    :read-permission="isScrubbed(selectedAsset)"
                    :edit-permission="
                        selectedAssetUpdatePermission(selectedAsset)
                    "
                    :data="tab.data"
                    :ref="
                        (el) => {
                            if (el) tabChildRef[index] = el
                        }
                    "
                ></component> -->
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
    } from 'vue'

    export default defineComponent({
        name: 'AssetPreview',
        components: {},

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            tab: {
                type: String,
                required: false,
                default: '',
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const activeKey = ref(0)
            const filteredTabs = [
                {
                    name: 'Overview',
                    component: 'info',
                    icon: 'Overview',
                    tooltip: 'Overview',
                },
                {
                    name: 'Run History',
                    component: 'runs',
                    icon: 'ActivityLogs',
                    tooltip: 'Runs History',
                },
            ]

            return { filteredTabs, activeKey }
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
