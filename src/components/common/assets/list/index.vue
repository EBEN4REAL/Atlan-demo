<template>
    <VirtualList :data="list" data-key="guid" variable-height>
        <template #default="{ item, index }">
            <slot :item="item" :itemIndex="index"></slot>
        </template>
        <template #footer>
            <div
                v-if="(isLoadMore || isLoading) && list.length > 0"
                class="flex items-center justify-center"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                    :class="isLoading ? 'px-2 w-9' : ''"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" />
                    </template>
                    <AtlanLoader v-else class="h-10" />
                </button>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    export default defineComponent({
        name: 'AssetList',
        components: {
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
            isLoading: {
                type: Boolean,
                required: true,
                default: () => false,
            },
            isLoadMore: {
                type: Boolean,
                required: true,
                default: () => false,
            },
        },
        emits: ['loadMore'],
        setup(props, { emit }) {
            const { list, isLoadMore, isLoading } = toRefs(props)

            return {
                list,
                isLoadMore,
                isLoading,
            }
        },
    })
</script>

<style lang="less" scoped></style>
