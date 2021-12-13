<template>
    <div class="grid w-full grid-cols-3 gap-4">
        <Item
            style="height: 150px"
            v-for="item in list"
            :key="item.name"
            :item="item"
            :selectedItem="selectedItem"
            @click="handleSelect(item)"
        ></Item>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
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
        emits: ['select'],
        setup(props, { emit }) {
            const { list } = toRefs(props)

            const selectedItem = ref(null)

            const handleSelect = (item) => {
                selectedItem.value = item
                emit('select', item)
            }

            return {
                list,
                handleSelect,
                selectedItem,
            }
        },
    })
</script>

<style lang="less" scoped></style>
