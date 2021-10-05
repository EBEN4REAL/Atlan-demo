<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex mx-3 border group"
        :class="[
            !bulkSelectMode && isSelected
                ? 'border-primary rounded bg-primary-light'
                : 'bg-white border-transparent',
            bulkSelectMode && isChecked ? 'bg-primary-light' : '',
        ]"
    >
        <div
            class="flex items-start flex-1 px-3 py-4 border-b border-transparent rounded  w-96 group-hover:shadow"
            :class="{ ' border-gray-200': bulkSelectMode ? true : !isSelected }"
        >
            <a-checkbox
                v-if="showCheckBox"
                :checked="isChecked"
                class="ml-2 mr-3 opacity-0 group-hover:opacity-100"
                :class="bulkSelectMode ? 'opacity-100' : 'opacity-0'"
                @click.stop
                @change="(e) => $emit('listItem:check', e, item)"
            />
            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <!-- Asset type + Hierarchy bar -->
                <div class="flex items-center text-gray-500 gap-x-2">
                    <AssetLogo
                        v-if="showAssetTypeIcon"
                        :asset="item"
                        :selected="isSelected"
                    />

                    <HierarchyBar
                        v-if="projection?.includes('hierarchy')"
                        :selected-asset="item"
                    />
                </div>

                <!-- Title bar -->
                <div class="flex items-center mb-0 overflow-hidden">
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
                        class="flex-none mb-0.5 ml-1"
                    ></StatusBadge>
                </div>

                <!-- Info bar -->
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
                            <span class="ml-1 text-sm text-gray-500">{{
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
                        class="flex text-sm text-gray-500"
                    >
                        <span
                            v-if="
                                ['table', 'tablepartition'].includes(
                                    item.typeName.toLowerCase()
                                )
                            "
                            class="mr-2 text-gray-500"
                            ><span class="tracking-tighter text-gray">{{
                                rowCount(item, false)
                            }}</span>
                            Rows</span
                        >
                        <span class="text-gray-500">
                            <span class="tracking-tighter text-gray">{{
                                columnCount(item, false)
                            }}</span>
                            Cols</span
                        >
                    </div>

                    <!-- Owner bar -->
                    <div
                        v-if="getCombinedUsersAndGroups(item).length"
                        class="flex items-center text-sm text-gray-500 gap-x-1"
                    >
                        <AtlanIcon icon="User" />
                        <span
                            v-html="
                                getTruncatedUsers(
                                    getCombinedUsersAndGroups(item),
                                    20
                                )
                            "
                        />
                    </div>
                </div>
                <!-- Description -->
                <div
                    v-if="projection?.includes('description')"
                    class="max-w-lg text-sm text-gray-500 truncate-overflow"
                >
                    <span v-if="description(item)?.length">{{
                        description(item)
                    }}</span>
                </div>
                <!-- Classification and terms -->
                <div
                    v-if="projection?.includes('classifications')"
                    class="flex items-center"
                >
                    <button
                        v-if="isOverflowing"
                        class="w-8 h-8 p-2 group"
                        @click="() => chipScrollWrapper?.scrollBy(-200, 0)"
                    >
                        <AtlanIcon
                            icon="ChevronRight"
                            class="text-gray-500 transform rotate-180  opacity-70 group-hover:opacity-100"
                        />
                    </button>
                    <div
                        ref="chipScrollWrapper"
                        class="flex items-center overflow-x-auto  flex-nowrap gap-x-2 hidden-scroll"
                        style="scroll-behavior: smooth"
                    >
                        <Pill
                            v-for="clsf in item.classifications"
                            class="flex-none"
                            :label="clsf.typeName"
                            :has-action="false"
                        >
                            <template #prefix>
                                <AtlanIcon
                                    icon="Shield"
                                    class="text-pink-400 group-hover:text-white"
                                />
                            </template>
                        </Pill>
                    </div>
                    <button
                        v-if="isOverflowing"
                        class="w-8 h-8 p-2 group"
                        @click="() => chipScrollWrapper?.scrollBy(200, 0)"
                    >
                        <AtlanIcon
                            icon="ChevronRight"
                            class="text-gray-500  opacity-70 group-hover:opacity-100"
                        />
                    </button>
                </div>
            </div>
            <ThreeDotMenu
                v-if="showThreeDotMenu"
                :entity="item"
                class="opacity-0"
                :visible="false"
                :showGtcCrud="false"
                :showLinks="false"
                :showUnlinkAsset="true"
                @unlinkAsset="$emit('unlinkAsset', item)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { computed, defineComponent, PropType, Ref, ref } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import ThreeDotMenu from '~/components/glossary/threeDotMenu/threeDotMenu.vue'

    import AssetLogo from '@/common/icon/assetIcon.vue'
    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            StatusBadge,
            HierarchyBar,
            AssetLogo,
            Pill,
            ThreeDotMenu,
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
            // If the list items are selectable or not
            showCheckBox: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            // This is different than showCheckBox prop. List items are selectable but the check box should be visible only when atleast one item is selected/ on hover
            bulkSelectMode: {
                type: Boolean,
                required: false,
                default: false,
            },
            // for unlinking asset in glossary
            showThreeDotMenu: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['listItem:check', 'unlinkAsset'],
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

            const chipScrollWrapper: Ref<HTMLElement | null> = ref(null)

            const isOverflowing = computed(
                () =>
                    (chipScrollWrapper.value?.scrollWidth || 0) >
                    (chipScrollWrapper.value?.clientWidth || 0)
            )
            return {
                chipScrollWrapper,
                isOverflowing,
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
<style scoped>
    .hidden-scroll::-webkit-scrollbar {
        height: 0 !important;
        width: 0 !important;
    }
    .hidden-scroll {
        overflow: -moz-scrollbars-none;
        scrollbar-width: none;
    }
</style>
