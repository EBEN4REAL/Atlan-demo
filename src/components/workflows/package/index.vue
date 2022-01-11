<template>
    <div class="px-6 py-2">
        <AggregationTabs
            :list="getAggregationByType"
            v-model="postFacets.typeName"
            @change="handlePackageTypeChange"
        ></AggregationTabs>
    </div>
    <div class="flex h-full overflow-y-auto">
        <WorkflowList
            :list="list"
            class="px-6 mb-4"
            @select="handleSelect"
        ></WorkflowList>
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
            const packageLimit = ref(20)
            const packageOffset = ref(0)
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const postFacets = ref({
                typeName: '__all',
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
                quickChange: quickChangePackage,
                list,
                getAggregationByType,
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
                offset.value = 0
                quickChangePackage()
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
