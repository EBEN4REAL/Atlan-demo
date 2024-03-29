<template>
    <div class="p-6 bg-white border border-gray-200 rounded">
        <div class="flex items-center mb-4">
            <AtlanIcon icon="TableSummary" class="w-auto h-8 mr-3" /><span
                class="text-base font-bold text-gray"
                >{{ getSummaryVariants(asset)?.label }} Summary</span
            >
        </div>
        <slot name="announcement"></slot>
        <div class="flex flex-col gap-y-3">
            <div
                v-if="getSummaryVariants(asset)?.components?.length"
                class="flex flex-wrap gap-x-16 gap-y-3"
            >
                <div
                    v-for="(component, index) in getSummaryVariants(asset)
                        ?.components"
                    :key="index"
                >
                    <div
                        v-if="component === 'Categories'"
                        class="flex flex-col"
                    >
                        <p class="mb-1 text-sm text-gray-500">Categories</p>
                        <Categories
                            v-model="localCategories"
                            :selected-asset="asset"
                            :edit-permission="false"
                            :allow-delete="false"
                        />
                    </div>
                    <component
                        v-else
                        :is="component"
                        :asset="asset"
                    ></component>
                </div>
            </div>
            <div class="flex flex-col">
                <p class="mb-1 text-gray-500">Description</p>
                <Description
                    ref="descriptionRef"
                    v-model="localDescription"
                    :selected-asset="asset"
                    :edit-permission="false"
                    :read-only="true"
                    :in-profile="true"
                    class="-ml-1"
                    @change="handleChangeDescription"
                />
            </div>
            <div class="flex gap-x-16">
                <div
                    ref="animationPoint"
                    class="flex flex-col max-w-sm"
                    style="min-width: 12rem"
                >
                    <p class="mb-1 text-sm text-gray-500">Certificate</p>

                    <Certificate
                        v-model="localCertificate"
                        :selected-asset="asset"
                        :edit-permission="false"
                        :in-profile="true"
                        :show-add-btn="false"
                        :show-popover="false"
                        @change="handleChangeCertificate"
                    />
                </div>

                <div v-if="asset.guid" class="flex flex-col">
                    <p class="mb-1 text-sm text-gray-500">Owners</p>
                    <Owners
                        v-model="localOwners"
                        :selected-asset="asset"
                        :edit-permission="false"
                        :in-profile="true"
                        :show-add-btn="false"
                        @change="handleOwnersChange"
                    />
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        defineAsyncComponent,
    } from 'vue'

    // Components
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            CertificateBadge,
            Description,
            Certificate,
            Owners,
            Rows: defineAsyncComponent(() => import('./types/rows.vue')),
            Columns: defineAsyncComponent(() => import('./types/columns.vue')),
            Categories: defineAsyncComponent(
                () => import('@common/input/categories/categories2.vue')
            ),
            Definition: defineAsyncComponent(
                () => import('./types/definition.vue')
            ),
            TermsCount: defineAsyncComponent(
                () => import('./types/termsCount.vue')
            ),
            CategoriesCount: defineAsyncComponent(
                () => import('./types/categoriesCount.vue')
            ),
            ParentGlossary: defineAsyncComponent(
                () => import('./types/parentGlossary.vue')
            ),
            ParentContext: defineAsyncComponent(
                () => import('./types/parentContext.vue')
            ),
            Connection: defineAsyncComponent(
                () => import('./types/connection.vue')
            ),
            WorkspaceRelationsCount: defineAsyncComponent(
                () => import('./types/workspaceRelationsCount.vue')
            ),
            Pages: defineAsyncComponent(() => import('./types/pageCount.vue')),
            Tiles: defineAsyncComponent(() => import('./types/tileCount.vue')),
            SourceCreated: defineAsyncComponent(
                () => import('./types/sourceCreated.vue')
            ),
            SourceUpdated: defineAsyncComponent(
                () => import('./types/sourceUpdated.vue')
            ),
            SourceViewCount: defineAsyncComponent(
                () => import('./types/sourceViewCount.vue')
            ),
            SubFolderCount: defineAsyncComponent(
                () => import('./types/subFolderCount.vue')
            ),
            TableCount: defineAsyncComponent(
                () => import('./types/tableCount.vue')
            ),
            ViewCount: defineAsyncComponent(
                () => import('./types/viewCount.vue')
            ),
            FieldCount: defineAsyncComponent(
                () => import('./types/fieldCount.vue')
            ),
            ReportCount: defineAsyncComponent(
                () => import('./types/reportCount.vue')
            ),
            S3ObjectCount: defineAsyncComponent(
                () => import('./types/s3ObjectCount.vue')
            ),
            PowerBITableCounts: defineAsyncComponent(
                () => import('./types/powerBITableCounts.vue')
            ),
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const {
                getSummaryVariants,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                dataTypeCategoryImage,
                isScrubbed,
                isGTC,
                connectorName,
                connectionName,
                getConnectorImage,
            } = useAssetInfo()

            const {
                isLoading,
                localDescription,
                localCertificate,
                localOwners,
                handleChangeDescription,
                handleOwnersChange,
                handleChangeCertificate,
                descriptionRef,
                animationPoint,
                localCategories,
            } = updateAssetAttributes(asset)

            return {
                isLoading,
                localDescription,
                handleChangeDescription,
                localOwners,
                handleOwnersChange,
                localCertificate,
                handleChangeCertificate,
                getSummaryVariants,
                descriptionRef,
                animationPoint,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                dataTypeCategoryImage,
                isScrubbed,
                isGTC,
                connectorName,
                connectionName,
                getConnectorImage,
                localCategories,
            }
        },
    })
</script>
