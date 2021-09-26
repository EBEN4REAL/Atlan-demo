<template>
    <div>
        <div v-if="showCrossIcon" class="flex items-center ml-2 bg-white">
            <a-button
                class="px-1 border-0 outline-none"
                @click="$emit('closeSidebar')"
            >
                <AtlanIcon icon="Cancel" />
            </a-button>
        </div>
        <div v-if="page !== 'profile'" class="px-5 py-3 border-b">
            <div class="flex items-center justify-between mb-0 text-sm">
                <div
                    v-if="page === 'nonBiOverview'"
                    class="text-gray-500 uppercase"
                >
                    {{ getDataType(selectedAsset?.attributes?.dataType) }}
                </div>
                <AssetLogo
                    v-if="page === 'discovery' || page === 'biOverview'"
                    :asset="selectedAsset"
                    variant="md"
                />

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

                    <!-- <AtlanButton color="secondary" size="sm" class="px-2">
                        <template #label>
                            <AtlanIcon icon="Share" />
                        </template>
                    </AtlanButton>
                    <AtlanButton color="secondary" size="sm" class="px-2">
                        <template #label>
                            <AtlanIcon icon="External" />
                        </template>
                    </AtlanButton>
                    <AtlanButton color="secondary" size="sm" class="px-2">
                        <template #label>
                            <AtlanIcon icon="Bookmark" />
                        </template>
                    </AtlanButton> -->
                </div>
            </div>

            <div class="flex items-center w-full">
                <component
                    v-if="page === 'nonBiOverview'"
                    :is="
                        images[getDataType(selectedAsset?.attributes?.dataType)]
                    "
                    class="w-4 h-4 mr-1.5"
                ></component>

                <Tooltip
                    v-if="page === 'discovery'"
                    :tooltip-text="selectedAsset?.attributes?.name"
                    classes="font-bold text-lg cursor-pointer text-primary hover:underline"
                    placement="left"
                    :route-to="
                        isColumnAsset(selectedAsset)
                            ? getColumnUrl(selectedAsset)
                            : `/assets/${selectedAsset.guid}/overview`
                    "
                />
                <Tooltip
                    v-else
                    :tooltip-text="selectedAsset?.attributes?.name"
                    classes="text-gray-700 font-semibold text-md leading-1"
                    placement="left"
                />

                <StatusBadge
                    :key="selectedAsset.guid"
                    :show-no-status="false"
                    :status-id="selectedAsset?.attributes?.assetStatus"
                    class="ml-1.5"
                ></StatusBadge>
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
                    <!-- <a-tooltip
                        placement="left"
                        :mouse-enter-delay="0.5"
                        color="white"
                    >
                        <template #title>
                            <span class="text-gray-500">
                                {{ tab.tooltip }}
                            </span>
                        </template>
                        <div
                            class="flex items-center justify-center w-full h-full "
                        >
                            <AtlanIcon
                                :icon="tab.icon"
                                :class="
                                    activeKey === index ? 'text-primary' : ''
                                "
                                class="h-5"
                            />
                        </div>
                    </a-tooltip> -->
                    <SidePanelTabHeaders
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :isAtive="activeKey === index"
                    />
                </template>

                <div
                    class="flex flex-col"
                    :style="{ height: tabHeights[page] }"
                >
                    <div
                        class="flex items-center justify-between px-4 pt-2 font-semibold text-gray-700  text-md"
                    >
                        {{ tab.tooltip }}
                    </div>

                    <component
                        :is="tab.component"
                        :component-data="dataMap[tab.id]"
                        :info-tab-data="selectedAsset"
                        :page="page"
                        :selected-asset="selectedAsset"
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
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetDetailsTabList from '../../discovery/preview/tabs/useTabList'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import { images, dataTypeList } from '~/constant/datatype'
    import { useMagicKeys } from '@vueuse/core'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            Tooltip,
            AssetLogo,
            StatusBadge,
            SidePanelTabHeaders,
            AtlanButton,
            info: defineAsyncComponent(() => import('./tabs/info/infoTab.vue')),
            columns: defineAsyncComponent(
                () => import('./tabs/columns/columnTab.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./tabs/activity/activityTab.vue')
            ),
            chat: defineAsyncComponent(
                () => import('./tabs/chat/assetChat.vue')
            ),
            relations: defineAsyncComponent(
                () => import('./tabs/relations/relationTab.vue')
            ),
            actions: defineAsyncComponent(
                () => import('./tabs/actions/actions.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('./tabs/lineage/lineageTab.vue')
            ),
            businessMetadataTab: defineAsyncComponent(
                () => import('./tabs/businessMetadata/businessMetadataTab.vue')
            ),
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
            showCrossIcon: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedAsset, page } = toRefs(props)
            const { filteredTabs } = useAssetDetailsTabList(page, selectedAsset)
            const { assetTypeLabel, title, assetStatus, assetType } =
                useAssetInfo()
            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            const dataMap: { [id: string]: any } = ref({})
            const handleChange = () => {}
            const infoTabData: Ref<any> = ref({})
            // const {} =useMagicKeys();
            const tabHeights = {
                discovery: 'calc(100vh - 7.8rem)',
                profile: 'calc(100vh - 3rem)',
                biOverview: 'calc(100vh - 8.06rem)',
                nonBiOverview: 'calc(100vh - 8.3rem)',
            }

            function getAssetEntitity(data: Ref): any {
                if (data.value?.entities.length > 0)
                    return data.value?.entities[0]
                return {}
            }

            const getDataType = (type: string) => {
                let label = ''
                dataTypeList.forEach((i) => {
                    if (i.type.includes(type)) label = i.label
                })
                return label
            }
            const isColumnAsset = (asset) => assetType(asset) === 'Column'

            const getColumnUrl = (asset) => {
                const tableGuid = asset.attributes?.table.guid
                return `/assets/${tableGuid}/overview?column=${asset?.guid}`
            }

            provide('mutateSelectedAsset', (updatedAsset: assetInterface) => {
                emit('assetMutation', updatedAsset)
            })

            watch(page, () => {
                if (activeKey.value > filteredTabs.value.length)
                    activeKey.value = 0
            })

            function init() {
                isLoaded.value = false
                infoTabData.value = selectedAsset.value
            }
            watch(() => selectedAsset.value.guid, init)
            onMounted(init)

            return {
                tabHeights,
                isLoaded,
                infoTabData,
                title,
                assetTypeLabel,
                dataMap,
                activeKey,
                filteredTabs,
                assetStatus,
                handleChange,
                images,
                getDataType,
                isColumnAsset,
                getColumnUrl,
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
