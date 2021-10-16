<template>
    <div>
        <!-- top section -->
        <div class="relative p-4 bg-gray-100 shadow">
            <div class="flex">
                <!-- close filtersPane -->
                <a-button
                    v-if="showFiltersPane"
                    class="absolute z-30 px-0 border-l-0 rounded-none rounded-r shadow-md  -left-1"
                    @click="showFiltersPane = !showFiltersPane"
                >
                    <AtlanIcon
                        icon="ChevronDown"
                        class="h-4 ml-1 transition-transform transform rotate-90 "
                    />
                </a-button>
                <!-- filters -->
                <a-button
                    class="flex items-center w-8 h-8 p-2 border-r-0 rounded-none rounded-l "
                    @click="showFiltersPane = !showFiltersPane"
                    :class="{ 'ml-4': showFiltersPane }"
                >
                    <AtlanIcon icon="FilterFunnel" />
                </a-button>
                <!-- search box -->
                <a-input-search
                    v-model:value="searchQuery"
                    :placeholder="`Search terms and categories`"
                    @change="onSearch"
                    class="rounded-none rounded-r"
                ></a-input-search>
                <!-- projections  -->
                <Projections
                    :projectionOptions="projectionOptions"
                    @projectionChange="handleProjectionChange"
                />
            </div>
        </div>
        <!-- asset list starts here -->
        <div v-if="isLoading && !all.length">
            <LoadingView />
        </div>
        <div v-else-if="all.length" class="flex flex-row w-full">
            <div
                ref="scrollDiv"
                class="w-full"
                :style="
                    headerReachedTop ? 'max-height: calc(100vh - 220px)' : ''
                "
                @scroll="handleScroll"
                :class="{ 'overflow-y-auto ': headerReachedTop }"
            >
                <div ref="topSectionRef"></div>

                <div>
                    <AssetList
                        :list="all"
                        :projection="projection"
                        :isLoading="isLoading"
                        :selectedEntity="selectedEntity"
                        @loadMore="loadMore"
                        @gtcCardClicked="onEntitySelect"
                        @bulkSelectChange="
                            (list) => $emit('bulkSelectChange', list)
                        "
                    />
                </div>
            </div>
        </div>
        <div v-else-if="!all.length" class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div>
        <!-- list ends here -->
        <!-- filters pane in left -->
        <teleport to="#filterPane">
            <a-drawer
                v-if="showFiltersPane"
                :visible="showFiltersPane"
                placement="left"
                :mask="false"
                :get-container="false"
                :wrap-style="{
                    position: 'absolute',
                    width: '100%',
                }"
                width="100%"
                :keyboard="false"
                :destroy-on-close="true"
                :closable="false"
                :class="$style.drawerClasses"
            >
                <div class="h-full">
                    <Filters
                        :initialFilters="initialFilters"
                        @filterUpdated="updateFilters"
                        @initialize="handleFilterInitialize"
                    />
                </div>
            </a-drawer>
        </teleport>
        <!-- sidebar drawer for terms and category preview -->
        <teleport to="#sidePanel">
            <a-drawer
                v-if="selectedEntity?.guid !== undefined && showPreviewPanel"
                :visible="
                    selectedEntity?.guid !== undefined && showPreviewPanel
                "
                placement="right"
                :mask="false"
                :get-container="false"
                :wrap-style="{ position: 'absolute', width: '100%' }"
                :keyboard="false"
                :destroy-on-close="true"
                :closable="false"
                width="100%"
            >
                <GtcPreview
                    :entity="selectedEntity"
                    @closePreviewPanel="handlClosePreviewPanel"
                    @updateAsset="updateSelectedAsset"
                />
            </a-drawer>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        toRef,
        watch,
        PropType,
        provide,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import EmptyView from '@common/empty/discover.vue'
    import GtcPreview from '~/components/glossary/sidebar/gtcPreview.vue'
    import AssetList from '~/components/glossary/profile/termsAndCategories/assetList.vue'
    import Projections from '@/glossary/profile/termsAndCategories/projections.vue'
    import Filters from '@/glossary/profile/termsAndCategories/filters.vue'

    // composables
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            AssetList,
            EmptyView,
            LoadingView,
            Projections,
            GtcPreview,
            Filters,
        },
        props: {
            qualifiedName: {
                type: String,
                required: true,
                default: '',
            },
            displayText: {
                type: String,
                required: false,
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
            showPreviewPanel: {
                type: Boolean,
                required: true,
                default: false,
            },
            headerReachedTop: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['entityPreview', 'firstCardReachedTop', 'bulkSelectChange'],
        setup(props, { emit }) {
            // data
            const glossaryQualifiedName = computed(() => props.qualifiedName)

            const searchQuery = ref<string>()
            const activeKey = ref(0)
            const selectedEntity = ref<Category | Term>()
            const showFiltersPane = ref(false)
            const topSectionRef = ref(null)
            const scrollDiv = ref(null)
            const initialFilters = ref()
            const projection = ref([
                'status',
                'description',
                'owners',
                'linkedAssets',
            ])
            const {
                entities,
                referredEntities,
                error,
                isLoading,
                fetchAssetsPaginated,
                fetchAssets,
                deleteEntityFromList,
            } = useGtcSearch(glossaryQualifiedName)

            const projectionOptions = [
                { value: 'categories', label: 'Categories' },
                { value: 'checkbox', label: 'Checkbox' },
                { value: 'classifications', label: 'Classifications' },
                { value: 'description', label: 'Description' },
                { value: 'linkedAssets', label: 'Linked Assets' },
                { value: 'owners', label: 'Owners' },
                { value: 'status', label: 'Status' },
                // { value: 'rows', label: 'Rows' },
                // { value: 'popularity', label: 'Popularity' },
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
            const handlClosePreviewPanel = () => {
                selectedEntity.value = undefined
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

            const updateSelectedAsset = (updatedAsset) => {
                const idx = entities.value?.findIndex(
                    (ast) => ast.guid === updatedAsset.guid
                )
                if (idx > -1) entities.value[idx] = updatedAsset
            }

            const handleFetchList = (entity: Category | Term) => {
                deleteEntityFromList(entity?.guid)
            }

            const handleScroll = (e) => {
                if (scrollDiv.value?.scrollTop < 2) {
                    emit('firstCardReachedTop')
                }
            }
            const handleProjectionChange = (newProjection) => {
                projection.value = newProjection.value
            }

            const updateFilters = (filters: any) => {
                fetchAssetsPaginated({ filters, offset: 0 })
            }
            const handleFilterInitialize = (value) => {
                initialFilters.value = value
            }
            // lifecycle methods and watchers and  providers
            watch(selectedEntity, (newSelectedEntity) => {
                emit('entityPreview', newSelectedEntity)
            })

            provide('handleFetchList', handleFetchList)
            provide('referredEntities', referredEntities)

            return {
                glossaryQualifiedName,
                searchQuery,
                all,
                entities,
                handleFetchList,
                onSearch,
                onEntitySelect,
                loadMore,
                updateFilters,
                handlClosePreviewPanel,
                updateSelectedAsset,
                selectedEntity,
                isLoading,
                projectionOptions,
                projection,
                activeKey,
                referredEntities,
                handleScroll,
                topSectionRef,
                scrollDiv,
                handleProjectionChange,
                showFiltersPane,
                initialFilters,
                handleFilterInitialize,
            }
        },
    })
</script>
<style lang="less" module>
    .secondaryHeading {
        @apply tracking-widest text-xs text-gray leading-5;
    }
    .glossaryTermsTab {
        :global(.ant-tabs-tabpane .ant-tabs-tabpane-active) {
            @apply h-1/3 overflow-auto;
        }
    }
    .drawerClasses {
        :global(.ant-drawer-wrapper-body) {
            @apply bg-gray-100 !important;
        }
    }
</style>

<style lang="less" scoped>
    .list {
        max-height: calc(100vh - 300px);
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
