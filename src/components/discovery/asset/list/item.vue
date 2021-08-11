<template>
    <div
        class="flex items-start max-w-2xl py-6 pl-2 pr-4 mx-auto bg-white  hover:bg-primary-100 hover:bg-opacity-10 text-gray"
    >
        <div class="p-2 mr-2 rounded bg-opacity-30 bg-primary-100">
            <component
                :is="item.typeName"
                class="flex-none w-auto h-6"
            ></component>
        </div>

        <div class="box-border flex flex-col flex-1 pr-16 overflow-hidden">
            <!-- Title bar -->
            <div class="flex items-center mb-0 overflow-hidden">
                <router-link
                    :to="`/assets/${item.guid}/overview`"
                    class="flex-shrink mb-0 overflow-hidden text-base font-bold leading-6 tracking-wide truncate cursor-pointer  text-gray hover:underline overflow-ellipsis whitespace-nowrap"
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
            <!-- Row?Col/Owner bar -->
            <div
                v-if="
                    projection?.includes('owners') ||
                    projection?.includes('rows') ||
                    projection?.includes('popularity')
                "
                class="flex items-baseline mt-1"
            >
                <!-- Owners -->
                <div
                    v-if="
                        projection?.includes('owners') &&
                        getCombinedUsersAndGroups(item).length
                    "
                    class="flex items-baseline mr-4 text-xs leading-5 text-gray"
                >
                    <span class="mr-1">Owned by </span>
                    <span class="font-bold">{{
                        getTruncatedUsers(getCombinedUsersAndGroups(item), 20)
                    }}</span>
                </div>
                <!-- Row/Col-->
                <div
                    class="flex mr-2"
                    v-if="
                        projection?.includes('rows') &&
                        (item.typeName.toLowerCase() === 'table' ||
                            item.typeName.toLowerCase() === 'view')
                    "
                >
                    <div
                        class="flex items-baseline mr-2"
                        v-if="item?.typeName.toLowerCase() === 'table'"
                    >
                        <span class="mr-1 text-sm font-bold">{{
                            rowCount(item, false)
                        }}</span>
                        <span class="text-xs text-gray-description">Rows</span>
                    </div>
                    <div class="flex items-baseline mr-2">
                        <span class="mr-1 text-sm font-bold">{{
                            columnCount(item, false)
                        }}</span>
                        <span class="text-xs text-gray-description">Cols</span>
                    </div>
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
            <!-- Description -->
            <span
                v-if="projection?.includes('description')"
                class="mt-1 text-sm whitespace-pre-line"
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
