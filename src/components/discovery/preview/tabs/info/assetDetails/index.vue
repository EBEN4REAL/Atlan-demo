<template>
    <div class="flex flex-col w-full px-5 gap-y-4">
        <div
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
            class="flex items-center w-full gap-16"
        >
            <Definition
                :sql="displaySQL"
                v-if="
                    selectedAsset.typeName == 'View' ||
                    selectedAsset.typeName == 'MaterialisedView'
                "
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Definition</span>
                    <span class="text-primary">SQL</span>
                </div>
            </Definition>
            <RowInfoHoverCard
                v-if="
                    selectedAsset.typeName == 'Table' ||
                    selectedAsset.typeName == 'TablePartition'
                "
                :row-count="rows"
                :size-bytes="size"
                :source-updated-at="sourceUpdated"
                :source-updated-at-raw="sourceUpdatedRaw"
                :source-created-at="sourceCreated"
                :source-created-at-raw="sourceCreatedRaw"
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Rows</span>
                    <span class="text-gray-700">{{ rows }}</span>
                </div>
            </RowInfoHoverCard>
            <div
                class="flex flex-col text-sm cursor-pointer"
                @click="switchTab('Columns')"
            >
                <span class="mb-2 text-sm text-gray-500">Columns</span>
                <span class="text-primary">{{ cols }}</span>
            </div>
        </div>
        <Description
            v-if="selectedAsset.guid"
            :selected-asset="selectedAsset"
            :edit-permission="userHasEditPermission"
            @update:selected-asset="mutateSelectedAsset"
        />

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
            :edit-permission="userHasEditPermission"
            @update:selected-asset="mutateSelectedAsset"
        />
        <Owners
            v-if="
                selectedAsset.guid &&
                (selectedAsset.typeName === 'Query' ||
                    selectedAsset.typeName === 'QueryFolder')
            "
            :selected-asset="selectedAsset"
            :edit-permission="false"
            @update:selected-asset="mutateSelectedAsset"
        />

        <Status
            v-if="selectedAsset.guid"
            :selected-asset="selectedAsset"
            :edit-permission="userHasEditPermission"
            @update:selected-asset="mutateSelectedAsset"
        />
    </div>
</template>

<script lang="ts">
    import Definition from '@/discovery/preview/hovercards/definition.vue'
    import RowInfoHoverCard from '@/discovery/preview/hovercards/rowInfo.vue'
    import { computed, defineComponent, PropType, toRefs, inject } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Description from '@common/sidebar/description.vue'
    import Owners from '@common/sidebar/owners.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Status from '@common/sidebar/status.vue'
    import Query from '@common/sidebar/query.vue'
    import { format } from 'sql-formatter'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Experts,
            Description,
            Status,
            Owners,
            Query,
            RowInfoHoverCard,
            Definition,
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
            const { selectedAsset } = toRefs(props)
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset', () => {})
            const switchTab: (tabName: string) => void = inject(
                'switchTab',
                () => {}
            )

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                viewDefinition,
            } = useAssetInfo()

            const displaySQL = computed(() =>
                selectedAsset.value ? viewDefinition(selectedAsset.value) : '~'
            )

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
                rows,
                cols,
                sourceUpdated,
                sourceUpdatedRaw,
                sourceCreated,
                sourceCreatedRaw,
                size,
                format,
                selectedAsset,
                displaySQL,
                isSelectedAssetHaveRowsAndColumns,
                mutateSelectedAsset,
                switchTab,
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
