<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-4">
        <div class="flex items-center justify-between mb-1 text-sm">
            <span> Owners</span>
        </div>
        <OwnersInline
            v-model="owners"
            :guid="selectedAsset.guid"
        ></OwnersInline>

        <div class="flex items-center justify-between mb-1 text-sm">
            <span> Classifications</span>
        </div>

        <ClassificationInline
            v-model="classificationValue"
            :guid="selectedAsset.guid"
        ></ClassificationInline>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        inject,
        watch,
        ref,
    } from 'vue'
    import SQL from '@/assets/preview/popover/sql.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/assets/preview/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import OwnersInline from '@/common/input/owner/inline.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import ClassificationInline from '@/common/input/classification/inline.vue'
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
            OwnersInline,
            ClassificationInline,
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
                required: false,
            },
            page: {
                type: String,
                required: false,
            },
        },

        setup(props) {
            const { selectedAsset } = toRefs(props)

            const {
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                ownerUsers,
                ownerGroups,
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
                classifications,
            } = useAssetInfo()

            const owners = ref({
                ownerUsers: ownerUsers(selectedAsset.value),
                ownerGroups: ownerGroups(selectedAsset.value),
            })

            const classificationValue = computed(() =>
                classifications(selectedAsset.value)
            )

            watch(selectedAsset, () => {
                owners.value = {
                    ownerUsers: ownerUsers(selectedAsset.value),
                    ownerGroups: ownerGroups(selectedAsset.value),
                }
            })

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
                selectedAsset,
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
                classificationValue,
                isSelectedAssetHaveRowsAndColumns,
                title,
                getConnectorImage,
                assetType,
                rowCount,
                classifications,
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
                owners,
                ownerGroups,
                ownerUsers,
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
