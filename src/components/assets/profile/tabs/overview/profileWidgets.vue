<template>
    <div>
        <div
            class="grid gap-y-3 gap-x-16"
            :class="
                asset.typeName == 'Table' || asset.typeName == 'TablePartition'
                    ? 'summary-grid-3'
                    : 'summary-grid-2'
            "
        >
            <RowInfoHoverCard
                v-if="
                    asset.typeName == 'Table' ||
                    asset.typeName == 'TablePartition'
                "
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
            <div class="max-w-screen-md">
                <Description
                    v-if="asset.guid"
                    :selected-asset="asset"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>
            <div
                :class="
                    asset.typeName == 'Table' ||
                    asset.typeName == 'TablePartition'
                        ? 'status-grid'
                        : ''
                "
            >
                <Status
                    v-if="asset.guid"
                    :selected-asset="asset"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>

            <Owners
                v-if="asset.guid"
                :selected-asset="asset"
                :edit-permission="editPermission"
                @update:selected-asset="mutateAsset"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        // watch,
        // ref,
        // inject,
        computed,
        PropType,
        toRefs,
    } from 'vue'

    // Components
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Owners from '@common/sidebar/owners.vue'
    import RowInfoHoverCard from '@/discovery/preview/hovercards/rowInfo.vue'
    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { RowInfoHoverCard, Description, Status, Owners },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
            } = useAssetInfo()

            const rows = computed(() =>
                asset.value ? rowCount(asset.value, true) : '~'
            )
            const size = computed(() =>
                asset.value ? sizeBytes(asset.value, false) : '~'
            )
            const cols = computed(() =>
                asset.value ? columnCount(asset.value, true) : '~'
            )
            const sourceUpdated = computed(() =>
                asset.value ? sourceUpdatedAt(asset.value) : ''
            )
            const sourceUpdatedRaw = computed(() =>
                asset.value ? sourceUpdatedAt(asset.value, true) : ''
            )
            const sourceCreated = computed(() =>
                asset.value ? sourceCreatedAt(asset.value) : ''
            )
            const sourceCreatedRaw = computed(() =>
                asset.value ? sourceCreatedAt(asset.value, true) : ''
            )
            const mutateAsset = (updatedAsset: assetInterface) => {}
            return {
                asset,
                rows,
                cols,
                sourceUpdated,
                sourceUpdatedRaw,
                sourceCreated,
                sourceCreatedRaw,
                size,
                mutateAsset,
            }
        },
    })
</script>

<style lang="less" scoped>
    .summary-grid-2 {
        grid-template-columns: fit-content(300px) 1fr;
    }
    .summary-grid-3 {
        grid-template-columns: fit-content(300px) fit-content(300px) 1fr;
    }
    .status-grid {
        grid-column: span 2;
    }
</style>
