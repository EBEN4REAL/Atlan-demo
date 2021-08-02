<template>
    <!-- TODO: Add loading state -->
    <VirtualList :data="list" :data-key="keyField">
        <template #default="{ item }">
            <div class="border-b border-gray-200">
                <ListItem
                    :item="item"
                    :score="score[item.guid]"
                    :projection="projection"
                    @click="handlePreview(item)"
                ></ListItem>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, SetupContext } from 'vue'
    import ListItem from './item.vue'
    import VirtualList from '~/lib/virtualList.vue'

    export default defineComponent({
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
