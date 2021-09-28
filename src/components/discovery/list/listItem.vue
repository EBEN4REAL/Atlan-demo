<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex mx-3"
        :class="
            isSelected
                ? 'border-primary bg-white border rounded bg-primary-light'
                : 'bg-white border-b border-gray-200'
        "
    >
        <!-- Selected asset pill 
        <div
            class="self-stretch w-5"
            :class="isSelected ? 'w-1 bg-primary mr-4' : 'w-5'"
        ></div>-->
        <!-- remove cssClasses prop -->
        <div
            class="flex items-start flex-1 px-3 w-96"
            :class="cssClasses?.paddingY ? cssClasses?.paddingY : 'py-3'"
        >
            <a-checkbox
                v-if="showCheckBox"
                class="self-center mr-6"
                :checked="isChecked"
                @click.stop
                @change="(e) => $emit('listItem:check', e, item)"
            />
            <div
                class="box-border flex flex-col flex-1 overflow-hidden lg:pr-16"
            >
                <div class="flex items-center">
                    <AssetLogo
                        v-if="showAssetTypeIcon"
                        :asset="item"
                        :selected="isSelected"
                    />

                    <HierarchyBar
                        v-if="projection?.includes('hierarchy')"
                        class="ml-3"
                        :selected-asset="item"
                    />
                </div>

                <!-- Title bar -->
                <div class="flex items-center mb-0 overflow-hidden">
                    <!-- <component
                        v-if="showAssetTypeIcon"
                        :is="item.typeName"
                        class="flex-none w-auto h-5 mr-2"
                    ></component> -->
                    <!-- <AssetLogo :asset="item" /> -->

                    <!-- remove cssClasses prop -->
                    <router-link
                        :class="
                            cssClasses?.textSize
                                ? cssClasses?.textSize
                                : 'text-md'
                        "
                        :to="
                            isColumnAsset(item)
                                ? getColumnUrl(item)
                                : `/assets/${item.guid}/overview`
                        "
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </router-link>
                    <StatusBadge
                        :key="item.guid"
                        :show-no-status="false"
                        :status-id="status(item)"
                        class="flex-none ml-1"
                    ></StatusBadge>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Column data type -->
                    <div
                        v-if="item.typeName.toLowerCase() === 'column'"
                        class="flex items-center space-x-2"
                    >
                        <div class="flex">
                            <component
                                :is="dataTypeImage(item)"
                                class="w-auto h-4"
                            ></component>
                            <span class="ml-1 text-sm text-gray-700">{{
                                dataType(item)
                            }}</span>
                        </div>
                        <div v-if="item.attributes?.isPrimary" class="flex">
                            <AtlanIcon icon="PrimaryKey" />
                            <span class="ml-1 text-sm text-gray-700">
                                Primary Key
                            </span>
                        </div>
                    </div>

                    <div
                        v-if="
                            ['table', 'view', 'tablepartition'].includes(
                                item.typeName.toLowerCase()
                            )
                        "
                        class="flex text-sm text-gray-500"
                    >
                        <span
                            v-if="
                                ['table', 'tablepartition'].includes(
                                    item.typeName.toLowerCase()
                                )
                            "
                            class="mr-2 text-gray-500"
                            ><span class="tracking-tighter text-gray-700">{{
                                rowCount(item, false)
                            }}</span>
                            rows</span
                        >
                        <span class="text-gray-500">
                            <span class="tracking-tighter text-gray-700">{{
                                columnCount(item, false)
                            }}</span>
                            columns</span
                        >
                    </div>
                    <div
                        class="flex items-baseline"
                        v-if="getCombinedUsersAndGroups(item).length"
                    >
                        <span class="text-gray-500">owned by </span>
                        <span
                            class="ml-1 text-gray-700"
                            v-html="
                                getTruncatedUsers(
                                    getCombinedUsersAndGroups(item),
                                    20
                                )
                            "
                        />
                    </div>
                </div>
                <!-- Row?Col/Owner bar -->
                <div
                    v-if="
                        projection?.includes('owners') ||
                        projection?.includes('rows') ||
                        projection?.includes('popularity')
                    "
                    class="flex items-center"
                >
                    <!-- Owners -->

                    <!-- Row/Col-->

                    <!-- Popularity -->
                    <!-- <div
                    class="pt-1 mr-2"
                    v-if="
                        projection?.includes('popularity') &&
                        item?.attributes?.popularityScore > 0
                    "
                >
                    <AtlanIcon :icon="search" class="h-3"/>
                    <span class="ml-1 text-sm font-bold">
                        {{
                            numeralFormat(
                                item?.attributes?.popularityScore,
                                '0[.]00'
                            )
                        }}
                    </span>
                </div> -->
                    <!-- Search score -->
                    <!-- <div
                    v-if="projection?.includes('searchscore')"
                    class="pt-1 mr-2"
                >
                    <AtlanIcon :icon="search" class="h-3"/>
                    <span class="ml-1 text-sm font-bold">
                        {{ numeralFormat(score, '0[.]000000') }}
                    </span>
                </div> -->
                </div>
                <!-- Description -->
                <div
                    v-if="projection?.includes('description')"
                    class="max-w-lg mt-1 text-sm text-gray-500  truncate-overflow"
                >
                    <span v-if="description(item)?.length">{{
                        description(item)
                    }}</span>
                </div>

                <!-- Hierarchy bar -->
            </div>

            <!-- <img :src="logo(item)" class="flex-none w-auto h-6" /> -->
        </div>
    </div>
