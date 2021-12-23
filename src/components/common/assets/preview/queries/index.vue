<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
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
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div
            v-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div v-else-if="list.length === 0 && !isLoading" class="flex-grow">
            <EmptyView
                empty-screen="EmptyDiscover"
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
        >
            <template #default="{ item, itemIndex }">
                <AssetItem
                    :item="item"
                    :item-index="itemIndex"
                    :enable-sidebar-drawer="true"
                    class="m-1"
                    @updateDrawer="handleListUpdate"
                />
            </template>
        </AssetList>
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
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

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
            }
        },
    })
</script>
