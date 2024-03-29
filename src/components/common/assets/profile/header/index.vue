<template>
    <div class="flex items-center w-full px-6 pt-3">
        <a-button
            class="flex items-center justify-center px-1.5 py-1"
            @click="back"
        >
            <atlan-icon
                icon="ArrowRight"
                class="w-auto h-4 text-gray-500 transform rotate-180"
            />
        </a-button>
        <div class="flex items-center justify-between w-full ml-3">
            <div class="flex flex-col w-full">
                <div v-show="isEditMode">
                    <Name
                        v-model="isEditMode"
                        :selected-asset="item"
                        classes="text-base font-bold text-gray-700  mb-0"
                        @updateName="handleNameUpdate"
                    />
                </div>

                <div
                    v-if="!isEditMode"
                    class="flex items-center mb-0 overflow-hidden"
                >
                    <div
                        v-if="['column'].includes(item.typeName?.toLowerCase())"
                        class="flex mr-1"
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500 mb-0.5"
                        />
                    </div>
                    <Tooltip
                        v-if="assetState(item) === 'deleted'"
                        :tooltip-text="`${entityTitle} (archived)`"
                        classes="text-base font-bold text-gray-500  mb-0"
                    />
                    <Tooltip
                        v-else
                        :tooltip-text="entityTitle"
                        classes="text-base font-bold text-gray-700  mb-0"
                    />

                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-1 ml-1"
                    ></CertificateBadge>
                    <a-tooltip placement="right"
                        ><template #title>Limited Access</template>
                        <AtlanIcon
                            v-if="isScrubbed(item)"
                            icon="Lock"
                            class="h-4 mb-1 ml-1"
                        ></AtlanIcon
                    ></a-tooltip>
                </div>
                <div
                    class="flex items-center gap-x-3"
                    :class="isGTC(item) ? 'mt-0' : 'mt-1'"
                >
                    <div class="flex items-center">
                        <a-tooltip
                            v-if="
                                ![
                                    'AtlasGlossary',
                                    'AtlasGlossaryTerm',
                                    'AtlasGlossaryCategory',
                                ].includes(item?.typeName)
                            "
                            placement="left"
                        >
                            <template #title>
                                <span>{{
                                    `${connectorName(item)}/${connectionName(
                                        item
                                    )}`
                                }}</span>
                            </template>
                            <img
                                :src="getConnectorImage(item)"
                                class="h-4 mr-1 mb-0.5"
                            />
                        </a-tooltip>

                        <div
                            v-if="
                                ![
                                    'AtlasGlossary',
                                    'AtlasGlossaryTerm',
                                    'AtlasGlossaryCategory',
                                ].includes(item?.typeName)
                            "
                            class="text-sm tracking-wider text-gray-500 uppercase"
                        >
                            {{ assetTypeLabel(item) || item?.typeName }}
                            <span
                                v-if="
                                    ['SalesforceObject'].includes(
                                        item.typeName
                                    ) && isCustom(item)
                                "
                                >(custom)</span
                            >
                            <span
                                v-if="
                                    ['TableauDatasource'].includes(
                                        item.typeName
                                    ) && isPublished(item)
                                "
                                >(Published)</span
                            >
                            <span
                                v-if="
                                    ['DataStudioAsset'].includes(
                                        item.typeName
                                    ) && dataStudioAssetType(item)
                                "
                                >({{ dataStudioAssetType(item) }})</span
                            >
                        </div>
                        <div
                            v-else
                            class="flex items-center text-sm tracking-wider text-gray-500 uppercase"
                        >
                            <atlan-icon
                                v-if="isGTC(item)"
                                :icon="`${
                                    glossaryLabel[item?.typeName]
                                        .charAt(0)
                                        .toUpperCase() +
                                    glossaryLabel[item?.typeName].slice(1)
                                }`"
                                class="mr-1"
                            />
                            {{ glossaryLabel[item?.typeName] }}
                        </div>
                    </div>

                    <div
                        v-if="
                            ['database'].includes(item.typeName?.toLowerCase())
                        "
                        class="flex text-sm text-gray-500 gap-x-2"
                    >
                        <div class="flex items-center text-gray">
                            <img
                                :src="getConnectorImage(item)"
                                class="h-4 mr-1 mb-0.5"
                            />
                            <span>{{
                                `${connectorName(item)}/${connectionName(item)}`
                            }}</span>
                        </div>
                    </div>

                    <div
                        v-if="item.typeName?.toLowerCase() === 'column'"
                        class="flex items-center gap-x-1"
                    >
                        <div class="flex">
                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 text-gray-500 mr-0.5 mb-0.5"
                            />
                            <span
                                class="text-sm tracking-wider text-gray-500"
                                >{{ dataType(item) }}</span
                            >
                        </div>
                        <div
                            v-if="
                                isPrimary(item) ||
                                isDist(item) ||
                                isPartition(item)
                            "
                            class="flex"
                        >
                            <AtlanIcon
                                icon="Key"
                                class="mr-1 mb-0.5"
                            ></AtlanIcon>

                            <span
                                v-if="isPrimary(item)"
                                class="ml-1 text-sm text-gray-700"
                                >Primary Key</span
                            >
                            <span
                                v-if="isDist(item)"
                                class="ml-1 text-sm text-gray-700"
                                >Dist Key</span
                            >
                            <span
                                v-if="isPartition(item)"
                                class="ml-1 text-sm text-gray-700"
                                >Partition Key</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="
                            [
                                'table',
                                'view',
                                'tablepartition',
                                'materialisedview',
                                'column',
                                'schema',
                            ].includes(item.typeName?.toLowerCase())
                        "
                        class="flex text-sm text-gray-500 gap-x-2"
                    >
                        <a-tooltip
                            v-if="tableName(item)"
                            placement="bottomLeft"
                        >
                            <div
                                v-if="tableName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="TableGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ tableName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Table - {{ tableName(item) }}</span>
                            </template>
                        </a-tooltip>
                        <a-tooltip v-if="viewName(item)" placement="bottomLeft">
                            <div
                                v-if="viewName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="ViewGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ viewName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>View - {{ viewName(item) }}</span>
                            </template>
                        </a-tooltip>
                        <a-tooltip placement="bottomLeft">
                            <div
                                v-if="databaseName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="DatabaseGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div
                                    @click="
                                        handleOpenDrawer(
                                            databaseQualifiedName(item)
                                        )
                                    "
                                    class="tracking-tight text-gray-500 border-b border-gray-400 border-dashed cursor-pointer hover:text-primary hover:border-gray-500"
                                >
                                    {{ databaseName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Database - {{ databaseName(item) }}</span>
                            </template>
                        </a-tooltip>
                        <a-tooltip placement="bottomLeft">
                            <div
                                v-if="schemaName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="SchemaGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div
                                    @click="
                                        handleOpenDrawer(
                                            schemaQualifiedName(item)
                                        )
                                    "
                                    class="tracking-tight text-gray-500 border-b border-gray-400 border-dashed cursor-pointer hover:text-primary hover:border-gray-500"
                                >
                                    {{ schemaName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Schema - {{ schemaName(item) }}</span>
                            </template>
                        </a-tooltip>
                    </div>
                </div>
            </div>
            <a-button-group>
                <a-tooltip
                    v-if="
                        !isGTC(item) &&
                        !isBiAsset(item) &&
                        !isSaasAsset(item) &&
                        !isObjectAsset(item) &&
                        assetType(item) !== 'Connection' &&
                        connectorName(item) !== 'glue' &&
                        connectorName(item) !== 'netsuite'
                    "
                    title=""
                >
                    <div v-if="featureEnabledMap[INSIGHT_WORKSPACE_LEVEL_TAB]">
                        <QueryDropdown
                            v-if="
                                assetType(item) === 'Table' ||
                                assetType(item) === 'View' ||
                                assetType(item) === 'TablePartition' ||
                                assetType(item) === 'MaterialisedView'
                            "
                            @handleClick="goToInsights"
                        >
                            <template #button>
                                <a-button
                                    v-if="allowQuery(parentConnection)"
                                    class="flex items-center justify-center p-2"
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Query"
                                            class="mr-1 -mt-0.5 text-primary"
                                        />
                                        <span class="">Query </span>
                                    </div>
                                </a-button>
                            </template>
                        </QueryDropdown>

                        <a-button
                            v-else
                            block
                            class="flex items-center justify-center p-2"
                            @click="handleClick"
                        >
                            <div class="flex items-center">
                                <AtlanIcon
                                    icon="Query"
                                    class="mr-1 -mt-0.5 text-primary"
                                />
                                <span class="">Query </span>
                            </div>
                        </a-button>
                    </div>
                </a-tooltip>

                <a-button
                    v-if="
                        (isBiAsset(item) ||
                            isSaasAsset(item) ||
                            isObjectAsset(item)) &&
                        (webURL(item) || sourceURL(item))
                    "
                    block
                    @click="handleBIRedirect"
                    ><div class="flex items-center justify-center px-1">
                        <img :src="getConnectorImage(item)" class="h-4 mr-1" />
                        View in
                        {{ getConnectorLabel(item) }}
                    </div>
                </a-button>

                <ShareMenu :asset="item" :edit-permission="true">
                    <a-button
                        block
                        class="flex items-center justify-center p-2"
                    >
                        <AtlanIcon icon="Share" />
                    </a-button>
                </ShareMenu>
                <template v-if="!disableSlackAsk">
                    <SlackAskButton :asset="item" />
                </template>
                <!--  3 dot menus for GTC -->
                <AssetMenu
                    :delete-permission="
                        selectedAssetUpdatePermission(
                            item,
                            false,
                            'ENTITY_DELETE'
                        )
                    "
                    :asset="item"
                    :edit-permission="selectedAssetUpdatePermission(item)"
                    @edit="handleEdit"
                >
                    <a-button
                        v-if="isGTC(item)"
                        block
                        class="flex items-center justify-center p-2"
                    >
                        <AtlanIcon icon="KebabMenu" />
                    </a-button>
                </AssetMenu>
                <AssetMenu
                    :asset="item"
                    :edit-permission="selectedAssetUpdatePermission(item)"
                >
                    <a-button
                        v-if="
                            !isGTC(item) && selectedAssetUpdatePermission(item)
                        "
                        block
                        class="flex items-center justify-center p-2"
                    >
                        <AtlanIcon icon="KebabMenu" />
                    </a-button>
                </AssetMenu>
            </a-button-group>
        </div>
    </div>
    <AssetDrawer
        :show-drawer="drawerVisible"
        :qualifiedName="qfToFetch"
        @closeDrawer="handleCloseDrawer"
        :drawerActiveKey="drawerActiveKey"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        ref,
        watch,
    } from 'vue'
    import { useMagicKeys, useActiveElement, whenever, and } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AssetMenu from './assetMenu.vue'
    import ShareMenu from '@/common/assets/misc/shareMenu.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'
    import Tooltip from '@/common/ellipsis/index.vue'
    import QueryDropdown from '@/common/query/queryDropdown.vue'
    import Name from '@/glossary/common/name.vue'
    import SlackAskButton from '~/components/common/assets/misc/slackAskButton.vue'
    import AssetDrawer from '@common/assets/preview/drawer.vue'
    import { disableSlackAsk } from '~/composables/integrations/slack/useAskAQuestion'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useGTCPermissions, {
        fetchGlossaryPermission,
    } from '~/composables/glossary/useGTCPermissions'
    import {
        featureEnabledMap,
        INSIGHT_WORKSPACE_LEVEL_TAB,
    } from '~/composables/labs/labFeatureList'
    import useConnectionData from '~/composables/connection/useConnectionData'

    export default defineComponent({
        name: 'AssetHeader',
        components: {
            SlackAskButton,
            CertificateBadge,
            AtlanIcon,
            ShareMenu,
            AssetMenu,
            Tooltip,
            QueryDropdown,
            Name,
            AssetDrawer,
        },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const isEditMode = ref(false)
            const {
                title,
                getConnectorImage,
                getConnectorLabel,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                schemaName,
                tableName,
                viewName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getAssetQueryPath,
                isScrubbed,
                selectedAssetUpdatePermission,
                isGTC,
                isBiAsset,
                isSaasAsset,
                isObjectAsset,
                assetTypeLabel,
                webURL,
                sourceURL,
                isCustom,
                isPublished,
                dataStudioAssetType,
                assetPermission,
                databaseQualifiedName,
                schemaQualifiedName,
                allowQuery,
                connectionQualifiedName,
                assetState,
            } = useAssetInfo()

            const { getConnection } = useConnectionData()

            const parentConnection = ref(
                getConnection(connectionQualifiedName(item.value))
            )

            const entityTitle = ref(title(item.value))
            const router = useRouter()
            const drawerActiveKey = ref('Relations')

            const goToInsights = (openVQB) => {
                // router.push(getAssetQueryPath(asset))
                const URL =
                    `http://` +
                    window.location.host +
                    getAssetQueryPath(item.value) +
                    `&openVQB=${openVQB}`

                window.open(URL, '_blank')?.focus()
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: !openVQB ? 'sql_query' : 'vqb_query',
                    asset_type: item.value.typeName,
                })
            }

            const handleClick = () => {
                // router.push(getAssetQueryPath(asset))
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: 'sql_query',
                    asset_type: item.value.typeName,
                })
                const URL =
                    `http://` +
                    window.location.host +
                    getAssetQueryPath(item.value)

                window.open(URL, '_blank')?.focus()
            }

            const { Escape /* keys you want to monitor */ } = useMagicKeys()

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )

            const back = () => {
                if (window.history.length <= 1) {
                    router.push({ path: '/assets' })
                    return false
                }
                router.back()
            }

            const handleBIRedirect = () => {
                if (webURL(item.value)) {
                    window.open(webURL(item.value), '_blank').focus()
                } else {
                    window.open(sourceURL(item.value), '_blank').focus()
                }
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: 'open_in_source',
                    asset_type: item.value.typeName,
                })
            }

            /*  whenever(and(Escape, notUsingInput), (v) => {
                if (v) back()
            }) */
            const { checkAccess } = useAuth()
            const handleEdit = (asset) => {
                isEditMode.value = true
            }
            watch(item, () => {
                entityTitle.value = title(item.value)
            })

            const handleNameUpdate = (val) => {
                entityTitle.value = val
                console.log(val)
            }

            const drawerVisible = ref(false)
            const qfToFetch = ref('')

            const handleOpenDrawer = (qfName) => {
                drawerVisible.value = true
                qfToFetch.value = qfName
            }

            const handleCloseDrawer = () => {
                drawerVisible.value = false
                qfToFetch.value = ''
            }

            // * permissions for glossary to check against the glossary and not category or term,
            // * there providing the anchor (i.e glossary) to the fetchGlossaryPermission fn
            // ! should we use entity update and remove permission of the term or category itself?
            // const glossary = computed(() => {
            //     if (item.value.typeName === 'AtlasGlossary') return item.value
            //     if (
            //         ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'].includes(
            //             item.value.typeName
            //         )
            //     )
            //         return item.value.attributes.anchor
            //     return null
            // })
            // const {
            //     entityUpdatePermission: glossaryUpdatePermission,
            //     entityDeletePermission: glossaryDeletePermission,
            //     fetch,
            // } = fetchGlossaryPermission(glossary)
            //  ANCHOR
            // if (glossary.value) fetch()

            return {
                featureEnabledMap,
                INSIGHT_WORKSPACE_LEVEL_TAB,
                // glossary,
                // glossaryUpdatePermission,
                // glossaryDeletePermission,
                disableSlackAsk,
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
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                tableName,
                viewName,
                back,
                goToInsights,
                isScrubbed,
                selectedAssetUpdatePermission,
                assetTypeLabel,
                glossaryLabel,
                isGTC,
                map,
                checkAccess,
                isBiAsset,
                isSaasAsset,
                isObjectAsset,
                webURL,
                handleBIRedirect,
                handleClick,
                sourceURL,
                getConnectorLabel,
                isEditMode,
                handleEdit,
                isCustom,
                handleNameUpdate,
                entityTitle,
                isPublished,
                dataStudioAssetType,
                databaseQualifiedName,
                schemaQualifiedName,
                handleOpenDrawer,
                drawerVisible,
                qfToFetch,
                handleCloseDrawer,
                drawerActiveKey,
                allowQuery,
                parentConnection,
                assetState,
            }
        },
    })
</script>
