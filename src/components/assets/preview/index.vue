<template>
    <div v-if="selectedAsset?.guid" class="flex flex-col h-full">
        <div
            class="flex flex-col px-4 py-3 border-b border-gray-200"
            v-if="!isProfile"
        >
            <div class="flex items-center mb-1" style="padding-bottom: 1px">
                <div
                    v-if="
                        ['column'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                    "
                    class="flex mr-1"
                >
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

                <CertificateBadge
                    v-if="certificateStatus(selectedAsset)"
                    :status="certificateStatus(selectedAsset)"
                    :username="certificateUpdatedBy(selectedAsset)"
                    :timestamp="certificateUpdatedAt(selectedAsset)"
                    placement="bottomRight"
                    class="mb-0.5"
                ></CertificateBadge>
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

        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            :style="
                isProfile
                    ? 'height: calc(100% - 0px)'
                    : 'height: calc(100% - 84px)'
            "
            tab-position="left"
        >
            <a-tab-pane
                v-for="(tab, index) in getPreviewTabs(selectedAsset)"
                :key="index"
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
                    :key="selectedAsset.guid"
                    :is="tab.component"
                    :selected-asset="selectedAsset"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        ref,
        PropType,
        watch,
        toRefs,
        computed,
        provide,
    } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useRoute } from 'vue-router'

    import useEvaluate from '~/composables/auth/useEvaluate'
    import { debouncedWatch } from '@vueuse/core'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
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
            activity: defineAsyncComponent(
                () => import('./activity/activityTab.vue')
            ),
            // chat: defineAsyncComponent(
            //     () => import('./tabs/chat/assetChat.vue')
            // ),
            // relations: defineAsyncComponent(
            //     () => import('./tabs/relations/relationTab.vue')
            // ),
            // actions: defineAsyncComponent(
            //     () => import('./tabs/actions/actions.vue')
            // ),
            lineage: defineAsyncComponent(
                () => import('./lineage/lineageTab.vue')
            ),
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
            tab: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { getAllowedActions } = useAssetEvaluate()
            const actions = computed(() =>
                getAllowedActions(selectedAsset.value)
            )
            provide('actions', actions)
            provide('selectedAsset', selectedAsset)

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
                getPreviewTabs,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            } = useAssetInfo()

            const activeKey = ref(0)

            const route = useRoute()
            const isProfile = ref(false)
            if (route.params.id) {
                isProfile.value = true
            }

            watch(
                () => route.params.id,
                (newId) => {
                    if (newId) {
                        isProfile.value = true
                    } else {
                        isProfile.value = false
                    }
                }
            )

            const body = ref({})
            const { refresh } = useEvaluate(body, false)
            debouncedWatch(
                () => selectedAsset.value?.attributes?.qualifiedName,
                (prev) => {
                    if (prev) {
                        body.value = {
                            entities: [
                                {
                                    typeName: selectedAsset.value.typeName,
                                    entityGuid: selectedAsset.value.guid,
                                    action: 'ENTITY_UPDATE',
                                },
                            ],
                        }
                        refresh()
                    }
                },
                { debounce: 100 }
            )

            provide('switchTab', (asset, tabName: string) => {
                const idx = getPreviewTabs(asset).findIndex(
                    (tl) => tl.name === tabName
                )
                if (idx > -1) activeKey.value = idx
            })

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
                getPreviewTabs,
                refresh,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                isProfile,
                actions,
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
