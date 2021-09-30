<template>
    <div>
        <div class="mb-3 text-base font-bold text-gray-700">Table Summary</div>
        <div class="flex w-full gap-16">
            <div class="flex-shrink-0">
                <div class="flex gap-16 mb-3">
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
                </div>
                <Status
                    v-if="assetData.guid"
                    :selected-asset="assetData"
                    @update:selected-asset="mutateAsset"
                />
            </div>
            <div class="w-full">
                <Description
                    v-if="assetData.guid"
                    :selected-asset="assetData"
                    @update:selected-asset="mutateAsset"
                />
                <Owners
                    v-if="assetData.guid"
                    :selected-asset="assetData"
                    @update:selected-asset="mutateAsset"
                />
            </div>
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
                viewDefinition,
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

<style lang="less" scoped></style>
