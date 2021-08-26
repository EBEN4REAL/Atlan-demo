<template>
    <div>
        <div class="p-4 bg-gray-100">
            <div class="flex mb-2 space-x-2">
                <a-input-search
                    v-model:value="searchQuery"
                    :placeholder="`Search ${qualifiedName.split('@'[1])}...`"
                    @change="onSearch"
                ></a-input-search>
                <a-popover trigger="click">
                    <template #content>
                        <p class="mb-1 text-gray-500">Show/Hide</p>
                        <div class="w-32">
                            <a-checkbox-group
                                v-model:value="projection"
                                name="checkboxgroup"
                                :options="projectionOptions"
                            />
                        </div>
                    </template>
                    <a-button class="p-1 ml-2 rounded">
                        <AtlanIcon icon="FilterDot" class="h-6" />
                    </a-button>
                </a-popover>
            </div>
            <!-- <div>
                <GtcFilters @filterUpdated="updateFilters" />
            </div> -->
        </div>
        <div v-if="isLoading && !all.length">
            <LoadingView />
        </div>
        <div v-else-if="all.length" class="flex flex-row w-full mt-4">
            <div class="w-full">
                <a-tabs default-active-key="1" class="border-0">
                    <!-- TODO: fix tab-pane header UI  -->
                    <a-tab-pane key="1" :tab="`All (${all.length})`">
                        <!-- list starts here -->
                        <!-- TODO: make panel scrollable -->
                        <div class="overflow-auto" style="max-height: 380px">
                            <div v-for="asset in all" :key="asset.guid">
                                <GtcEntityCard
                                    :class="{
                                        'hover:bg-gray-100': true,
                                        'bg-blue-50':
                                            selectedEntity?.guid === asset.guid,
                                    }"
                                    :entity="asset"
                                    :projection="projection"
                                    @gtcCardClicked="onEntitySelect"
                                />
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="`Terms (${terms.length})`">
                        <!--? why max-height is fixed to 380px  -->
                        <div class="overflow-auto" style="max-height: 380px">
                            <div v-for="asset in terms" :key="asset.guid">
                                <GtcEntityCard
                                    :class="{ 'hover:bg-gray-100': true }"
                                    :entity="asset"
                                    :projection="projection"
                                    @gtcCardClicked="onEntitySelect"
                                />
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane
                        key="3"
                        :tab="`Categories (${categories.length})`"
                    >
                        <!--? why max-height is fixed to 380px  -->
                        <div class="overflow-auto" style="max-height: 380px">
                            <div v-for="asset in categories" :key="asset.guid">
                                <GtcEntityCard
                                    :class="{ 'hover:bg-gray-100': true }"
                                    :entity="asset"
                                    :projection="projection"
                                    @gtcCardClicked="onEntitySelect"
                                />
                            </div>
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
    import { defineComponent, computed, ref, toRef, watch, PropType } from 'vue'
    import { useDebounceFn } from '@vueuse/core'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import EmptyView from '@common/empty/discover.vue'
    import GtcEntityCard from './gtcEntityCard.vue'
    import GtcFilters from './common/gtcFilters.vue'

    // composables
    import useGtcSearch from '~/composables/glossary/useGtcSearch'

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: { GtcEntityCard, EmptyView, LoadingView, GtcFilters },
        props: {
            qualifiedName: {
                type: String,
                required: true,
                default: '',
            },
            guid: {
                type: String,
                required: true,
                default: '',
            },
            type: {
                type: String as PropType<
                    'AtlasGlossary' | 'AtlasGlossaryCategory'
                >,
                required: true,
                default: 'AtlasGlossary',
            },
        },
        emits: ['entityPreview'],
        setup(props, context) {
            // data
            const glossaryQualifiedName = toRef(props, 'qualifiedName')
            const searchQuery = ref<string>()
            const selectedEntity = ref<Category | Term>()
            const projection = ref(['status', 'description', 'owners'])
            const { entities, error, isLoading, fetchAssetsPaginated } =
                useGtcSearch(glossaryQualifiedName)

            const projectionOptions = [
                { value: 'description', label: 'Description' },
                { value: 'owners', label: 'Owners' },
                { value: 'status', label: 'Status' },
                // { value: 'heirarchy', label: 'Heirarchy' },
                // { value: 'rows', label: 'Rows' },
                // { value: 'popularity', label: 'Popularity' },
                // { value: 'classifications', label: 'Classifications' },
            ]

            // computed
            const terms = computed(() => {
                if (props.type === 'AtlasGlossary') {
                    return (
                        entities.value?.filter(
                            (entity) => entity.typeName === 'AtlasGlossaryTerm'
                        ) ?? []
                    )
                }
                if (props.type === 'AtlasGlossaryCategory') {
                    return (
                        entities.value?.filter((entity) => {
                            if (
                                entity.typeName === 'AtlasGlossaryTerm' &&
                                entity?.attributes?.categories?.length
                            ) {
                                if (
                                    entity?.attributes?.categories?.find(
                                        (category) =>
                                            category.guid === props.guid
                                    )
                                ) {
                                    return true
                                }
                            }
                            return false
                        }) ?? []
                    )
                }
                return []
            })
            const categories = computed(() => {
                if (props.type === 'AtlasGlossary') {
                    return (
                        entities.value?.filter(
                            (entity) =>
                                entity.typeName === 'AtlasGlossaryCategory'
                        ) ?? []
                    )
                }
                if (props.type === 'AtlasGlossaryCategory') {
                    return (
                        entities.value?.filter((entity) => {
                            if (
                                entity.typeName === 'AtlasGlossaryCategory' &&
                                entity?.attributes?.parentCategory
                            )
                                return (
                                    entity.typeName ===
                                        'AtlasGlossaryCategory' &&
                                    entity?.attributes?.parentCategory?.guid ===
                                        props.guid
                                )
                            return false
                        }) ?? []
                    )
                }
                return []
            })
            const all = computed(
                () => [...terms.value, ...categories.value] ?? []
            )

            // methods
            const onEntitySelect = (entity: Category | Term) => {
                selectedEntity.value = entity
            }
            const onSearch = useDebounceFn(() => {
                fetchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }, 400)

            const loadMore = () => {
                fetchAssetsPaginated({})
            }

            const updateFilters = (filters: any) => {
                fetchAssetsPaginated({ filters, offset: 0 })
            }

            // lifecycle methods and watchers
            watch(selectedEntity, (newSelectedEntity) => {
                context.emit('entityPreview', newSelectedEntity)
            })

            // watch(entities, (newEntities) => {
            //     selectedEntity.value = newEntities[0]
            // })

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
                updateFilters,
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
