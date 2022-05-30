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

    export default defineComponent({
        components: {
            SearchAndFilter,
        },
        setup() {
            const limit = ref(100)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const globalState = ref([])
            const selectedAssetId = ref('')

            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: 'Connection',
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
            })

            const handleSearchChange = () => {
                offset.value = 0
                quickChange()
            }

            watch(queryText, () => {
                handleSearchChange()
            })

            return {
                handleSearchChange,
                queryText,
            }
        },
    })
</script>
