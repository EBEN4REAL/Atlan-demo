<template>
    <div class="p-5 overflow-scroll">
        <div class="flex items-center text-sm font-bold text-gray-500">
            <AtlanIcon icon="AssetsInactiveLight" class="mr-2" />Assets
        </div>

        <div class="container-asset-list-persona-purpose">
            <AssetList
                asset-list-class="overflow-scroll asset-list-persona-purpose"
                :persona="item"
                :global-state="globalState"
                :filters="filterConfig"
                aggregation-tab-class="px-1 my-1 aggreation-persona-purpose-assets"
                search-bar-class="px-1 my-1"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import AssetList from '@/common/assetList/assetList.vue'

    export default defineComponent({
        name: 'AssetsView',
        components: { AssetList },
        props: {
            item: {
                type: Object,
                required: true,
            },
            activeTab: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { item, activeTab } = toRefs(props)
            const globalState = computed(() =>
                activeTab.value === 'persona' ? ['persona', item.value.id] : []
            )
            const filterConfig = computed(() => {
                if (activeTab.value === 'persona') {
                    return {
                        hierarchy: {},
                    }
                }
                return {
                    __traitNames: {
                        classifications: item.value.tags,
                    },
                }
            })
            return { filterConfig, globalState }
        },
    })
</script>
<style lang="less">
    .container-asset-list-persona-purpose {
        .empty-asset {
            margin-top: calc(50vh - 230px) !important;
        }
    }
    .asset-list-persona-purpose {
        height: calc(100vh - 250px);
    }
    .aggreation-persona-purpose-assets {
        .ant-tabs-tab:first-child {
            transform: translateY(8px);
        }
        .ant-tabs-tab {
            height: 30px !important;
        }
    }
</style>
<style lang="less" scoped></style>
