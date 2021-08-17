<template>
    <VirtualList :data="list" :data-key="keyField">
        <template #default="{ item }">
            <ListItem
                :item="item"
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
    import { defineComponent, SetupContext, toRefs } from 'vue'
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
            keyField: {
                type: String,
                required: false,
                default() {
                    return 'guid'
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
            function handlePreview(item: any) {
                ctx.emit('preview', item)
            }

            return { handlePreview }
        },
    })
</script>
