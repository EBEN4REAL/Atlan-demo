<template>
    <div
        class="flex px-4 py-6 bg-white  hover:bg-primary-100 hover:bg-opacity-10 text-gray"
    >
        <component
            :is="item.typeName"
            class="flex-none w-auto h-6 mr-2"
        ></component>

        <div class="flex flex-col flex-grow pr-16">
            <!-- Title bar -->
            <div class="flex items-center mb-0">
                <router-link
                    :to="`/assets/${item.guid}/overview`"
                    class="mb-0 text-xl font-bold leading-6 tracking-wide truncate cursor-pointer  text-gray hover:underline"
                >
                    {{ title(item) }}
                </router-link>
                <StatusBadge
                    :key="item.guid"
                    :showNoStatus="true"
                    :status-id="status(item)"
                    class="ml-2"
                ></StatusBadge>
                <router-link
                    class="ml-1"
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
                    v-if="projection?.includes('owners')"
                    class="flex flex-wrap pt-1"
                >
                    <template
                        v-for="user in item?.attributes?.ownerUsers?.split(',')"
                        :key="user"
                    >
                        <div
                            v-if="user?.length > 0"
                            class="mr-1 text-xs tracking-wide  text-gray-description"
                        >
                            <Fa
                                icon="fal user"
                                class="mr-1 text-xs leading-none  pushtop text-shadow"
                            />
                            <span class="">{{ user }}</span>
                        </div>
                    </template>
                    <template
                        v-for="group in item?.attributes?.ownerGroups?.split(
                            ','
                        )"
                        :key="group"
                    >
                        <div
                            v-if="group?.length > 0"
                            class="mr-1 text-xs tracking-wide  text-gray-description"
                        >
                            <Fa
                                icon="fal user-friends"
                                class="mr-1 leading-none pushtop"
                            />
                            <span>{{ group }}</span>
                        </div>
                    </template>
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
                            <span
                                class="mr-1 text-xs tracking-wide  text-gray-description"
                                >Rows</span
                            >
                            <span class="text-sm font-bold tracking-wide">{{
                                rowCount(item, true)
                            }}</span>
                        </div>
                        <div class="mr-2">
                            <span
                                class="mr-1 text-xs tracking-wide  text-gray-description"
                                >Cols</span
                            >
                            <span class="text-sm font-bold tracking-wide">{{
                                columnCount(item, true)
                            }}</span>
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
                        <span class="ml-1 text-sm font-bold tracking-wide">
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
                        <span class="ml-1 text-sm font-bold tracking-wide">
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
    import { defineComponent, PropType } from 'vue'

    import StatusBadge from '@common/badge/status/index.vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

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
            } = useAssetInfo()

            return {
                description,
                logo,
                dataTypeImage,
                dataType,
                title,
                status,
                rowCount,
                columnCount,
            }
        },
    })
</script>
