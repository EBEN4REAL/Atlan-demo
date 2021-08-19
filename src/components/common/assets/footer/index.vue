<template>
    <div class="flex w-full px-3 py-1 border-t bg-gray-100 border-gray-100">
        <div class="flex items-center justify-between w-full">
            <div
                v-if="props.isLoading || props.isValidating"
                class="flex items-center text-sm leading-none"
            >
                <a-spin size="small" class="mr-2 leading-none"></a-spin
                ><span>searching results</span>
            </div>
            <AssetPagination
                v-else
                :label="props.assetTypeLabel"
                :list-count="props.listCount"
                :total-count="props.totalCount"
            ></AssetPagination>

            <div
                v-if="
                    props.isLoadMore &&
                        (!props.isLoading || !props.isValidating)
                "
                class="text-sm cursor-pointer text-primary"
                @click="loadMore"
            >
                load more...
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import AssetPagination from '@common/pagination/index.vue';

    export default {
        name: 'Footer',
        components: {
            AssetPagination,
        },
        props: {
            isLoading: {
                type: Boolean,
                default: false,
            },
            isValidating: {
                type: Boolean,
                default: false,
            },
            isLoadMore: {
                type: Boolean,
                default: false,
            },
            assetTypeLabel: {
                type: String,
            },
            listCount: {
                type: Number,
                default: 0,
            },
            totalCount: {
                type: Number,
                default: 0,
            },
        },
        setup(props, { emit }) {
            const loadMore = (e) => {
                console.log('emitt');
                emit('loadMore', e);
            };
            return {
                loadMore,
                props,
            };
        },
    };
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