</template>

<script lang="ts">
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { defineComponent, PropType, computed } from 'vue'
    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            StatusBadge,
            HierarchyBar,
            AssetLogo,
        },
        props: {
            item: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {}
                },
            },
            score: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isSelected: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            cssClasses: {
                type: String,
                required: false,
                default: () => '',
            },
            showAssetTypeIcon: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            showCheckBox: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['listItem:check'],
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
                ownerGroups,
                ownerUsers,
            } = useAssetInfo()

            function getTruncatedUsers(arr: string[], wordCount: number = 30) {
                const strSize: number[] = [0]
                let idx = 0
                arr.forEach((name) => {
                    strSize.push(strSize[strSize.length - 1] + name.length)
                })

                // Check upto how long it is possible to display
                while (strSize[idx] < wordCount && idx < strSize.length) {
                    idx += 1
                }
                // // Compenstion for the initial 0 in strSize
                idx -= 1

                /** The elements that would be displayed */
                const displayArray = arr.slice(0, idx)
                /** The elements that would be truncated as x other(s) */
                const truncated = arr.slice(idx)

                // Check if something needs to be truncated
                if (truncated.length) {
                    // If there is only 1 element to be truncated then compare the
                    // length of name and 'x others(s)'
                    const lastElm =
                        truncated.length === 1 &&
                        truncated[0].length <
                            `${truncated.length} other(s)`.length
                            ? `${truncated[0]}`
                            : `${truncated.length} other(s)`

                    return `${displayArray.join(', ')} and ${lastElm}`
                }
                // Check if everything can be directly displayed
                // If so then take the last element from array, append it with 'and'
                const lastElm = displayArray.pop()
                return displayArray.length
                    ? `${displayArray.join(', ')} and ${lastElm}`
                    : `${lastElm}`
            }

            function getCombinedUsersAndGroups(item: assetInterface) {
                return [...ownerUsers(item), ...ownerGroups(item)].filter(
                    (name) => name.length
                )
            }

            const isColumnAsset = (asset) => assetType(asset) === 'Column'

            const getColumnUrl = (asset) => {
                const tableGuid = asset?.attributes?.table?.guid
                return `/assets/${tableGuid}/overview?column=${asset.guid}`
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
                getTruncatedUsers,
                getCombinedUsersAndGroups,
            }
        },
    })
</script>

<style>
    .truncate-overflow {
        position: relative;
        @apply overflow-y-hidden;
        @apply bg-clip-text text-transparent;
        @apply max-h-10;
        background-image: linear-gradient(
            to bottom,
            #3e4359 1.5rem,
            transparent 2.5rem
        );
    }
</style>
