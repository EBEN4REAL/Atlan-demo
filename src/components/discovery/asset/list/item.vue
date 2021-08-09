<template>
    <div class="px-4 py-3 bg-white hover:bg-primary-100 hover:bg-opacity-10">
        <div class="flex items-center justify-between align-middle">
            <div class="flex items-center mr-1 align-middle">
                <div class="">
                    <component
                        :is="item.typeName"
                        class="w-auto h-5 mr-2"
                    ></component>
                </div>
                <div class="flex flex-col w-full">
                    <div class="flex items-center justify-between mb-0">
                        <router-link :to="`/assets/${item.guid}/overview`">
                            <a
                                class="mb-0 font-semibold leading-none tracking-wide truncate cursor-pointer text-primary hover:underline"
                            >
                                {{ title(item) }}
                            </a>
                        </router-link>
                        <StatusBadge
                            :key="item.guid"
                            :status-id="item?.attributes?.assetStatus"
                            class="ml-1"
                        ></StatusBadge>
                    </div>
                    <div class="flex items-center">
                        <div>
                            <!-- <StatusBadge
              :status="status(item)"
              class="ml-1"
              :key="item.guid"
            ></StatusBadge> -->
                        </div>
                    </div>
                </div>
            </div>
            <img :src="logo(item)" class="w-auto h-4" />
        </div>
        <p
            v-if="projection?.includes('description')"
            class="mb-0 text-xs text-gray-500"
        >
            {{ description(item) }}
        </p>

        <div
            v-if="item.typeName.toLowerCase() === 'column'"
            class="flex items-center mt-1 mb-0 text-xs"
        >
            <component
                :is="dataTypeImage(item)"
                class="w-5 h-5 mr-1 text-gray-500"
            ></component>
            <div class="leading-none">{{ dataType(item) }}</div>
        </div>

        <div
            v-if="
                projection?.includes('rows') ||
                    projection?.includes('popularity')
            "
            class="flex items-center justify-between align-middle"
        >
            <div
                v-if="
                    projection?.includes('rows') &&
                        (item.typeName.toLowerCase() === 'table' ||
                            item.typeName.toLowerCase() === 'view')
                "
            >
                <p class="mb-0 text-xs text-gray-500">
                    <span v-if="item?.typeName.toLowerCase() === 'table'">
                        <span class="font-bold tracking-wide">{{
                            rowCount(item, true)
                        }}</span>
                        rows,
                    </span>
                    <span
                        class="font-bold tracking-wide cursor-pointer text-primary"
                        >{{ columnCount(item, true) }}</span
                    >
                    cols
                </p>
            </div>
            <div
                v-if="
                    projection?.includes('popularity') &&
                        item?.attributes?.popularityScore > 0
                "
                class="text-xs text-gray-500"
            >
                <fa icon="fal analytics" class="pushtop"></fa>
                {{ numeralFormat(item?.attributes?.popularityScore, '0[.]00') }}
            </div>
        </div>
        <div
            v-if="projection?.includes('searchscore')"
            class="text-xs text-gray-500"
        >
            <fa icon="fal search" class="pushtop"></fa>
            {{ numeralFormat(score, '0[.]000000') }}
        </div>
        <div
            v-if="projection?.includes('owners')"
            class="flex flex-wrap mt-1 gap-x-1"
        >
            <template
                v-for="user in item?.attributes?.ownerUsers?.split(',')"
                :key="user"
            >
                <div
                    v-if="user?.length > 0"
                    class="flex items-center px-2 py-1 mb-1 leading-none text-blue-500 align-middle transition-all bg-blue-500 rounded-md cursor-pointer bg-opacity-10 hover:bg-opacity-100 hover:text-white"
                >
                    <fa
                        icon="fal user"
                        class="mr-1 text-xs leading-none pushtop text-shadow"
                    ></fa>
                    <div class="">{{ user }}</div>
                </div>
            </template>
            <template
                v-for="group in item?.attributes?.ownerGroups?.split(',')"
                :key="group"
            >
                <div
                    v-if="group?.length > 0"
                    class="flex items-center px-2 py-1 mb-1 leading-none text-blue-600 align-middle bg-blue-100 rounded-md cursor-pointer hover:text-primary"
                >
                    <fa
                        icon="fal user-friends"
                        class="mr-1 leading-none pushtop"
                    ></fa>
                    <div>{{ group }}</div>
                </div>
            </template>
        </div>
        <RelationshipBadge
            v-if="projection?.includes('heirarchy')"
            :item="item"
            class="mt-1"
        ></RelationshipBadge>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';

    import StatusBadge from '@common/badge/status/index.vue';
    import RelationshipBadge from '@common/badge/relationship/index.vue';
    import AssetMixin from '~/mixins/asset';
    import { Components } from '~/api/atlas/client';

    export default defineComponent({
        components: {
            StatusBadge,
            RelationshipBadge,
        },
        mixins: [AssetMixin],
        props: {
            item: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {};
                },
            },
            score: {
                type: Number,
                required: false,
                default() {
                    return 0;
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return [];
                },
            },
        },

        data() {
            return {};
        },
        methods: {},
    });
</script>
