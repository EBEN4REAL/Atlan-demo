<template>
    <div
        class="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 grid-flow-cols auto-rows-min"
    >
        <Item
            style="height: 150px"
            v-for="item in list"
            :key="item.name"
            :item="item"
            :selectedItem="selectedItem"
            @click="handleSelect(item)"
            @dblclick="handleDoubleClick(item)"
            @select="handleDoubleClick(item)"
        ></Item>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import Item from './item.vue'

    export default defineComponent({
        components: { Item },
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['select', 'dblClick'],
        setup(props, { emit }) {
            const { list } = toRefs(props)

            const selectedItem = ref(null)

            const handleSelect = (item) => {
                selectedItem.value = item
                emit('select', item)
            }
            const route = useRoute()
            watch(
                list,
                () => {
                    if (list.value?.length > 0) {
                        if (!route.params?.id) {
                            handleSelect(list.value[0])
                        }
                    }
                },
                { immediate: true }
            )

            const handleDoubleClick = (item) => {
                emit('dblClick', item)
            }

            return {
                list,
                handleSelect,
                selectedItem,
                route,
                handleDoubleClick,
            }
        },
    })
</script>

<style lang="less" scoped></style>
