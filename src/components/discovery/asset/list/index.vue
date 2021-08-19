<template>
    <VirtualList :data="list" data-key="guid" :variable-height="false">
        <template #default="{ item }">
            <ListItem
                :item="item"
                :isSelected="item.guid === selectedAssetId"
                :score="score[item.guid]"
                :projection="projection"
                @click="handlePreview(item)"
            ></ListItem>
        </template>
    </VirtualList>
    <!-- <ListItem
        :v-for="item in list"
        :key="item[keyField]"
        :item="item"
        :score="score[item.guid]"
        :projection="projection"
        @click="handlePreview(item)"
    ></ListItem> -->
    <!-- TODO: Add loading state -->
</template>

<script lang="ts">
    import { defineComponent, SetupContext, ref, toRefs, watch } from 'vue'
    import ListItem from './item.vue'
    import VirtualList from '~/lib/virtualList/virtualList.vue'

    export default defineComponent({
        name: 'AssetList',
        components: {
            ListItem,
            VirtualList,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            score: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isLoading: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['preview'],
        setup(props, ctx: SetupContext) {
            const { list } = toRefs(props)
            const selectedAssetId = ref('')
            function handlePreview(item: any) {
                selectedAssetId.value = item.guid
                ctx.emit('preview', item)
            }

            // select first asset automatically

            watch(
                list,
                () => {
                    if (list.value.length > 0) {
                        selectedAssetId.value = list.value[0].guid
                    }
                },
                { immediate: true }
            )

            return { handlePreview, selectedAssetId, list }
        },
    })
</script>
