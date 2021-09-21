<template>
    <div class="w-full px-5">
        <div
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
            class="flex items-center w-full gap-16 mb-3"
        >
            <RowInfoHoverCard
                :row-count="rows"
                :size-bytes="size"
                :source-updated-at="sourceUpdated"
                :source-updated-at-raw="sourceUpdatedRaw"
                :source-created-at="sourceCreated"
                :source-created-at-raw="sourceCreatedRaw"
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-1 text-sm text-gray-500">Rows</span>
                    <span class="text-gray-700">{{ rows }}</span>
                </div>
            </RowInfoHoverCard>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-sm text-gray-500">Columns</span>
                <span class="text-gray-700">{{ cols }}</span>
            </div>
        </div>
        <Description
            v-if="selectedAsset.guid"
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />

        <Owners
            v-if="selectedAsset.guid && page !== 'nonBiOverview'"
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />

        <Status
            v-if="selectedAsset.guid && page !== 'nonBiOverview'"
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />
    </div>
</template>

<script lang="ts">
    import RowInfoHoverCard from '@/discovery/preview/hovercards/rowInfo.vue'
    import { computed, defineComponent, PropType, toRefs, inject } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Description from '@common/sidebar/description.vue'
    import Owners from '@common/sidebar/owners.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Status from '@common/sidebar/status.vue'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Experts,
            Description,
            Status,
            Owners,
            RowInfoHoverCard,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
        },

        setup(props) {
            const { selectedAsset } = toRefs(props)
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset', () => {})

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
            } = useAssetInfo()

            const rows = computed(() =>
                selectedAsset.value ? rowCount(selectedAsset.value, true) : '~'
            )
            const size = computed(() =>
                selectedAsset.value
                    ? sizeBytes(selectedAsset.value, false)
                    : '~'
            )

            const cols = computed(() =>
                selectedAsset.value
                    ? columnCount(selectedAsset.value, true)
                    : '~'
            )

            const sourceUpdated = computed(() =>
                selectedAsset.value ? sourceUpdatedAt(selectedAsset.value) : ''
            )
            const sourceUpdatedRaw = computed(() =>
                selectedAsset.value
                    ? sourceUpdatedAt(selectedAsset.value, true)
                    : ''
            )

            const sourceCreated = computed(() =>
                selectedAsset.value ? sourceCreatedAt(selectedAsset.value) : ''
            )
            const sourceCreatedRaw = computed(() =>
                selectedAsset.value
                    ? sourceCreatedAt(selectedAsset.value, true)
                    : ''
            )

            function isSelectedAssetHaveRowsAndColumns(
                selectedAsset: assetInterface
            ) {
                if (selectedAsset.typeName === 'View') return true
                if (selectedAsset.typeName === 'Table') return true
                return false
            }

            return {
                rows,
                cols,
                sourceUpdated,
                sourceUpdatedRaw,
                sourceCreated,
                sourceCreatedRaw,
                size,
                selectedAsset,
                isSelectedAssetHaveRowsAndColumns,
                mutateSelectedAsset,
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
