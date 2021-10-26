<template>
    <!-- preloader -->
    <div
        v-if="!isReady"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin>
    </div>
    <!-- preloader ends here -->
    <!-- related asset list with assetTpe type  -->
    <VirtualList v-else :data="list.entities" :data-key="keyField">
        <template #default="{ item }">
            <ListItem
                :item="item"
                :projection="projections"
                class="p-0 m-0 cursor-pointer"
                :css-classes="cssClasses"
                :show-asset-type-icon="false"
                :is-selected="item.guid === selectedAssetId"
                @click="handlePreview(item)"
            ></ListItem>
        </template>
    </VirtualList>
    <teleport to="#overAssetPreviewSidebar">
        <a-drawer
            v-if="showAssetSidebar"
            v-model:visible="showAssetSidebar"
            placement="right"
            :mask="false"
            :get-container="false"
            :wrap-style="{ position: 'absolute', width: '100%' }"
            :keyboard="false"
            :destroy-on-close="true"
            :closable="false"
            width="100%"
        >
            <AssetPreview
                :selected-asset="selectedAssetData"
                page="biOverview"
                :show-cross-icon="true"
                @closeSidebar="handleCloseSidebar"
                @asset-mutation="propagateToAssetList"
            />
        </a-drawer>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue'
    import ListItem from '~/components/discovery/list/listItem.vue'
    import ColumnListItem from '~/components/discovery/preview/tabs/columns/columnListItem.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useBiRelations from '~/composables/asset/useBiRelations'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetPreview from '~/components/discovery/preview/assetPreview.vue'
    import useDiscoveryStore from '~/store/discovery'
    export default defineComponent({
        components: {
            ListItem,
            VirtualList,
            ColumnListItem,
            AssetPreview,
        },
        props: {
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
            projections: {
                type: Array,
                required: false,
                default: () => [],
            },
            cssClasses: {
                required: false,
                default: () => {},
            },
            page: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        emits: ['preview'],
        setup(props, context) {
            const { page } = toRefs(props)
            const storeDiscovery = useDiscoveryStore()
            const selectedAssetId = ref('')
            const { dataTypeImage } = useAssetInfo()

            const showAssetSidebar = ref(false)
            const selectedAssetData = ref({})

            const handleCloseSidebar = () => {
                showAssetSidebar.value = false
                selectedAssetData.value = {}
                selectedAssetId.value = ''
            }

            function handlePreview(item: any) {
                selectedAssetId.value = item.guid
                storeDiscovery.setSelectedAsset(item)
                // ctx.emit('preview', item)
                // context.emit('preview', item)
                if (page.value === 'biOverview') {
                    selectedAssetData.value = item
                    showAssetSidebar.value = true
                }
            }

            // gets the list of related assets for the ListItem component
            const { list, isReady, error } = useBiRelations(
                props.assetId,
                props.assetType
            )
            const propagateToAssetList = (updatedAsset: assetInterface) => {
                selectedAssetData.value = updatedAsset
                selectedAssetId.value = ''
                selectedAssetId.value = updatedAsset.guid
            }

            watch(
                list,
                () => {
                    if (list.value.length > 0) {
                        selectedAssetId.value = list.value[0].guid
                    }
                },
                { immediate: true }
            )

            return {
                list,
                isReady,
                handlePreview,
                dataTypeImage,
                selectedAssetId,
                handleCloseSidebar,
                selectedAssetData,
                showAssetSidebar,
                propagateToAssetList,
            }
        },
    })
</script>
