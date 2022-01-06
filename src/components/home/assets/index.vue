<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col">
                <div
                    v-if="showAggrs && !isLoading && list.length > 0"
                    class="w-full"
                >
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
                v-if="isLoading"
                class="flex items-center justify-center flex-grow"
            >
                <AtlanIcon icon="Loader" class="w-auto h-10 animate-spin" />
            </div>
            <div
                v-if="!isLoading && error"
                class="flex items-center justify-center flex-grow"
            >
                <ErrorView />
            </div>
            <div
                v-else-if="list.length === 0 && !isLoading"
                class="flex items-center justify-center flex-grow"
            >
                <EmptyView
                    empty-screen="EmptyDiscover"
                    desc="No assets found"
                />
            </div>

            <!--                             :show-check-box="
                                preference?.display?.includes('enableCheckbox')
                            " -->
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
                        :enable-sidebar-drawer="true"
                        @updateDrawer="updateCurrentList"
                    ></AssetItem>
                </template>
            </AssetList>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        toRaw,
        PropType,
        defineComponent,
        ref,
        toRefs,
        Ref,
        computed,
        inject,
        watch,
    } from 'vue'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import { useDebounceFn } from '@vueuse/core'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import useAssetStore from '~/store/asset'
    import { discoveryFilters } from '~/constant/filters/discoveryFilters'

    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
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
            showCheckBox: {
                type: Boolean,
                required: false,
                default: false,
            },
            checkedCriteria: {
                type: String,
                required: false,
                default: 'guid',
            },
            staticUse: {
                type: Boolean,
                required: false,
                default: false,
            },
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
            enableSidebarDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            emptyViewText: {
                type: String,
                default: '',
            },
            dependentKey: {
                type: String,
                required: false,
                default: 'DEFAULT_ASSET_LIST_HOME',
            },
        },
        emits: ['listLoaded'],
        setup(props, { emit }) {
            const {
                preference: preferenceProp,
                checkedCriteria,
                dependentKey,
            } = toRefs(props)
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

            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const { initialFilters, page, projection } = toRefs(props)
            const discoveryStore = useAssetStore()

            // if (discoveryStore.activeFacet && page.value === 'assets') {
            //     facets.value = discoveryStore.activeFacet
            // }
            // if (discoveryStore.activePostFacet && page.value === 'assets') {
            //     postFacets.value = discoveryStore.activePostFacet
            // }
            // if (discoveryStore.preferences.sort) {
            //     preference.value.sort = discoveryStore.preferences.sort
            // }
            // if (discoveryStore.preferences.display) {
            //     preference.value.display = discoveryStore.preferences.display
            // }
            // if (discoveryStore.activeFacetTab?.length > 0) {
            //     activeKey.value = discoveryStore.activeFacetTab
            // } else {
            //     activeKey.value = ['hierarchy']
            // }
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
                fetch,
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
            })

            const updateCurrentList = (asset) => {
                updateList(asset)
            }

            const sendSearchEvent = useDebounceFn(() => {
                useAddEvent('discovery', 'search', 'changed')
            }, 600)

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                sendSearchEvent()
                quickChange()
            }, 100)

            const handleFilterChange = () => {
                offset.value = 0
                quickChange()
                discoveryStore.setActiveFacet(facets.value)
            }

            const handleAssetTypeChange = () => {
                offset.value = 0
                quickChange()
                discoveryStore.setActivePostFacet(postFacets.value)
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleChangePreference = () => {
                quickChange()
                discoveryStore.setPreferences(preference.value)
            }

            const handleDisplayChange = () => {
                discoveryStore.setPreferences(preference.value)
            }

            const handleResetEvent = () => {
                facets.value = {}
                queryText.value = ''
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const placeholder = computed(() => {
                const found = assetTypeAggregationList.value.find(
                    (item) => item.id === postFacets.value.typeName
                )

                if (found) {
                    console.log(found)
                    return `Search ${found.label.toLowerCase()} assets`
                }
                return 'Search all assets'
            })

            watch(isLoading, () => {
                if (!isLoading.value) {
                    emit('listLoaded', list.value.length)
                }
            })

            return {
                projection,
                handleFilterChange,
                isLoading,
                queryText,
                assetTypeAggregationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                handleLoadMore,
                handleAssetTypeChange,
                fetch,
                placeholder,
                handleSearchChange,
                isValidating,
                preference,
                handleChangePreference,
                handleResetEvent,
                dirtyTimestamp,
                handleDisplayChange,

                activeKey,
                discoveryFilters,
                error,

                updateCurrentList,
                searchDirtyTimestamp,
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
