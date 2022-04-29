<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <ContextMenu :asset="item">
        <template #content>
            <div
                class="transition duration-100 hover:border-primary"
                :class="{
                    'border-primary  shadow border bg-primary-menu': isSelected,
                    'cursor-pointer': enableSidebarDrawer,
                    'opacity-80': isLoading,
                    'my-1.5 rounded-lg': page === 'assets',
                }"
                @click="handlePreview(item)"
            >
                <div
                    class="flex flex-col"
                    :class="[
                        !bulkSelectMode && isSelected
                            ? 'border-primary '
                            : 'border-transparent',
                        bulkSelectMode && isChecked ? 'bg-primary-menu' : '',
                    ]"
                >
                    <div class="flex items-start flex-1 px-3 py-3 asset-card">
                        <a-tooltip
                            placement="leftTop"
                            :title="
                                isScrubbed(item) && disableCheckboxForScrubbed
                                    ? `You don't have permission to link this asset to a term`
                                    : ''
                            "
                            :mouse-enter-delay="0.2"
                        >
                            <a-checkbox
                                v-if="showCheckBox"
                                :checked="isChecked"
                                :disabled="
                                    isScrubbed(item) &&
                                    disableCheckboxForScrubbed
                                "
                                class="ml-2 mr-3 opacity-60 hover:opacity-100"
                                :class="
                                    bulkSelectMode ? 'opacity-100' : 'opacity-0'
                                "
                                @click.stop
                                @change="
                                    (e) => $emit('listItem:check', e, item)
                                "
                        /></a-tooltip>
                        <div
                            class="flex flex-col flex-1"
                            :class="{ '': !isCompact }"
                        >
                            <div class="flex items-center justify-between">
                                <div
                                    class="flex items-center flex-grow overflow-hidden"
                                >
                                    <a-tooltip
                                        v-if="connectorName(item)"
                                        placement="left"
                                    >
                                        <template #title>
                                            <span
                                                >{{ connectorName(item) }}
                                            </span>
                                            <span v-if="connectionName(item)">{{
                                                `/${connectionName(item)}`
                                            }}</span>
                                        </template>
                                        <img
                                            :src="getConnectorImage(item)"
                                            class="h-4 mr-1 mb-0.5"
                                        />
                                    </a-tooltip>
                                    <div
                                        v-if="
                                            ['column'].includes(
                                                item.typeName?.toLowerCase()
                                            )
                                        "
                                        class="flex items-center mr-1"
                                    >
                                        <component
                                            :is="dataTypeCategoryImage(item)"
                                            class="h-4 mb-1 text-gray-500"
                                        />
                                    </div>

                                    <Tooltip
                                        :clamp-percentage="
                                            assetNameTruncatePercentage
                                        "
                                        :tooltip-text="`${title(item)}`"
                                        :route-to="getProfilePath(item)"
                                        :classes="
                                            isScrubbed(item)
                                                ? 'text-md mb-0  font-semibold cursor-pointer text-primary hover:underline opacity-80 tracking-wide'
                                                : 'text-md font-bold mb-0 cursor-pointer text-primary hover:underline tracking-wide '
                                        "
                                        :should-open-in-new-tab="
                                            openAssetProfileInNewTab
                                        "
                                        @click="(e) => e.stopPropagation()"
                                    />

                                    <CertificateBadge
                                        v-if="certificateStatus(item)"
                                        :status="certificateStatus(item)"
                                        :username="certificateUpdatedBy(item)"
                                        :timestamp="certificateUpdatedAt(item)"
                                        class="mb-1 ml-1"
                                    ></CertificateBadge>

                                    <a-tooltip placement="right"
                                        ><template #title
                                            >Limited Access</template
                                        >
                                        <AtlanIcon
                                            v-if="isScrubbed(item)"
                                            icon="Lock"
                                            class="h-4 mb-1 ml-2 text-gray-500"
                                        ></AtlanIcon
                                    ></a-tooltip>
                                </div>
                                <div class>
                                    <a-tooltip :title="announcementType(item)">
                                        <AtlanIcon
                                            :icon="icon"
                                            class="outline-none"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                            </div>

                            <div v-if="description(item)" class="flex mt-0.5">
                                <Tooltip
                                    v-if="
                                        preference?.display?.includes(
                                            'description'
                                        )
                                    "
                                    class="text-xs text-gray-500"
                                    :tooltip-text="description(item)"
                                    :rows="2"
                                />
                            </div>

                            <!-- Info bar -->
                            <div class="flex flex-wrap items-center mt-1.5">
                                <div class="flex items-center mr-2">
                                    <a-tooltip
                                        class="flex items-center"
                                        v-if="
                                            connectorName(item) &&
                                            ![
                                                'table',
                                                'view',
                                                'tablepartition',
                                                'materialisedview',
                                                'column',
                                                'schema',
                                                'query',
                                            ].includes(
                                                item.typeName?.toLowerCase()
                                            )
                                        "
                                        placement="left"
                                    >
                                        <template #title>
                                            <span
                                                >{{ connectorName(item) }}
                                            </span>
                                            <span v-if="connectionName(item)">{{
                                                `/${connectionName(item)}`
                                            }}</span>
                                        </template>
                                        <span
                                            class="mr-1 text-sm tracking-wider text-gray-500 capitalize"
                                            >{{ connectorName(item) }}
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
                                                item.typeName?.toLowerCase()
                                            )
                                        "
                                        icon="Category"
                                        class="h-4 mr-1"
                                    ></AtlanIcon>
                                    <AtlanIcon
                                        v-if="
                                            ['atlasglossaryterm'].includes(
                                                item.typeName?.toLowerCase()
                                            )
                                        "
                                        icon="Term"
                                        class="h-4 mr-1"
                                    ></AtlanIcon>
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
                                            ].includes(
                                                item.typeName?.toLowerCase()
                                            )
                                        "
                                        :icon="
                                            assetTypeImage(item) ||
                                            item?.typeName
                                        "
                                        class="self-center mr-1 text-gray-500 mb-0.5"
                                    ></AtlanIcon>

                                    <div class="text-sm text-gray-500">
                                        {{
                                            assetTypeLabel(item) ||
                                            item.typeName
                                        }}
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
                                    </div>
                                </div>

                                <div class="flex items-center">
                                    <div
                                        v-if="parentCategory(item)"
                                        class="flex items-center mr-3 text-sm text-gray-500 gap-x-1"
                                    >
                                        in
                                        <div
                                            v-if="
                                                [
                                                    'atlasglossarycategory',
                                                ].includes(
                                                    item.typeName?.toLowerCase()
                                                )
                                            "
                                            :key="parentCategory(item).guid"
                                            class="flex ml-0.5"
                                        >
                                            <AtlanIcon
                                                icon="Category"
                                                class="h-4 mt-0.5 mr-1"
                                            ></AtlanIcon>
                                            {{
                                                parentCategory(item).attributes
                                                    ?.name
                                            }}
                                        </div>
                                    </div>
                                    <div
                                        v-if="isGTC(item)"
                                        class="flex items-center text-sm text-gray-500"
                                    >
                                        <AtlanIcon
                                            icon="Glossary"
                                            class="h-4 mr-1"
                                        ></AtlanIcon>
                                        {{ getAnchorName(item) }}
                                    </div>
                                </div>

                                <div
                                    v-if="
                                        [
                                            'table',
                                            'view',
                                            'tablepartition',
                                            'materialisedview',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex mr-2 text-sm text-gray-500"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <span
                                            v-if="
                                                [
                                                    'table',
                                                    'tablepartition',
                                                ].includes(
                                                    item.typeName?.toLowerCase()
                                                )
                                            "
                                            class="mr-2 text-gray-500"
                                            ><span class="text-gray-500"
                                                >{{ rowCount(item, false) }}
                                            </span>
                                            rows</span
                                        >
                                        <template #title>
                                            <span
                                                v-if="
                                                    sizeBytes(item, false) &&
                                                    rowCount(item, false) !==
                                                        '~'
                                                "
                                                class="font-semibold"
                                                >{{ rowCount(item, true) }} rows
                                                ({{
                                                    sizeBytes(item, false)
                                                }})</span
                                            >
                                            <span v-else class="font-semibold"
                                                >Row count is not available for
                                                {{ connectorName(item) }}/{{
                                                    connectionName(item)
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                    <span class="text-gray-500">
                                        <span class="text-gray-500">{{
                                            columnCount(item, false)
                                        }}</span>
                                        columns</span
                                    >
                                </div>

                                <div
                                    v-if="
                                        ['database'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    class="flex mr-2 text-sm text-gray-500"
                                >
                                    <div class="flex items-center text-gray">
                                        <img
                                            :src="getConnectorImage(item)"
                                            class="h-4 mr-1 mb-0.5"
                                        />
                                        <span>{{
                                            `${connectorName(
                                                item
                                            )}/${connectionName(item)}`
                                        }}</span>
                                    </div>
                                </div>

                                <div
                                    v-if="
                                        item.typeName?.toLowerCase() ===
                                            'column' ||
                                        item.typeName?.toLowerCase() ===
                                            'salesforcefield'
                                    "
                                    class="flex items-center mr-2"
                                >
                                    <div class="flex items-center">
                                        <component
                                            :is="dataTypeCategoryImage(item)"
                                            class="h-4 text-gray-500 mr-0.5 mb-0.5"
                                        />
                                        <span
                                            class="text-sm tracking-wider text-gray-500 uppercase"
                                            >{{ dataType(item) }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="
                                            isPrimary(item) ||
                                            isDist(item) ||
                                            isPartition(item)
                                        "
                                        class="flex ml-1 text-gray-500"
                                    >
                                        <AtlanIcon
                                            icon="PrimaryKey"
                                            class="mb-0.5 text-yellow-500"
                                        ></AtlanIcon>

                                        <span
                                            v-if="isPrimary(item)"
                                            class="ml-1 text-sm text-gray-500"
                                            >Primary</span
                                        >
                                        <span
                                            v-if="isDist(item)"
                                            class="ml-1 text-sm text-gray-500"
                                            >Dist</span
                                        >
                                        <span
                                            v-if="isPartition(item)"
                                            class="ml-1 text-sm text-gray-500"
                                            >Partition</span
                                        >
                                    </div>
                                </div>

                                <div
                                    v-if="
                                        ['column'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    class="flex mr-2 text-sm text-gray-500 gap-x-2"
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
                                                v-if="
                                                    parentTable(item)
                                                        ?.attributes
                                                        ?.certificateStatus
                                                "
                                                :icon="
                                                    getEntityStatusIcon(
                                                        'Table',
                                                        parentTable(item)
                                                            ?.attributes
                                                            ?.certificateStatus
                                                    )
                                                "
                                                class="mr-1 mb-0.5"
                                            />
                                            <AtlanIcon
                                                v-else
                                                icon="TableGray"
                                                class="mr-1 mb-0.5"
                                            />
                                            <div
                                                class="tracking-tight text-gray-500"
                                            >
                                                {{ tableName(item) }}
                                            </div>
                                        </div>
                                        <template #title>
                                            <span
                                                >Table -
                                                {{ tableName(item) }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                    <a-tooltip
                                        v-if="viewName(item)"
                                        placement="bottomLeft"
                                    >
                                        <div
                                            v-if="viewName(item)"
                                            class="flex items-center text-gray-500"
                                        >
                                            <AtlanIcon
                                                v-if="
                                                    parentView(item)?.attributes
                                                        ?.certificateStatus
                                                "
                                                :icon="
                                                    getEntityStatusIcon(
                                                        'View',
                                                        parentView(item)
                                                            ?.attributes
                                                            ?.certificateStatus
                                                    )
                                                "
                                                class="mr-1 mb-0.5"
                                            />
                                            <AtlanIcon
                                                v-else
                                                icon="ViewGray"
                                                class="mr-1 mb-0.5"
                                            />
                                            <div
                                                class="tracking-tight text-gray-500"
                                            >
                                                {{ viewName(item) }}
                                            </div>
                                        </div>
                                        <template #title>
                                            <span
                                                >View -
                                                {{ viewName(item) }}</span
                                            >
                                        </template>
                                    </a-tooltip>
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
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip
                                        placement="bottomLeft"
                                        :mouseEnterDelay="0.3"
                                    >
                                        <div
                                            v-if="databaseName(item)"
                                            class="flex items-center text-gray-500"
                                        >
                                            <AtlanIcon
                                                icon="DatabaseGray"
                                                class="mr-1 mb-0.5"
                                            />
                                            <div
                                                class="tracking-tight text-gray-500"
                                            >
                                                {{ databaseName(item) }}
                                            </div>
                                        </div>
                                        <template #title>
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <div class="flex flex-col">
                                                    <div class="text-xs">
                                                        Database
                                                    </div>

                                                    {{ databaseName(item) }}
                                                </div>
                                                <div
                                                    v-if="page === 'assets'"
                                                    class="pl-3 font-bold"
                                                >
                                                    <a-button
                                                        shape="circle"
                                                        type="dashed"
                                                        @click="
                                                            handleBrowseAsset(
                                                                'databaseQualifiedName'
                                                            )
                                                        "
                                                        ><AtlanIcon
                                                            icon="Search"
                                                        ></AtlanIcon
                                                    ></a-button>
                                                </div>
                                            </div>
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
                                                class="tracking-tight text-gray-500"
                                            >
                                                {{ schemaName(item) }}
                                            </div>
                                        </div>
                                        <template #title>
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <div class="flex flex-col">
                                                    <div class="text-xs">
                                                        Schema
                                                    </div>

                                                    {{ schemaName(item) }}
                                                </div>
                                                <div
                                                    v-if="page === 'assets'"
                                                    class="pl-3 font-bold"
                                                >
                                                    <a-button
                                                        shape="circle"
                                                        type="dashed"
                                                        @click="
                                                            handleBrowseAsset(
                                                                'schemaQualifiedName'
                                                            )
                                                        "
                                                        ><AtlanIcon
                                                            icon="Search"
                                                        ></AtlanIcon
                                                    ></a-button>
                                                </div>
                                            </div>
                                        </template>
                                    </a-tooltip>
                                </div>

                                <div
                                    v-if="
                                        [
                                            'PowerBIDataset',
                                            'PowerBIDataflow',
                                            'PowerBIReport',
                                            'PowerBIDashboard',
                                        ].includes(item?.typeName)
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentWorkspace(item)
                                                    ?.attributes?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentWorkspace(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Workspace -
                                                {{
                                                    parentWorkspace(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['PowerBIPage'].includes(item?.typeName)
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentReport(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentReport(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Report -
                                                {{
                                                    parentReport(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['PowerBITile', 'LookerTile'].includes(
                                            item?.typeName
                                        )
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentDashboard(item)
                                                    ?.attributes?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentDashboard(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Dashboard -
                                                {{
                                                    parentDashboard(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['PowerBIDatasource'].includes(
                                            item?.typeName
                                        )
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentDataset(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentDataset(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Dataset -
                                                {{
                                                    parentDataset(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'TableauWorkbook',
                                            'TableauFlow',
                                            'TableauMetric',
                                            'TableauDatasource',
                                        ].includes(item?.typeName)
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentProject(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentProject(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Project -
                                                {{
                                                    parentProject(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'TableauDatasource',
                                            'TableauWorksheet',
                                            'TableauDashboard',
                                        ].includes(item?.typeName)
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentWorkbook(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentWorkbook(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Workbook -
                                                {{
                                                    parentWorkbook(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['TableauProject'].includes(
                                            item?.typeName
                                        )
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentSite(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentSite(item)?.attributes
                                                        ?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Site -
                                                {{
                                                    parentSite(item)?.attributes
                                                        ?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'TableauCalculatedField',
                                            'TableauDatasourceField',
                                        ].includes(item?.typeName)
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentDatasource(item)
                                                    ?.attributes?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentDatasource(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Datasource -
                                                {{
                                                    parentDatasource(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>

                                <div
                                    v-if="
                                        [
                                            'lookerdashboard',
                                            'lookerlook',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="item?.attributes?.folderName"
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    item?.attributes?.folderName
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Folder -
                                                {{
                                                    item?.attributes?.folderName
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'lookermodel',
                                            'lookerexplore',
                                            'lookerfield',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="item?.attributes?.projectName"
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    item?.attributes
                                                        ?.projectName
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Project -
                                                {{
                                                    item?.attributes
                                                        ?.projectName
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'lookerexplore',
                                            'lookerfield',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex flex-wrap ml-2 text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="item?.attributes?.modelName"
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                <AtlanIcon
                                                    icon="CaretRight"
                                                    class="w-auto h-4 mb-0.5 -mx-1"
                                                />
                                                {{
                                                    item?.attributes?.modelName
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Model -
                                                {{
                                                    item?.attributes?.modelName
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        [
                                            'lookerdashboard',
                                            'lookerlook',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex ml-2 text-sm text-gray-500"
                                >
                                    <span class="text-gray-500">
                                        <span
                                            class="tracking-tight text-gray-500"
                                            >{{ sourceViewCount(item) }}</span
                                        >
                                        views</span
                                    >
                                </div>
                                <div
                                    v-if="
                                        ['lookerfolder'].includes(
                                            item.typeName?.toLowerCase()
                                        ) && sourceChildCount(item) !== '0'
                                    "
                                    class="flex text-sm text-gray-500"
                                >
                                    <span class="text-gray-500">
                                        <span
                                            class="tracking-tight text-gray-500"
                                            >{{ sourceChildCount(item) }}</span
                                        >
                                        sub-folder{{
                                            sourceChildCount(item) === '1'
                                                ? ''
                                                : 's'
                                        }}</span
                                    >
                                </div>
                                <div
                                    v-if="
                                        [
                                            'salesforcedashboard',
                                            'salesforcereport',
                                            'salesforceobject',
                                        ].includes(item.typeName?.toLowerCase())
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentOrganization(item)
                                                    ?.attributes?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentOrganization(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Organization -
                                                {{
                                                    parentOrganization(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['salesforcefield'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                                >
                                    <a-tooltip placement="bottomLeft">
                                        <div
                                            v-if="
                                                parentObject(item)?.attributes
                                                    ?.name
                                            "
                                            class="flex items-center text-gray-500"
                                        >
                                            <span class="tracking-tight">
                                                in
                                                {{
                                                    parentObject(item)
                                                        ?.attributes?.name
                                                }}
                                            </span>
                                        </div>
                                        <template #title>
                                            <span
                                                >Parent Object -
                                                {{
                                                    parentObject(item)
                                                        ?.attributes?.name
                                                }}</span
                                            >
                                        </template>
                                    </a-tooltip>
                                </div>
                                <div
                                    v-if="
                                        ['salesforceobject'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    class="flex ml-2 text-sm text-gray-500"
                                >
                                    <span class="text-gray-500">
                                        <span
                                            class="font-semibold tracking-tight text-gray-500"
                                            >{{ fieldCount(item) }}</span
                                        >
                                        fields</span
                                    >
                                </div>
                                <div
                                    v-if="
                                        ['salesforcedashboard'].includes(
                                            item.typeName?.toLowerCase()
                                        ) && reportCount(item) !== '0'
                                    "
                                    class="flex ml-2 text-sm text-gray-500"
                                >
                                    <span class="text-gray-500">
                                        <span
                                            class="font-semibold tracking-tight text-gray-500"
                                            >{{ reportCount(item) }}</span
                                        >
                                        reports</span
                                    >
                                </div>
                            </div>

                            <div class="flex flex-wrap items-center gap-x-1">
                                <div
                                    v-if="
                                        clsfList?.length > 0 &&
                                        preference?.display?.includes(
                                            'classifications'
                                        )
                                    "
                                    class="flex flex-wrap mt-1 gap-x-1"
                                >
                                    <template
                                        v-for="classification in clsfList"
                                        :key="classification.guid"
                                    >
                                        <PopoverClassification
                                            :classification="classification"
                                            :entity-guid="item.guid"
                                            :mouse-enter-delay="mouseEnterDelay"
                                            @mouse-entered="enteredPill"
                                            @mouse-left="leftPill"
                                        >
                                            <ClassificationPill
                                                :name="classification.name"
                                                :display-name="
                                                    classification?.displayName
                                                "
                                                :is-propagated="
                                                    isPropagated(classification)
                                                "
                                                :allow-delete="false"
                                                :color="
                                                    classification.options?.color?.toLowerCase()
                                                "
                                                :created-by="
                                                    classification?.createdBy
                                                "
                                            ></ClassificationPill>
                                        </PopoverClassification>
                                    </template>
                                </div>
                                <div
                                    v-if="
                                        terms.length > 0 &&
                                        preference?.display?.includes('terms')
                                    "
                                    class="flex flex-wrap gap-1 mt-1"
                                >
                                    <template
                                        v-for="term in terms"
                                        :key="term.guid"
                                    >
                                        <div
                                            class="flex flex-wrap"
                                            v-if="
                                                term?.attributes?.__state &&
                                                term?.attributes?.__state !==
                                                    'DELETED'
                                            "
                                        >
                                            <TermPopover
                                                :term="term"
                                                :is-fetched-term-loading="
                                                    termLoading
                                                "
                                                :fetched-term="
                                                    getFetchedTerm(
                                                        term?.guid ??
                                                            term?.termGuid
                                                    )
                                                "
                                                :mouse-enter-delay="
                                                    termMouseEnterDelay
                                                "
                                                trigger="hover"
                                                @visible="
                                                    () => {
                                                        handleTermPopoverVisibility(
                                                            true,
                                                            term
                                                        )
                                                    }
                                                "
                                            >
                                                <TermPill
                                                    :term="term"
                                                    :allow-delete="false"
                                                    @mouseenter="
                                                        termEnteredPill
                                                    "
                                                    @mouseleave="termLeftPill"
                                                />
                                            </TermPopover>
                                        </div>
                                    </template>
                                </div>
                                <div
                                    v-if="categories(item)?.length > 0"
                                    class="flex items-center gap-x-2"
                                >
                                    <div
                                        v-for="cat in categories(item).slice(
                                            0,
                                            3
                                        )"
                                        :key="cat.guid"
                                        class="flex items-center px-2 py-1 mt-1 bg-white border rounded-full group hover:text-white hover:bg-primary"
                                        style="max-width: 200px"
                                    >
                                        <div class="w-4 mr-1">
                                            <AtlanIcon
                                                icon="Category"
                                                class="h-4 text-purple group-hover:text-white"
                                            ></AtlanIcon>
                                        </div>
                                        <Tooltip
                                            :tooltip-text="cat.attributes?.name"
                                            :route-to="`/glossary/${cat?.guid}`"
                                            classes="cursor-pointer   hover:text-white  group-hover:text-white"
                                            :should-open-in-new-tab="true"
                                            @click="(e) => e.stopPropagation()"
                                            placement="bottom"
                                        />
                                    </div>
                                </div>

                                <a-popover
                                    trigger="hover"
                                    placement="bottomLeft"
                                    v-if="
                                        categories(item)?.slice(3)?.length > 0
                                    "
                                    overlayClassName="max-w-xs"
                                >
                                    <template #content>
                                        <div
                                            class="flex flex-wrap items-center px-2 py-2 gap-x-2 gap-y-2"
                                        >
                                            <div
                                                v-for="cat in categories(
                                                    item
                                                )?.slice(3)"
                                                :key="cat.guid"
                                                class="flex items-center px-2 py-1 bg-white border rounded-full hover:text-white hover:bg-primary group"
                                                style="max-width: 200px"
                                            >
                                                <div class="w-4 mr-1">
                                                    <AtlanIcon
                                                        :icon="
                                                            getGlossaryStatusIcon(
                                                                'AtlasGlossaryCategory',
                                                                certificateStatus(
                                                                    cat
                                                                )
                                                            )
                                                        "
                                                        class="h-4 text-purple group-hover:text-white"
                                                    ></AtlanIcon>
                                                </div>
                                                <Tooltip
                                                    :tooltip-text="
                                                        cat.attributes?.name
                                                    "
                                                    :route-to="`/glossary/${cat?.guid}`"
                                                    classes="cursor-pointer   hover:text-white group-hover:text-white"
                                                    :should-open-in-new-tab="
                                                        true
                                                    "
                                                    @click="
                                                        (e) =>
                                                            e.stopPropagation()
                                                    "
                                                    placement="bottom"
                                                />
                                            </div>
                                        </div>
                                    </template>

                                    <div
                                        class="flex items-center px-2 py-1 mt-1 mr-3 text-sm bg-transparent cursor-pointer gap-x-1 text-primary"
                                    >
                                        +
                                        {{ categories(item)?.slice(3)?.length }}
                                        more
                                    </div>
                                </a-popover>
                            </div>
                        </div>
                        <slot name="cta"></slot>
                    </div>
                </div>
                <hr
                    class="mx-2 text-gray-100 bg-gray-200"
                    :class="
                        (bulkSelectMode && isChecked) ||
                        isSelected ||
                        page === 'assets'
                            ? 'invisible'
                            : ''
                    "
                />

                <AssetDrawer
                    :guid="selectedAssetDrawerGuid"
                    :show-drawer="showAssetSidebarDrawer"
                    @closeDrawer="handleCloseDrawer"
                    @update="handleListUpdate"
                />
            </div>
        </template>
    </ContextMenu>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed, PropType } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import ClassificationPill from '@/common/pills/classification.vue'
    import PopoverClassification from '@/common/popover/classification/index.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Truncate from '@/common/ellipsis/index.vue'
    import TermPopover from '@/common/popover/glossary/index.vue'
    import TermPill from '@/common/pills/term.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import ContextMenu from '../misc/contextmenu.vue'

    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            TermPill,
            CertificateBadge,
            ClassificationPill,
            PopoverClassification,
            AssetDrawer,
            Tooltip,
            Truncate,
            TermPopover,
            ContextMenu,
        },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
            selectedGuid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },

            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            // If the list items are selectable or not
            showCheckBox: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            // This is different than showCheckBox prop. List items are selectable but the check box should be visible only when atleast one item is selected/ on hover
            bulkSelectMode: {
                type: Boolean,
                required: false,
                default: false,
            },
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showThreeDotMenu: {
                type: Boolean,
                required: false,
                default: false,
            },
            noBg: {
                type: Boolean,
                required: false,
                default: false,
            },
            enableSidebarDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            itemIndex: {
                type: Number,
                required: true,
            },
            isCompact: {
                type: Boolean,
                default: () => false,
            },
            assetNameTruncatePercentage: {
                type: String,
                default: '95%',
                required: false,
            },
            openAssetProfileInNewTab: {
                type: Boolean,
                default: false,
            },
            disableCheckboxForScrubbed: {
                type: Boolean,
                default: false,
                required: false,
            },
            isLoading: {
                type: Boolean,
                default: false,
                required: false,
            },
            page: {
                type: String,
                required: false,
                default: 'notAssets',
            },
        },
        emits: [
            'listItem:check',
            'unlinkAsset',
            'preview',
            'updateDrawer',
            'browseAsset',
        ],
        setup(props, { emit }) {
            const {
                preference,
                selectedGuid,
                item,
                isChecked,
                showCheckBox,
                bulkSelectMode,
                enableSidebarDrawer,
                itemIndex,
                isLoading,
            } = toRefs(props)

            const { getEntityStatusIcon: getGlossaryStatusIcon } =
                useGlossaryData()
            const showAssetSidebarDrawer = ref(false)
            const selectedAssetDrawerGuid = ref('')

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
                description,
                assetTypeLabel,
                getAnchorName,
                isGTC,
                categories,
                parentCategory,
                classifications,
                getProfilePath,
                isUserDescription,
                isScrubbed,
                meaningRelationships,
                meanings,
                parentWorkspace,
                parentReport,
                parentDashboard,
                parentDataset,
                reportCount,
                dashboardCount,
                datasetCount,
                dataflowCount,
                tileCount,
                pageCount,
                parentProject,
                parentDatasource,
                parentWorkbook,
                parentSite,
                parentOrganization,
                parentObject,
                sourceViewCount,
                sourceChildCount,
                fieldCount,
                isCustom,
                announcementType,
                assetTypeImage,
                isPublished,
                databaseQualifiedName,
                schemaQualifiedName,
                connectionQualifiedName,
                parentTable,
                parentView,
            } = useAssetInfo()

            const icon = computed(() => {
                if (!announcementType(item.value)) {
                    return ''
                }
                switch (announcementType(item.value)?.toLowerCase()) {
                    case 'information':
                        return 'InformationAnnouncement'
                    case 'issue':
                        return 'IssuesAnnouncement'
                    case 'warning':
                        return 'WarningAnnouncement'
                    default:
                        return 'InformationAnnouncement'
                }
            })

            const handlePreview = (item: any) => {
                if (enableSidebarDrawer.value === true) {
                    showAssetSidebarDrawer.value = true
                    selectedAssetDrawerGuid.value = item?.guid
                } else {
                    emit('preview', item, itemIndex.value)
                }
            }

            const handleCloseDrawer = () => {
                selectedAssetDrawerGuid.value = ''
                showAssetSidebarDrawer.value = false
            }

            const handleListUpdate = (asset) => {
                emit('updateDrawer', asset)
            }

            const isSelected = computed(() => {
                return selectedGuid.value === item?.value?.guid
            })

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!item?.value?.guid) {
                    return false
                }
                return item?.value?.guid !== classification.entityGuid
            }

            const clsfList = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications(item.value),
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            const terms = computed(() => meanings(item.value))

            const termIcon = (term) => {
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'verified'
                ) {
                    return 'TermVerified'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'draft'
                ) {
                    return 'TermDraft'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'deprecated'
                ) {
                    return 'TermDeprecated'
                }
                return 'Term'
            }

            const handleBrowseAsset = (typeName: string) => {
                console.log(typeName, databaseQualifiedName(item.value))
                if (typeName === 'databaseQualifiedName') {
                    emit('browseAsset', {
                        typeName: 'Database',
                        connector: connectorName(item.value),

                        connectionQualifiedName: connectionQualifiedName(
                            item.value
                        ),
                        attributeName: typeName,
                        attributeValue: databaseQualifiedName(item.value),
                    })
                } else if (typeName === 'schemaQualifiedName') {
                    emit('browseAsset', {
                        typeName: 'Schema',
                        connector: connectorName(item.value),

                        connectionQualifiedName: connectionQualifiedName(
                            item.value
                        ),
                        attributeName: typeName,
                        attributeValue: schemaQualifiedName(item.value),
                    })
                }
            }

            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()

            const { mouseEnterDelay, enteredPill, leftPill } =
                useMouseEnterDelay()
            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()

            return {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                isSelected,
                title,
                getConnectorImage,
                termIcon,
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
                meaningRelationships,
                assetTypeLabel,
                description,
                handlePreview,
                isGTC,
                handleListUpdate,
                getAnchorName,
                categories,
                parentCategory,
                isPropagated,
                clsfList,
                classifications,
                getProfilePath,
                showAssetSidebarDrawer,
                selectedAssetDrawerGuid,
                handleCloseDrawer,
                isUserDescription,
                isScrubbed,
                parentWorkspace,
                parentReport,
                parentDashboard,
                parentDataset,
                reportCount,
                dashboardCount,
                datasetCount,
                dataflowCount,
                tileCount,
                pageCount,
                parentProject,
                parentDatasource,
                parentWorkbook,
                parentSite,
                parentOrganization,
                parentObject,
                sourceViewCount,
                sourceChildCount,
                terms,
                fieldCount,
                isCustom,
                getGlossaryStatusIcon,
                meanings,
                assetTypeImage,
                icon,
                announcementType,
                mouseEnterDelay,
                enteredPill,
                isPublished,
                databaseQualifiedName,
                connectionQualifiedName,
                handleBrowseAsset,
                schemaQualifiedName,
                leftPill,
                termMouseEnterDelay,
                termEnteredPill,
                termLeftPill,
                getEntityStatusIcon,
                parentTable,
                parentView,
            }
        },
    })
</script>
