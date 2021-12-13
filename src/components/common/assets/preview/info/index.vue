<template>
    <div class="flex flex-col w-full h-full pt-4 overflow-auto gap-y-4">
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
        <AnnouncementWidget class="mx-5" :selected-asset="selectedAsset" />

        <div
            v-if="
                isGTC(selectedAsset) || selectedAsset.typeName === 'Connection'
            "
            class="flex flex-col"
        >
            <Shortcut shortcut-key="n" action="set name" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span> Name</span>
                </div>
            </Shortcut>

            <Name
                ref="nameRef"
                v-model="localName"
                class="mx-4"
                :read-only="readOnly"
                @change="handleChangeName"
            />
        </div>

        <Connection v-if="selectedAsset.typeName === 'Connection'"></Connection>

        <div v-if="webURL(selectedAsset)" class="px-5">
            <a-button
                block
                class="flex items-center justify-between"
                @click="handlePreviewClick"
                ><div class="flex items-center">
                    <img
                        :src="getConnectorImage(selectedAsset)"
                        class="h-5 mr-1"
                    />
                    {{
                        assetTypeLabel(selectedAsset) || selectedAsset.typeName
                    }}
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
                    selectedAsset.typeName == 'View' ||
                    selectedAsset.typeName == 'MaterialisedView'
                "
                :sql="definition(selectedAsset)"
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Definition</span>
                    <span class="text-primary">SQL</span>
                </div>
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
                v-if="rowCount(selectedAsset) > 0"
                class="flex flex-col text-sm cursor-pointer"
                @click="showSampleDataModal"
            >
                <span class="mb-2 text-sm text-gray-500">Rows</span>
                <span class="font-semibold text-primary">{{
                    rowCount(selectedAsset)
                }}</span>
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
            v-if="selectedAsset.typeName?.toLowerCase() === 'column'"
            class="flex flex-col px-5 text-sm"
        >
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

        <div class="flex flex-col">
            <Shortcut
                shortcut-key="d"
                action="set description"
                placement="left"
            >
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
            </Shortcut>

            <Description
                ref="descriptionRef"
                v-model="localDescription"
                class="mx-4"
                :selected-asset="selectedAsset"
                :read-only="readOnly"
                @change="handleChangeDescription"
            />
        </div>
        <div v-if="selectedAsset.guid && selectedAsset.typeName === 'Query'">
            <SavedQuery :selected-asset="selectedAsset" class="mx-4" />
        </div>
        <div
            v-if="selectedAsset.guid && selectedAsset.typeName !== 'Column'"
            class="flex flex-col"
        >
            <Shortcut shortcut-key="o" action="set owners" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span> Owners</span>
                </div>
            </Shortcut>

            <Owners
                v-model="localOwners"
                class="px-5"
                :selected-asset="selectedAsset"
                :read-only="readOnly"
                @change="handleOwnersChange"
            />
        </div>

        <div
            v-if="
                ![
                    'AtlasGlossary',
                    'AtlasGlossaryCategory',
                    'Connection',
                ].includes(selectedAsset.typeName)
            "
            class="flex flex-col"
        >
            <Shortcut
                shortcut-key="t"
                action="set classification"
                placement="left"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span> Classification</span>
                </div>
            </Shortcut>

            <Classification
                v-model="localClassifications"
                :guid="selectedAsset.guid"
                :read-only="readOnly"
                class="px-5"
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
            <p
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
            >
                Terms
            </p>
            <Terms
                v-model="localMeanings"
                :selected-asset="selectedAsset"
                class="px-5"
                :read-only="readOnly"
                @change="handleMeaningsUpdate"
            >
            </Terms>
        </div>

        <div ref="animationPoint" class="flex flex-col">
            <Shortcut
                shortcut-key="c"
                action="set certificate"
                placement="left"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
                >
                    <span> Certificate</span>
                </div>
            </Shortcut>

            <Certificate
                v-model="localCertificate"
                class="px-5"
                :selected-asset="selectedAsset"
                :read-only="readOnly"
                @change="handleChangeCertificate"
            />
        </div>

        <div
            v-if="
               selectedAsset.typeName === 'AtlasGlossaryTerm'
            "
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
                :read-only="readOnly"
                @change="handleCategoriesUpdate"
            >
            </Categories>
        </div>

        <a-modal
            v-model:visible="sampleDataVisible"
            :footer="null"
            :closable="false"
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
    } from 'vue'
    import SavedQuery from '@common/hovercards/savedQuery.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import SQL from '@/common/popover/sql.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/common/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Name from '@/common/input/name/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import Terms from '@/common/input/terms/index.vue'
    import Categories from '@/common/input/categories/categories.vue'
    import Shortcut from '@/common/popover/shortcut.vue'
    import Connection from './connection.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

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
            Terms,
            Shortcut,
            Categories,
            SampleDataTable: defineAsyncComponent(
                () =>
                    import(
                        '@common/assets/profile/tabs/overview/nonBi/sampleData.vue'
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
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const actions = inject('actions')
            const selectedAsset = inject('selectedAsset')
            const switchTab = inject('switchTab')

            const { isDrawer } = toRefs(props)

            const sampleDataVisible = ref<boolean>(false)

            const showSampleDataModal = () => {
                sampleDataVisible.value = true
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
                assetTypeLabel,
                isGTC,
                isUserDescription,
            } = useAssetInfo()

            const {
                entity,
                isLoading,
                localName,
                localDescription,
                localCertificate,
                localOwners,
                localClassifications,
                localMeanings,
                localCategories,
                handleCategoriesUpdate,
                handleMeaningsUpdate,
                handleChangeName,
                handleChangeDescription,
                handleOwnersChange,
                handleChangeCertificate,
                handleClassificationChange,
                isLoadingClassification,
                nameRef,
                descriptionRef,
                animationPoint,
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
                window.open(webURL(selectedAsset.value), '_blank').focus()
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
                handlePreviewClick,
                assetTypeLabel,
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
                isUserDescription,
                localCategories,
            }
        },
    })
</script>
