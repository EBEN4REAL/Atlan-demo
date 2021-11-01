<template>
    <div class="flex flex-col w-full px-5 pt-4 gap-y-4">
        <div
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
            class="flex items-center w-full gap-16"
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
            <RowInfoHoverCard
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
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Rows</span>
                    <span class="text-gray-700">{{
                        rowCount(selectedAsset)
                    }}</span>
                </div>
            </RowInfoHoverCard>
            <div
                class="flex flex-col text-sm cursor-pointer"
                @click="switchTab('Columns')"
            >
                <span class="mb-2 text-sm text-gray-500">Columns</span>
                <span class="text-primary">{{
                    columnCount(selectedAsset)
                }}</span>
            </div>
        </div>

        <!-- <div
            v-if="
                isSelectedAssetHaveRowsAndColumns(selectedAsset) &&
                sourceUpdatedAt(selectedAsset)
            "
        >
            <div class="flex flex-col text-sm cursor-pointer">
                <span class="mb-2 text-sm text-gray-500">Freshnes</span>
                <span class="text-primary">{{
                    sourceUpdatedAt(selectedAsset)
                }}</span>
            </div>
        </div> -->
        <Description :selected-asset="selectedAsset" />

        <Query
            v-if="selectedAsset.guid && selectedAsset.typeName === 'Query'"
            :selected-asset="selectedAsset"
        />

        <Owners
            v-if="
                selectedAsset.guid &&
                selectedAsset.typeName !== 'Column' &&
                selectedAsset.typeName !== 'Query' &&
                selectedAsset.typeName !== 'QueryFolder'
            "
            :selected-asset="selectedAsset"
        />

        <!-- <Owners
            v-if="
                selectedAsset.guid &&
                (selectedAsset.typeName === 'Query' ||
                    selectedAsset.typeName === 'QueryFolder')
            "
            :selected-asset="selectedAsset"
            :edit-permission="false"
            @update:selected-asset="mutateSelectedAsset"
        /> -->
        <CertificationPopover :selected-asset="selectedAsset">
            <Certificate :selected-asset="selectedAsset" />
        </CertificationPopover>
        <Terms :selected-asset="selectedAsset"></Terms>

        <Classification :selected-asset="selectedAsset"> </Classification>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, inject } from 'vue'
    import SQL from '@/assets/preview/popover/sql.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/assets/preview/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import Terms from '@/common/input/terms/index.vue'
    import CertificationPopover from '@/assets/preview/popover/certification.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    // import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // import Description from '@common/sidebar/description.vue'

    // import Experts from '@common/sidebar/experts.vue'
    // import Status from '@common/sidebar/status.vue'
    // import Query from '@common/sidebar/query.vue'
    // import { format } from 'sql-formatter'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            // Experts,
            Description,
            // Status,
            Owners,
            Classification,
            // Query,
            Certificate,
            RowInfoHoverCard,
            SQL,
            Terms,
            CertificationPopover,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            userHasEditPermission: {
                type: Boolean,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
        },

        setup(props) {
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
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                previewTabs,
                sourceUpdatedAt,
                sourceCreatedAt,
                definition,
            } = useAssetInfo()
            // const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
            //     inject('mutateSelectedAsset', () => {})
            // const switchTab: (tabName: string) => void = inject(
            //     'switchTab',
            //     () => {}
            // )

            // const {
            //     rowCount,
            //     columnCount,
            //     sizeBytes,
            //     sourceUpdatedAt,
            //     sourceCreatedAt,
            //     viewDefinition,
            // } = useAssetInfo()

            // const displaySQL = computed(() =>
            //     selectedAsset.value ? viewDefinition(selectedAsset.value) : '~'
            // )

            // const rows = computed(() =>
            //     selectedAsset.value ? rowCount(selectedAsset.value, true) : '~'
            // )
            // const size = computed(() =>
            //     selectedAsset.value
            //         ? sizeBytes(selectedAsset.value, false)
            //         : '~'
            // )

            // const cols = computed(() =>
            //     selectedAsset.value
            //         ? columnCount(selectedAsset.value, true)
            //         : '~'
            // )

            // const sourceUpdated = computed(() =>
            //     selectedAsset.value ? sourceUpdatedAt(selectedAsset.value) : ''
            // )
            // const sourceUpdatedRaw = computed(() =>
            //     selectedAsset.value
            //         ? sourceUpdatedAt(selectedAsset.value, true)
            //         : ''
            // )

            // const sourceCreated = computed(() =>
            //     selectedAsset.value ? sourceCreatedAt(selectedAsset.value) : ''
            // )
            // const sourceCreatedRaw = computed(() =>
            //     selectedAsset.value
            //         ? sourceCreatedAt(selectedAsset.value, true)
            //         : ''
            // )

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

            return {
                // rows,
                // cols,
                // sourceUpdated,
                // sourceUpdatedRaw,
                // sourceCreated,
                // sourceCreatedRaw,
                // size,
                // format,
                // selectedAsset,
                // displaySQL,
                isSelectedAssetHaveRowsAndColumns,
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
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
                previewTabs,
                definition,
                sourceUpdatedAt,
                sourceCreatedAt,
                // mutateSelectedAsset,
                // switchTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owner-expert {
        // margin-top: 0.3rem;
        // margin-bottom: 0.3rem;
    }
</style>
