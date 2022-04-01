<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col">
                <div v-if="showAggrs && list.length > 0" class="w-full">
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class="mt-3"
                        :list="assetTypeAggregationList"
                        @change="handleAssetTypeChange"
                    >
                    </AggregationTabs>
                </div>
            </div>

            <div
                v-if="!isValidating && error"
                class="flex items-center justify-center flex-grow"
            >
                <ErrorView />
            </div>
            <div
                v-else-if="list.length === 0 && !isValidating"
                class="flex items-center justify-center flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    :desc="emptyText"
                />
            </div>
            <div
                v-else-if="list.length === 0 && isValidating"
                class="flex items-center justify-center flex-grow"
            >
                <AtlanLoader class="h-10" />
            </div>
            <AssetList
                v-else
                ref="assetlistRef"
                :list="list"
                :is-load-more="isLoadMore"
                :is-loading="isValidating"
                style="height: 350px"
                @loadMore="handleLoadMore"
            >
                <template #default="{ item }">
                    <AssetItem
                        :item="item"
                        :preference="preference"
                        :is-loading="isValidating"
                        class="hover:bg-primary-menu"
                        :enable-sidebar-drawer="true"
                        @updateDrawer="updateCurrentList"
                    ></AssetItem>
                </template>
            </AssetList>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRaw, PropType, defineComponent, ref, toRefs, watch } from 'vue'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    import {
        MinimalAttributes,
        DefaultRelationAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AggregationTabs,
            EmptyView,
            ErrorView,
            AssetItem,
        },
        props: {
            initialFilters: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            preference: {
                type: Object as PropType<any>,
                required: false,
                default: () => ({
                    sort: 'default',
                    display: [],
                }),
            },
            showAggrs: {
                type: Boolean,
                required: false,
                default: true,
            },

            dependentKey: {
                type: String,
                required: false,
                default: 'DEFAULT_ASSET_LIST_HOME',
            },
            emptyText: {
                type: String,
                required: false,
                default: 'No assets found',
            },
        },
        emits: ['listLoaded'],
        setup(props, { emit }) {
            const { preference: preferenceProp, dependentKey } = toRefs(props)
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})

            /* Assiging prefrence props if any from props */
            const preference = ref(toRaw(preferenceProp.value))
            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })

            const defaultAttributes = ref([...MinimalAttributes])
            const relationAttributes = ref([...DefaultRelationAttributes])

            const { initialFilters } = toRefs(props)

            if (props.initialFilters) {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
            }
            /* Watcher for parent component changes initial filters otherwise req won't be triggered */
            watch(initialFilters, () => {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
                quickChange()
            })

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                error,
                quickChange,
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

            const updateCurrentList = (asset) => {
                updateList(asset)
            }

            const handleAssetTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            watch(isValidating, () => {
                if (!isValidating.value) {
                    emit('listLoaded', list.value.length)
                }
            })

            return {
                isLoading,
                queryText,
                assetTypeAggregationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                handleLoadMore,
                handleAssetTypeChange,
                isValidating,
                preference,
                error,
                updateCurrentList,
            }
        },
    })
</script>

<style lang="less">
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
</style>
