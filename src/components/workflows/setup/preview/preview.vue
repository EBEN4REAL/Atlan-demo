<template>
    <div>
        <div v-if="showCrossIcon">
            <a-button
                class="fixed z-10 px-0 border-r-0 rounded-none rounded-l  -left-5"
                @click="$emit('closeSidebar')"
            >
                <AtlanIcon
                    icon="ChevronDown"
                    class="h-4 ml-1 transition-transform transform -rotate-90"
                />
            </a-button>
        </div>
        <div class="px-5 py-3 border-b">
            <div class="flex items-center justify-between mb-0 text-sm">
                <div class="flex items-center flex-none">
                    <span class="text-sm tracking-wider text-gray-700 uppercase"
                        >WORKFLOW</span
                    >
                </div>
                <div class="flex space-x-2">
                    <a-button-group>
                        <a-button size="small"
                            ><AtlanIcon icon="Share"
                        /></a-button>
                        <a-button size="small">
                            <AtlanIcon icon="External" />
                        </a-button>
                        <a-button size="small">
                            <AtlanIcon icon="Bookmark" />
                        </a-button>
                    </a-button-group>
                </div>
            </div>
        </div>

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

                <div
                    class="flex flex-col"
                    :style="{ height: 'calc(100vh - 7.8rem)' }"
                >
                    <div
                        class="flex items-center justify-between px-4 pt-2 font-semibold text-gray-700  text-md"
                    >
                        {{ tab.tooltip }}
                    </div>

                    <component
                        :is="tab.component"
                        :selected-workflow="selectedWorkflow"
                        :is-loaded="isLoaded"
                        @change="handleChange"
                    ></component>
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
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import AtlanButton from '@/UI/button.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'

    export default defineComponent({
        name: 'SetupWorkflowPreview',
        components: {
            Tooltip,
            AssetLogo,
            StatusBadge,
            SidePanelTabHeaders,
            AtlanButton,
            info: defineAsyncComponent(() => import('./tabs/info/infoTab.vue')),
            runs: defineAsyncComponent(() => import('./tabs/runs/runsTab.vue')),
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
                    name: 'Runs',
                    component: 'runs',
                    icon: 'Activity',
                    tooltip: 'Runs',
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

            // watch(page, () => {
            //     if (activeKey.value > filteredTabs.length) activeKey.value = 0
            // })

            function init() {
                isLoaded.value = false
            }

            watch(selectedWorkflow, init, { deep: true })
            onMounted(init)

            return {
                tabHeights,
                isLoaded,
                activeKey,
                filteredTabs,
                handleChange,
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

        :global(.ant-tabs-bar) {
            margin-bottom: 0px !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
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
