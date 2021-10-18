<template>
    <div>
        <div class="mb-3 text-base font-bold text-gray-700">Table Summary</div>
        <div
            class="grid gap-y-3 gap-x-16"
            :class="
                assetData.typeName == 'Table' ||
                assetData.typeName == 'TablePartition'
                    ? 'summary-grid-3'
                    : 'summary-grid-2'
            "
        >
            <RowInfoHoverCard
                v-if="
                    assetData.typeName == 'Table' ||
                    assetData.typeName == 'TablePartition'
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
                    v-if="assetData.guid"
                    :selected-asset="assetData"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>
            <div
                :class="
                    assetData.typeName == 'Table' ||
                    assetData.typeName == 'TablePartition'
                        ? 'status-grid'
                        : ''
                "
            >
                <Status
                    v-if="assetData.guid"
                    :selected-asset="assetData"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>

            <Owners
                v-if="assetData.guid"
                :selected-asset="assetData"
                :edit-permission="editPermission"
                @update:selected-asset="mutateAsset"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, inject, computed } from 'vue'

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
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
            } = useAssetInfo()

            const rows = computed(() =>
                assetData.value ? rowCount(assetData.value, true) : '~'
            )
            const size = computed(() =>
                assetData.value ? sizeBytes(assetData.value, false) : '~'
            )

            const cols = computed(() =>
                assetData.value ? columnCount(assetData.value, true) : '~'
            )

            const sourceUpdated = computed(() =>
                assetData.value ? sourceUpdatedAt(assetData.value) : ''
            )
            const sourceUpdatedRaw = computed(() =>
                assetData.value ? sourceUpdatedAt(assetData.value, true) : ''
            )

            const sourceCreated = computed(() =>
                assetData.value ? sourceCreatedAt(assetData.value) : ''
            )
            const sourceCreatedRaw = computed(() =>
                assetData.value ? sourceCreatedAt(assetData.value, true) : ''
            )

            const mutateAsset = (updatedAsset: assetInterface) => {}

            return {
                assetData,
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
