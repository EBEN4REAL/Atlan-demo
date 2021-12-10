<template>
    <div>
        <PreviewHeader :name="selectedWorkflow.metadata.name" type="workflow" />
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            tab-position="left"
        >
            <a-tab-pane
                v-for="(tab, index) in filteredTabs"
                :key="index"
                class="overflow-y-auto"
            >
                <template #tab>
                    <SidePanelTabHeaders
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :is-active="activeKey === index"
                    />
                </template>

                <div class="flex flex-col">
                    <div
                        class="flex items-center justify-between px-4 pt-2 pb-2 mt-2 text-lg font-semibold text-gray-700"
                    >
                        {{ tab.name }}
                    </div>

                    <component
                        :is="tab.component"
                        :selected-workflow="selectedWorkflow"
                        :is-loaded="isLoaded"
                        class="overflow-auto"
                        :style="{ height: 'calc(100vh - 11rem)' }"
                        @change="handleChange"
                    />
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
        inject,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import AtlanButton from '@/UI/button.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import PreviewHeader from '@/workflows/shared/previewHeader.vue'
    import access from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'DiscoverWorkflowPreview',
        components: {
            Tooltip,
            AssetLogo,
            StatusBadge,
            SidePanelTabHeaders,
            AtlanButton,
            info: defineAsyncComponent(
                () => import('@/workflows/shared/infoTab.vue')
            ),
            runs: defineAsyncComponent(() => import('./tabs/runs/runsTab.vue')),
            PreviewHeader,
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },
            showCrossIcon: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)
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

            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            const handleChange = () => {}
            const tabHeights = {
                discovery: 'calc(100vh - 7.8rem)',
                profile: 'calc(100vh - 3rem)',
            }

            provide('mutateSelectedAsset', (updatedAsset: assetInterface) => {
                emit('assetMutation', updatedAsset)
            })

            provide('switchTab', (tabName: string) => {
                const idx = filteredTabs.findIndex((tl) => tl.name === tabName)
                if (idx > -1) activeKey.value = idx
            })

            function init() {
                isLoaded.value = false
            }

            watch(selectedWorkflow, init, { deep: true })
            onMounted(init)

            return {
                access,
                tabHeights,
                isLoaded,
                activeKey,
                filteredTabs,
                handleChange,
                emit,
            }
        },
    })
</script>
<style lang="less" scoped>
    .icon-btn {
        @apply flex;
        @apply py-2 ml-2 px-3;
        @apply rounded;
        @apply text-gray;
        @apply border border-gray-300;
        @apply cursor-pointer;
        @apply hover:bg-gray-100;
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
            display: flex;
            justify-content: center;
            @apply p-0 !important;
        }

        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }
</style>
