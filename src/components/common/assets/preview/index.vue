<template>
    <div v-if="selectedAsset?.guid" class="flex flex-col h-full">
        <div
            v-if="!isProfile"
            class="flex flex-col px-4 py-4 border-b border-gray-200"
        >
            <div class="flex items-center mb-1">
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
                        class="h-4 text-gray-500 mb-0.5"
                    />
                </div>
                <Tooltip
                    :tooltip-text="`${title(selectedAsset)}`"
                    :route-to="getProfilePath(selectedAsset)"
                    classes="text-base font-bold mb-0 cursor-pointer text-primary hover:underline "
                    @click="() => $emit('closeDrawer')"
                    :shouldOpenInNewTab="
                        selectedAsset.typeName?.toLowerCase() === 'query'
                    "
                />

                <CertificateBadge
                    v-if="certificateStatus(selectedAsset)"
                    :status="certificateStatus(selectedAsset)"
                    :username="certificateUpdatedBy(selectedAsset)"
                    :timestamp="certificateUpdatedAt(selectedAsset)"
                    placement="bottomRight"
                    class="mb-1 ml-1"
                ></CertificateBadge>
                <a-tooltip placement="bottomRight"
                    ><template #title>Limited Access</template>
                    <AtlanIcon
                        v-if="isScrubbed(selectedAsset)"
                        icon="Lock"
                        class="w-4 h-4 mb-1 ml-1"
                        style="min-width: 1rem"
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

                    <div class="text-sm tracking-wider text-gray-500 uppercase">
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
                                    v-if="showCTA(action.id)"
                                    class="flex items-center justify-center"
                                    @click="handleAction(action.id)"
                                >
                                    <AtlanIcon
                                        :icon="action.icon"
                                        class="mb-0.5 h-4 w-auto"
                                    />
                                </a-button>
                            </a-tooltip>
                        </template>
                    </template>
                </a-button-group>
            </div>
        </div>

        <!-- <div
            v-if="isEvaluating"
            class="flex items-center justify-center flex-grow"
        >
        <AtlanLoader class="h-10" />

        </div> -->
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            :style="
                isProfile
                    ? 'height: calc(100% - 0px)'
                    : 'height: calc(100% - 84px)'
            "
            tab-position="left"
            :destroy-inactive-tab-pane="true"
        >
            <a-tab-pane
                v-for="(tab, index) in getPreviewTabs(selectedAsset, isProfile)"
                :key="index"
                :destroy-inactive-tab-pane="true"
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
                        @click="onClickTabIcon(tab)"
                    />
                </template>
                <NoAccess v-if="isScrubbed(selectedAsset) && tab.scrubbed" />
                <component
                    :is="tab.component"
                    v-else-if="tab.component"
                    :key="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :is-drawer="isDrawer"
                    :read-permission="isScrubbed(selectedAsset)"
                    :edit-permission="
                        selectedAssetUpdatePermission(selectedAsset, isDrawer)
                    "
                    :data="tab.data"
                    :ref="
                        (el) => {
                            if (el) tabChildRef[index] = el
                        }
                    "
                    :collectionData="{
                        collectionInfo,
                        hasCollectionReadPermission,
                        hasCollectionWritePermission,
                        isCollectionCreatedByCurrentUser,
                    }"
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
    import { useAuthStore } from '~/store/auth'
    import useEvaluate from '~/composables/auth/useEvaluate'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'
    import ShareMenu from '@/common/assets/misc/shareMenu.vue'
    import NoAccess from '@/common/assets/misc/noAccess.vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useCollectionInfo from '~/components/insights/explorers/queries/composables/useCollectionInfo'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            PreviewTabsIcon,
            CertificateBadge,
            ShareMenu,
            NoAccess,
            Tooltip,

            info: defineAsyncComponent(() => import('./info/index.vue')),
            columns: defineAsyncComponent(() => import('./columns/index.vue')),
            actions: defineAsyncComponent(() => import('./actions/index.vue')),
            property: defineAsyncComponent(
                () => import('./property/index.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./activity/activityTab.vue')
            ),
            queries: defineAsyncComponent(() => import('./queries/index.vue')),
            relations: defineAsyncComponent(
                () => import('./relations/index.vue')
            ),
            resources: defineAsyncComponent(
                () => import('@common/widgets/resources/index.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('./lineage/lineageTab.vue')
            ),
            customMetadata: defineAsyncComponent(
                () => import('./customMetadata/index.vue')
            ),
            linkedAssets: defineAsyncComponent(
                () => import('./linkedAssets/linkedAssetsWrapper.vue')
            ),
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
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
            drawerActiveKey: {
                type: String,
                required: false,
                default: 'info',
            },
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const { selectedAsset, isDrawer, page, drawerActiveKey } =
                toRefs(props)
            const { getAllowedActions, getAssetEvaluationsBody } =
                useAssetEvaluate()
            const actions = computed(() =>
                getAllowedActions(selectedAsset.value)
            )
            provide('actions', actions)
            provide('selectedAsset', selectedAsset)
            provide('sidebarPage', page)

            const {
                collectionInfo,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                isCollectionCreatedByCurrentUser,
            } = useCollectionInfo(selectedAsset)

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
                selectedAssetUpdatePermission,
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
            const authStore = useAuthStore()

            const { refresh, isLoading: isEvaluating } = useEvaluate(
                body,
                false,
                isDrawer.value
            )
            debouncedWatch(
                () => selectedAsset.value?.attributes?.qualifiedName,
                (prev) => {
                    if (prev) {
                        if (
                            authStore?.evaluations?.some(
                                (ev) =>
                                    ev?.entityGuid === selectedAsset.value?.guid
                            )
                        ) {
                            return
                        }
                        body.value = {
                            entities: getAssetEvaluationsBody(
                                selectedAsset.value
                            ),
                        }

                        refresh()
                    }
                },
                { debounce: 100, immediate: true }
            )

            const switchTab = (asset, tabName: string) => {
                const idx = getPreviewTabs(asset, isProfile.value).findIndex(
                    (tl) => tl.name === tabName
                )
                if (idx > -1) activeKey.value = idx
            }

            provide('switchTab', switchTab)

            watch(drawerActiveKey, (newVal) => {
                switchTab(selectedAsset.value, newVal)
            })

            const router = useRouter()

            const handleAction = (key) => {
                emit('closeDrawer')
                switch (key) {
                    case 'open':
                        router.push(getProfilePath(selectedAsset.value))
                        break
                    case 'query':
                        // router.push(getAssetQueryPath(selectedAsset.value))
                        handleClick(getAssetQueryPath(selectedAsset.value))
                        break
                    default:
                        break
                }
            }

            const showCTA = (action) => {
                return route.path !== '/insights'
                    ? true
                    : selectedAsset.value.typeName === 'Query'
                    ? false
                    : action === 'query'
                    ? false
                    : true
            }

            const tabChildRef = ref([])

            const handleTabChange = (k) => {
                // ! disabling this temporarily
                // if (
                //     k !== activeKey.value &&
                //     tabChildRef.value[activeKey.value]?.isEdit
                // )
                //     tabChildRef.value[activeKey.value]?.handleCancel()
                // else activeKey.value = k
            }

            const handleClick = (path) => {
                const URL = `http://` + window.location.host + path

                window.open(URL, '_blank')?.focus()
            }

            const onClickTabIcon = (tabObj: object) => {
                console.log('onClickTabIcon', tabObj)
                if (!tabObj.analyticsKey) {
                    return
                }
                const scrubbed =
                    isScrubbed(selectedAsset.value) && tabObj.scrubbed
                if (scrubbed) {
                    return
                }
                useAddEvent('discovery', 'asset_sidebar', 'tab_changed', {
                    asset_type: selectedAsset.value.typeName,
                    tab_name: tabObj.analyticsKey,
                })
            }

            provide('isProfile', isProfile.value)

            return {
                tabChildRef,
                activeKey,
                handleTabChange,
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
                isEvaluating,
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
                selectedAssetUpdatePermission,
                showCTA,
                onClickTabIcon,

                //for collection access
                collectionInfo,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                isCollectionCreatedByCurrentUser,
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
