<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="px-4 pt-3 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} related assets`"
                class=""
                @change="handleSearchChange"
            >
                <template #postFilter>
                    <div style="max-width: 330px">
                        <PreferenceSelector
                            v-model="preference"
                            @change="handleChangePreference"
                        />
                    </div>
                </template>
            </SearchAdvanced>
        </div>

        <AggregationTabs
            v-model="postFacets.typeName"
            class="px-3 mb-1"
            :list="assetTypeAggregationList"
            @change="handleAssetTypeChange"
        ></AggregationTabs>

        <div
            v-if="isLoading || isFetchingGuids"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-if="!isLoading && !isFetchingGuids && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div
            v-else-if="
                (list.length === 0 || guidList.length === 0) &&
                !isLoading &&
                !isFetchingGuids
            "
            class="flex-grow"
        >
            <EmptyView
                empty-screen="NoAssetsFound"
                image-class="h-44"
                desc="No related assets found"
            ></EmptyView>
        </div>
        <!-- {{ list }} -->
        <AssetList
            v-else
            :list="list"
            :is-load-more="isLoadMore"
            :is-loading="isValidating"
            @loadMore="handleLoadMore"
        >
            <template #default="{ item, itemIndex }">
                <AssetItem
                    :item="item"
                    :item-index="itemIndex"
                    :preference="preference"
                    :enable-sidebar-drawer="true"
                    :asset-name-truncate-percentage="'93%'"
                    class="mx-3"
                    @updateDrawer="updateCurrentList"
                ></AssetItem>
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
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { useRelations } from '~/composables/discovery/useRelations'
    import { whenever } from '@vueuse/core'

    export default defineComponent({
        name: 'RelationshipsTab',
        components: {
            SearchAdvanced,
            AggregationTabs,
            AssetList,
            AssetItem,
            PreferenceSelector,
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

            const {
                guidList,
                isLoading: isFetchingGuids,
                isReady: isGuidArrayReady,
            } = useRelations(selectedAsset)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})

            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
            const dependentKey = ref(null)
            const { customMetadataProjections } = useTypedefData()

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            const preference = ref({ sort: 'default', display: [] })
            const relationAttributes = ref([...AssetRelationAttributes])

            const updateFacet = () => {
                facets.value = {}
                facets.value.guidList = guidList.value
            }
            updateFacet()

            const {
                list,
                isLoading,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                assetTypeAggregationList,
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

            const updateCurrentList = (asset: any) => {
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

            const handleAssetTypeChange = (tabName) => {
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

            const handleChangePreference = () => {
                quickChange()
            }

            whenever(isGuidArrayReady, () => {
                dependentKey.value = 'RELATED_ASSET_LIST'

                updateFacet()

                fetch()
            })

            return {
                isLoading,
                isFetchingGuids,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                assetTypeAggregationList,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleAssetTypeChange,
                handleSearchChange,
                preference,
                handleChangeSort,
                handleLoadMore,
                handleChangePreference,
                error,
                isValidating,
                updateCurrentList,
                guidList,
            }
        },
    })
</script>
