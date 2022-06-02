<template>
    <div v-if="selectedAsset?.guid" class="flex flex-col h-full">
        <div
            v-if="!isProfile"
            class="flex flex-col px-4 py-4 border-b border-gray-200"
        >
            <div class="flex items-center mb-1">
                <a-tooltip v-if="connectorName(selectedAsset)" placement="left">
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
                    v-if="
                        ['process', 'columnprocess', 'biprocess'].includes(
                            selectedAsset.typeName?.toLowerCase()
                        )
                    "
                    :tooltip-text="`${title(selectedAsset)}`"
                    :classes="
                        isScrubbed(selectedAsset)
                            ? 'mb-0 font-semibold text-gray-500 opacity-80 '
                            : 'font-bold mb-0 text-gray-500 '
                    "
                />
                <Tooltip
                    v-else
                    :tooltip-text="`${title(selectedAsset)}`"
                    :route-to="getProfilePath(selectedAsset)"
                    :classes="
                        isScrubbed(selectedAsset)
                            ? 'mb-0  font-semibold cursor-pointer text-primary hover:underline opacity-80 '
                            : 'font-bold mb-0 cursor-pointer text-primary hover:underline '
                    "
                    :should-open-in-new-tab="true"
                    @click="() => $emit('closeDrawer')"
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
                    <AtlanIcon
                        v-if="
                            [
                                'table',
                                'view',
                                'tablepartition',
                                'materialisedview',
                                'column',
                                'schema',
                                'query',
                            ].includes(selectedAsset.typeName?.toLowerCase())
                        "
                        :icon="
                            assetTypeImage(selectedAsset) ||
                            selectedAsset?.typeName
                        "
                        class="self-center mr-1 text-gray-500 mb-0.5"
                    ></AtlanIcon>
                    <AtlanIcon
                        v-if="
                            ['s3object', 's3bucket'].includes(
                                selectedAsset.typeName?.toLowerCase()
                            )
                        "
                        :icon="selectedAsset?.typeName"
                        class="self-center mr-1 text-gray-500 mb-0.5"
                    ></AtlanIcon>
                    <a-tooltip
                        class="flex items-center"
                        v-if="
                            connectorName(selectedAsset) &&
                            ![
                                'table',
                                'view',
                                'tablepartition',
                                'materialisedview',
                                'column',
                                'schema',
                                'query',
                            ].includes(selectedAsset.typeName?.toLowerCase())
                        "
                        placement="left"
                    >
                        <template #title>
                            <span>{{ connectorName(selectedAsset) }} </span>
                            <span v-if="connectionName(selectedAsset)">{{
                                `/${connectionName(selectedAsset)}`
                            }}</span>
                        </template>
                        <span
                            class="mr-1 text-sm tracking-wider text-gray-500 capitalize"
                            >{{ connectorName(selectedAsset) }}
                        </span>
                        <!-- <img
                                    :src="getConnectorImage(item)"
                                    class="h-4 mb-0.5"
                                /> -->
                        <!-- <span class=""></span> -->
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

                    <div class="text-sm text-gray-500">
                        {{
                            assetTypeLabel(selectedAsset) ||
                            selectedAsset.typeName
                        }}
                        <span
                            v-if="
                                ['SalesforceObject'].includes(
                                    selectedAsset.typeName
                                ) && isCustom(selectedAsset)
                            "
                            >(custom)</span
                        >
                        <span
                            v-if="
                                ['TableauDatasource'].includes(
                                    selectedAsset.typeName
                                ) && isPublished(selectedAsset)
                            "
                            >(Published)</span
                        >
                    </div>
                </div>
                <a-button-group>
                    <a-tooltip title="Open">
                        <a-button
                            v-if="
                                showCTA('open') &&
                                !(
                                    isDrawer &&
                                    route?.params?.id &&
                                    assetType(selectedAsset) === 'Column'
                                ) &&
                                ![
                                    'Process',
                                    'ColumnProcess',
                                    'BIProcess',
                                ].includes(selectedAsset.typeName)
                            "
                            class="flex items-center justify-center p-2"
                            @click="handleAction('open')"
                        >
                            <AtlanIcon icon="EnterProfile" class="w-auto h-4" />
                        </a-button>
                    </a-tooltip>

                    <a-tooltip
                        title="Query"
                        v-if="featureEnabledMap[INSIGHT_WORKSPACE_LEVEL_TAB]"
                    >
                        <QueryDropdown
                            v-if="
                                showCTA('query') &&
                                connectorName(selectedAsset) !== 'glue' &&
                                (assetType(selectedAsset) === 'Table' ||
                                    assetType(selectedAsset) === 'View' ||
                                    assetType(selectedAsset) ===
                                        'TablePartition' ||
                                    assetType(selectedAsset) ===
                                        'MaterialisedView')
                            "
                            @handleClick="handleQueryAction"
                        >
                            <template #button>
                                <a-button
                                    class="flex items-center justify-center p-2"
                                >
                                    <AtlanIcon
                                        icon="Query"
                                        class="w-auto h-4"
                                    />
                                </a-button>
                            </template>
                        </QueryDropdown>
                    </a-tooltip>

                    <SlackAskButton
                        v-if="!disableSlackAsk"
                        :asset="selectedAsset"
                    />

                    <KebabMenu
                        :key="selectedAsset.guid"
                        :asset="selectedAsset"
                        :edit-permission="
                            selectedAssetUpdatePermission(
                                selectedAsset,
                                isDrawer
                            )
                        "
                    >
                        <a-button class="flex items-center justify-center p-2">
                            <AtlanIcon icon="KebabMenu" />
                        </a-button>
                    </KebabMenu>
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
            tab-position="right"
            :destroy-inactive-tab-pane="true"
            @tabClick="handleTabClick"
        >
           
            <template
                v-for="(tab, index) in getPreviewTabs(selectedAsset, isProfile)"
            >   
                <a-tab-pane
                    v-if="
                        tab.component === 'Jira' && !jiraAppInstalled
                            ? false
                            : true
                    "
                    :key="index"
                    :destroy-inactive-tab-pane="true"
                    :disabled="isScrubbed(selectedAsset) && tab.scrubbed"
                    :class="index === activeKey ? 'flex flex-col' : ''"
                >  
                    <template #tab>
                        <a-badge
                            :count="getCount(tab.name)"
                            :offset="[-8, 5]"
                            class="small"
                            :number-style="{
                                background:
                                    'linear-gradient(132.26deg, #0575E6 7.86%, #0029C4 89.25%)',
                                color: '#fff',
                            }"
                        >
                       
                            <div class="flex flex-col" style="width: 45px">
                                <PreviewTabsIcon
                                    :title="tab.tooltip"
                                    :icon="tab.icon"
                                    :image="tab.image"
                                    :emoji="tab.emoji"
                                    height="h-5"
                                    width="w-5"
                                    :active-icon="tab.activeIcon"
                                    :is-active="activeKey === index"
                                    :is-scrubbed="
                                        isScrubbed(selectedAsset) &&
                                        tab.scrubbed
                                    "
                                    @click="onClickTabIcon(tab)"
                                >
                                </PreviewTabsIcon>

                                <span
                                    class="tracking-tight text-gray-500 leading-none mt-0.5"
                                    style="font-size: 11px"
                                    >{{ trimText(tab.name) }}
                                </span>
                            </div>
                        </a-badge>
                    </template>
                    <NoAccess
                        v-if="isScrubbed(selectedAsset) && tab.scrubbed"
                    />
                    <component
                        :is="tab.component"
                        v-else-if="tab.component"
                        :key="selectedAsset.guid"
                        :ref="
                            (el) => {
                                if (el) tabChildRef[index] = el
                            }
                        "
                        :is-scrubbed="isScrubbed(selectedAsset)"
                        :selected-asset="selectedAsset"
                        :is-drawer="isDrawer"
                        :read-permission="!isScrubbed(selectedAsset)"
                        :edit-permission="
                            selectedAssetUpdatePermission(
                                selectedAsset,
                                isDrawer
                            )
                        "
                        :tab="tab"
                        :data="tab.data"
                        :read-only-in-cm="readOnlyInCm"
                        :collection-data="{
                            collectionInfo,
                            hasCollectionReadPermission,
                            hasCollectionWritePermission,
                            isCollectionCreatedByCurrentUser,
                        }"
                    ></component>
                </a-tab-pane>
            </template>
            <template #moreIcon>
                <div class="flex justify-center">
                    <AtlanIcon
                        icon="KebabMenuHorizontal"
                        class="text-primary"
                    ></AtlanIcon>
                </div>
            </template>
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
        inject,
    } from 'vue'

    import { useRoute, useRouter } from 'vue-router'
    import { debouncedWatch, whenever } from '@vueuse/core'
    import Tooltip from '@common/ellipsis/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useAuthStore } from '~/store/auth'
    import useEvaluate from '~/composables/auth/useEvaluate'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'
    import KebabMenu from '@/common/assets/misc/kebabMenu.vue'
    import NoAccess from '@/common/assets/misc/noAccess.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useCollectionInfo from '~/components/insights/explorers/queries/composables/useCollectionInfo'
    import QueryDropdown from '@/common/query/queryDropdown.vue'
    import SlackAskButton from '~/components/common/assets/misc/slackAskButton.vue'

    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

    import {
        resourceId,
        disableSlackAsk,
    } from '~/composables/integrations/slack/useAskAQuestion'
    import { issuesCount } from '~/composables/integrations/jira/useJiraTickets'
    import integrationStore from '~/store/integrations/index'
    import {
        featureEnabledMap,
        INSIGHT_WORKSPACE_LEVEL_TAB,
    } from '~/composables/labs/labFeatureList'
    import { getDomain } from '~/utils/url'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            PreviewTabsIcon,
            CertificateBadge,
            NoAccess,
            Tooltip,
            QueryDropdown,
            KebabMenu,
            info: defineAsyncComponent(() => import('./info/index.vue')),
            columns: defineAsyncComponent(() => import('./columns/index.vue')),
            actions: defineAsyncComponent(() => import('./actions/index.vue')),
            request: defineAsyncComponent(() => import('./request/index.vue')),
            property: defineAsyncComponent(
                () => import('./property/index.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./activity/activityTab.vue')
            ),
            queries: defineAsyncComponent(() => import('./queries/index.vue')),
            s3Objects: defineAsyncComponent(
                () => import('./s3objects/index.vue')
            ),
            relations: defineAsyncComponent(
                () => import('./relations/index.vue')
            ),
            resources: defineAsyncComponent(
                () =>
                    import(
                        '@/common/assets/preview/resources/resourcesWrapper.vue'
                    )
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
            Jira: defineAsyncComponent(
                () =>
                    import('@/common/assets/preview/integrations/jira/jira.vue')
            ),
            SlackResourcesTab: defineAsyncComponent(
                () =>
                    import(
                        '@/common/assets/preview/resources/slackResourcesWrapper.vue'
                    )
            ),
            SlackAskButton,
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
                default: 'Overview',
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
            const readOnlyInCm = ref(true)

            provide('actions', actions)
            provide('selectedAsset', selectedAsset)
            provide('sidebarPage', page)
            provide('isDrawer', isDrawer)

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
                assetTypeImage,
                selectedAssetUpdatePermission,
                isCustom,
                isPublished,
                links,
            } = useAssetInfo()

            const activeKey = ref(1)
            const activeLabel = ref<string>("Overview")

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

            const slackResourceCount = () =>
                links(selectedAsset.value).filter(
                    (l) => getDomain(l.attributes.link) === 'slack.com'
                ).length

            const getCount = (tab) => {
                if (tab?.toLowerCase() === 'resources') {
                    return (
                        links(selectedAsset.value).length - slackResourceCount()
                    )
                } else if (tab?.toLowerCase() === 'slack') {
                    return slackResourceCount()
                }
            }

            const { refresh, isLoading: isEvaluating } = useEvaluate(
                body,
                false,
                isDrawer.value
            )
            provide('isEvaluating', isEvaluating)

            debouncedWatch(
                () => selectedAsset.value?.attributes?.qualifiedName,
                (prev) => {
                    if (prev) {
                        if (
                            !isDrawer.value &&
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

            const switchTab = (
                asset,
                tabName: string,
                enableEditinCM = false
            ) => {
                if (enableEditinCM) {
                    readOnlyInCm.value = false
                }                
                const idx = getPreviewTabs(asset, isProfile.value).findIndex(
                    (tl) => tl.name === tabName
                )
                
                if (idx > -1) {
                    activeKey.value = idx
                }else {
                    activeKey.value = 0
                }

                // After a while change back to read state as the same component is being used for other CM tabs

                setTimeout(() => {
                    readOnlyInCm.value = true
                }, 1000)
            }

            watch(selectedAsset, () => {
                switchTab(selectedAsset.value, activeLabel.value)
            }, {deep: true})

            const handleTabClick = (tabIndex) => {
                const getTab = getPreviewTabs(selectedAsset.value, isProfile.value)[tabIndex]
                activeLabel.value = getTab.name
            }

            provide('switchTab', switchTab)

            debouncedWatch(
                drawerActiveKey,
                (newVal) => {
                    switchTab(selectedAsset.value, newVal)
                },
                { debounce: 200, immediate: true }
            )

            const handleAction = (key) => {
                emit('closeDrawer')
                switch (key) {
                    case 'open':
                        window.open(
                            getProfilePath(selectedAsset.value),
                            '_blank'
                        )
                        useAddEvent('discovery', 'cta_action', 'clicked', {
                            action: 'open_asset',
                            asset_type: selectedAsset.value.typeName,
                        })
                        break
                    case 'query':
                        // router.push(getAssetQueryPath(selectedAsset.value))
                        handleClick(getAssetQueryPath(selectedAsset.value))
                        break
                    default:
                        break
                }
            }

            const handleQueryAction = (openVQB) => {
                handleClick(
                    `${getAssetQueryPath(
                        selectedAsset.value
                    )}&openVQB=${openVQB}`
                )
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: !openVQB ? 'sql_query' : 'vqb_query',
                    asset_type: selectedAsset.value.typeName,
                })
            }

            const showCTA = (action) =>
                route.path !== '/insights'
                    ? true
                    : selectedAsset.value.typeName === 'Query'
                    ? false
                    : action !== 'query'

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
                const URL = `http://${window.location.host}${path}`

                window.open(URL, '_blank')?.focus()
            }

            const onClickTabIcon = (tabObj) => {
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

            provide('isProfile', isProfile)

            const updateList = inject('updateList', () => ({}))
            const updateDrawerList = inject('updateDrawerList', () => ({}))

            const store = integrationStore()
            const { tenantJiraStatus, tenantSlackStatus } = toRefs(store)

            /** whenever resource ID is fetched, refresh the asset to load the generated resource, then switch tab */
            watch(resourceId, () => {
                const id = ref(selectedAsset.value.guid)
                const { asset, isReady: isUpdateReady } = useCurrentUpdate({
                    id,
                })

                whenever(isUpdateReady, () => {
                    if (isDrawer.value) {
                        updateDrawerList(asset.value)
                    } else updateList(asset.value)

                    if (resourceId.value) {
                        if (tenantSlackStatus.value.configured)
                            switchTab(selectedAsset.value, 'Slack')
                        else switchTab(selectedAsset.value, 'Resources')
                    }
                })
            })
            const trimText = (text) => {
                if (text?.length > 9) {
                    return `${text?.substring(0, 6)}...`
                }
                return text
            }

            const {
                count,
                isReady: countReady,
                mutate,
            } = issuesCount(false, false)

            watch(
                () => tenantJiraStatus.value.configured,
                (v) => {
                    if (v) mutate()
                },
                { immediate: true }
            )

            const jiraAppInstalled = computed(
                () => countReady?.value && !!count.value
            )

           

        
            return {
                INSIGHT_WORKSPACE_LEVEL_TAB,
                featureEnabledMap,
                jiraAppInstalled,
                disableSlackAsk,
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
                assetTypeImage,
                route,
                // for collection access
                collectionInfo,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                isCollectionCreatedByCurrentUser,
                handleQueryAction,
                readOnlyInCm,
                isCustom,
                isPublished,
                trimText,
                getCount,
                links,
                slackResourceCount,
                switchTab,
                handleTabClick
            }
        },
    })
</script>
<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-right) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }

            :global(> .ant-tabs-nav .ant-tabs-tab) {
                padding: 6px 8px !important;
                @apply justify-center;
                @apply mt-2 !important;
                &:global(.ant-tabs-tab-active) {
                    @apply bg-primary-menu;
                }
            }

            :global(> .ant-tabs-nav .ant-tabs-tab:first-child) {
                padding: 6px 8px !important;
                @apply mt-1 !important;
                @apply justify-center;
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
            }
        }
    }
</style>

<style lang="less">
    .small {
        .ant-badge-count {
            height: 16px;
            font-size: 10px;
            line-height: 18px;
            min-width: 16px;
        }

        .ant-scroll-number-only {
            height: 16px;
        }

        .ant-scroll-number-only > p.ant-scroll-number-only-unit {
            height: 16px;
        }
    }
</style>
