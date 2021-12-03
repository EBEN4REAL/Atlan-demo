<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center flex-grow h-24"
    >
        <AtlanIcon
            icon="Loader"
            class="w-auto h-10 animate-spin"
        />
    </div>
    <VirtualList v-else :data="list" data-key="guid" variable-height>
        <template #default="{ item }">
            <div
                class="mx-3 my-1 transition-all duration-300 hover:bg-primary-light"
                :class="
                    item.guid === selectedAssetId
                        ? 'outline-primary bg-primary-light shadow-sm'
                        : ''
                "
            >
                <Popover :item="item">
                    <MiniAssetItem
                        :no-bg="true"
                        :item="item"
                        :preference="preference"
                        has-pop-hover
                        @click="handlePreview(item)"
                    />
                </Popover>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import MiniAssetItem from '@/common/assets/list/miniAssetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'
    import { useRelations } from '~/composables/discovery/useRelations'
    import Popover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'AssetList',
        components: {
            MiniAssetItem,
            VirtualList,
            Popover,
        },
        props: {
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            assetType: {
                type: String,
                requred: true,
                default: () => '',
            },
            assetId: {
                type: String,
                requred: true,
                default: () => '',
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            const selectedAssetId = ref('')
            // const shouldReSelect = false

            const handlePreview = (item: any) => {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                } else {
                    selectedAssetId.value = item.guid
                }
                emit('preview', item)
            }
            const { fetchRelationAssets } = useRelations
            const { list, isReady, error, isLoading } = fetchRelationAssets(
                props.assetId,
                props.assetType
            )

            return {
                // handlePreview,
                selectedAssetId,
                isLoading,
                list,
                handlePreview,
                // bulkSelectedAssets,
                // updateBulkSelectedAssets,
                // handleCardClicked,
                // selectedAsset,
            }
        },
    })
</script>

<style lang="less" scoped></style>
