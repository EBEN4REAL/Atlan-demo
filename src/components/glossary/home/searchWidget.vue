<template>
    <div
        class="flex flex-col items-center w-full pt-5 mb-5"
        :class="$style.menuClasses"
    >
        <a-dropdown :trigger="['click']">
            <!-- <a-input-search
                v-model:value="searchQuery"
                placeholder="Search terms, categories & glossaries"
                class="w-1/2"
                @change="onSearch"
            /> -->
            <SearchAndFilter
                v-model:value="searchQuery"
                placeholder="Search terms, categories & glossaries"
                class="w-1/2"
                @change="onSearch"
            />
            <template #overlay>
                <a-menu class="overflow-y-auto max-h-40">
                    <a-menu-item v-if="isLoading">
                        <LoadingView />
                    </a-menu-item>
                    <template v-for="item in entities" v-else :key="item.guid">
                        <a-menu-item
                            class="flex items-center py-2"
                            @click="redirectToProfile(item)"
                        >
                            <div class="flex flex-col py-1 ml-3">
                                <span class="flex items-center space-x-2"
                                    >{{ item.displayText }}
                                    <StatusBadge
                                        :key="item?.guid"
                                        :status-id="
                                            item?.attributes?.assetStatus
                                        "
                                        :show-chip-style-status="false"
                                        :show-label="false"
                                        class="p-0 ml-2"
                                    ></StatusBadge>
                                </span>
                                <span class="text-xs text-gray-500">
                                    Parent glossary name goes here
                                </span>
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
            const redirectToProfile = (entity) => {
                console.log(entity)
                if (entity.typeName === 'AtlasGlossary')
                    router.push(`/glossary/${entity.guid}`)
                else if (entity.typeName === 'AtlasGlossaryTerm')
                    router.push(`/glossary/term/${entity.guid}`)
                else router.push(`/glossary/category/${entity.guid}`)
            }

            return {
                entities,
                onSearch,
                searchQuery,
                redirectToProfile,
                isLoading,
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
