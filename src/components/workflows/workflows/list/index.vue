<template>
    <div class="grid w-full grid-cols-2 gap-4 grid-flow-cols auto-rows-min">
        <Item
            v-for="item in list"
            :key="item.name"
            :item="item"
            :packageObject="getPackage(item)"
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
            packageList: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            const { list, packageList } = toRefs(props)

            const selectedItem = ref(null)

            const handleSelect = (item) => {
                selectedItem.value = item
                emit('select', item)
            }

            const getPackage = (item) => {
                console.log(item)
                const packageName =
                    item.metadata.annotations['package.argoproj.io/name']
                return packageList.value.find(
                    (p) =>
                        p.metadata.annotations['package.argoproj.io/name'] ===
                        packageName
                )
            }

            return {
                list,
                handleSelect,
                selectedItem,
                packageList,
                getPackage,
            }
        },
    })
</script>

<style lang="less" scoped></style>
