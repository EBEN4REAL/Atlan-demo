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
            <div class="flex items-center mt-1">
                <div class="flex items-center text-gray-700 uppercase">
                    {{ activeTab }}
                </div>
                <a-button-group class="ml-auto">
                    <a-button
                        class="flex items-center p-2"
                        @mouseover="isHover = true"
                        @mouseleave="isHover = false"
                    >
                        <AtlanIcon
                            :icon="
                                isHover
                                    ? 'AssetsActiveLight'
                                    : 'AssetsInactiveLight'
                            "
                            class="mr-1"
                        />
                        View assets
                    </a-button>
                    <a-button
                        v-if="item.attributes?.channelLink"
                        class="flex items-center p-2"
                    >
                        <a :href="item.attributes?.channelLink" target="_blank">
                            <AtlanIcon icon="Slack" />
                        </a>
                    </a-button>
                    <a-button
                        v-auth="[map.LIST_PERSONA, map.LIST_PURPOSE]"
                        class="flex items-center p-2"
                    >
                        <router-link
                            :to="`/governance/${activeTab}s/${item.id}`"
                        >
                            <AtlanIcon icon="Edit" />
                        </router-link>
                    </a-button>
                </a-button-group>
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
                            height="h-5"
                        >
                            <template #label
                                ><div
                                    class="label-drawer-persona-purpose text-gray-500 leading-none mt-0.5"
                                >
                                    {{ tab.tooltip }}
                                </div></template
                            >
                        </PreviewTabsIcon>
                    </template>
                    <component
                        :is="tab.component"
                        :persona="item"
                        :tab="tab"
                        :item="item"
                        :active-tab="activeTab"
                        @handleChangeTab="handleChangeTab"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import map from '~/constant/accessControl/map'
    import useAssetStore from '~/store/asset'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import Overview from '@/common/widgets/personaPurpose/preview/overview.vue'
    import UsersGroups from '@/common/widgets/personaPurpose/preview/usersGroups.vue'
    import Resources from '@/common/widgets/personaPurpose/preview/resources.vue'
    import Properties from '@/common/widgets/personaPurpose/preview/properties.vue'
    import AssetsView from './preview/assetsView.vue'

    export default defineComponent({
        name: 'DrawerWidgetPersonaPurpose',
        components: {
            PreviewTabsIcon,
            AssetsView,
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
                type: Object,
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
            const tabList = ref([
                {
                    tooltip: 'assets',
                    icon: 'AssetsInactiveLight',
                    activeIcon: 'AssetsActiveLight',
                    component: 'AssetsView',
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
                                component: 'AssetsView',
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
                                component: 'AssetsView',
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

            const assetStore = useAssetStore()
            const handleViewAssets = () => {
                assetStore.setGlobalState([activeTab.value, item.value.id])
                router.push('/assets')
            }
            const isHover = ref(false)

            return {
                tabList,
                activeKey,
                handleViewAssets,
                handleChangeTab,
                map,
                isHover,
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
                padding: 6px 8px !important;
                @apply justify-center;
                @apply mt-2 !important;
            }
            :global(.ant-tabs-tab:first-child) {
                padding: 6px 8px !important;
                @apply justify-center;
                @apply mt-0 !important;
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
