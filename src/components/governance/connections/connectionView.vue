<template>
    <div class="px-6 py-7">
        <span class="text-xl">Connections</span>
        <div class="w-1/3 mt-4">
            <SearchAndFilter
                v-model:value="queryText"
                :placeholder="`Search Connections`"
                class="max-w-lg shadow-none filter-request"
                :autofocus="true"
                size="default"
            >
            </SearchAndFilter>
        </div>
        <div class="my-4">
            <AggregationTabs
                v-model="postFacets.connectorName"
                class="overflow-auto"
                :list="connectorAggregateList"
                :shortcut-enabled="false"
                :useImagePath="true"
                @change="handleConnectorTypeChange"
            >
            </AggregationTabs>
        </div>
        <div class="grid grid-cols-4 gap-4 gap-y-6 mt-7 pb-7">
            <ConnectorCard
                v-for="item in list"
                :key="item.guid"
                :item="item"
                :selected-guid="selectedAsset.guid"
            ></ConnectorCard>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted, watch, ref } from 'vue'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ConnectorCard from './connectorCard.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    export default defineComponent({
        components: {
            SearchAndFilter,
            ConnectorCard,
            AggregationTabs,
        },
        setup() {
            const limit = ref(100)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeName: 'Connection',
            })
            const globalState = ref([])
            const selectedAssetId = ref('')
            const preference = ref({
                sort: 'name.keyword-asc',
            })

            const aggregations = ref(['connectorName'])
            const postFacets = ref({
                connectorName: '__all',
            })

            const dependentKey = ref('connectionsList' || 'DEFAULT_ASSET_LIST')

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
            ])

            const relationAttributes = ref([...AssetRelationAttributes])

            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const hierarchyDirtyTimestamp = ref(
                `dirty_${Date.now().toString()}`
            )
            const searchBox: Ref<null | HTMLInputElement> = ref(null)

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                connectorAggregateList,
                isLoadMore,
                isValidating,
                fetch,

                error,
                selectedAsset,
                quickChange,
                updateList,
                rotateAggregateTab,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                globalState,
                suppressLogs: true,
                preference: preference,
            })

            const handleSearchChange = () => {
                offset.value = 0
                quickChange()
            }
            const handleConnectorTypeChange = (tabName) => {
                offset.value = 0
                quickChange()
                // if (page.value !== 'admin')
                //     discoveryStore.setActivePostFacet(postFacets.value)
            }

            watch(queryText, () => {
                handleSearchChange()
            })

            return {
                handleSearchChange,
                queryText,
                list,
                selectedAsset,
                postFacets,
                assetTypeAggregationList,
                connectorAggregateList,
                handleConnectorTypeChange,
                facets,
            }
        },
    })
</script>
