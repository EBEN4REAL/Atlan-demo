<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col w-full h-full">
            <div class="w-full">
                <SearchAdvanced
                    v-model="queryText"
                    :autofocus="true"
                    :allow-clear="true"
                    @change="handleSearchChange"
                >
                    <template #postFilter>
                        <div style="max-width: 330px">
                            <PreferenceSelector
                                v-model="preference"
                                @change="fetchList(0)"
                            />
                        </div>
                    </template>
                </SearchAdvanced>
            </div>
            <div>
                <AggregationTabs
                    v-model="postFilters.typeName"
                    :list="assetTypeAggregationList"
                    @change="fetchList(0)"
                />
            </div>
            <div>
                <AssetList
                    :list="list"
                    :is-load-more="isLoadMore"
                    :is-loading="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template #default="{ item }">
                        <AssetItem
                            :preference="preference"
                            :item="item"
                        ></AssetItem>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, toRefs, watch } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import useFetchAssetList from '~/composables/discovery/useFetchAssetList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'AssetsV2',
        components: {
            SearchAdvanced,
            AggregationTabs,
            PreferenceSelector,
            AssetList,
            AssetItem,
        },
        props: {
            filters: {
                type: Object,
                default: () => {},
            },
            preference: {
                type: Object,
                default: () => ({
                    sort: 'default',
                    display: [],
                }),
            },
            attributes: {
                type: Array,
                default: () => [],
            },
            postFilters: {
                type: Object,
                default: () => ({
                    typeName: '__all',
                }),
            },
            aggregations: {
                type: Array,
                default: () => ['typeName'],
            },
        },
        setup(props) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const isCache = ref(true) // use SWRV or not
            const dependentKey = ref('DEFAULT_ASSET_LIST') // CacheKey for swrv, when changed causes asset list to get refetched

            // set all the attributes that would be fetched
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])

            const {
                filters,
                attributes,
                postFilters,
                aggregations,
                preference,
            } = toRefs(props)

            const {
                list,
                isLoadMore,
                quickChange,
                isValidating,
                assetTypeAggregationList,
            } = useFetchAssetList({
                queryText,
                offset,
                limit,
                facets: filters,
                postFacets: postFilters,
                aggregations,
                preference,
                isCache,
                dependentKey,
                attributes: attributes.value.length
                    ? attributes
                    : defaultAttributes,
            })

            const fetchList = (skip = 0) => {
                offset.value = skip
                quickChange()
            }

            // LOAD MORE
            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    fetchList((offset.value += limit.value))
                }
            }

            // SEARCH
            const handleSearchChange = useDebounceFn(() => {
                fetchList()
            }, 100)

            watch(
                [filters, preference, postFilters, aggregations],
                () => {
                    fetchList()
                },
                { deep: true }
            )

            return {
                limit,
                offset,
                queryText,
                list,
                preference,
                filters,
                postFilters,
                isLoadMore,
                isValidating,
                assetTypeAggregationList,
                fetchList,
                handleLoadMore,
                handleSearchChange,
            }
        },
    })
</script>

<style></style>
