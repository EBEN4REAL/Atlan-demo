<template>
    <WorkflowList
        :list="list"
        class="px-6 mb-4"
        @select="handleSelect"
    ></WorkflowList>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch, provide } from 'vue'

    import WorkflowList from './list/index.vue'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import { useDebounceFn } from '@vueuse/core'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: {
            WorkflowList,
        },
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {
            const activeKey = ref(['sourceCategory_0'])

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

            const limit = ref(0)
            const offset = ref(0)
            const queryText = ref('')
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
                queryText,
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

            watch(packageListFromWorkflows, () => {
                const map = Object.keys(packageListFromWorkflows.value)

                // Fetch all packages
                facetPackage.value = {
                    packageNames: map,
                }
                quickChangePackage()

                console.log('workflowDistinct', workflowDistinctList.value)

                // Fetch runs
                facetRun.value = {
                    workflowTemplates: workflowDistinctList.value,
                }
                quickChangeRun()
            })

            const { quickChange: quickChangePackage, list } =
                usePackageDiscoverList({
                    isCache: false,
                    dependentKey: dependentKeyPackage,
                    facets: facetPackage,
                    limit: packageLimit,
                    offset: packageOffset,
                })

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
                emit('select', item)
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
