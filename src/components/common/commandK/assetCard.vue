<template>
    <div class="flex flex-col">
        <div
            class="flex items-center flex-1 px-5 pt-2 pb-3 transition-all duration-300  hover:bg-gray-100 hover:border-none"
        >
            <AssetLogo :asset="item" :textRequired="false" variant="lg" />
            <div class="flex flex-col flex-1 overflow-hidden lg:pr-16">
                <!-- Title bar -->
                <div
                    v-if="item.guid === '-1'"
                    class="flex flex-shrink pl-1 mb-0 overflow-hidden text-sm font-bold text-gray-700 truncate  overflow-ellipsis whitespace-nowrap"
                >
                    <div>{{ item.displayText }}</div>
                    <AtlanIcon icon="Lock" class="ml-1 mt-0.5" />
                </div>
                <div v-else class="flex items-center pl-1 mb-0 overflow-hidden">
                    <router-link
                        :class="
                            cssClasses?.textSize
                                ? cssClasses?.textSize
                                : 'text-sm'
                        "
                        :to="
                            isColumnAsset(item)
                                ? getColumnUrl(item)
                                : `/assets/${item.guid}/overview`
                        "
                        class="flex-shrink mb-0 overflow-hidden text-sm font-bold truncate cursor-pointer  text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </router-link>
                    <CertificatePopover :data="item" />
                </div>

                <!-- Info bar -->

                <div class="flex items-center text-gray-500 gap-x-2">
                    <AssetLogo
                        :asset="item"
                        :imageRequired="false"
                        class="text-xs"
                    />
                    <HierarchyBar :selected-asset="item" class="text-xs" />
                    <span class="mr-2" style="color: #c4c4c4"> • </span>
                    <div class="flex items-center gap-x-3">
                        <!-- Column dataType -->
                        <div
                            v-if="item.typeName.toLowerCase() === 'column'"
                            class="flex items-center space-x-2"
                        >
                            <div class="flex">
                                <component
                                    :is="dataTypeImage(item)"
                                    class="w-auto h-4 text-gray-500"
                                    style="margin-top: 1px"
                                ></component>
                                <span class="ml-1 text-xs text-gray-500">{{
                                    dataType(item)
                                }}</span>
                            </div>
                            <div v-if="item.attributes?.isPrimary" class="flex">
                                <AtlanIcon icon="PrimaryKey" />
                            </div>
                        </div>

                        <!-- Row/Col bar -->
                        <div
                            v-if="
                                ['table', 'view', 'tablepartition'].includes(
                                    item.typeName.toLowerCase()
                                )
                            "
                            class="flex text-xs text-gray-500"
                        >
                            <span
                                v-if="
                                    ['table', 'tablepartition'].includes(
                                        item.typeName.toLowerCase()
                                    )
                                "
                                class="flex mr-2 space-x-2 text-gray-500"
                                ><span class="mr-1 tracking-wide text-gray">{{
                                    rowCount(item, false)
                                }}</span>
                                Rows</span
                            >
                            <span class="flex space-x-2 text-gray-500">
                                <span class="mr-1 tracking-wide text-gray">{{
                                    columnCount(item, false)
                                }}</span>
                                Cols</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { computed, defineComponent, PropType, Ref, ref } from 'vue'
    import CertificatePopover from '~/components/common/certificatePopover.vue'

    import AssetLogo from '@/common/icon/assetIcon.vue'
    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            StatusBadge,
            HierarchyBar,
            AssetLogo,
            CertificatePopover,
        },
        props: {
            item: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {}
                },
            },
        },
        emits: [],
        setup() {
            const {
                description,
                logo,
                dataTypeImage,
                dataType,
                assetType,
                title,
                status,
                rowCount,
                columnCount,
            } = useAssetInfo()

            const isColumnAsset = (asset) => assetType(asset) === 'Column'

            const getColumnUrl = (asset) => {
                const tableGuid = asset?.attributes?.table?.guid
                return `/assets/${tableGuid}/overview?column=${asset.guid}`
            }

            function getClassificationDisplayname(name: string) {
                return useClassificationStore().getClasificationByName(name)
                    ?.displayName
            }

            return {
                isColumnAsset,
                getColumnUrl,
                description,
                logo,
                dataTypeImage,
                dataType,
                assetType,
                title,
                status,
                rowCount,
                columnCount,
                getClassificationDisplayname,
            }
        },
    })
</script>
