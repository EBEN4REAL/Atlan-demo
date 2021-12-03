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
                <Popover :item="item">
                    <AssetItem
                        :no-bg="true"
                        :item="item"
                        :preference="preference"
                        has-pop-hover
                        @click="handlePreview(item)"
                        :enableSidebarDrawer="true"
                    ></AssetItem>
                </Popover>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'
    import { useRelations } from '~/composables/discovery/useRelations'
    import Popover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'AssetList',
        components: {
            AssetItem,
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
