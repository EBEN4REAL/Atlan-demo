<script setup lang="ts">
    import { toRefs, defineProps, computed } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import CertificateBadge from '@common/badge/certificate/index.vue'

    const props = defineProps({
        log: {
            type: Object,
            default: () => {},
        },
        assetMetaMap: {
            type: Object,
            default: () => {},
        },
    })

    const {log, assetMetaMap} = toRefs(props)

    const {
        title: getTitle,
        getConnectorImage,
        databaseName: getDatabaseName,
        schemaName: getSchemaName,
        tableName: getTableName,
        viewName: getViewName,
        connectorName: getConnectorName,
        connectionName: getConnectionName,
        certificateStatus,
        certificateUpdatedAt,
        certificateUpdatedBy,
        assetTypeLabel,
        getAnchorName,
        isGTC,
    } = useAssetInfo()

    const assetURL = (asset) => ({
        path: `/assets/${asset.guid}`,
    })
    const imageUrl = (username: any) =>
        `${window.location.origin}/api/service/avatars/${username}`
    const { showUserPreview: openPreview, setUserUniqueAttribute } =
        useUserPreview()

    const handleUserPreview = (username: string) => {
        setUserUniqueAttribute(username, 'username')
        openPreview()
    }

    const resourceExists = computed(() =>
        log.value
        && log.value._source
        && log.value._source.resourceQF
        && assetMetaMap.value[log.value._source.resourceQF]
        && Object.keys(assetMetaMap.value[log.value._source.resourceQF]).length > 0
    )

    const connectorName = computed(() => resourceExists.value ? getConnectorName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const connectionName = computed(() => resourceExists.value ? getConnectionName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const connectorImage = computed(() => resourceExists.value ? getConnectorImage(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const typeOfResource = computed(() => {
        if (resourceExists.value) {
            return assetMetaMap.value[log.value._source.resourceQF].typeName ?? ""
        }
        return ""
    })
    const anchorName = computed(() => resourceExists.value ? getAnchorName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const assetLabel = computed(() => resourceExists.value ? assetTypeLabel(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const databaseName = computed(() => resourceExists.value ? getDatabaseName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const schemaName = computed(() => resourceExists.value ? getSchemaName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const tableName = computed(() => resourceExists.value ? getTableName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const viewName = computed(() => resourceExists.value ? getViewName(assetMetaMap.value[log.value._source.resourceQF]) : "")
    const title = computed(() => resourceExists.value ? getTitle(assetMetaMap.value[log.value._source.resourceQF]) : "")
</script>

<template>
    <div class="flex items-center h-full py-1">
        <div
            v-if="resourceExists"
            class="flex items-center justify-center"
        >
            <div class="items-center">
                <span class="text-primary uppercase font-bold">
                    {{ title }}
                    <CertificateBadge
                        v-if="
                            certificateStatus(
                                assetMetaMap[log._source.resourceQF]
                            )
                        "
                        :status="
                            certificateStatus(
                                assetMetaMap[log._source.resourceQF]
                            )
                        "
                        :username="
                            certificateUpdatedBy(
                                assetMetaMap[log._source.resourceQF]
                            )
                        "
                        :timestamp="
                            certificateUpdatedAt(
                                assetMetaMap[log._source.resourceQF]
                            )
                        "
                        class="mb-0.5"
                    />
                </span>
                <div class="parent-ellipsis-container">
                    <div class="flex flex-wrap items-center mt-1">
                        <div class="flex items-center mr-2">
                            <a-tooltip v-if="connectorName" placement="left">
                                <template #title>
                                    <span>{{ connectorName }}</span>
                                    <span v-if="connectionName">/{{ connectionName }}</span>
                                </template>
                                <img :src="connectorImage" class="h-4 mr-1 mb-0.5" />
                            </a-tooltip>
                            <div
                                v-else-if="typeOfResource.toLowerCase() === 'atlasglossarycategory'"
                                class="flex items-center text-xs text-gray-500 "
                            >
                                <AtlanIcon
                                    icon="Term"
                                    class="h-4 mb-0.5 mr-1"
                                />
                            </div>
                            <div
                                v-else-if="typeOfResource.toLowerCase() === 'atlasglossaryterm'"
                                class="flex items-center text-xs text-gray-500 "
                            >
                                <AtlanIcon
                                    icon="Term"
                                    class="h-4 mb-0.5 mr-1"
                                />
                            </div>
                            <div
                                v-else-if="isGTC(assetMetaMap[log._source.resourceQF])"
                                class="flex items-center text-xs text-gray-500 "
                            >
                                <AtlanIcon
                                    icon="Glossary"
                                    class="h-4 mr-1"
                                />
                                {{ anchorName }}
                            </div>
                            <div class="text-xs tracking-wider text-gray-500 uppercase">
                                {{ assetLabel || tyepOfResource }}
                            </div>
                            <div v-if="databaseName" class="flex items-center text-xs text-gray-500 ml-1">
                                <AtlanIcon
                                    icon="Database"
                                    class="h-4 mr-1"
                                />
                                {{ databaseName }}
                            </div>
                            <div v-if="schemaName" class="flex items-center text-xs text-gray-500 ml-1">
                                <AtlanIcon
                                    icon="Schema"
                                    class="h-4 mr-1"
                                />
                                {{ schemaName }}
                            </div>
                            <div v-if="tableName" class="flex items-center text-xs text-gray-500 ml-1">
                                <AtlanIcon
                                    icon="Table"
                                    class="h-4 mr-1"
                                />
                                {{ tableName }}
                            </div>
                            <div v-if="viewName" class="flex items-center text-xs text-gray-500 ml-1">
                                <AtlanIcon
                                    icon="View"
                                    class="h-4 mr-1"
                                />
                                {{ viewName }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>-</div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "AccessLogItem"
    }
</script>