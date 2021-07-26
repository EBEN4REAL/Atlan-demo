<template>
    <div class="flex w-full px-3 py-1 border-t bg-gray-50 border-gray-50">
        <div class="flex items-center justify-between w-full">
            <div
                class="flex items-center text-sm leading-none"
                v-if="props.isLoading || props.isValidating"
            >
                <a-spin size="small" class="mr-2 leading-none"></a-spin
                ><span>searching results</span>
            </div>
            <AssetPagination
                v-else
                :label="props.assetTypeLabel"
                :listCount="props.listCount"
                :totalCount="props.totalCount"
            ></AssetPagination>

            <div
                class="text-sm cursor-pointer text-primary"
                @click="loadMore"
                v-if="
                    props.isLoadMore &&
                        (!props.isLoading || !props.isValidating)
                "
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
        components: {
            AssetPagination,
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
