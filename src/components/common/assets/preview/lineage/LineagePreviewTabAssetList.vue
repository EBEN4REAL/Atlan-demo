<template>
    <div
        v-for="(item, x) in lineageList"
        :key="x"
        class="flex mx-3 bg-white border border-transparent"
    >
        <div
            class="flex items-start flex-1 px-3 py-4 border-b border-transparent border-gray-200  w-96"
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <!-- Asset type + Hierarchy bar -->
                <div class="flex items-center text-gray-500 gap-x-2">
                    <AssetLogo :asset="item" />

                    <HierarchyBar :selected-asset="item" />
                </div>

                <!-- Title bar -->
                <div class="flex items-center mb-0 overflow-hidden">
                    <router-link
                        :to="
                            isColumnAsset(item)
                                ? getColumnUrl(item)
                                : `/assets/${item.guid}/overview`
                        "
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary hover:underline overflow-ellipsis whitespace-nowrap text-md"
                    >
                        {{ title(item) }}
                    </router-link>
                    <StatusBadge
                        :key="item.guid"
                        :show-no-status="false"
                        class="flex-none mb-0.5 ml-1"
                    ></StatusBadge>
                </div>
                <!-- Description -->
                <div class="max-w-lg text-sm text-gray-500 truncate-overflow">
                    <span v-if="description(item)?.length">{{
                        description(item)
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    // Constants

    export default defineComponent({
        name: 'LineagePreviewTabAssetList',
        components: { StatusBadge, HierarchyBar, AssetLogo },
        props: {
            lineageList: {
                type: Array as PropType<assetInterface[]>,
                required: true,
            },
        },
        setup() {
            const { description, title, status, assetType } = useAssetInfo()
            const isColumnAsset = (asset) => assetType(asset) === 'Column'
            const getColumnUrl = (asset) => {
                const tableGuid = asset?.attributes?.table?.guid
                return `/assets/${tableGuid}/overview?column=${asset.guid}`
            }

            return {
                description,
                title,
                status,
                isColumnAsset,
                getColumnUrl,
            }
        },
    })
</script>
