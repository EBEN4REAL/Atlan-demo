<template>
    <div class="flex flex-col w-full h-full py-4 overflow-auto gap-y-4">
        <div class="flex items-center justify-between px-5">
            <span class="font-semibold text-gray-500">Overview</span>

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

        <AnnouncementWidget
            class="mx-5"
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>

        <div
            v-if="
                isGTC(selectedAsset) ||
                selectedAsset.typeName === 'Connection' ||
                selectedAsset.typeName === 'Process'
            "
            class="flex flex-col"
        >
            <div class="px-5 mb-1 text-sm text-gray-500">Name</div>

            <Name
                ref="nameRef"
                v-model="localName"
                class="mx-4"
                :edit-permission="editPermission"
                @change="handleChangeName"
            />
        </div>

        <Connection
            v-if="selectedAsset.typeName === 'Connection'"
            :selected-asset="selectedAsset"
            v-model="localSQLQuery"
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
                    <AtlanIcon
                        :icon="getConnectorImage(selectedAsset)"
                        class="h-4 mr-1"
                    />Open in
                    {{ getConnectorLabel(selectedAsset) }}
                </div>
                <AtlanIcon icon="External" />
            </a-button>
        </div>

        <div
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
            class="flex items-center w-full gap-16 px-5"
        >
            <SQL
                v-if="
                    (selectedAsset.typeName == 'View' ||
                        selectedAsset.typeName == 'MaterialisedView') &&
                    definition(selectedAsset)
                "
                :sql="definition(selectedAsset)"
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Definition</span>
                    <span class="text-primary">SQL</span>
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
                :class="isProfile ? '' : 'cursor-pointer'"
                @click="showSampleDataModal"
            >
                <span class="mb-2 text-sm text-gray-500">Rows</span>
                <span
                    :class="
                        isProfile
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
                <span class="mb-2 text-sm text-gray-500">Columns</span>
                <span class="font-semibold text-primary">{{
                    columnCount(selectedAsset)
                }}</span>
            </div>
            <div
                v-if="sizeBytes(selectedAsset) > 0"
                class="flex flex-col text-sm cursor-pointer"
            >
                <span class="mb-2 text-sm text-gray-500">Size</span>
                <span class="text-gray-700">{{
                    sizeBytes(selectedAsset)
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
            <div class="flex flex-col text-sm cursor-pointer">
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
            v-if="selectedAsset.typeName?.toLowerCase() === 'column'"
            class="flex flex-col px-5 text-sm gap-y-4"
        >
            <div class="flex flex-col">
                <span class="mb-2 text-sm text-gray-500">Data Type</span>

                <div class="flex items-center text-gray-700 gap-x-1">
                    <div class="flex">
                        <component
                            :is="dataTypeCategoryImage(selectedAsset)"
                            class="h-4 text-gray-500 mr-0.5 mb-0.5"
                        />
                        <span class="text-sm tracking-wider text-gray-700">{{
                            dataType(selectedAsset)
                        }}</span>
                    </div>

                    <div
                        v-if="
                            isPrimary(selectedAsset) ||
                            isDist(selectedAsset) ||
                            isPartition(selectedAsset)
                        "
                        class="flex"
                    >
                        <AtlanIcon
                            icon="PrimaryKey"
                            class="mb-0.5 text-yellow-500"
                        ></AtlanIcon>

                        <span
                            v-if="isPrimary(selectedAsset)"
                            class="ml-1 text-sm text-gray-700"
                            >Primary Key</span
                        >
                        <span
                            v-if="isDist(selectedAsset)"
                            class="ml-1 text-sm text-gray-700"
                            >Dist Key</span
                        >
                        <span
                            v-if="isPartition(selectedAsset)"
                            class="ml-1 text-sm text-gray-700"
                            >Partition Key</span
                        >
                    </div>
                </div>
            </div>
            <div v-if="tableName(selectedAsset)">
                <div class="mb-2 text-sm text-gray-500">Table</div>
                <div class="text-sm tracking-wider text-gray-700">
                    {{ tableName(selectedAsset) }}
                </div>
            </div>
            <div v-if="viewName(selectedAsset)">
                <div class="mb-2 text-sm text-gray-500">View</div>
                <div class="text-sm tracking-wider text-gray-700">
                    {{ viewName(selectedAsset) }}
                </div>
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
                    class="flex items-center justify-between px-2 shadow-none"
                    :class="
                        !collectionData?.hasCollectionReadPermission &&
                        !collectionData?.hasCollectionWritePermission &&
                        !collectionData?.isCollectionCreatedByCurrentUser
                            ? 'disabledButton'
                            : ''
                    "
                    @click="handleCollectionClick"
                    :disabled="
                        !collectionData?.hasCollectionReadPermission &&
                        !collectionData?.hasCollectionWritePermission &&
                        !collectionData?.isCollectionCreatedByCurrentUser
                    "
                >
                    <div class="flex items-center">
                        <AtlanIcon
                            icon="CollectionIconSmall"
                            class="mr-1 mb-0.5"
                        />
                        <span>
                            {{ collectionData?.collectionInfo?.displayText }}
                        </span>
                    </div>
                    <AtlanIcon
                        icon="Lock"
                        v-if="
                            !collectionData?.hasCollectionReadPermission &&
                            !collectionData?.hasCollectionWritePermission &&
                            !collectionData?.isCollectionCreatedByCurrentUser
                        "
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
            <div class="text-sm tracking-wider text-gray-700">
                {{ attributes(selectedAsset)?.parent?.attributes?.name }}
            </div>
        </div>

        <!-- <div
            v-if="
                selectedAsset?.guid &&
                selectedAsset?.typeName === 'Query' &&
                attributes(selectedAsset)?.parent?.typeName === 'Folder'
            "
            class="flex flex-col gap-y-4"
        >
            <div class="flex flex-col px-5 text-sm">
                <div class="mb-1 text-sm text-gray-500">Collection</div>
                <div class="text-sm tracking-wider text-gray-700">
                    {{ selectedAsset?.collectionName }}
                </div>
            </div>
            <div class="flex flex-col px-5 text-sm">
                <div class="mb-1 text-sm text-gray-500">Folder</div>
                <div class="text-sm tracking-wider text-gray-700">
                    {{ attributes(selectedAsset)?.parent?.attributes?.name }}
                </div>
            </div>
        </div> -->

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
        </div>
        <div v-if="isProcess(selectedAsset) && getProcessSQL(selectedAsset)">
            <SQLSnippet
                class="mx-4 rounded-lg"
                :text="getProcessSQL(selectedAsset)"
                background="bg-primary-light"
            />
        </div>

        <div v-if="selectedAsset.guid && selectedAsset.typeName === 'Query'">
            <SavedQuery :selected-asset="selectedAsset" class="mx-4" />
        </div>
        <div
            v-if="
                selectedAsset.guid &&
                !['Column', 'Connection'].includes(selectedAsset.typeName)
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
                :showShortcut="true"
                @change="handleOwnersChange"
            />
        </div>

        <div
            class="flex flex-col"
            v-if="selectedAsset.guid && selectedAsset.typeName == 'Connection'"
        >
            <div
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
            >
                <span> Admins</span>
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
                ![
                    'AtlasGlossary',
                    'AtlasGlossaryCategory',
                    'Connection',
                    'Query',
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
                :edit-permission="
                    selectedAssetUpdatePermission(
                        selectedAsset,
                        isDrawer,
                        'ENTITY_ADD_CLASSIFICATION'
                    )
                "
                :allowDelete="
                    selectedAssetUpdatePermission(
                        selectedAsset,
                        isDrawer,
                        'ENTITY_REMOVE_CLASSIFICATION'
                    )
                "
                class="px-5"
                :showShortcut="true"
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
                    ) && editPermission
                "
                :allowDelete="
                    selectedAssetUpdatePermission(
                        selectedAsset,
                        isDrawer,
                        'RELATIONSHIP_REMOVE',
                        'AtlasGlossaryTerm'
                    ) && editPermission
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
            <Categories
                v-model="localCategories"
                :selected-asset="selectedAsset"
                class="px-5"
                :edit-permission="editPermission"
                @change="handleCategoriesUpdate"
            >
            </Categories>
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
        <div v-if="isBiAsset(selectedAsset)" class="flex flex-col px-5 gap-y-4">
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
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        inject,
        ref,
        toRefs,
        watch,
        computed,
    } from 'vue'
    import SavedQuery from '@common/hovercards/savedQuery.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import SQL from '@/common/popover/sql.vue'
    import SQLSnippet from '@/common/sql/snippet.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/common/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Name from '@/common/input/name/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Admins from '@/common/input/admin/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import TermsWidget from '@/common/input/terms/index.vue'
    import Categories from '@/common/input/categories/categories.vue'
    import RelatedTerms from '@/common/input/relatedTerms/relatedTerms.vue'
    import Connection from './connection.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import SourceCreated from '@/common/widgets/summary/types/sourceCreated.vue'
    import SourceUpdated from '@/common/widgets/summary/types/sourceUpdated.vue'

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
            RowInfoHoverCard,
            SQL,
            SQLSnippet,
            TermsWidget,
            Categories,
            RelatedTerms,
            SourceCreated,
            SourceUpdated,
            Admins,
            SampleDataTable: defineAsyncComponent(
                () =>
                    import(
                        '@common/assets/profile/tabs/overview/nonBi/sampleData.vue'
                    )
            ),
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
        },
        setup(props) {
            const actions = inject('actions')
            const selectedAsset = inject('selectedAsset')
            const switchTab = inject('switchTab')
            const isProfile = inject('isProfile')
            const { collectionData } = toRefs(props)

            const { isDrawer } = toRefs(props)

            const sampleDataVisible = ref<boolean>(false)

            const showSampleDataModal = () => {
                if (!isProfile.value) {
                    sampleDataVisible.value = true
                }
            }

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
                getConnectorLabel,
            } = useAssetInfo()

            const {
                entity,
                isLoading,
                localName,
                localDescription,
                localCertificate,
                localOwners,
                localAdmins,
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
                handleChangeCertificate,
                handleClassificationChange,
                isLoadingClassification,
                nameRef,
                descriptionRef,
                animationPoint,
                localSQLQuery,
                handleSQLQueryUpdate,
            } = updateAssetAttributes(selectedAsset, isDrawer.value)

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

            const handlePreviewClick = () => {
                if (webURL(selectedAsset.value)) {
                    window.open(webURL(selectedAsset.value), '_blank').focus()
                } else {
                    window
                        .open(sourceURL(selectedAsset.value), '_blank')
                        .focus()
                }
            }

            // route to go to insights and select the collection
            const handleCollectionClick = () => {
                const URL =
                    `http://` +
                    window.location.host +
                    `/insights?col_id=` +
                    collectionData?.value?.collectionInfo?.guid

                window.open(URL, '_blank')?.focus()
            }

            return {
                localDescription,
                selectedAsset,
                isLoadingClassification,
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
                isProfile,
                getConnectorLabel,
            }
        },
    })
</script>

<style lang="less" module>
    .button {
        :global(.ant-btn) {
            @apply text-gray-700;
        }
    }
</style>

<style lang="less" scoped>
    .disabledButton {
        @apply text-gray-500 !important;
    }
</style>
