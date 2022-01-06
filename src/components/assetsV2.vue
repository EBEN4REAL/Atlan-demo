<template>
    <div class="flex">
        <!-- <div><AssetFilters /></div> -->
        <div class="flex flex-col">
            <div>
                <SearchAdvanced
                    v-model="queryText"
                    :autofocus="true"
                    :allow-clear="true"
                    @change="handleSearchChange"
                >
                    <!-- <template #postFilter>
                        <div style="max-width: 330px">
                            <PreferenceSelector
                                v-model="preference"
                                @change="handleChangePreference"
                                @display="handleDisplayChange"
                            />
                        </div>
                    </template> -->
                </SearchAdvanced>
            </div>
            <div>
                <AggregationTabs />
            </div>
            <div>
                <AssetList
                    :list="list"
                    :is-load-more="isLoadMore"
                    :is-loading="isLoading"
                    :is-validating="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template #default="{ item }">
                        <AssetItem :item="item"></AssetItem>
                    </template>
                </AssetList>
                {{ isLoading }} {{ isValidating }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
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
            AssetFilters,
            SearchAdvanced,
            PreferenceSelector,
            AssetList,
            AssetItem,
        },
        props: {
            ownerUsers: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
            ownerGroups: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
        },
        setup(props) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const isCache = ref(true) // use SWRV or not
            const dependentKey = ref('DEFAULT_ASSET_LIST') // CacheKey for swrv, when changed causes asset list to get refetched
            facets.value = {
                owners: {
                    ownerUsers: props.ownerUsers,
                    ownerGroups: props.ownerGroups,
                },
            }
            // set all the attributes that would be fetched
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            console.log('ye wala')
            const { list, isLoadMore, quickChange, isLoading, isValidating } =
                useFetchAssetList({
                    queryText,
                    offset,
                    limit,
                    facets,
                    isCache,
                    dependentKey,
                    attributes: defaultAttributes,
                })

            // LOAD MORE
            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }
            // SEARCH
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 100)

            return {
                limit,
                offset,
                queryText,
                facets,
                list,
                isLoadMore,
                isLoading,
                isValidating,
                handleLoadMore,
                handleSearchChange,
            }
        },
    })
</script>

<style></style>
