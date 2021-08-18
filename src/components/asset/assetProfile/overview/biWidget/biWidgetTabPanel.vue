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
    <VirtualList v-else :data="list.entities">
        <template #default="{ item }">
            <ListItem
                :item="item"
                :projection="projections"
                class="w-full p-0 m-0 border-b"
                :cssClasses="cssClasses"
            ></ListItem>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue'
    import ListItem from '@/discovery/asset/list/item.vue'
    import useBiRelations from '~/composables/asset/useBiRelations'
    import VirtualList from '~/lib/virtualList/virtualList.vue'

    export default defineComponent({
        components: { ListItem, VirtualList },
        props: {
            assetType: String,
            assetId: String,
        },
        setup(props) {
            const { assetId, assetType } = toRefs(props)

            // gets the list of related assets for the ListItem component
            const { list, isReady, error } = useBiRelations(
                props.assetId,
                props.assetType
            )

            return {
                assetType: props.assetType,
                list,
                isReady,
                projections: ['description', 'owners'],
                cssClasses: {
                    textSize: 'text-sm',
                    paddingY: 'py-6',
                },
            }
        },
    })
</script>

<style lang="less" scoped></style>
