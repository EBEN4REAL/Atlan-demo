<template>
    <div class="px-6">
        <div class="mb-4">
            <div class="flex space-x-2">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${all.length} assets...`"
                @change="onSearch"
            ></a-input-search>
            <a-popover title="Customise" trigger="click">
                <template #content>
                    <div class="w-32">
                        <a-checkbox-group
                            v-model:value="projection"
                            name="checkboxgroup"
                            :options="projectionOptions"
                        />
                    </div>
                </template>
                <a-button class="p-2 flex align-middle">
                    <fa icon="fal ellipsis-v" />
                </a-button>
            </a-popover>
            </div>

            <div class="my-2">
                <GtcFilters />
            </div>
        </div>
        <div v-if="isLoading && !all.length">
            <LoadingView />
        </div>
        <div v-else-if="all.length" class="flex flex-row w-full">
            <div class="w-full">
                <a-tabs type="card" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" :tab="`All (${all.length})`">
                        <div v-for="asset in all" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                :projection="projection"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="`Terms (${terms.length})`">
                        <div v-for="asset in terms" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                :projection="projection"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane
                        key="3"
                        :tab="`Categories (${categories.length})`"
                    >
                        <div v-for="asset in categories" :key="asset.guid">
                            <GtcEntityCard
                                :class="{ 'hover:bg-gray-100': true }"
                                :entity="asset"
                                :projection="projection"
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
import { defineComponent, computed, ref, toRef, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import LoadingView from '@common/loaders/page.vue'
import EmptyView from '@common/empty/discover.vue';
import GtcEntityCard from './gtcEntityCard.vue'
import GtcFilters from "./common/gtcFilters.vue";

import useGtcSearch from '~/composables/glossary/useGtcSearch'

import { Category, Term } from '~/types/glossary/glossary.interface'

export default defineComponent({
    components: { GtcEntityCard, EmptyView, LoadingView, GtcFilters },
    props: {
        qualifiedName: {
            type: String,
            required: true,
            default: '',
        },
    },
    emits: ['entityPreview'],
    setup(props, context) {
        const glossaryQualifiedName = toRef(props, 'qualifiedName');
        const searchQuery = ref<string>()

        const { entities, error, isLoading, fetchAssetsPaginated } = useGtcSearch(glossaryQualifiedName)

        const selectedEntity = ref<Category | Term>()

        const projectionOptions = [
            { value: 'description', label: 'Description' },
            { value: 'owners', label: 'Owners' },
            // { value: 'heirarchy', label: 'Heirarchy' },
            // { value: 'rows', label: 'Rows' },
            // { value: 'popularity', label: 'Popularity' },
            // { value: 'classifications', label: 'Classifications' },
        ]
        const projection = ref(['heirarchy', 'description'])


        const onEntitySelect = (entity: Category | Term) => {
            selectedEntity.value = entity
        }

        const terms = computed(
            () =>
                entities.value?.filter(
                    (entity) => entity.typeName === 'AtlasGlossaryTerm'
                ) ?? []
        );
        const categories = computed(
            () =>
                entities.value?.filter(
                    (entity) => entity.typeName === 'AtlasGlossaryCategory'
                ) ?? []
        );
        const all = computed(() => entities.value ?? [])

        const onSearch = useDebounceFn(() => {
            fetchAssetsPaginated({query: `${searchQuery.value ? `${searchQuery.value}` : '' }`, offset: 0})
        }, 400)

        const loadMore = () => {
            fetchAssetsPaginated({})
        }

        watch(selectedEntity, (newSelectedEntity) => {
            context.emit('entityPreview', newSelectedEntity)
        })

        return {
            glossaryQualifiedName,
            searchQuery,
            all,
            entities,
            terms,
            categories,
            onSearch,
            onEntitySelect,
            loadMore,
            selectedEntity,
            isLoading,
            projectionOptions,
            projection,
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