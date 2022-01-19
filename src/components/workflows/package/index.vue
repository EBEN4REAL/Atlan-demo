<template>
    <div class="px-6 py-2">
        <AggregationTabs
            :list="getAggregationByType"
            v-model="postFacets.typeName"
            @change="handlePackageTypeChange"
        ></AggregationTabs>
    </div>
    <div class="flex flex-col h-full overflow-y-auto">
        <div
            v-if="isLoading || isLoadingPackage"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>

        <div
            v-else-if="list.length === 0 && !isLoading && !isLoadingPackage"
            class="flex-grow"
        >
            <EmptyView
                empty-screen="EmptyDiscover"
                desc="No packages found"
                class="mb-10"
            ></EmptyView>
        </div>
        <div
            v-else-if="
                !isLoading && !isLoadingPackage && (error || errorPackage)
            "
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>

        <WorkflowList
            v-else
            :list="list"
            class="px-6 mb-4"
            @select="handleSelect"
        ></WorkflowList>
        <div
            v-if="(isLoadMore || isLoadingPackage) && list.length > 0"
            class="flex items-center justify-center"
        >
            <button
                :disabled="isLoadingPackage"
                class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                :class="isLoadingPackage ? 'px-2 w-9' : 'px-2'"
                @click="handleLoadMore"
            >
                <template v-if="!isLoadingPackage">
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </template>
                <AtlanLoader v-else class="h-10" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        watch,
        provide,
        inject,
        toRefs,
    } from 'vue'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import WorkflowList from './list/index.vue'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: {
            WorkflowList,
            AggregationTabs,
            EmptyView,
            ErrorView,
        },
        emits: ['setup', 'sandbox', 'select'],
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => {},
            },
        },
        setup(props, { emit }) {
            const { queryText } = toRefs(props)

            const activeKey = ref(['sourceCategory_0'])

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

            const queryInput = ref(queryText.value)

            const limit = ref(0)
            const offset = ref(0)

            const facets = ref({
                ui: true,
            })
            const dependentKey = ref('DEFAULT_PACKAGES')
            const aggregationWorkflow = ref(['package'])
            const {
                isLoading,
                error,
                quickChange,
                workflowDistinctList,
                workflowMapByPackage,
                packageList: packageListFromWorkflows,
            } = useWorkflowDiscoverList({
                isCache: true,
                dependentKey,
                facets,
                limit,
                offset,

                source: ref({
                    excludes: ['spec'],
                }),
                aggregations: aggregationWorkflow,
            })

            const packageList = ref([])
            const dependentKeyPackage = ref('')
            const facetPackage = ref({})
            const packageLimit = ref(10)
            const packageOffset = ref(0)
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const postFacets = ref({
                typeName: 'connector',
            })
            const aggregationPackage = ref(['by_type'])
            watch(packageListFromWorkflows, () => {
                const map = Object.keys(packageListFromWorkflows.value)

                // Fetch all packages
                facetPackage.value = {
                    packageNames: map,
                }
                dependentKeyPackage.value = `DEFAULT_PACKAGES_SEARCH`
                quickChangePackage()

                console.log('workflowDistinct', workflowDistinctList.value)

                // Fetch runs
                facetRun.value = {
                    workflowTemplates: workflowDistinctList.value,
                }
                quickChangeRun()
            })

            const handlePreview = inject('preview')

            const {
                isLoading: isLoadingPackage,
                error: errorPackage,
                quickChange: quickChangePackage,
                list,
                getAggregationByType,
                isLoadMore,
            } = usePackageDiscoverList({
                isCache: true,
                dependentKey: dependentKeyPackage,
                facets: facetPackage,
                postFacets,
                limit: packageLimit,
                offset: packageOffset,
                queryText: queryInput,
                aggregations: aggregationPackage,
            })

            debouncedWatch(
                queryText,
                () => {
                    queryInput.value = queryText.value
                    quickChangePackage()
                },
                { debounce: 100 }
            )

            // watch(packageFetchList, () => {
            //     packageList.value = packageList.value.concat(
            //         packageFetchList.value
            //     )
            // })

            const dependentKeyRun = ref('')
            const facetRun = ref({})
            const aggregationRun = ref(['status'])
            const { quickChange: quickChangeRun, runByWorkflowMap } =
                useRunDiscoverList({
                    isCache: false,
                    dependentKey: dependentKeyRun,
                    facets: facetRun,
                    limit: ref(0),
                    offset,
                    aggregations: aggregationRun,
                    queryText,
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                })

            provide('runMap', runByWorkflowMap)
            provide('workflowMap', workflowMapByPackage)

            // watch(list, () => {
            //     console.log('changed list')
            //     facetRun.value = {
            //         workflowTemplates: list.value.map(
            //             (item) => item.metadata.name
            //         ),
            //     }
            //     quickChangeRun()
            // })

            const handleFilterChange = () => {
                offset.value = 0

                quickChange()
            }

            const placeholder = computed(() => 'Search all packages')

            const selectedPackage = ref<any>(null)

            const handleSelect = (item) => {
                selectedPackage.value = item
                handlePreview(item)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleResetEvent = () => {
                facets.value = {
                    verified: true,
                }
                queryText.value = ''
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handlePackageTypeChange = (tabName) => {
                packageOffset.value = 0
                quickChangePackage()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    packageOffset.value += packageLimit.value
                    quickChangePackage()
                }
            }

            return {
                placeholder,
                dirtyTimestamp,
                searchDirtyTimestamp,
                isLoading,
                list,
                handleSelect,
                selectedPackage,
                queryText,
                error,

                facets,
                handleSetupSandbox,
                handleSetup,
                handleFilterChange,
                handleSearchChange,
                activeKey,
                handleResetEvent,
                preference,
                quickChangeRun,
                dependentKeyPackage,
                facetPackage,
                quickChangePackage,
                packageLimit,
                packageOffset,

                packageList,
                runByWorkflowMap,
                aggregationWorkflow,
                packageListFromWorkflows,
                workflowDistinctList,
                workflowMapByPackage,
                handlePreview,
                aggregationPackage,
                postFacets,
                getAggregationByType,
                handlePackageTypeChange,
                isLoadingPackage,
                errorPackage,
                isLoadMore,
                handleLoadMore,
            }
        },
    })
</script>

<style lang="less">
    .filters {
        max-width: 264px;
        width: 25%;
    }
</style>
