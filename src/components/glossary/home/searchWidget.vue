<template>
    <div
        class="flex flex-col items-center w-1/2 pt-3"
        :class="$style.menuClasses"
    >
        <a-dropdown :trigger="['click']">
            <SearchAndFilter
                v-model:value="searchQuery"
                placeholder="Search terms, categories & glossaries"
                class="w-full"
                @change="onSearch"
            />
            <template #overlay>
                <a-menu class="overflow-y-auto max-h-56">
                    <a-menu-item v-if="isLoading">
                        <LoadingView />
                    </a-menu-item>
                    <template v-for="item in entities" v-else :key="item.guid">
                        <a-menu-item
                            class="flex items-center py-2"
                            @click="
                                redirectToProfile(item?.typeName, item?.guid)
                            "
                        >
                            <div class="flex flex-col py-1 ml-3">
                                <span class="flex items-center space-x-2"
                                    >{{ item.displayText }}
                                    <StatusBadge
                                        :key="item?.guid"
                                        :status-id="
                                            item?.attributes?.certificateStatus
                                        "
                                        :show-chip-style-status="false"
                                        :show-label="false"
                                        class="p-0 ml-2"
                                    ></StatusBadge>
                                </span>
                                <div class="flex items-cener mt-0.5">
                                    <span class="text-xs text-gray-500"
                                        >{{
                                            assetTypeLabel[
                                                item?.typeName
                                            ].toUpperCase()
                                        }}
                                    </span>
                                    <div
                                        class="w-1 h-1 mx-2 mt-1 bg-gray-500 rounded-full "
                                    ></div>
                                    <span
                                        v-if="
                                            item?.typeName !==
                                                'AtlasGlossary' &&
                                            item?.attributes?.anchor?.attributes
                                                ?.name?.length
                                        "
                                        class="text-xs text-gray-500"
                                    >
                                        {{
                                            item?.attributes?.anchor?.attributes
                                                ?.name
                                        }}
                                        Glossary
                                    </span>
                                    <span v-else class="text-xs text-gray-500">
                                        {{ item?.attributes?.terms?.length }}
                                        Terms,
                                        {{
                                            item?.attributes?.categories?.length
                                        }}
                                        Categories
                                    </span>
                                </div>
                            </div>
                            <template #icon>
                                <atlan-icon
                                    v-if="
                                        item?.typeName === 'AtlasGlossaryTerm'
                                    "
                                    icon="Term"
                                    class="w-auto h-5"
                                />
                                <atlan-icon
                                    v-if="item?.typeName === 'AtlasGlossary'"
                                    icon="Glossary"
                                    class="w-auto h-5"
                                />

                                <atlan-icon
                                    v-if="
                                        item?.typeName ===
                                        'AtlasGlossaryCategory'
                                    "
                                    icon="Category"
                                    class="w-auto h-5"
                                />
                            </template>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-dropdown>
        <span
            class="flex items-center self-end mt-2 font-bold cursor-pointer  text-primary"
            @click="redirectToProfile(entities[0]?.typeName, entities[0]?.guid, { cta: 'glossaryContext'})"
            >Browse all Glossaries
            <atlan-icon icon="ArrowRight" class="w-auto h-4 ml-1" />
        </span>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    // components
    import StatusBadge from '@common/badge/status/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import LoadingView from '@common/loaders/page.vue'
    // composables
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    // utils
    import redirect from '@/glossary/utils/redirectToProfile'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        components: {
            StatusBadge,
            SearchAndFilter,
            LoadingView,
        },
        setup() {
            const searchQuery = ref<string>()
            const router = useRouter()
            const { entities, isLoading, fetchAssetsPaginated } = useGtcSearch(
                undefined,
                ref(true),
                'AtlasGlossaryTerm,AtlasGlossaryCategory,AtlasGlossary'
            )
            const onSearch = useDebounceFn(() => {
                fetchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }, 400)
            const redirectToProfile = redirect(router)

            return {
                entities,
                onSearch,
                searchQuery,
                redirectToProfile,
                isLoading,
                assetTypeLabel,
            }
        },
    })
</script>
<style lang="less" module>
    .menuClasses {
        :global(.ant-dropdown-menu-item) {
            @apply bg-gray-100 !important;
        }
    }
</style>
