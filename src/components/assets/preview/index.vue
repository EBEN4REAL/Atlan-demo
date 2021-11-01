<template>
    <AssetSelector />
    <div v-if="selectedAsset?.guid">
        <div class="flex flex-col px-4 py-3 border-b border-gray-200">
            <div class="flex items-center mb-1" style="padding-bottom: 1px">
                <div
                    v-if="
                        ['column'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                    "
                    class="flex mr-1"
                >
                    <!-- <component
                                :is="dataTypeImage(item)"
                                class="w-auto h-4 text-gray-500"
                                style="margin-top: 1px"
                    ></component> -->

                    <component
                        :is="dataTypeCategoryImage(selectedAsset)"
                        class="h-5 text-gray-500 mb-0.5"
                    />
                </div>
                <router-link
                    to="/"
                    class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap leadiing-none"
                >
                    {{ title(selectedAsset) }}
                </router-link>

                <!-- <CertificateBadge
                    :status="certificateStatus(selectedAsset)"
                    :username="certificateUpdatedBy(selectedAsset)"
                    :timestamp="certificateUpdatedAt(selectedAsset)"
                    placement="bottomRight"
                    class="mb-0.5"
                ></CertificateBadge> -->
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <a-tooltip placement="left">
                        <template #title>
                            <span>{{
                                `${connectorName(
                                    selectedAsset
                                )}/${connectionName(selectedAsset)}`
                            }}</span>
                        </template>
                        <img
                            :src="getConnectorImage(selectedAsset)"
                            class="h-4 mr-1 mb-0.5"
                        />
                    </a-tooltip>

                    <div class="text-sm tracking-tight uppercase text-gray">
                        {{ selectedAsset.typeName }}
                    </div>
                </div>
                <a-button-group>
                    <a-button class="flex items-center justify-center"
                        ><AtlanIcon icon="OpenTermProfile" class="mr-1 mb-0.5"
                    /></a-button>
                    <a-button block class="flex items-center justify-center"
                        ><AtlanIcon icon="Query" class="mr-1 mb-0.5"
                    /></a-button>
                    <a-button block class="flex items-center justify-center"
                        ><AtlanIcon icon="Share" class="mr-1 mb-0.5"
                    /></a-button>

                    <a-button><AtlanIcon icon="External" /></a-button>
                </a-button-group>
            </div>
        </div>
        <div class="">
            <a-tabs
                v-model:activeKey="activeKey"
                :class="$style.previewtab"
                tab-position="left"
            >
                <a-tab-pane
                    v-for="(tab, index) in previewTabs(selectedAsset)"
                    :key="index"
                    :style="{
                        height:
                            activeKey === index ? 'calc(100vh - 10rem)' : '',
                    }"
                >
                    <template #tab>
                        <PreviewTabsIcon
                            :title="tab.tooltip"
                            :icon="tab.icon"
                            :active-icon="tab.activeIcon"
                            :is-active="activeKey === index"
                        />
                    </template>

                    <component
                        :is="tab.component"
                        :selected-asset="selectedAsset"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>

        <!-- <div v-if="page !== 'profile'" class="p-5 border-b">
            <div v-if="selectedAsset.guid === '-1'" class="mb-0 text-sm">
                <AssetLogo :asset="selectedAsset" variant="md" />
                <div class="flex items-center w-full">
                    <Tooltip
                        :tooltip-text="selectedAsset.displayText"
                        classes="font-bold text-base cursor-pointer text-gray-700"
                        placement="left"
                    />
                    <AtlanIcon icon="Lock" class="mb-1 ml-1" />
                </div>
            </div>
            <div v-else>
                <div class="flex items-center justify-between mb-0 text-sm">
                    <AssetLogo :asset="selectedAsset" variant="md" />

                    <div class="flex space-x-2">
                        <a-button-group v-if="isQueryAsset(selectedAsset)">
                            <a-tooltip
                                placement="left"
                                :mouse-enter-delay="0.5"
                                title="Copy insights query link"
                            >
                                <a-button
                                    class="w-8 h-8"
                                    size="small"
                                    @click="handleCopyInsightsLink"
                                    ><AtlanIcon icon="Share" /></a-button
                            ></a-tooltip>
                            <a-tooltip
                                placement="bottom"
                                :mouse-enter-delay="0.5"
                                title="Run query in insights"
                            >
                                <a-button
                                    class="w-8 h-8"
                                    size="small"
                                    @click="handleOpenInsights"
                                >
                                    <AtlanIcon icon="Play" /> </a-button
                            ></a-tooltip>
                        </a-button-group>
                        <a-button-group v-else>
                            <a-tooltip
                                placement="left"
                                :mouse-enter-delay="0.5"
                                title="Copy asset profile link"
                            >
                                <a-button
                                    class="w-8 h-8"
                                    size="small"
                                    @click="handleCopyProfileLink"
                                    ><AtlanIcon icon="Share" /></a-button
                            ></a-tooltip>

                            <a-tooltip
                                placement="bottom"
                                :mouse-enter-delay="0.5"
                                title="Open profile"
                            >
                                <a-button
                                    class="w-8 h-8"
                                    size="small"
                                    @click="handleOpenProfile"
                                >
                                    <AtlanIcon icon="External" /> </a-button
                            ></a-tooltip>
                        </a-button-group>
                    </div>
                </div>

                <div class="flex items-center w-full mt-2">
                    <a-tooltip
                        placement="left"
                        :mouse-enter-delay="0.5"
                        :title="
                            getDataType(selectedAsset?.attributes?.dataType)
                        "
                    >
                        <component
                            :is="
                                images[
                                    getDataType(
                                        selectedAsset?.attributes?.dataType
                                    )
                                ]
                            "
                            v-if="isColumnAsset(selectedAsset)"
                            class="w-4 h-4 mb-1 mr-1"
                        ></component
                    ></a-tooltip>
                    <div
                        class="text-base font-bold cursor-pointer truncated text-primary hover:underline"
                        v-if="mutateTooltip"
                    >
                        {{ selectedAsset.attributes?.name }}
                    </div>
                    <Tooltip
                        v-else
                        :tooltip-text="selectedAsset.attributes?.name"
                        classes="font-bold text-base cursor-pointer text-primary hover:underline"
                        placement="left"
                        :route-to="
                            isColumnAsset(selectedAsset)
                                ? getColumnUrl(selectedAsset)
                                : isQueryAsset(selectedAsset)
                                ? getQueryUrl(selectedAsset)
                                : isQueryFolderAsset(selectedAsset)
                                ? null
                                : `/assets/${selectedAsset.guid}/overview`
                        "
                    />
                    <CertificatePopover
                        v-if="selectedAsset?.guid"
                        :data="selectedAsset"
                    />
                </div>
            </div>
        </div>
        <div v-if="selectedAsset.guid !== '-1'">
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
                            :isActive="activeKey === index"
                        />
                    </template>

                    <div
                        class="flex flex-col"
                        :style="{ height: tabHeights[page] }"
                    >
                        <div
                            v-if="tab.tooltip !== 'Activity'"
                            class="flex items-center justify-between px-5 py-3 font-semibold text-gray-700 text-md"
                        >
                            {{ tab.tooltip }}
                        </div>

                        <component
                            :is="tab.component"
                            :component-data="dataMap[tab.id]"
                            :info-tab-data="selectedAsset"
                            :page="page"
                            :selected-asset="selectedAsset"
                            :user-has-edit-permission="userHasEditPermission"
                            :is-loaded="isLoaded"
                            @change="handleChange"
                        ></component>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div v-else :style="{ height: tabHeights[page] }">
            <NoAccessPage
                >Oops, looks like you don’t have<br />access to view this
                asset!</NoAccessPage
            >
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineAsyncComponent, defineComponent, ref, PropType } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    // import Tooltip from '@common/ellipsis/index.vue'
    // import StatusBadge from '@common/badge/status/index.vue'
    // import AssetLogo from '@/common/icon/assetIcon.vue'
    // import AtlanButton from '@/UI/button.vue'
    // import CertificatePopover from '~/components/common/certificatePopover.vue'
    // import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // import useAssetDetailsTabList from '../../discovery/preview/tabs/useTabList'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import { images, dataTypeList } from '~/constant/datatype'
    // import { copyToClipboard } from '~/utils/clipboard'
    // import useCheckAccess from '~/services/access/useCheckAccess'
    // import NoAccessPage from '@/discovery/noAccess.vue'
    import AssetSelector from '@/common/assetSelector/assetSelector.vue'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            AssetSelector,
            PreviewTabsIcon,
            CertificateBadge,
            // Tooltip,
            // AssetLogo,
            // StatusBadge,
            // SidePanelTabHeaders,
            // NoAccessPage,
            // AtlanButton,
            info: defineAsyncComponent(() => import('./info/index.vue')),
            columns: defineAsyncComponent(() => import('./columns/index.vue')),
            actions: defineAsyncComponent(() => import('./actions/index.vue')),
            property: defineAsyncComponent(
                () => import('./property/index.vue')
            ),
            // activity: defineAsyncComponent(
            //     () => import('./tabs/activity/activityTab.vue')
            // ),
            // chat: defineAsyncComponent(
            //     () => import('./tabs/chat/assetChat.vue')
            // ),
            // relations: defineAsyncComponent(
            //     () => import('./tabs/relations/relationTab.vue')
            // ),
            // actions: defineAsyncComponent(
            //     () => import('./tabs/actions/actions.vue')
            // ),
            // lineage: defineAsyncComponent(
            //     () => import('./tabs/lineage/lineageTab.vue')
            // ),
            // businessMetadataTab: defineAsyncComponent(
            //     () => import('./tabs/businessMetadata/businessMetadataTab.vue')
            // ),
            // CertificatePopover,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            page: {
                type: String,
                required: false,
                default: '',
            },
            showCrossIcon: {
                type: Boolean,
                required: false,
            },
            mutateTooltip: {
                type: Boolean,
                default: false,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const {
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                schemaName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                previewTabs,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            } = useAssetInfo()

            // const { selectedAsset, page, mutateTooltip } = toRefs(props)
            // const { filteredTabs } = useAssetDetailsTabList(page, selectedAsset)
            // const { assetTypeLabel, title, certificateStatus, assetType } =
            //     useAssetInfo()
            const activeKey = ref(0)
            // const isLoaded: Ref<boolean> = ref(true)
            // const router = useRouter()
            // const userHasEditPermission = ref<boolean>(true)
            // const { evaluatePermissions } = useCheckAccess()
            // const { data: userPermission } = evaluatePermissions(
            //     selectedAsset.value,
            //     'ENTITY_UPDATE'
            // )
            // const dataMap: { [id: string]: any } = ref({})
            // const handleChange = () => {}
            // const infoTabData: Ref<any> = ref({})
            // // const {} =useMagicKeys();
            const tabHeights = {
                discovery: 'calc(100vh - 9.2rem)',
                profile: 'calc(100vh - 3rem)',
                biOverview: 'calc(100vh - 9.2rem)',
                nonBiOverview: 'calc(100vh - 9.2rem)',
            }
            // // function getAssetEntitity(data: Ref): any {
            // //     if (data.value?.entities.length > 0)
            // //         return data.value?.entities[0]
            // //     return {}
            // // }
            // const getDataType = (type: string) => {
            //     let label = ''
            //     dataTypeList.forEach((i) => {
            //         if (i.type.includes(type)) label = i.label
            //     })
            //     return label
            // }
            // const isColumnAsset = (asset) => assetType(asset) === 'Column'
            // const isQueryAsset = (asset) => assetType(asset) === 'Query'
            // const isQueryFolderAsset = (asset) =>
            //     assetType(asset) === 'QueryFolder'
            // const getColumnUrl = (asset) => {
            //     const tableGuid = asset?.attributes?.table?.guid
            //     return `/assets/${tableGuid}/overview?column=${asset.guid}`
            // }
            // const getQueryUrl = (asset) => {
            //     return `/insights?id=${asset.guid}`
            // }
            // const handleCopyProfileLink = () => {
            //     const baseUrl = window.location.origin
            //     if (isColumnAsset(selectedAsset.value)) {
            //         const text = `${baseUrl}/${getColumnUrl(
            //             selectedAsset.value
            //         )}`
            //         copyToClipboard(text)
            //     } else {
            //         const text = `${baseUrl}/assets/${selectedAsset.value.guid}/overview`
            //         copyToClipboard(text)
            //     }
            // }
            // const handleOpenProfile = () => {
            //     if (isColumnAsset(selectedAsset.value)) {
            //         router.push(`/${getColumnUrl(selectedAsset.value)}`)
            //     } else {
            //         router.push(`/assets/${selectedAsset.value.guid}/overview`)
            //     }
            // }
            // const handleOpenInsights = () => {
            //     router.push(`${getQueryUrl(selectedAsset.value)}`)
            // }
            // const handleCopyInsightsLink = () => {
            //     const baseUrl = window.location.origin
            //     const text = `${baseUrl}${getQueryUrl(selectedAsset.value)}`
            //     copyToClipboard(text)
            // }
            // provide('mutateSelectedAsset', (updatedAsset: assetInterface) => {
            //     emit('assetMutation', updatedAsset)
            // })
            // provide('switchTab', (tabName: string) => {
            //     const idx = filteredTabs.value.findIndex(
            //         (tl) => tl.name === tabName
            //     )
            //     if (idx > -1) activeKey.value = idx
            // })
            // watch(page, () => {
            //     if (activeKey.value > filteredTabs.value.length)
            //         activeKey.value = 0
            // })
            // watch(userPermission, () => {
            //     userHasEditPermission.value = userPermission.value[0]?.allowed
            // })
            // function init() {
            //     isLoaded.value = false
            //     infoTabData.value = selectedAsset.value
            // }
            // watch(() => selectedAsset.value.guid, init)
            // const name = computed(() => selectedAsset.value.attributes?.name)
            // onMounted(init)
            // return {
            //     mutateTooltip,
            //     name,
            //     tabHeights,
            //     isLoaded,
            //     infoTabData,
            //     userHasEditPermission,
            //     title,
            //     assetTypeLabel,
            //     dataMap,
            //     activeKey,
            //     filteredTabs,
            //     certificateStatus,
            //     handleChange,
            //     images,
            //     getDataType,
            //     isColumnAsset,
            //     getColumnUrl,
            //     getQueryUrl,
            //     isQueryAsset,
            //     isQueryFolderAsset,
            //     handleCopyProfileLink,
            //     handleOpenProfile,
            //     handleCopyInsightsLink,
            //     handleOpenInsights,
            // }

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,
                rowCount,
                columnCount,
                sizeBytes,
                databaseName,
                schemaName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                activeKey,
                previewTabs,
                tabHeights,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            }
        },
    })
</script>

<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-left) {
            :global(.ant-tabs-bar) {
                margin-bottom: 0px !important;
            }
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                @apply justify-center;
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
    }
</style>
