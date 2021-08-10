<template>
    <div
        class="flex max-w-2xl px-4 py-6 mx-auto bg-white  hover:bg-primary-100 hover:bg-opacity-10 text-gray"
    >
        <component
            :is="item.typeName"
            class="flex-none w-auto h-6 mr-2"
        ></component>

        <div class="box-border flex flex-col flex-1 pr-16 overflow-hidden">
            <!-- Title bar -->
            <div class="flex items-center mb-0">
                <router-link
                    :to="`/assets/${item.guid}/overview`"
                    class="flex-shrink mb-0 overflow-hidden text-lg font-bold leading-6 tracking-wide truncate cursor-pointer  text-gray hover:underline overflow-ellipsis whitespace-nowrap"
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
                    <Fa class="w-auto h-3" icon="fal external-link-alt" />
                </router-link>
            </div>
            <!-- Row?Col/Owner bar -->
            <div class="flex items-center">
                <!-- Owners -->
                <div
                    v-if="
                        projection?.includes('owners') &&
                        getCombinedUsersAndGroups(item).length
                    "
                    class="flex flex-wrap pt-1 mr-4 text-xs"
                >
                    <span class="mr-1 text-gray-description">Owned by </span>
                    <span class="font-bold text-gray">{{
                        getTruncatedUsers(getCombinedUsersAndGroups(item), 20)
                    }}</span>
                </div>
                <!-- Row/Col/popularity count -->
                <div
                    v-if="
                        projection?.includes('rows') ||
                        projection?.includes('popularity')
                    "
                    class="flex items-center"
                >
                    <!-- Row/Col-->
                    <div
                        class="flex items-center pt-1 mr-2"
                        v-if="
                            projection?.includes('rows') &&
                            (item.typeName.toLowerCase() === 'table' ||
                                item.typeName.toLowerCase() === 'view')
                        "
                    >
                        <div
                            class="mr-2"
                            v-if="item?.typeName.toLowerCase() === 'table'"
                        >
                            <span class="mr-1 text-sm font-bold">{{
                                rowCount(item, false)
                            }}</span>
                            <span class="text-xs text-gray-description"
                                >Rows</span
                            >
                        </div>
                        <div class="mr-2">
                            <span class="mr-1 text-sm font-bold">{{
                                columnCount(item, false)
                            }}</span>
                            <span class="text-xs text-gray-description"
                                >Cols</span
                            >
                        </div>
                    </div>
                    <!-- Popularity -->
                    <div
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
                    </div>
                    <!-- Search score -->
                    <div
                        v-if="projection?.includes('searchscore')"
                        class="pt-1 mr-2"
                    >
                        <Fa icon="fal search" class="w-auto h-3 pushtop" />
                        <span class="ml-1 text-sm font-bold">
                            {{ numeralFormat(score, '0[.]000000') }}
                        </span>
                    </div>
                </div>
            </div>
            <!-- Column data type -->
            <div
                v-if="item.typeName.toLowerCase() === 'column'"
                class="flex items-center mt-1 mb-0 text-xs"
            >
                <component
                    :is="dataTypeImage(item)"
                    class="w-5 h-5 mr-1"
                ></component>
                <div class="leading-none">{{ dataType(item) }}</div>
            </div>
            <!-- Description -->
            <span
                v-if="projection?.includes('description')"
                class="mt-1 text-xs leading-relaxed whitespace-pre-line"
            >
                {{ description(item) || 'No description' }}
            </span>
            <!-- Hierarchy bar -->
            <HierarchyBar
                class="py-1 mt-1"
                v-if="projection?.includes('heirarchy')"
                :selectedAsset="item"
            ></HierarchyBar>
        </div>

        <img :src="logo(item)" class="flex-none w-auto h-6" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

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

                console.log(strSize, arr)
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
                            ? truncated[0]
                            : `${truncated.length} other(s)`

                    return displayArray.join(', ') + ` and ${lastElm}`
                } else {
                    // Check if everything can be directly displayed
                    // If so then take the last element from array, append it with 'and'
                    const lastElm = displayArray.pop()
                    return displayArray.length
                        ? displayArray.join(', ') + ` and ${lastElm}`
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
                ownerGroups,
                ownerUsers,
                getTruncatedUsers,
                getCombinedUsersAndGroups,
            }
        },
    })
</script>
