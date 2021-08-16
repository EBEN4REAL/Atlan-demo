<template>
    <div
        v-if="!isReady"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin>
    </div>
    <VirtualList v-else :data="list.entities" :data-key="keyField">
        <template #default="{ item }">
            <ListItem
                :item="item"
                :projection="projection"
                class="w-full p-0 m-0 border-b"
            ></ListItem>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import ListItem from '@/discovery/asset/list/item.vue'
    import useBiRelations from '~/composables/asset/useBiRelations'
    import VirtualList from '~/lib/virtualList.vue'

    export default defineComponent({
        components: { ListItem, VirtualList },
        props: {
            assetType: String,
            assetId: String,
        },
        setup(props) {
            const { list, isReady, error } = useBiRelations(
                props.assetId,
                props.assetType
            )

            console.log(list)
            return {
                assetType: props.assetType,
                list,
                isReady,
                projection: ['description', 'owners'],
            }
        },
    })
</script>

<style lang="less" scoped></style>
