<template>
    <a-drawer
        :destroy-on-close="true"
        :visible="visible"
        :closable="false"
        :width="450"
    >
        <div
            v-if="visible"
            class="left-auto bg-white close-btn-sidebar close-btn-drawer"
            @click="$emit('close')"
        >
            <AtlanIcon icon="Add" class="text-gray-700" />
        </div>
        <div class="px-4 py-5 border-b border-gray-200">
            <div class="text-lg font-bold">{{ item.name }}</div>
            <div class="flex items-center">
                <div class="text-gray-700 mt-3.5 flex items-center uppercase">
                    {{ activeTab }}
                </div>
                <div
                    class="flex items-center ml-auto text-base text-gray-700 border border-gray-300 rounded cursor-pointer"
                >
                    <div
                        class="flex items-center py-1.5 px-2.5"
                        @click="handleViewAssets"
                    >
                        <AtlanIcon icon="AssetsInactiveLight" class="mr-1" />
                        View assets
                    </div>
                    <a
                        v-if="item.attributes?.channelLink"
                        :href="item.attributes?.channelLink"
                        target="_blank"
                    >
                        <div class="py-1.5 px-2.5 border-l border-gray-300">
                            <AtlanIcon icon="Slack" class="" />
                        </div>
                    </a>
                </div>
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
                        >
                            <template #label
                                ><div class="label-drawer-persona-purpose">
                                    {{ tab.tooltip }}
                                </div></template
                            >
                        </PreviewTabsIcon>
                    </template>
                    <component
                        :is="tab.component"
                        :filters="filterConfig"
                        :tab="tab"
                        aggregation-tab-class="px-5 my-1"
                        search-bar-class="px-5 my-1"
                        asset-item-class="px-2"
                        :item="item"
                        :persona="item"
                        :global-state="globalState"
                        :active-tab="activeTab"
                        @handleChangeTab="handleChangeTab"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import useAssetStore from '~/store/asset'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import AssetList from '@/common/assetList/assetList.vue'
    import Overview from '@/common/widgets/personaPurpose/preview/overview.vue'
    import UsersGroups from '@/common/widgets/personaPurpose/preview/usersGroups.vue'
    import Resources from '@/common/widgets/personaPurpose/preview/resources.vue'
    import Properties from '@/common/widgets/personaPurpose/preview/properties.vue'

    export default defineComponent({
        name: 'DrawerWidgetPersonaPurpose',
        components: {
            PreviewTabsIcon,
            AssetList,
            Overview,
            UsersGroups,
            Resources,
            Properties,
        },
        props: {
            visible: {
                type: Boolean,
                required: true,
            },
            item: {
                type: Boolean,
                required: true,
            },
            activeTab: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const router = useRouter()
            const { item, activeTab, visible }: { item: any } = toRefs(props)
            const globalState = ref([])
            const tabList = ref([
                {
                    tooltip: 'assets',
                    icon: 'AssetsInactiveLight',
                    activeIcon: 'AssetsActiveLight',
                    component: 'AssetList',
                },
            ])
            const activeKey = ref(0)
            const handleChangeTab = (section) => {
                const index = tabList.value.findIndex(
                    (el) => el.component === section
                )
                if (index !== -1) {
                    activeKey.value = index
                }
            }
            watch(visible, () => {
                if (visible) {
                    activeKey.value = 0
                    if (activeTab.value === 'persona') {
                        globalState.value = ['persona', item.value.id]
                        tabList.value = [
                            {
                                tooltip: 'Overview',
                                icon: 'Overview',
                                activeIcon: 'Overview',
                                component: 'Overview',
                            },
                            {
                                tooltip: 'Users',
                                icon: 'GroupLight',
                                activeIcon: 'GroupActive',
                                component: 'UsersGroups',
                            },
                            {
                                tooltip: 'Assets',
                                icon: 'AssetsInactiveLight',
                                activeIcon: 'AssetsActiveLight',
                                component: 'AssetList',
                            },
                            {
                                tooltip: 'Resources',
                                icon: 'Link',
                                activeIcon: 'Link',
                                component: 'Resources',
                            },
                            {
                                tooltip: 'Property',
                                icon: 'Property',
                                activeIcon: 'Property',
                                component: 'Properties',
                            },
                        ]
                    } else {
                        globalState.value = []
                        tabList.value = [
                            {
                                tooltip: 'Overview',
                                icon: 'Overview',
                                activeIcon: 'Overview',
                                component: 'Overview',
                            },
                            // {
                            //     tooltip: 'Users and groups',
                            //     icon: 'GroupLight',
                            //     activeIcon: 'GroupActive',
                            //     component: 'UsersGroups',
                            // },
                            {
                                tooltip: 'Assets',
                                icon: 'AssetsInactiveLight',
                                activeIcon: 'AssetsActiveLight',
                                component: 'AssetList',
                            },
                            {
                                tooltip: 'Resources',
                                icon: 'Link',
                                activeIcon: 'Link',
                                component: 'Resources',
                            },
                            {
                                tooltip: 'Property',
                                icon: 'Property',
                                activeIcon: 'Property',
                                component: 'Properties',
                            },
                        ]
                    }
                }
            })

            const filterConfig = computed(() => {
                if (activeTab.value === 'persona') {
                    return {
                        hierarchy: {
                            // connectorName: getConnectorName(connectionQfName.value),
                            // connectionQualifiedName: connectionQfName.value,
                        },
                    }
                }
                return {
                    __traitNames: {
                        classifications: item.value.tags,
                    },
                }
            })
            const assetStore = useAssetStore()
            const handleViewAssets = () => {
                assetStore.setGlobalState([activeTab.value, item.value.id])
                router.push('/assets')
            }
            return {
                tabList,
                activeKey,
                filterConfig,
                globalState,
                handleViewAssets,
                handleChangeTab,
            }
        },
    })
</script>

<style lang="less" scoped>
    .label-drawer-persona-purpose {
        font-size: 11px;
    }
    .content {
        height: calc(100vh - 30px);
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

                @apply justify-center;
            }
            :global(.ant-tabs-tab-active) {
                @apply bg-primary-light;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                @apply justify-center;
                @apply py-3 !important;
                @apply mt-0 !important;
            }
            :global(.ant-tabs-tab:first-child) {
                padding: 3px 8px !important;
                @apply justify-center;
                @apply py-3 !important;
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
