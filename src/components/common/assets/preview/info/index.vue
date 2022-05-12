<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Overview</span>
            </span>
            <span
                v-if="isLoading || isLoadingClassification"
                class="flex items-center"
            >
                <a-spin
                    size="small"
                    icon="Loader"
                    class="w-auto h-4 mr-1 animate-spin"
                ></a-spin>
                Saving</span
            >
        </div>
        <div class="flex flex-col pb-4 overflow-y-auto p gap-y-4">
            <AnnouncementWidget
                class="mx-5"
                :selected-asset="selectedAsset"
            ></AnnouncementWidget>

            <div
                v-if="
                    isGTC(selectedAsset) ||
                    selectedAsset.typeName === 'Connection' ||
                    selectedAsset.typeName === 'Process' ||
                    selectedAsset.typeName === 'Query' ||
                    selectedAsset.typeName === 'Collection'
                "
                class="flex flex-col"
            >
                <div class="px-5 mb-1 text-sm text-gray-500">Name</div>

                <Name
                    ref="nameRef"
                    v-model="localName"
                    :selected-asset="selectedAsset"
                    class="mx-4"
                    :edit-permission="editPermission"
                    @change="handleChangeName"
                />
            </div>

            <Connection
                v-if="selectedAsset.typeName === 'Connection'"
                v-model="localSQLQuery"
                :selected-asset="selectedAsset"
                :edit-permission="editPermission"
                @change="handleSQLQueryUpdate"
            ></Connection>

            <div
                v-if="webURL(selectedAsset) || sourceURL(selectedAsset)"
                class="px-5"
            >
                <a-button
                    block
                    class="flex items-center justify-between px-2 shadow-none"
                    @click="handlePreviewClick"
                    ><div class="flex items-center">
                        <img
                            :src="getConnectorImage(selectedAsset)"
                            class="h-4 mr-1"
                        />View in
                        {{ getConnectorLabel(selectedAsset) }}
                    </div>
                    <AtlanIcon icon="External" />
                </a-button>
            </div>

            <div
                v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
                class="flex flex-wrap items-center w-full px-5 gap-x-8"
            >
                <SQL
                    v-if="
                        (selectedAsset.typeName == 'View' ||
                            selectedAsset.typeName == 'MaterialisedView') &&
                        definition(selectedAsset) &&
                        definition(selectedAsset) !== '[]'
                    "
                    :sql="definition(selectedAsset)"
                >
                    <div class="flex flex-col text-sm cursor-pointer">
                        <span class="mb-1 text-sm text-gray-500"
                            >Definition</span
                        >
                        <span class="font-semibold text-primary">SQL</span>
                    </div>
                    <template #action>
                        <a-button
                            size="small"
                            block
                            @click="switchTab(selectedAsset, 'Lineage')"
                            >View Lineage</a-button
                        >
                    </template>
                </SQL>
                <!-- <RowInfoHoverCard
                v-if="
                    selectedAsset.typeName == 'Table' ||
                    selectedAsset.typeName == 'TablePartition'
                "
                :image="getConnectorImage(selectedAsset)"
                :row-count="rowCount(selectedAsset)"
                :size-bytes="sizeBytes(selectedAsset)"
                :source-updated-at="sourceUpdatedAt(selectedAsset)"
                :source-updated-at-raw="sourceUpdatedAt(selectedAsset, true)"
                :source-created-at="sourceCreatedAt(selectedAsset)"
                :source-created-at-raw="sourceCreatedAt(selectedAsset, true)"
            > -->

                <div
                    v-if="
                        rowCount(selectedAsset, true) !== '0' &&
                        rowCount(selectedAsset, true)
                    "
                    class="flex flex-col text-sm"
                    :class="
                        isProfile || connectorName(selectedAsset) === 'glue'
                            ? ''
                            : 'cursor-pointer'
                    "
                    @click="showSampleDataModal"
                >
                    <span class="mb-1 text-sm text-gray-500">Rows</span>
                    <span
                        :class="
                            isProfile || connectorName(selectedAsset) === 'glue'
                                ? 'text-gray-700'
                                : 'text-primary font-semibold'
                        "
                        >{{ rowCount(selectedAsset, true) }}</span
                    >
                </div>
                <!-- </RowInfoHoverCard> -->
                <div
                    class="flex flex-col text-sm cursor-pointer"
                    @click="switchTab(selectedAsset, 'Columns')"
                >
                    <span class="mb-1 text-sm text-gray-500">Columns</span>
                    <span class="font-semibold text-primary">{{
                        columnCount(selectedAsset)
                    }}</span>
                </div>
                <div
                    v-if="sizeBytes(selectedAsset) !== '0'"
                    class="flex flex-col text-sm cursor-pointer"
                >
                    <span class="mb-1 text-sm text-gray-500">Size</span>
                    <span class="text-gray-700">{{
                        sizeBytes(selectedAsset, false)
                    }}</span>
                </div>
            </div>

            <div
                v-if="
                    selectedAsset.typeName?.toLowerCase() === 'column' ||
                    selectedAsset.typeName?.toLowerCase() === 'salesforcefield'
                "
                class="flex flex-col px-5 text-sm gap-y-4"
            >
                <div class="flex flex-col">
                    <span class="mb-1 text-sm text-gray-500">Data Type</span>

                    <div class="flex items-center text-gray-700 gap-x-1">
                        <div class="flex items-center">
                            <component
                                :is="dataTypeCategoryImage(selectedAsset)"
                                class="h-4 mr-0.5 mb-0.5"
                            />
                            <span class="mr-1 text-sm uppercase">{{
                                dataType(selectedAsset)
                            }}</span>
                        </div>

                        <ColumnKeys
                            :is-primary="isPrimary(selectedAsset)"
                            :is-foreign="isForeign(selectedAsset)"
                            :is-partition="isPartition(selectedAsset)"
                            :is-sort="isSort(selectedAsset)"
                            :is-indexed="isIndexed(selectedAsset)"
                        />
                    </div>
                </div>
                <div v-if="tableName(selectedAsset)">
                    <div class="mb-1 text-sm text-gray-500"></div>

                    <div class="flex items-center mb-1 text-gray-500">
                        <span>Table</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        tableName(selectedAsset),
                                        'Table Name'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <div class="text-sm text-gray-700 break-all">
                        <AtlanIcon
                            v-if="
                                parentTable(selectedAsset)?.attributes
                                    ?.certificateStatus
                            "
                            :icon="
                                getEntityStatusIcon(
                                    'Table',
                                    parentTable(selectedAsset)?.attributes
                                        ?.certificateStatus
                                )
                            "
                            class="w-auto h-4 mb-0.5 mr-1"
                        />
                        <AtlanIcon
                            v-else
                            icon="TableGray"
                            class="w-auto h-4 mb-0.5 mr-1"
                        />
                        <router-link
                            class="text-gray-700 border-b border-gray-500 border-dashed cursor-pointer hover:text-primary"
                            :to="`/assets/${selectedAsset?.attributes?.table?.guid}`"
                            target="_blank"
                        >
                            {{ tableName(selectedAsset) }}</router-link
                        >
                    </div>
                </div>
                <div v-if="viewName(selectedAsset)">
                    <div class="flex items-center mb-1 text-gray-500">
                        <span>View</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        viewName(selectedAsset),
                                        'View Name'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <div class="text-sm text-gray-700">
                        <AtlanIcon
                            v-if="
                                parentView(selectedAsset)?.attributes
                                    ?.certificateStatus
                            "
                            :icon="
                                getEntityStatusIcon(
                                    'View',
                                    parentView(selectedAsset)?.attributes
                                        ?.certificateStatus
                                )
                            "
                            class="w-auto h-4 mb-0.5 break-all mr-1"
                        />
                        <AtlanIcon
                            v-else
                            icon="ViewGray"
                            class="w-auto h-4 mb-0.5 mr-1"
                        />
                        <router-link
                            class="text-gray-700 border-b border-gray-500 border-dashed cursor-pointer hover:text-primary"
                            :to="`/assets/${selectedAsset?.attributes?.view?.guid}`"
                            target="_blank"
                            >{{ viewName(selectedAsset) }}</router-link
                        >
                    </div>
                </div>
            </div>

            <div
                v-if="
                    ['SalesforceObject', 'SalesforceField'].includes(
                        selectedAsset?.typeName
                    ) && apiName(selectedAsset) !== ''
                "
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500">API Name</span>
                    <span class="text-gray-700">{{
                        apiName(selectedAsset)
                    }}</span>
                </div>
            </div>

            <div
                v-if="
                    ['SalesforceField', 'TableauCalculatedField'].includes(
                        selectedAsset?.typeName
                    ) &&
                    formula(selectedAsset) &&
                    formula(selectedAsset) !== ''
                "
                class="flex px-5"
            >
                <div class="flex flex-col w-full text-sm">
                    <span class="mb-1 text-sm text-gray-500">Formula</span>
                    <DetailsContainer
                        :text="formula(selectedAsset)"
                        class="rounded-lg"
                    />
                </div>
            </div>

            <div
                v-if="
                    [
                        'SalesforceOrganization',
                        'SalesforceReport',
                        'SalesforceDashboard',
                    ].includes(selectedAsset?.typeName)
                "
                class="flex flex-col px-5 text-sm"
            >
                <div class="flex items-center mb-1 text-gray-500">
                    <span>Source ID</span>
                    <a-tooltip title="Copy">
                        <div
                            v-if="sourceId(selectedAsset) !== '-'"
                            @click="
                                handleCopyValue(
                                    sourceId(selectedAsset),
                                    'Source ID'
                                )
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>

                <span class="text-gray-700">{{ sourceId(selectedAsset) }}</span>
            </div>

            <div
                v-if="
                    ['SalesforceDashboard'].includes(selectedAsset?.typeName) &&
                    selectedAsset?.attributes?.dashboardType
                "
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500"
                        >Dashboard Type</span
                    >
                    <span class="text-gray-700">{{
                        selectedAsset?.attributes?.dashboardType
                    }}</span>
                </div>
            </div>
            <div
                v-if="
                    ['SalesforceReport'].includes(selectedAsset?.typeName) &&
                    selectedAsset?.attributes?.reportType
                "
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <div class="mb-1 text-sm text-gray-500">Report Type</div>
                    <div class="text-gray-700">
                        {{ selectedAsset?.attributes?.reportType?.label }}
                    </div>
                </div>
            </div>

            <div
                v-if="
                    ((isBiAsset(selectedAsset) ||
                        isSaasAsset(selectedAsset) ||
                        isObjectAsset(selectedAsset)) &&
                        ![
                            'PowerBIWorkspace',
                            'TableauSite',
                            'LookerFolder',
                            'LookerProject',
                            'LookerQuery',
                            'SalesforceOrganization',
                            'S3Bucket',
                        ].includes(selectedAsset?.typeName)) ||
                    ['Schema', 'ColumnProcess', 'BIProcess'].includes(
                        selectedAsset?.typeName
                    )
                "
                class="flex px-5"
            >
                <ParentContext :asset="selectedAsset" />
            </div>

            <div
                v-if="['SalesforceObject'].includes(selectedAsset?.typeName)"
                class="flex px-5"
            >
                <FieldCount :asset="selectedAsset" />
            </div>

            <div
                v-if="
                    ['SalesforceReport'].includes(selectedAsset?.typeName) &&
                    detailColumns(selectedAsset).length > 0
                "
                class="flex px-5"
            >
                <div class="flex flex-col w-full text-sm">
                    <span class="mb-1 text-sm text-gray-500"
                        >Detail Columns</span
                    >
                    <DetailsContainer
                        :array="detailColumns(selectedAsset)"
                        class="rounded-lg"
                    />
                </div>
            </div>

            <div
                v-if="
                    ['SalesforceField'].includes(selectedAsset?.typeName) &&
                    picklistValues(selectedAsset).length > 0
                "
                class="flex px-5"
            >
                <div class="flex flex-col w-full text-sm">
                    <span class="mb-1 text-sm text-gray-500"
                        >Picklist Values</span
                    >
                    <DetailsContainer
                        :array="picklistValues(selectedAsset)"
                        class="rounded-lg"
                    />
                </div>
            </div>

            <div
                v-if="
                    ['LookerDashboard', 'LookerLook'].includes(
                        selectedAsset.typeName
                    )
                "
                class="flex px-5"
            >
                <SourceViewCount :asset="selectedAsset" />
            </div>
            <div
                v-if="['LookerFolder'].includes(selectedAsset.typeName)"
                class="flex px-5"
            >
                <SubFolderCount :asset="selectedAsset" />
            </div>

            <div v-if="sourceOwners(selectedAsset)" class="flex px-5">
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500">Source Owner</span>
                    <span class="text-gray-700">{{
                        sourceOwners(selectedAsset)
                    }}</span>
                </div>
            </div>

            <div v-if="selectedAsset?.attributes?.noteText" class="flex px-5">
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500">Note</span>
                    <span class="text-gray-700">{{
                        selectedAsset?.attributes?.noteText
                    }}</span>
                </div>
            </div>

            <div
                v-if="selectedAsset?.attributes?.subtitleText"
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500"
                        >Subtitle Text</span
                    >
                    <span class="text-gray-700">{{
                        selectedAsset?.attributes?.subtitleText
                    }}</span>
                </div>
            </div>

            <div
                v-if="selectedAsset?.attributes?.inlineHelpText"
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-sm text-gray-500">Help Text</span>
                    <span class="text-gray-700">{{
                        selectedAsset?.attributes?.inlineHelpText
                    }}</span>
                </div>
            </div>

            <div
                v-if="
                    selectedAsset?.typeName === 'LookerQuery' &&
                    fieldsLookerQuery(selectedAsset).length > 0
                "
                class="flex px-5"
            >
                <div class="flex flex-col w-full text-sm">
                    <span class="mb-1 text-sm text-gray-500">Fields</span>

                    <DetailsContainer
                        :array="fieldsLookerQuery(selectedAsset)"
                        class="rounded-lg"
                    />
                </div>
            </div>

            <div
                v-if="['S3Object', 'S3Bucket'].includes(selectedAsset.typeName)"
                class="flex flex-col px-5 text-sm"
            >
                <div class="flex items-center mb-1 text-gray-500">
                    <span>ARN</span>
                    <a-tooltip title="Copy">
                        <div
                            @click="
                                handleCopyValue(awsArn(selectedAsset), 'ARN')
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700">{{ awsArn(selectedAsset) }}</span>
            </div>

            <div
                v-if="['S3Bucket'].includes(selectedAsset.typeName)"
                @click="switchTab(selectedAsset, 'Objects')"
                class="flex flex-col px-5 text-sm cursor-pointer"
            >
                <span class="mb-1 text-sm text-gray-500">Objects</span>
                <span class="font-semibold text-primary">{{
                    s3ObjectCount(selectedAsset)
                }}</span>
            </div>

            <div
                v-if="['S3Object'].includes(selectedAsset.typeName)"
                class="flex flex-col px-5 text-sm"
            >
                <span class="mb-1 text-gray-500">Size</span>

                <span class="text-gray-700"
                    >{{ s3ObjectSize(selectedAsset) }}B</span
                >
            </div>

            <div
                v-if="
                    isSelectedAssetHaveRowsAndColumns(selectedAsset) &&
                    externalLocation(selectedAsset)
                "
                class="flex px-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-2 text-sm text-gray-500"
                        >External Location</span
                    >
                    <span class="font-semibold break-all">{{
                        externalLocation(selectedAsset)
                    }}</span>
                </div>
            </div>

            <div
                v-if="
                    isSelectedAssetHaveRowsAndColumns(selectedAsset) &&
                    externalLocation(selectedAsset)
                "
                class="flex px-5"
            >
                <div
                    v-if="externalLocationFormat(selectedAsset)"
                    class="flex flex-col text-sm cursor-pointer"
                >
                    <span class="mb-2 text-sm text-gray-500"
                        >External Location Format</span
                    >
                    <span class="text-gray-700 break-all">{{
                        externalLocationFormat(selectedAsset)
                    }}</span>
                </div>
            </div>

            <div
                v-if="selectedAsset?.typeName === 'Query'"
                class="flex flex-col px-5 text-sm"
            >
                <div class="mb-1 text-sm text-gray-500">Collection</div>

                <a-tooltip placement="left" color="#363636">
                    <template #title>
                        {{
                            !collectionData?.hasCollectionReadPermission &&
                            !collectionData?.hasCollectionWritePermission &&
                            !collectionData?.isCollectionCreatedByCurrentUser
                                ? `You don't have access to this collection`
                                : `View collection`
                        }}
                    </template>

                    <a-button
                        block
                        class="flex items-center px-2 shadow-none"
                        :class="
                            !collectionData?.hasCollectionReadPermission &&
                            !collectionData?.hasCollectionWritePermission &&
                            !collectionData?.isCollectionCreatedByCurrentUser
                                ? 'disabledButton'
                                : ''
                        "
                        :disabled="
                            !collectionData?.hasCollectionReadPermission &&
                            !collectionData?.hasCollectionWritePermission &&
                            !collectionData?.isCollectionCreatedByCurrentUser
                        "
                        @click="handleCollectionClick"
                    >
                        <div class="flex items-center">
                            <!-- <AtlanIcon
                            icon="CollectionIconSmall"
                            class="mr-1 mb-0.5"
                        /> -->

                            <span class="w-5 h-5 mr-1 -mt-1 text-lg">{{
                                collectionData?.collectionInfo?.attributes?.icon
                                    ? collectionData?.collectionInfo?.attributes
                                          ?.icon
                                    : '🗃'
                            }}</span>

                            <span
                                class="text-left truncate"
                                style="width: 270px"
                            >
                                {{
                                    collectionData?.collectionInfo?.displayText
                                }}
                            </span>
                        </div>
                        <AtlanIcon
                            v-if="
                                !collectionData?.hasCollectionReadPermission &&
                                !collectionData?.hasCollectionWritePermission &&
                                !collectionData?.isCollectionCreatedByCurrentUser
                            "
                            icon="Lock"
                        />
                        <AtlanIcon v-else icon="External" />
                    </a-button>
                </a-tooltip>
            </div>

            <div
                v-if="
                    selectedAsset?.guid &&
                    selectedAsset?.typeName === 'Query' &&
                    attributes(selectedAsset)?.parent?.typeName === 'Folder'
                "
                class="flex flex-col px-5 text-sm"
            >
                <div class="mb-1 text-sm text-gray-500">
                    {{ attributes(selectedAsset)?.parent?.typeName }}
                </div>
                <div class="text-sm text-gray-700">
                    {{ attributes(selectedAsset)?.parent?.attributes?.name }}
                </div>
            </div>

            <div class="flex flex-col">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span>Description</span>
                    <a-tooltip title="User Description" placement="left">
                        <AtlanIcon
                            v-if="isUserDescription(selectedAsset)"
                            icon="User"
                            class="h-3 mr-1"
                        ></AtlanIcon
                    ></a-tooltip>
                </div>

                <Description
                    ref="descriptionRef"
                    v-model="localDescription"
                    class="mx-4"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    @change="handleChangeDescription"
                />

                <transition
                    v-if="
                        similarList('description').length > 0 &&
                        !localDescription
                    "
                    name="fade"
                >
                    <Suggestion
                        class="mx-4 mt-2"
                        @apply="handleApplySuggestion"
                        :button-between="false"
                        :asset="selectedAsset"
                        :edit-permission="editPermission"
                        :list="similarList('description')"
                    ></Suggestion>
                </transition>
            </div>
            <div v-if="isProcess(selectedAsset)" class="flex flex-col text-sm">
                <span class="px-5 mb-1 text-gray-500">Query</span>
                <SQLSnippet
                    v-if="getProcessSQL(selectedAsset)?.length"
                    class="mx-4 rounded-lg"
                    :text="getProcessSQL(selectedAsset)"
                    background="bg-primary-light"
                />
                <span v-else class="px-5 text-gray-600"
                    >No SQL data available</span
                >
            </div>
            <div v-if="selectedAsset?.typeName === 'LookerQuery'">
                <SQLSnippet
                    class="mx-4 rounded-lg"
                    :text="selectedAsset?.attributes?.sourceDefinition"
                    background="bg-primary-light"
                />
            </div>

            <div
                v-if="
                    selectedAsset.guid &&
                    selectedAsset.typeName === 'Query' &&
                    readPermission
                "
            >
                <SavedQuery :selected-asset="selectedAsset" class="mx-4" />
            </div>
            <div
                v-if="
                    selectedAsset.guid &&
                    !['Column', 'Connection', 'Collection'].includes(
                        selectedAsset.typeName
                    )
                "
                class="flex flex-col"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span> Owners</span>
                </div>

                <Owners
                    v-model="localOwners"
                    class="px-5"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    :show-shortcut="true"
                    @change="handleOwnersChange"
                />
            </div>

            <div
                v-if="
                    selectedAsset.guid &&
                    ['Collection'].includes(selectedAsset.typeName)
                "
                class="flex flex-col px-5"
            >
                <div class="mb-1 text-sm text-gray-500">Created by</div>
                <div class="flex">
                    <PopOverUser :item="createdBy(selectedAsset)">
                        <UserPill
                            :username="createdBy(selectedAsset)"
                            @click="handleClickUser(createdBy(selectedAsset))"
                        ></UserPill
                    ></PopOverUser>
                </div>
            </div>

            <div
                v-if="
                    selectedAsset.guid && selectedAsset.typeName == 'Connection'
                "
                class="flex flex-col"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span>Admins</span>
                </div>

                <Admins
                    v-model="localAdmins"
                    class="px-5"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    @change="handleChangeAdmins"
                />
            </div>

            <div
                v-if="
                    selectedAsset.guid &&
                    selectedAsset.typeName == 'Collection' &&
                    (localAdmins?.adminUsers?.length > 0 ||
                        localAdmins?.adminGroups?.length > 0)
                "
                class="flex flex-col"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span>Editors</span>
                </div>

                <Admins
                    v-model="localAdmins"
                    class="px-5"
                    :selected-asset="selectedAsset"
                    :edit-permission="false"
                    :showAddButton="false"
                    @change="handleChangeAdmins"
                />
            </div>

            <div
                v-if="
                    selectedAsset.guid &&
                    selectedAsset.typeName == 'Collection' &&
                    (localViewers?.viewerUsers?.length > 0 ||
                        localViewers?.viewerGroups?.length > 0)
                "
                class="flex flex-col"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span>Viewers</span>
                </div>

                <Viewers
                    v-model="localViewers"
                    class="px-5"
                    :selected-asset="selectedAsset"
                    :edit-permission="false"
                    :showAddButton="false"
                    @change="handleChangeViewers"
                />
            </div>

            <div
                v-if="
                    ![
                        'AtlasGlossary',
                        'AtlasGlossaryCategory',
                        'Connection',
                        'Collection',
                    ].includes(selectedAsset.typeName)
                "
                class="flex flex-col"
            >
                <div class="px-5 mb-1 text-sm text-gray-500">
                    <span> Classification</span>
                </div>

                <Classification
                    v-model="localClassifications"
                    :guid="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :edit-permission="
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            isDrawer,
                            'ENTITY_ADD_CLASSIFICATION'
                        )
                    "
                    :allow-delete="
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            isDrawer,
                            'ENTITY_REMOVE_CLASSIFICATION'
                        )
                    "
                    class="px-5"
                    :show-shortcut="true"
                    @change="handleClassificationChange"
                >
                </Classification>
            </div>

            <div
                v-if="
                    ![
                        'AtlasGlossary',
                        'AtlasGlossaryTerm',
                        'AtlasGlossaryCategory',
                        'Connection',
                    ].includes(selectedAsset.typeName)
                "
                class="flex flex-col"
            >
                <p class="px-5 mb-1 text-sm text-gray-500">Terms</p>
                <TermsWidget
                    v-model="localMeanings"
                    :selected-asset="selectedAsset"
                    class="px-5"
                    :edit-permission="
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            isDrawer,
                            'RELATIONSHIP_ADD',
                            'AtlasGlossaryTerm'
                        )
                    "
                    :allow-delete="
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            isDrawer,
                            'RELATIONSHIP_REMOVE',
                            'AtlasGlossaryTerm'
                        )
                    "
                    @change="handleMeaningsUpdate"
                >
                </TermsWidget>
            </div>

            <div ref="animationPoint" class="flex flex-col">
                <div class="px-5 mb-1 text-sm text-gray-500">Certificate</div>

                <Certificate
                    v-model="localCertificate"
                    class="px-5"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    @change="handleChangeCertificate"
                />
            </div>

            <div
                v-if="selectedAsset.typeName === 'AtlasGlossaryTerm'"
                class="flex flex-col"
            >
                <p
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    Categories
                </p>
                <!-- <Categories -->
                <!--     v-model="localCategories" -->
                <!--     :selected-asset="selectedAsset" -->
                <!--     class="px-5" -->
                <!--     :edit-permission="editPermission" -->
                <!--     @change="handleCategoriesUpdate" -->
                <!-- > -->
                <!-- </Categories> -->
                <Categories2
                    v-model="localCategories"
                    :selected-asset="selectedAsset"
                    class="px-5"
                    :edit-permission="editPermission"
                    @change="handleCategoriesUpdate"
                >
                </Categories2>
            </div>

            <div
                v-if="selectedAsset.typeName === 'AtlasGlossaryTerm'"
                class="flex flex-col"
            >
                <p
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    Related Terms
                </p>
                <RelatedTerms
                    v-model="localSeeAlso"
                    :selected-asset="selectedAsset"
                    class="px-5"
                    :edit-permission="editPermission"
                    :allow-delete="editPermission"
                    @change="handleSeeAlsoUpdate"
                >
                </RelatedTerms>
            </div>

            <CustomMetadataPreview
                v-if="
                    readPermission &&
                    !['Query', 'Folder', 'Collection'].includes(
                        selectedAsset?.typeName
                    )
                "
                :selected-asset="selectedAsset"
                :edit-permission="editPermission"
                :allow-delete="editPermission"
                :is-drawer="isDrawer"
                :tab="tab"
            >
            </CustomMetadataPreview>

            <div
                v-if="isBiAsset(selectedAsset) || isSaasAsset(selectedAsset)"
                class="flex flex-col px-5 gap-y-4"
            >
                <SourceUpdated :asset="selectedAsset" />
                <SourceCreated :asset="selectedAsset" />
            </div>
            <a-modal
                v-model:visible="sampleDataVisible"
                :footer="null"
                :closable="false"
                :destroy-on-close="true"
                width="1000px"
                ><div class="p-3">
                    <SampleDataTable :asset="selectedAsset" />
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        inject,
        ref,
        toRefs,
    } from 'vue'
    import SavedQuery from '@common/hovercards/savedQuery.vue'
    import DetailsContainer from '@common/assets/misc/detailsOverflowContainer.vue'
    import { message } from 'ant-design-vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import SQL from '@/common/popover/sql.vue'
    import SQLSnippet from '@/common/sql/snippet.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/common/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Name from '@/common/input/name/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Admins from '@/common/input/admin/index.vue'
    import Viewers from '@/common/input/viewer/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import TermsWidget from '@/common/input/terms/index.vue'
    import Categories from '@/common/input/categories/categories.vue'
    import Categories2 from '@/common/input/categories/categories2.vue'
    import RelatedTerms from '@/common/input/relatedTerms/relatedTerms.vue'
    import Connection from './connection.vue'
    import Suggestion from './suggestion.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import SourceCreated from '@/common/widgets/summary/types/sourceCreated.vue'
    import SourceUpdated from '@/common/widgets/summary/types/sourceUpdated.vue'
    import SourceViewCount from '@/common/widgets/summary/types/sourceViewCount.vue'
    import FieldCount from '@/common/widgets/summary/types/fieldCount.vue'
    import SubFolderCount from '@/common/widgets/summary/types/subFolderCount.vue'
    import ParentContext from '@/common/widgets/summary/types/parentContext.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import CustomMetadataPreview from '@/common/input/customMetadata/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useSimilarList } from '~/composables/discovery/useSimilarList'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Connection,
            Description,
            Name,
            AnnouncementWidget,
            Owners,
            Classification,
            SavedQuery,
            Certificate,
            CustomMetadataPreview,
            RowInfoHoverCard,
            SQL,
            SQLSnippet,
            ColumnKeys,
            TermsWidget,
            Categories,
            Categories2,
            RelatedTerms,
            SourceCreated,
            SourceUpdated,
            Admins,
            Viewers,
            SourceViewCount,
            SubFolderCount,
            ParentContext,
            FieldCount,
            DetailsContainer,
            PreviewTabsIcon,
            UserPill,
            PopOverUser,
            Suggestion,
            SampleDataTable: defineAsyncComponent(
                () =>
                    import(
                        '@common/assets/profile/tabs/overview/sql/sampleData.vue'
                    )
            ),
            AtlanIcon,
        },
        props: {
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            readPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            collectionData: {
                type: Object,
                required: false,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const actions = inject('actions')
            const selectedAsset = inject('selectedAsset')
            const switchTab = inject('switchTab')
            const isProfile = inject('isProfile')
            const { collectionData } = toRefs(props)

            const { isDrawer } = toRefs(props)

            const sampleDataVisible = ref<boolean>(false)

            const {
                getConnectorImage,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                isForeign,
                isSort,
                isIndexed,
                sourceUpdatedAt,
                sourceCreatedAt,
                definition,
                webURL,
                sourceURL,
                assetTypeLabel,
                isProcess,
                getProcessSQL,
                isGTC,
                isUserDescription,
                selectedAssetUpdatePermission,
                tableName,
                viewName,
                attributes,
                externalLocation,
                externalLocationFormat,
                isBiAsset,
                isSaasAsset,
                isObjectAsset,
                getConnectorLabel,
                connectorName,
                fieldsLookerQuery,
                sourceOwners,
                apiName,
                detailColumns,
                picklistValues,
                sourceId,
                formula,
                createdBy,
                parentTable,
                parentView,
                title,
                awsArn,
                s3ObjectSize,
                s3ObjectCount,
            } = useAssetInfo()

            const {
                entity,
                isLoading,
                localName,
                localDescription,
                localCertificate,
                localOwners,
                localAdmins,
                localViewers,
                localClassifications,
                localMeanings,
                localCategories,
                localSeeAlso,
                handleSeeAlsoUpdate,
                handleCategoriesUpdate,
                handleMeaningsUpdate,
                handleChangeName,
                handleChangeDescription,
                handleOwnersChange,
                handleChangeAdmins,
                handleChangeViewers,
                handleChangeCertificate,
                handleClassificationChange,
                isLoadingClassification,
                nameRef,
                descriptionRef,
                animationPoint,
                localSQLQuery,
                handleSQLQueryUpdate,
            } = updateAssetAttributes(selectedAsset, isDrawer.value)

            const limit = ref(0)
            const offset = ref(0)
            const facets = ref({
                typeNames: [selectedAsset.value.typeName],
                similarity: title(selectedAsset.value),
                orExists: ['description', 'userDescription'],
            })
            const aggregations = ref(['description'])

            const { quickChange, similarList, aggregationMap } = useSimilarList(
                {
                    limit,
                    offset,
                    facets,
                    aggregations,
                }
            )
            if (!localDescription.value) {
                quickChange()
            }

            const isSelectedAssetHaveRowsAndColumns = (selectedAsset) => {
                if (
                    selectedAsset.typeName === 'View' ||
                    selectedAsset.typeName === 'Table' ||
                    selectedAsset.typeName === 'TablePartition' ||
                    selectedAsset.typeName === 'MaterialisedView'
                ) {
                    return true
                }

                return false
            }

            const showSampleDataModal = () => {
                if (!isProfile.value) {
                    sampleDataVisible.value = true
                }
            }

            const handlePreviewClick = () => {
                if (webURL(selectedAsset.value)) {
                    window.open(webURL(selectedAsset.value), '_blank').focus()
                } else {
                    window
                        .open(sourceURL(selectedAsset.value), '_blank')
                        .focus()
                }
                useAddEvent('discovery', 'cta_action', 'clicked', {
                    action: 'open_in_source',
                    asset_type: selectedAsset.value.typeName,
                })
            }

            // route to go to insights and select the collection
            const handleCollectionClick = () => {
                const URL = `http://${window.location.host}/insights?col_id=${collectionData?.value?.collectionInfo?.guid}`

                window.open(URL, '_blank')?.focus()
            }

            const handleCopyValue = async (value, type) => {
                await copyToClipboard(value)
                message.success(`${type} copied!`)
            }

            const handleApplySuggestion = (obj) => {
                console.log(obj)
                localDescription.value = obj.value
                handleChangeDescription()
            }

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            return {
                localDescription,
                selectedAsset,
                isLoadingClassification,
                handleCopyValue,
                localClassifications,
                handleClassificationChange,
                isSelectedAssetHaveRowsAndColumns,
                getConnectorImage,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                localOwners,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                isForeign,
                isSort,
                isIndexed,
                definition,
                sourceUpdatedAt,
                sourceCreatedAt,
                entity,
                isLoading,
                actions,
                switchTab,
                webURL,
                sourceURL,
                handlePreviewClick,
                assetTypeLabel,
                isProcess,
                getProcessSQL,
                handleOwnersChange,
                localCertificate,
                handleChangeCertificate,
                animationPoint,
                isGTC,
                localName,
                handleChangeName,
                handleChangeDescription,
                nameRef,
                descriptionRef,
                sampleDataVisible,
                showSampleDataModal,
                localMeanings,
                handleMeaningsUpdate,
                handleCategoriesUpdate,
                handleSeeAlsoUpdate,
                isUserDescription,
                localCategories,
                localSeeAlso,
                handleChangeAdmins,
                localAdmins,
                localViewers,
                handleChangeViewers,
                selectedAssetUpdatePermission,
                localSQLQuery,
                handleSQLQueryUpdate,
                tableName,
                viewName,
                attributes,
                externalLocation,
                externalLocationFormat,
                handleCollectionClick,
                isBiAsset,
                isSaasAsset,
                isObjectAsset,
                isProfile,
                getConnectorLabel,
                connectorName,
                fieldsLookerQuery,
                sourceOwners,
                apiName,
                detailColumns,
                picklistValues,
                sourceId,
                formula,
                handleClickUser,
                createdBy,
                getEntityStatusIcon,
                parentTable,
                parentView,
                awsArn,
                s3ObjectSize,
                s3ObjectCount,
                quickChange,
                limit,
                title,
                offset,
                aggregations,
                similarList,
                aggregationMap,
                handleApplySuggestion,
            }
        },
    })
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.1s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0.2;
    }
    .close-btn {
        height: 32px;
        width: 32px;
        background: #3e4359cc;
        position: fixed;
        border-radius: 50%;
        display: grid;
        place-items: center;
        transform: rotate(45deg);
        right: 430px;
        top: 60px;
        cursor: pointer;
    }
</style>
