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
    <div class="flex items-center py-1">
        <div
            v-if="resourceExists"
            class="flex items-center justify-center"
        >
            <div class="items-center">
                <div class="flex items-center">
                    <span class="uppercase font-bold text-primary truncate">
                        {{ title }}
                    </span>
                    <CertificateBadge
                        v-if="certificateStatus(assetMetaMap[log._source.resourceQF])"
                        :status="certificateStatus(assetMetaMap[log._source.resourceQF])"
                        :username="certificateUpdatedBy(assetMetaMap[log._source.resourceQF])"
                        :timestamp="certificateUpdatedBy(assetMetaMap[log._source.resourceQF])"
                        class="ml-1"
                    />
                </div>
                <div class="parent-ellipsis-container">
                    <div class="flex flex-wrap items-center mt-1">
                        <div class="flex items-center mr-2">
                            <a-tooltip v-if="connectorName" placement="left">
                                <template #title>
                                    <span>{{ connectorName }}</span>
                                    <span v-if="connectionName">/{{ connectionName }}</span>
                                </template>
                                <img :src="connectorImage" class="h-3 mr-1 mb-0.5" />
                            </a-tooltip>
                            <AtlanIcon
                                v-if="typeOfResource.toLowerCase() === 'atlasglossarycategory'"
                                icon="Category"
                                class="h-4 mb-0.5 mr-1"
                            />
                            <AtlanIcon
                                v-else-if="typeOfResource.toLowerCase() === 'atlasglossaryterm'"
                                icon="Term"
                                class="h-4 mb-0.5 mr-1"
                            />
                            <div
                                v-else-if="isGTC(assetMetaMap[log._source.resourceQF])"
                                class="flex items-center text-sm text-gray-500 "
                            >
                                <AtlanIcon
                                    icon="Glossary"
                                    class="h-4 mr-1"
                                />
                                {{ anchorName }}
                            </div>
                            <div class="text-xs tracking-wider text-gray-500 uppercase">
                                {{ assetLabel || typeOfResource }}
                            </div>
                            <div
                                v-if="
                                    [
                                        'database',
                                        'table',
                                        'view',
                                        'tablepartition',
                                        'materialisedview',
                                        'column',
                                        'schema',
                                    ].includes(typeOfResource.toLowerCase())
                                "
                                class="flex text-sm text-gray-500"
                            >
                                <a-tooltip placement="bottomLeft">
                                    <div
                                        v-if="databaseName"
                                        class="flex items-center text-xs text-gray-500"
                                    >
                                        <span class="mx-2">&bull;</span>
                                        <div class="tracking-tight text-gray-500">{{ databaseName }}</div>
                                    </div>
                                    <template #title>
                                        <span>Database - {{ databaseName }}</span>
                                    </template>
                                </a-tooltip>
                                <a-tooltip placement="bottomLeft">
                                    <div
                                        v-if="schemaName"
                                        class="flex items-center text-xs text-gray-500 "
                                    >
                                        <div class="tracking-tight text-gray-500">
                                            <span class="mx-1">/</span>
                                            <span v-if="tableName">&#8230;</span>
                                            <span v-else>{{ schemaName }}</span>
                                        </div>
                                    </div>
                                    <template #title>
                                        <span>Schema - {{ schemaName }}</span>
                                    </template>
                                </a-tooltip>
                                <div
                                    v-if="['column'].includes(typeOfResource.toLowerCase())"
                                    class="flex mr-2 text-sm text-gray-500  gap-x-2"
                                >
                                    <a-tooltip
                                        v-if="tableName"
                                        placement="bottomLeft"
                                    >
                                        <div
                                            v-if="tableName"
                                            class="flex items-center text-xs text-gray-500"
                                        >
                                            <span class="mx-1">/</span>
                                            <div class="flex-1 min-w-0 text-gray-500">
                                                <span v-if="viewName">&#8230;</span>
                                                <div v-else class="truncate">{{ tableName }}</div>
                                            </div>
                                        </div>
                                        <template #title>
                                            <span>Table - {{ tableName }}</span>
                                        </template>
                                    </a-tooltip>
                                    <a-tooltip
                                        v-if="viewName"
                                        placement="bottomLeft"
                                    >
                                        <div
                                            v-if="viewName"
                                            class="flex-1 items-center text-xs text-gray-500"
                                        >
                                            <span class="mx-1">/</span>
                                            <div class="text-gray-500 truncate min-w-0">
                                                {{ viewName }}
                                            </div>
                                        </div>
                                        <template #title>
                                            <span>View - {{ viewName }}</span>
                                        </template>
                                    </a-tooltip>
                                </div>
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