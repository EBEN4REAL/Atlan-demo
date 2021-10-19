<template>
    <div>
        <div class="mb-3 text-base font-bold text-gray-700">Table Summary</div>
        <div
            class="grid gap-y-3 gap-x-16"
            :class="
                selectedAsset.typeName == 'Table' ||
                selectedAsset.typeName == 'TablePartition'
                    ? 'summary-grid-3'
                    : 'summary-grid-2'
            "
        >
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
                    v-if="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>
            <div
                :class="
                    selectedAsset.typeName == 'Table' ||
                    selectedAsset.typeName == 'TablePartition'
                        ? 'status-grid'
                        : ''
                "
            >
                <Status
                    v-if="selectedAsset.guid"
                    :selected-asset="selectedAsset"
                    :edit-permission="editPermission"
                    @update:selected-asset="mutateAsset"
                />
            </div>

            <Owners
                v-if="selectedAsset.guid"
                :selected-asset="selectedAsset"
                :edit-permission="editPermission"
                @update:selected-asset="mutateAsset"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent,
        // watch, 
        // ref,
        // inject,
        computed 
    } from 'vue'
    import { storeToRefs } from 'pinia'

    // Components
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Owners from '@common/sidebar/owners.vue'
    import RowInfoHoverCard from '@/discovery/preview/hovercards/rowInfo.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    // store
    import useDiscoveryStore from '~/store/discovery'

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
            // const assetDataInjection = inject('assetData')

            /** COMPUTED */
            // const assetData = computed(() => assetDataInjection?.asset)
            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            
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
                selectedAsset.value ? sizeBytes(selectedAsset.value, false) : '~'
            )

            const cols = computed(() =>
                selectedAsset.value ? columnCount(selectedAsset.value, true) : '~'
            )

            const sourceUpdated = computed(() =>
                selectedAsset.value ? sourceUpdatedAt(selectedAsset.value) : ''
            )
            const sourceUpdatedRaw = computed(() =>
                selectedAsset.value ? sourceUpdatedAt(selectedAsset.value, true) : ''
            )

            const sourceCreated = computed(() =>
                selectedAsset.value ? sourceCreatedAt(selectedAsset.value) : ''
            )
            const sourceCreatedRaw = computed(() =>
                selectedAsset.value ? sourceCreatedAt(selectedAsset.value, true) : ''
            )

            const mutateAsset = (updatedAsset: assetInterface) => {}

            return {
                selectedAsset,
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
