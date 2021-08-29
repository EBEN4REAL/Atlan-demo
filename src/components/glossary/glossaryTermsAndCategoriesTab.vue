<template>
    <div>
        <div class="p-4 bg-gray-100">
            <div class="flex mb-2 space-x-2">
                <a-input-search
                    v-model:value="searchQuery"
                    :placeholder="`Search ${qualifiedName.split('@'[1])}....`"
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
                <a-tabs
                    v-model:activeKey="activeKey"
                    default-active-key="1"
                    class="border-0"
                    :class="$style.glossaryTermsTab"
                >
                    <a-tab-pane v-for="(item, idx) in assetTypeList" :key="idx">
                        <template #tab>
                            <div class="flex items-center">
                                <p
                                    class="my-0"
                                    :class="{
                                        'text-primary': activeKey === idx,
                                    }"
                                >
                                    {{ item.name }}
                                </p>
                                <div
                                    v-if="item.list.length"
                                    class="px-2 mx-2"
                                    :class="
                                        activeKey === idx
                                            ? 'bg-primary-light text-primary'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                >
                                    {{ item.list.length }}
                                </div>
                            </div>
                        </template>
                        <div
                            class="overflow-auto"
                            style="max-height: calc(100vh - 380px)"
                        >
                            <AssetList
                                :list="item.list"
                                :projection="projection"
                                :isLoading="isLoading"
                                @loadMore="loadMore"
                                @gtcCardClicked="onEntitySelect"
                            />
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <div v-else-if="!all.length" class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div>
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
                <CategoryTermPreview
                    :entity="selectedEntity"
                    @closePreviewPanel="handlClosePreviewPanel"
                    @updateAsset="updateSelectedAsset"
                />
            </a-drawer>
        </teleport>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, toRef, watch, PropType } from 'vue'
    import { useDebounceFn } from '@vueuse/core'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import EmptyView from '@common/empty/discover.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
    import GtcEntityCard from './gtcEntityCard.vue'
    import GtcFilters from './common/gtcFilters.vue'
    import AssetList from '@/glossary/common/assetList.vue'

    // composables
    import useGtcSearch from '~/composables/glossary/useGtcSearch'

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            AssetList,
            GtcEntityCard,
            EmptyView,
            LoadingView,
            GtcFilters,
            CategoryTermPreview,
        },
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
            showPreviewPanel: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['entityPreview'],
        setup(props, { emit }) {
            // data
            const glossaryQualifiedName = toRef(props, 'qualifiedName')
            const searchQuery = ref<string>()
            const activeKey = ref(0)
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

            const assetTypeList = computed(() => [
                { name: 'All', list: [...all.value] },
                { name: 'Terms', list: [...terms.value] },
                { name: 'Categories', list: [...categories.value] },
            ])

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

            const updateFilters = (filters: any) => {
                fetchAssetsPaginated({ filters, offset: 0 })
            }

            const updateSelectedAsset = (updatedAsset) => {
                const idx = entities.value?.findIndex(
                    (ast) => ast.guid === updatedAsset.guid
                )
                if (idx > -1) entities.value[idx] = updatedAsset
            }

            // lifecycle methods and watchers
            watch(selectedEntity, (newSelectedEntity) => {
                emit('entityPreview', newSelectedEntity)
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
                updateFilters,
                handlClosePreviewPanel,
                updateSelectedAsset,
                selectedEntity,
                isLoading,
                projectionOptions,
                projection,
                activeKey,
                assetTypeList,
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
