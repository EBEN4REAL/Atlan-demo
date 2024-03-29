<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="flex items-center justify-between px-5 pt-4 pb-2">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Columns</span>
            </span>
        </div>

        <div class="px-5 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} columns`"
                class=""
                @change="handleSearchChange"
            >
                <template #sort>
                    <Sorting
                        v-model="preference.sort"
                        asset-type="Column"
                        @change="handleChangeSort"
                    ></Sorting>
                </template>
            </SearchAdvanced>
        </div>

        <AggregationTabs
            v-model="postFacets.dataType"
            class="px-5 mt-2 mb-2"
            :list="columnDataTypeAggregationList"
            @change="handleDataTypeChange"
        ></AggregationTabs>

        <div
            v-if="columnWithLineageCount"
            class="flex items-center px-5 my-2 text-new-gray-600 ebuka"
        >
            <a-checkbox
                :class="$style.checkbox_style"
                class="inline-flex items-center w-full"
                @change="handleLineageFilterChange"
            >
                Show columns with lineage ({{ columnWithLineageCount }})
            </a-checkbox>
        </div>

        <div
            v-if="!isValidating && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div v-else-if="list.length === 0 && !isValidating" class="flex-grow">
            <EmptyView
                empty-screen="NoAssetsFound"
                image-class="h-44"
                :desc="`No columns found ${queryText.length > 0 ? 'with ' + queryText : ''}`"
            ></EmptyView>
        </div>
        <div
            v-else-if="list.length === 0 && isValidating"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>
        <!-- {{ list }} -->
        <AssetList
            v-else
            ref="columnlistRef"
            :list="list"
            :is-load-more="false"
            class="column-list-container"
        >
            <template #default="{ item }">
                <ColumnItem
                    :item="item"
                    class="px-2 my-1"
                    :similar-list="similarListByName(item)"
                    @update="handleListUpdate"
                />
            </template>
        </AssetList>
        <div
            v-if="isValidating && list?.length !== 0"
            class="flex items-center justify-center w-full mb-4 text-new-gray-600"
        >
            Loading<span class="mx-1 font-bold">20</span>more...
            <AtlanLoader class="h-4 mb-0.5" />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        PropType,
    } from 'vue'
    import {
        debouncedWatch,
        useDebounceFn,
        useInfiniteScroll,
    } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/dropdown/sorting.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import ColumnItem from './assetItem.vue'

    import { DefaultRelationAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useEvaluate from '~/composables/auth/useEvaluate'
    import { assetInterface } from '~/types/assets/asset.interface'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { useSimilarList } from '~/composables/discovery/useSimilarList'
    import { getColumnCountWithLineage } from '~/components/common/assets/profile/tabs/lineage/util.js'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'ColumnWidget',
        components: {
            SearchAdvanced,
            AggregationTabs,
            AssetList,
            ColumnItem,
            Sorting,
            EmptyView,
            ErrorView,
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const aggregationAttributeName = 'dataType'
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeName: 'Column',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_COLUMNS_SIDEBAR_TAB')
            const filterByColumnsWithLineage = ref(false)
            const columnWithLineageCount = ref(null)
            const columnAttributes = ref([
                'name',
                'displayName',
                'description',
                'displayDescription',
                'userDescription',
                'certificateStatus',
                'certificateUpdatedBy',
                'meanings',
                'category',
                'dataType',
                'isPrimary',
                'isCustom',
                'isPartition',
                'isSort',
                'isIndexed',
                'isForeign',
                'isDist',
                'order',
                '__hasLineage',
            ])
            const defaultAttributes = ref([...columnAttributes.value])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([...DefaultRelationAttributes])

            const updateFacet = () => {
                facets.value = {}

                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'table' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'tablepartition'
                ) {
                    facets.value.tableQualifiedName =
                        selectedAsset.value?.attributes?.qualifiedName
                }
                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'view' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'materialisedview'
                ) {
                    facets.value.viewQualifiedName =
                        selectedAsset.value?.attributes?.qualifiedName
                }
            }

            updateFacet()

            const {
                list,
                freshList,
                isLoading,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                getAggregationList,
                error,
                isValidating,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })

            const handleListUpdate = (asset: any) => {
                updateList(asset)
            }

            getColumnCountWithLineage(
                selectedAsset.value,
                columnWithLineageCount
            )

            const handleLineageFilterChange = (e) => {
                filterByColumnsWithLineage.value = e.target.checked
                facets.value['__hasLineage'] = {
                    value: !!filterByColumnsWithLineage.value,
                }

                quickChange()
            }

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            const body = ref({})
            const { refresh } = useEvaluate(body, false, false, true) // true for columnEvaluations

            debouncedWatch(
                () => props.selectedAsset.attributes.qualifiedName,
                (prev) => {
                    if (prev) {
                        updateFacet()
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            const handleDataTypeChange = () => {
                console.log('change data type', facets.value)
                offset.value = 0
                quickChange()
            }

            const handleLoadMore = async () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                    await quickChange()
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleChangeSort = () => {
                list.value = []
                offset.value = 0
                quickChange()
            }

            const suggestionLimit = ref(0)
            const suggestionOffset = ref(0)
            const suggestionFacets = ref({
                typeNames: ['Column'],
                orExists: ['description', 'userDescription'],
                similarities: [],
            })
            const suggestionAggregations = ref(['name'])

            const { quickChange: quickSuggestionChange, similarListByName } =
                useSimilarList({
                    limit: suggestionLimit,
                    offset: suggestionOffset,
                    facets: suggestionFacets,
                    aggregations: suggestionAggregations,
                })

            const { title } = useAssetInfo()

            watch(
                () => [...freshList.value],
                () => {
                    // For evaluations
                    body.value = {
                        entities: freshList.value.map((item) => ({
                            typeName: item.typeName,
                            entityId: item?.attributes?.qualifiedName,
                            action: 'ENTITY_UPDATE',
                        })),
                    }
                    refresh()

                    // For getting description suggestions for all the columns
                    suggestionFacets.value = {
                        ...suggestionFacets.value,
                        similarities: freshList.value.map((item) =>
                            title(item)
                        ),
                    }

                    quickSuggestionChange()
                }
            )
            const columnlistRef = ref(null)

            useInfiniteScroll(
                columnlistRef,
                () => {
                    if (columnlistRef.value) {
                        handleLoadMore()
                    }
                },
                { distance: 10 }
            )

            return {
                isLoading,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                columnDataTypeAggregationList,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleDataTypeChange,
                handleSearchChange,
                preference,
                handleChangeSort,
                handleLoadMore,
                error,
                isValidating,
                handleListUpdate,
                columnAttributes,
                similarListByName,
                columnWithLineageCount,
                handleLineageFilterChange,
                columnlistRef,
            }
        },
    })
</script>

<style lang="less" module>
    .checkbox_style {
        :global(.ant-checkbox) {
            top: 0 !important;
        }
    }
</style>
