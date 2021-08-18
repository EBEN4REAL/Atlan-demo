<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex justify-between border-b border-gray-300 text-gray"
        :class="isSelected ? 'bg-primary-light' : 'bg-white hover:bg-gray-100'"
    >
        <!-- Selected asset pill -->
        <div
            class="self-stretch"
            :class="isSelected ? 'w-1 bg-primary mr-4' : 'w-5'"
        ></div>
        <!-- remove cssClasses prop -->
        <div
            class="flex items-start flex-1 pr-5 w-96"
            :class="cssClasses?.paddingY ? cssClasses?.paddingY : 'py-6'"
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden lg:pr-16"
            >
                <!-- Title bar -->
                <div class="flex items-center mb-0 overflow-hidden">
                    <component
                        :is="item.typeName"
                        class="flex-none w-auto h-5 mr-2"
                    ></component>
                    <!-- remove cssClasses prop -->
                    <router-link
                        :class="
                            cssClasses?.textSize
                                ? cssClasses?.textSize
                                : 'text-lg'
                        "
                        :to="`/assets/${item.guid}/overview`"
                        class="
                            flex-shrink
                            mb-0
                            overflow-hidden
                            font-bold
                            leading-6
                            tracking-wide
                            truncate
                            cursor-pointer
                            text-gray
                            hover:underline
                            overflow-ellipsis
                            whitespace-nowrap
                        "
                    >
                        {{ title(item) }}
                    </router-link>
                    <StatusBadge
                        :key="item.guid"
                        :showNoStatus="true"
                        :status-id="status(item)"
                        class="flex-none ml-2"
                    ></StatusBadge>
                    <router-link
                        class="flex-none ml-1"
                        :to="`/assets/${item.guid}/overview`"
                        target="_blank"
                    >
                        <Fa
                            class="w-auto h-3 mt-1"
                            icon="fal external-link-alt"
                        />
                    </router-link>
                </div>
                <!-- Column data type -->
                <div
                    v-if="item.typeName.toLowerCase() === 'column'"
                    class="flex items-center mt-1 mr-4"
                >
                    <component
                        :is="dataTypeImage(item)"
                        class="w-auto h-5"
                    ></component>
                    <span class="ml-1 text-sm">{{ dataType(item) }}</span>
                </div>
                <!-- Description -->
                <div
                    v-if="projection?.includes('description')"
                    class="max-w-lg mt-1 text-sm truncate-overflow"
                >
                    <span v-if="description(item).length">
                        {{ description(item) }}
                    </span>
                    <span v-else class="text-gray-500">No description</span>
                </div>
                <!-- Hierarchy bar -->
                <HierarchyBar
                    class="py-1 mt-1"
                    v-if="projection?.includes('heirarchy')"
                    :selectedAsset="item"
                ></HierarchyBar>
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
                    <div
                        v-if="
                            projection?.includes('owners') &&
                            getCombinedUsersAndGroups(item).length
                        "
                        class="
                            flex
                            items-baseline
                            mt-1
                            mr-4
                            text-xs
                            leading-5
                            text-gray
                        "
                    >
                        <span
                            class="mr-1"
                            v-html="
                                'Owned by ' +
                                getTruncatedUsers(
                                    getCombinedUsersAndGroups(item),
                                    20
                                )
                            "
                        />
                    </div>
                    <!-- Row/Col-->
                    <div
                        class="flex mt-1 mr-2 text-sm"
                        v-if="
                            projection?.includes('rows') &&
                            ['table', 'view'].includes(
                                item.typeName.toLowerCase()
                            )
                        "
                    >
                        <span
                            v-if="item?.typeName.toLowerCase() === 'table'"
                            class="mr-4"
                            >{{ rowCount(item, false) }} Rows</span
                        >
                        <span class="mr-4"
                            >{{ columnCount(item, false) }} Cols</span
                        >
                    </div>
                    <!-- Popularity -->
                    <!-- <div
                    class="pt-1 mr-2"
                    v-if="
                        projection?.includes('popularity') &&
                        item?.attributes?.popularityScore > 0
                    "
                >
                    <Fa icon="fal analytics" class="w-auto h-3" />
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
                    <Fa icon="fal search" class="w-auto h-3 pushtop" />
                    <span class="ml-1 text-sm font-bold">
                        {{ numeralFormat(score, '0[.]000000') }}
                    </span>
                </div> -->
                </div>
            </div>

            <img :src="logo(item)" class="flex-none w-auto h-6" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import StatusBadge from '@common/badge/status/index.vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            StatusBadge,
            HierarchyBar,
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
            cssClasses: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        setup(props) {
            const {
                description,
                logo,
                dataTypeImage,
                dataType,
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
                    idx++
                }
                // // Compenstion for the initial 0 in strSize
                idx--

                /** The elements that would be displayed */
                const displayArray = arr.slice(0, idx)
                /** The elements that would be truncated as x other(s) */
                const truncated = arr.slice(idx)

                // Check if something needs to be truncated
                if (truncated.length) {
                    // If there is only 1 element to be truncated then compare the
                    // length of name and 'x others(s)'
                    const lastElm =
                        truncated.length == 1 &&
                        truncated[0].length <
                            `${truncated.length} other(s)`.length
                            ? `<b>${truncated[0]}</b>`
                            : `<b>${truncated.length}</b> other(s)`

                    return `<b>${displayArray.join(', ')}</b> and ${lastElm}`
                } else {
                    // Check if everything can be directly displayed
                    // If so then take the last element from array, append it with 'and'
                    const lastElm = displayArray.pop()
                    return displayArray.length
                        ? `<b>${displayArray.join(
                              ', '
                          )}</b> and <b>${lastElm}</b>`
                        : lastElm
                }
            }

            function getCombinedUsersAndGroups(item: assetInterface) {
                return [...ownerUsers(item), ...ownerGroups(item)].filter(
                    (name) => name.length
                )
            }
            return {
                description,
                logo,
                dataTypeImage,
                dataType,
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
