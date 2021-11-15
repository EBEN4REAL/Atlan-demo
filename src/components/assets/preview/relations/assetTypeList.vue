<template>
    <VirtualList :data="list" data-key="guid" variable-height>
        <template #default="{ item }">
            <div
                class="mx-3 my-1 transition-all duration-300  hover:bg-primary-light"
                :class="
                    item.guid === selectedAssetId
                        ? 'outline-primary bg-primary-light shadow-sm'
                        : ''
                "
            >
                <AssetItem
                    :item="item"
                    :preference="preference"
                    @click="handlePreview(item)"
                ></AssetItem>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import AssetItem from '@/assets/list/assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'
    import { useRelations } from '~/composables/discovery/useRelations'

    export default defineComponent({
        name: 'AssetList',
        components: {
            AssetItem,
            VirtualList,
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
            page: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
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
