<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="px-4 pt-3 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} columns`"
                class=""
                @change="handleSearchChange"
            >
                <template #postFilter>
                    <div class="flex items-center justify-between py-1 rounded">
                        <p class="mr-4 text-sm text-gray-500">Sort By</p>

                        <Sorting
                            v-model="preference.sort"
                            asset-type="Column"
                            @change="handleChangeSort"
                        ></Sorting>
                    </div>
                </template>
            </SearchAdvanced>
        </div>

        <AggregationTabs
            v-model="postFacets.dataType"
            class="px-3 mb-1"
            :list="columnDataTypeAggregationList"
            @change="handleDataTypeChange"
        ></AggregationTabs>

        <div
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
             <AtlanLoader class="h-10" />
        <AtlanLoader class="h-10" />

        </div>
        <div
            v-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div v-else-if="list.length === 0 && !isLoading" class="flex-grow">
            <EmptyView
                empty-screen="NoAssetsFound"
                image-class="h-44"
                desc="No columns found"
            ></EmptyView>
        </div>
        <!-- {{ list }} -->
        <AssetList
            v-else
            ref="assetlistRef"
            :list="list"
            :is-load-more="isLoadMore"
            :is-loading="isValidating"
            @loadMore="handleLoadMore"
        >
            <template #default="{ item }">
                <ColumnItem
                    :item="item"
                    class="m-1"
                    @update="handleListUpdate"
                />
            </template>
        </AssetList>
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
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/select/sorting.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import ColumnItem from './assetItem.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useEvaluate from '~/composables/auth/useEvaluate'
    import { assetInterface } from '~/types/assets/asset.interface'

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
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
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
            const dependentKey = ref('DEFAULT_COLUMNS')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([...AssetRelationAttributes])

            const updateFacet = () => {
                facets.value = {}
                if (selectedAsset?.value.typeName?.toLowerCase() === 'table') {
                    facets.value.tableQualifiedName =
                        selectedAsset?.value.attributes.qualifiedName
                }
                if (selectedAsset?.value.typeName?.toLowerCase() === 'view') {
                    facets.value.viewQualifiedName =
                        selectedAsset?.value.attributes.qualifiedName
                }
            }

            updateFacet()

            const {
                list,
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

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            const body = ref({})
            const { refresh } = useEvaluate(body, false)

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

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleChangeSort = () => {
                quickChange()
            }

            watch(list, () => {
                // For evaluations
                body.value = {
                    entities: list.value.map((item) => ({
                        typeName: item.typeName,
                        entityGuid: item.guid,
                        action: 'ENTITY_UPDATE',
                    })),
                }
                refresh()
            })

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
            }
        },
    })
</script>
