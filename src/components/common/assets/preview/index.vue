<template>
    <div v-if="selectedAsset?.guid" class="flex flex-col h-full">
        <div
            v-if="!isProfile"
            class="flex flex-col px-4 py-3 border-b border-gray-200"
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
                <AtlanIcon
                    v-if="
                        ['atlasglossarycategory'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                    "
                    icon="Category"
                    class="h-4 mb-0.5 mr-1"
                ></AtlanIcon>
                <AtlanIcon
                    v-if="
                        ['atlasglossaryterm'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                    "
                    icon="Term"
                    class="h-4 mb-0.5 mr-1"
                ></AtlanIcon>
                <router-link
                    :to="getProfilePath(selectedAsset)"
                    @click="() => $emit('closeDrawer')"
                    class="flex-shrink mb-0 mr-1 overflow-hidden font-bold leading-none truncate cursor-pointer  text-md hover:underline overflow-ellipsis whitespace-nowrap"
                    :class="
                        isDrawer &&
                        ['column'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                            ? 'pointer-events-none text-gray-500'
                            : 'text-primary'
                    "
                >
                    {{ title(selectedAsset) }}
                </router-link>
                <CertificateBadge
                    v-if="
                        certificateStatus(selectedAsset) &&
                        !isScrubbed(selectedAsset)
                    "
                    :status="certificateStatus(selectedAsset)"
                    :username="certificateUpdatedBy(selectedAsset)"
                    :timestamp="certificateUpdatedAt(selectedAsset)"
                    placement="bottomRight"
                    class="mb-0.5"
                ></CertificateBadge>
                <a-tooltip placement="bottomRight"
                    ><template #title>Limited Access</template>
                    <AtlanIcon
                        v-if="isScrubbed(selectedAsset)"
                        icon="Lock"
                        class="h-4 mb-0.5"
                    ></AtlanIcon
                ></a-tooltip>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <a-tooltip
                        v-if="connectorName(selectedAsset)"
                        placement="left"
                    >
                        <template #title>
                            <span>{{ connectorName(selectedAsset) }} </span>
                            <span v-if="connectionName(selectedAsset)">{{
                                `/${connectionName(selectedAsset)}`
                            }}</span>
                        </template>
                        <img
                            :src="getConnectorImage(selectedAsset)"
                            class="h-4 mr-1 mb-0.5"
                        />
                    </a-tooltip>
                    <AtlanIcon
                        v-if="
                            ['atlasglossarycategory'].includes(
                                selectedAsset.typeName?.toLowerCase()
                            )
                        "
                        icon="Category"
                        class="h-4 mb-0.5 mr-1"
                    ></AtlanIcon>
                    <AtlanIcon
                        v-if="
                            ['atlasglossaryterm'].includes(
                                selectedAsset.typeName?.toLowerCase()
                            )
                        "
                        icon="Term"
                        class="h-4 mb-0.5 mr-1"
                    ></AtlanIcon>

                    <div class="text-sm tracking-wider uppercase text-gray">
                        {{
                            assetTypeLabel(selectedAsset) ||
                            selectedAsset.typeName
                        }}
                    </div>
                </div>
                <a-button-group>
                    <template
                        v-for="action in getActions(selectedAsset)"
                        :key="action.id"
                    >
                        <component
                            :is="action.component"
                            v-if="action.component"
                            :asset="selectedAsset"
                            :edit-permission="true"
                        >
                            <a-button class="flex items-center justify-center">
                                <AtlanIcon icon="Share" class="mb-0.5" />
                            </a-button>
                        </component>
                        <template v-else>
                            <a-tooltip :title="action.label">
                                <a-button
                                    class="flex items-center justify-center"
                                    @click="handleAction(action.id)"
                                >
                                    <AtlanIcon
                                        :icon="action.icon"
                                        class="mb-0.5"
                                    />
                                </a-button>
                            </a-tooltip>
                        </template>
                    </template>
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
            :destroyInactiveTabPane="true"
        >
            <a-tab-pane
                v-for="(tab, index) in getPreviewTabs(selectedAsset)"
                :key="index"
                class="overflow-y-auto"
                :destroyInactiveTabPane="true"
                :disabled="isScrubbed(selectedAsset) && tab.scrubbed"
            >
                <template #tab>
                    <PreviewTabsIcon
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :image="tab.image"
                        :emoji="tab.emoji"
                        :active-icon="tab.activeIcon"
                        :is-active="activeKey === index"
                        :is-scrubbed="isScrubbed(selectedAsset) && tab.scrubbed"
                    />
                </template>

                <component
                    v-if="tab.component"
                    :is="tab.component"
                    :key="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :isDrawer="isDrawer"
                    :readOnly="isScrubbed(selectedAsset)"
                    :data="tab.data"
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

    import { useRoute, useRouter } from 'vue-router'
    import { debouncedWatch } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    import useEvaluate from '~/composables/auth/useEvaluate'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'
    import ShareMenu from '@/common/assets/misc/shareMenu.vue'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            PreviewTabsIcon,
            CertificateBadge,
            ShareMenu,
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
            relations: defineAsyncComponent(
                () => import('./relations/index.vue')
            ),
            resources: defineAsyncComponent(
                () => import('@common/widgets/resources/index.vue')
            ),
            // chat: defineAsyncComponent(
            //     () => import('./tabs/chat/assetChat.vue')
            // ),
            // actions: defineAsyncComponent(
            //     () => import('./tabs/actions/actions.vue')
            // ),
            lineage: defineAsyncComponent(
                () => import('./lineage/lineageTab.vue')
            ),
            customMetadata: defineAsyncComponent(
                () => import('./customMetadata/index.vue')
            ),
            // CertificatePopover,
        },

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
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const { selectedAsset, isDrawer } = toRefs(props)
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
                getActions,
                getAssetQueryPath,
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
                assetTypeLabel,
                getProfilePath,
                isScrubbed,
            } = useAssetInfo()

            const activeKey = ref(0)

            const route = useRoute()
            const isProfile = ref(false)
            if (route.params.id && !isDrawer.value) {
                isProfile.value = true
            }

            watch(
                () => route.params.id,
                (newId) => {
                    if (newId && !isDrawer.value) {
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

            const router = useRouter()

            const handleAction = (key) => {
                emit('closeDrawer')
                switch (key) {
                    case 'open':
                        router.push(getProfilePath(selectedAsset.value))
                        break
                    case 'query':
                        router.push(getAssetQueryPath(selectedAsset.value))
                        break
                    default:
                        break
                }
            }

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
                assetTypeLabel,
                getActions,
                getAssetQueryPath,
                handleAction,
                getProfilePath,
                isScrubbed,
            }
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
