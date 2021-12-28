<template>
    <div class="flex items-center w-full px-8 pt-3">
        <a-button class="px-1" @click="back">
            <atlan-icon
                icon="ArrowRight"
                class="w-auto h-4 text-gray-500 transform rotate-180"
            />
        </a-button>
        <div class="flex items-center justify-between w-full ml-3">
            <div class="flex flex-col">
                <div class="flex items-center mb-0 overflow-hidden">
                    <div
                        v-if="['column'].includes(item.typeName?.toLowerCase())"
                        class="flex mr-1"
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500 mb-0.5"
                        />
                    </div>
                    <div
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 truncate cursor-pointer text-mdoverflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </div>

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
                <div class="flex items-center mt-1 gap-x-3">
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
                                class="h-3 mr-1 mb-0.5"
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
                            {{ item.typeName }}
                        </div>
                        <div
                            v-else
                            class="flex items-center text-sm tracking-wider text-gray-500 uppercase"
                        >
                            <atlan-icon
                                v-if="isGTC(item)"
                                :icon="`${
                                    assetTypeLabel[item?.typeName]
                                        .charAt(0)
                                        .toUpperCase() +
                                    assetTypeLabel[item?.typeName].slice(1)
                                }`"
                                class="mr-1"
                            />
                            {{ assetTypeLabel[item?.typeName] }}
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
                                class="h-3 mr-1 mb-0.5"
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
                                <div class="tracking-tight text-gray-500">
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
                                <div class="tracking-tight text-gray-500">
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
                        ![
                            'AtlasGlossary',
                            'AtlasGlossaryTerm',
                            'AtlasGlossaryCategory',
                        ].includes(item?.typeName)
                    "
                    title="Query"
                >
                    <a-button
                        block
                        class="flex items-center justify-center"
                        @click="goToInsights(item)"
                    >
                        <AtlanIcon
                            icon="Query"
                            class="mr-1 mb-0.5"
                        /> </a-button
                ></a-tooltip>
                <ShareMenu :asset="item" :edit-permission="true">
                    <a-button block class="flex items-center justify-center">
                        <AtlanIcon icon="Share" class="mb-0.5" />
                    </a-button>
                </ShareMenu>
                <AssetMenu
                    :asset="item"
                    :edit-permission="selectedAssetUpdatePermission(item)"
                >
                    <a-button
                        v-if="
                            selectedAssetUpdatePermission(item) ||
                            checkAccess(
                                [
                                    map.DELETE_TERM,
                                    map.DELETE_GLOSSARY,
                                    map.DELETE_CATEGORY,
                                ],
                                'or'
                            )
                        "
                        block
                        class="flex items-center justify-center"
                    >
                        <AtlanIcon icon="KebabMenu" class="mr-1 mb-0.5" />
                    </a-button>
                </AssetMenu>
            </a-button-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue'
    import { useMagicKeys, useActiveElement, whenever, and } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AssetMenu from './assetMenu.vue'
    import ShareMenu from '@/common/assets/misc/shareMenu.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        name: 'AssetHeader',
        components: {
            CertificateBadge,
            AtlanIcon,
            ShareMenu,
            AssetMenu,
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
        setup() {
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
            } = useAssetInfo()

            const router = useRouter()

            const goToInsights = (asset) => {
                router.push(getAssetQueryPath(asset))
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

            whenever(and(Escape, notUsingInput), (v) => {
                if (v) back()
            })
            const { checkAccess } = useAuth()

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
                isGTC,
                map,
                checkAccess,
            }
        },
    })
</script>
