<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div
            v-else-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>

        <div
            v-else-if="list.length === 0 && !isLoading && queryText === ''"
            class="flex-grow"
        >
            <EmptyView
                empty-screen="EmptyQueriesTab"
                desc="This asset doesn't have any saved queries"
                buttonText="Create a new query"
                buttonColor="secondary"
                @event="handleCreateQuery"
            ></EmptyView>
        </div>

        <div v-else class="flex flex-col flex-grow">
            <div class="px-4 pt-3 pb-0">
                <SearchAdvanced
                    v-model:value="queryText"
                    :autofocus="true"
                    :placeholder="`Search ${totalCount} queries`"
                    class=""
                    @change="handleSearchChange"
                />
            </div>

            <div
                v-if="list.length === 0 && !isLoading && queryText !== ''"
                class="flex items-center justify-center flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No queries found"
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
                class="mt-4"
            >
                <template #default="{ item, itemIndex }">
                    <Popover :item="item">
                        <AssetItem
                            :item="item"
                            :item-index="itemIndex"
                            :enable-sidebar-drawer="true"
                            class="mx-3"
                            @updateDrawer="handleListUpdate"
                    /></Popover>
                </template>
            </AssetList>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/select/sorting.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import AssetItem from '@common/assets/list/assetItem.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Popover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'ColumnWidget',
        components: {
            SearchAdvanced,
            AggregationTabs,
            AssetList,
            AssetItem,
            Sorting,
            EmptyView,
            ErrorView,
            Popover,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { queries, getAssetQueryPath } = useAssetInfo()
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeName: 'Query',
            })
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_QUERIES')
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

                facets.value.guidList = queries(selectedAsset.value)?.map(
                    (query) => query.guid
                )
            }

            updateFacet()

            const {
                list,
                isLoading,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                error,
                isValidating,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
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

            const handleCreateQuery = () => {
                window.open(getAssetQueryPath(selectedAsset.value))
            }

            return {
                isLoading,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleSearchChange,
                handleLoadMore,
                error,
                isValidating,
                handleListUpdate,
                handleCreateQuery,
            }
        },
    })
</script>
