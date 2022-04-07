<template>
    <div class="flex w-full overflow-hidden">
        <AssetFilters
            v-model="wfFilters"
            v-model:activeKey="activeKey"
            :filter-list="workflowFilterRef"
            :allow-custom-filters="false"
            no-filter-title="Filters"
            class="drawer-request"
            @reset="handleResetEvent"
            @change="refetch()"
        />

        <div
            class="flex flex-col flex-1 h-full overflow-x-hidden border-l border-r border-gray-300 gap-y-4"
        >
            <div class="flex items-center mx-4 mt-4 gap-x-4">
                <div
                    class="flex items-center flex-1 bg-white border border-gray-300 rounded-md"
                    style="width: calc(100% - 150px)"
                >
                    <PackageSelector
                        v-model:value="packageId"
                        type="minimal"
                        @update:value="refetch()"
                        class="w-64 border-r rounded-tl-md rounded-bl-md focus-within:ring-2"
                    />

                    <SearchAndFilter
                        v-model:value="queryText"
                        size="minimal"
                        class="bg-white border-b-0 rounded-tr-md rounded-br-md focus-within:ring-2 ml-0.5"
                        :placeholder="getPlaceholder"
                        @update:value="refetch()"
                        @select="$event.target.blur()"
                    />
                </div>
                <router-link :to="{ params: { tab: 'marketplace' } }">
                    <AtlanButton2 label="New workflow" class="flex-none" />
                </router-link>
            </div>

            <WorkflowList
                v-if="list.length"
                v-model:selectedId="selectedId"
                :loading="isLoading"
                :workflows="list"
                :is-load-more="isLoadMore"
                :lastRunsMap="runByWorkflowMap"
                @load-more="loadMoreWorkflows"
            />

            <div
                v-else-if="!isLoading"
                class="flex flex-col items-center justify-center h-full"
            >
                <AtlanIcon icon="NoAssetsFound" class="h-44" />
                <span>No workflows found</span>
            </div>

            <template v-if="isLoading && !list.length">
                <div
                    v-for="idx in 5"
                    :key="idx"
                    class="p-4 mx-4 bg-white rounded-lg"
                >
                    <a-skeleton active :paragraph="{ rows: 2 }" />
                </div>
            </template>
        </div>

        <div style="width: 420px" class="flex-none hidden lg:block">
            <WorkflowPreview
                v-if="selectedWorkflow"
                :workflow="selectedWorkflow"
                :runs="runs(selectedWorkflow)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { useDebounceFn, watchOnce, whenever } from '@vueuse/core'
    import { computed, defineComponent, provide, ref } from 'vue'

    import { capitalizeFirstLetter } from '~/utils/string'

    import AssetFilters from '@/common/assets/filters/index.vue'

    import { useWorkflowStore } from '~/workflowsv2/store'
    import { workflowFilter } from '~/workflowsv2/constants/filters'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
    import { useWorkflowTypes } from '~/workflowsv2/composables/useWorkflowTypes'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    import WorkflowList from '~/workflowsv2/components/manage/workflowList.vue'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import PackageSelector from '~/workflowsv2/components/common/selectors/packageSelector.vue'
    import WorkflowPreview from '~/workflowsv2/components/common/preview/workflowPreview.vue'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'ManageWorkflows',
        components: {
            AssetFilters,
            WorkflowList,
            SearchAndFilter,
            PackageSelector,
            WorkflowPreview,
        },
        props: {},
        emits: [],
        setup() {
            const { name } = useWorkflowInfo()
            const { name: pkgName } = usePackageInfo()
            const workflowStore = useWorkflowStore()
            const isDrawerVisible = ref(false)
            const activeKey = ref(['schedule_0', 'wfType_0'])
            const wfFilters = ref({})
            const packageId = ref<string | undefined>(undefined)
            const offset = ref(0)
            const limit = ref(20)
            const selectedId = ref('')

            const getPlaceholder = computed(() => {
                if (packageId.value)
                    return `Search all ${pkgName(
                        workflowStore.packageMeta?.[packageId.value]
                    )} workflows`

                return 'Search all workflows'
            })
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const facets = computed(() => ({
                ui: true,
                packageName: packageId.value,
                ...wfFilters.value,
            }))

            const queryText = ref(null)

            const { list, quickChange, isLoading, isLoadMore } =
                useWorkflowDiscoverList({
                    facets,
                    queryText,
                    limit,
                    offset,
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                })

            const selectedWorkflow = computed(() =>
                list.value?.find((li) => li?.metadata?.uid === selectedId.value)
            )

            const runFacets = computed(() => ({
                workflowTemplates: list.value
                    .map((wft) => name(wft))
                    .slice(offset.value),
            }))

            const {
                quickChange: quickChangeRun,
                runByWorkflowMap,
                resetState: resetRunState,
                isLoading: isRunLoading,
            } = useRunDiscoverList({
                facets: runFacets,
                limit: ref(0),
                aggregations: ref(['status']),
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
                immediate: false,
            })

            const runs = (workflow) =>
                runByWorkflowMap.value?.[workflow?.metadata?.name]

            whenever(
                () => runFacets.value.workflowTemplates,
                () => {
                    if (!offset.value) resetRunState()
                    quickChangeRun()
                },
                { deep: true }
            )

            const refetch = useDebounceFn(
                () => {
                    offset.value = 0
                    quickChange()
                },
                250,
                { maxWait: 1000 }
            )

            const handleResetEvent = () => {
                wfFilters.value = {}
                refetch()
            }

            const loadMoreWorkflows = () => {
                if (isLoadMore.value) offset.value += limit.value
                quickChange()
            }

            provide('isRunLoading', isRunLoading)

            ///////////////////////////////////////////////////////////////////////////////////
            /**  Dynamically inject the workflow type filter after getting response from API */

            // Existing filters
            const workflowFilterRef = ref([...workflowFilter])

            // Fetch the workflow types from API
            const { workflowTypeList } = useWorkflowTypes()

            // Once the data is received from API, transform and inject to the existing filters
            watchOnce(workflowTypeList, () => {
                const idx = workflowFilterRef.value.findIndex(
                    (li) => li.id === 'wfType'
                )
                if (idx > -1)
                    workflowFilterRef.value[idx].data =
                        workflowTypeList.value.map((agg) => ({
                            id: agg.key,
                            label: `${capitalizeFirstLetter(agg.key)} (${
                                agg.doc_count
                            })`,
                        }))
            })
            ///////////////////////////////////////////////////////////////////////////////////

            return {
                list,
                refetch,
                isLoading,
                runByWorkflowMap,
                runs,
                runFacets,
                queryText,
                packageId,
                wfFilters,
                isDrawerVisible,
                activeKey,
                workflowFilterRef,
                handleResetEvent,
                facets,
                workflowTypeList,
                isLoadMore,
                loadMoreWorkflows,
                selectedId,
                selectedWorkflow,
                getPlaceholder,
            }
        },
    })
</script>

<style lang="less" scoped>
    .drawer-request {
        @apply bg-gray-100 flex-none w-64;
        .ant-collapse-content {
            background: none !important;
        }
        .ant-collapse-header {
            @apply hover:bg-transparent !important;
        }
        .group {
            background: none !important;
        }
    }
</style>
