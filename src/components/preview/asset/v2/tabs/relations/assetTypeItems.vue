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
                v-if="item.typeName !== 'Column'"
                :item="item"
                :projection="projections"
                class="w-full p-0 m-0 border-b"
                :cssClasses="cssClasses"
                :showAssetTypeIcon="false"
                @click="handlePreview(item)"
                :isSelected="item.guid === selectedAssetId"
            ></ListItem>
            <div v-else class="mx-5 my-2">
                <ColumnListItem :asset="item" />
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, SetupContext } from 'vue'
    import ListItem from '@/discovery/list/item.vue'
    import useBiRelations from '~/composables/asset/useBiRelations'
    import VirtualList from '~/lib/virtualList/virtualList.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import ColumnListItem from '@/preview/asset/v2/tabs/columns/listItem.vue'

    export default defineComponent({
        components: { ListItem, VirtualList, ColumnListItem },
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
        },
        emits: ['preview'],
        setup(props, context) {
            const selectedAssetId = ref('')
            const { dataTypeImage } = useAssetInfo()
            function handlePreview(item: any) {
                selectedAssetId.value = item.guid
                // ctx.emit('preview', item)
                context.emit('preview', item)
            }

            // gets the list of related assets for the ListItem component
            const { list, isReady, error } = useBiRelations(
                props.assetId,
                props.assetType
            )

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
            }
        },
    })
</script>

<style lang="less" scoped></style>
