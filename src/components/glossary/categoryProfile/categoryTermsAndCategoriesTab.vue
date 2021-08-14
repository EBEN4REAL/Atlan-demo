<template>
    <div>
        <div class="mb-4">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${all.length} assets...`"
                class="w-80"
                @change="onSearch"
            ></a-input-search>
        </div>
        <div v-if="isLoading && !all.length">
            <LoadingView />
        </div>
        <div v-else-if="all?.length" class="flex flex-row w-full">
            <div class="w-full border-r">
                <a-tabs type="card" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" :tab="`All (${all.length})`">
                        <div v-for="asset in all" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="`Terms (${terms.length})`">
                        <div v-for="asset in terms" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane
                        key="3"
                        :tab="`Sub-Categories (${categories.length})`"
                    >
                        <div v-for="asset in categories" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                </a-tabs>
            <a-button type="link" @click="loadMore">Load More</a-button>
            </div>
            <!-- <div v-if="selectedEntity?.guid" class="w-1/3">
                <Overview
                    :item="selectedEntity"
                    :selectedAssetData="selectedEntity"
                ></Overview>
            </div> -->
        </div>
        <div v-else-if="!all.length" class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div>
    </div>
</template>

<script lang="ts">
// Logic will change when /categories/full?searchText="lorem" is active
import { defineComponent, computed, ref, watch, onMounted, toRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import LoadingView from '@common/loaders/page.vue'
import EmptyView from '@common/empty/discover.vue'
import GtcEntityCard from '../gtcEntityCard.vue'

import useGtcSearch from '~/composables/glossary/useGtcSearch'

export default defineComponent({
    components: { GtcEntityCard, EmptyView, LoadingView },
    props: {
        qualifiedName: {
            type: String,
            required: true,
            default: '',
        },
        categoryGuid: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props) {
        const categoryQualifiedName = toRef(props, 'qualifiedName');
        const searchQuery = ref<string>()

        const {entities, error, isLoading, fetchAssetsPaginated } =
            useGtcSearch(categoryQualifiedName)

        const selectedEntity = ref()

        const onEntitySelect = (entity) => {
            selectedEntity.value = entity
        }

        const terms = computed(
            () =>
                entities.value?.filter((entity) => {
                    if (
                        entity.typeName === 'AtlasGlossaryTerm' &&
                        entity?.attributes?.categories?.length
                    ) {
                        if (
                            entity?.attributes?.categories?.find(
                                (category) =>
                                    category.guid === props.categoryGuid
                            )
                        ) {
                            return true
                        }
                    }
                    return false
                }) ?? []
        )
        const categories = computed(
            () =>
                entities.value?.filter((entity) => {
                    if (entity.typeName === 'AtlasGlossaryCategory' && entity?.attributes?.parentCategory)
                        return (
                            entity.typeName === 'AtlasGlossaryCategory' &&
                            entity?.attributes?.parentCategory?.guid ===
                                props.categoryGuid
                        )
                    return false
                }) ?? []
        )
        const all = computed(() => [...terms.value, ...categories.value])

        const onSearch = useDebounceFn(() => {
            fetchAssetsPaginated({query: `${searchQuery.value ? `${searchQuery.value}` : '' }`, offset: 0})
        }, 200)    
            
        const loadMore = () => {
            fetchAssetsPaginated({})
        }

        return {
            categoryQualifiedName,
            searchQuery,
            all,
            terms,
            categories,
            onSearch,
            onEntitySelect,
            loadMore,
            selectedEntity,
            isLoading,
        }
    },
})
</script>
<style lang="less">
.secondaryHeading {
    @apply tracking-widest text-xs text-gray leading-5;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>