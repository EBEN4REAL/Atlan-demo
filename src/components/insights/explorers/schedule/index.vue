<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 pb-0 mb-4 text-lg font-bold text-gray-700">
            Schedule Query
        </div>
        <!-- <div class="flex flex-row w-full px-4 mt-3 mb-6">
            <a-input
                v-model:value="queryText"
                class="h-8 rounded"
                :class="$style.inputSearch"
                placeholder="Search schedules"
            >
                <template #suffix>
                    <AtlanIcon icon="Search" color="#6F7590" />
                </template>
            </a-input>
            <a-popover trigger="click" placement="bottomLeft">
                <a-button
                    class="flex items-center w-8 h-8 p-2 ml-3 filterButton"
                >
                    <template #icon>
                        <AtlanIcon icon="Filter" class="-ml-0.5" />
                    </template>
                </a-button>
                <template #content>
                    <div>Filters</div>
                </template>
            </a-popover>
        </div> -->

        <div
            class="flex flex-col w-full h-full px-4 overflow-y-scroll"
            v-if="list.length"
        >
            <template v-for="item in list" :key="item.name">
                <WorkflowCard class="mb-3" :item="item" />
            </template>
            <div
                v-if="list.length > 0"
                class="flex items-center justify-center mb-3"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between px-3 py-2 transition-all duration-300 bg-white rounded-full text-primary"
                    :class="isLoading ? 'px-3 py-2' : ''"
                    @click="handleLoadMore"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" class="-mt-0.5" />
                    </template>
                    <AtlanLoader v-else class="w-6 h-6" />
                </button>
            </div>
        </div>
        <div class="flex justify-center w-full h-full px-4" v-else>
            <p class="text-gray-500">No scheduled workflows!</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, provide } from 'vue'
    import { useWorkflowDiscoverList } from '~/workflows/composables/package/useWorkflowDiscoverList'
    import { useRunDiscoverList } from '~/workflows/composables/package/useRunDiscoverList'
    import { debouncedWatch, until, invoke } from '@vueuse/core'
    import whoami from '~/composables/user/whoami'
    import { useSavedQueriesMeta } from './composables/useSavedQueriesMeta'

    import WorkflowCard from './workflowCard.vue'
    export default defineComponent({
        components: { WorkflowCard },
        props: {},
        setup(props) {
            const {
                savedQueryMetaMap,
                mutate: savedQueryRefresh,
                isLoading: savedQueryFetchLoading,
                error: savedQueryFetchError,
                updatedRequestBody: updatedSavedQueriesFetchRequestBody,
            } = useSavedQueriesMeta([])
            // for fetching the metdata of the saved queries
            const uniqueSavedQueryIds = ref([])
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const { username } = whoami()
            const facets = ref({
                ui: true,
                packageName: '@atlan/schedule-query',
                user: username,
            })
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const dependentKey = ref('default_schedule_workflow')
            const { list, quickChange, isLoading, refresh } =
                useWorkflowDiscoverList({
                    isCache: false,
                    dependentKey,
                    facets,
                    limit,
                    offset,
                    queryText,
                    source: ref({}),
                    preference,
                })

            const dependentKeyRun = ref()
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
                    queryText: ref(''),
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                })

            watch(list, () => {
                const map = list.value.map((i) => i?.metadata?.name)
                let tempSavedQueries: any[] =
                    list.value.map(
                        (workflow) =>
                            workflow.spec?.templates[0]?.dag?.tasks[0]?.arguments?.parameters?.find(
                                (e) => e?.name === 'saved-query-id'
                            )?.value
                    ) ?? []
                debugger
                // for removing duplicates saved query ids
                tempSavedQueries = new Set(tempSavedQueries)
                uniqueSavedQueryIds.value = Array.from(tempSavedQueries)
                updatedSavedQueriesFetchRequestBody(uniqueSavedQueryIds.value)
                savedQueryRefresh()

                facetRun.value = {
                    workflowTemplates: map,
                }
                // Only get the run details when there are actually any workflows from the previous API call
                if (map.length) quickChangeRun()
            })

            debouncedWatch(
                queryText,
                () => {
                    quickChange(true)
                },
                { debounce: 250 }
            )

            const handleLoadMore = () => {
                offset.value += limit.value
                quickChange(true)
            }

            try {
                invoke(async () => {
                    await until(savedQueryFetchLoading).toBe(true)
                    if (savedQueryFetchError.value) {
                        console.error(
                            savedQueryFetchError.value,
                            'Error in fetching saved queries metadata'
                        )
                    } else {
                        console.log(savedQueryMetaMap)
                        watch(savedQueryMetaMap, () => {
                            console.log(savedQueryMetaMap)
                            debugger
                        })
                    }
                })
            } catch (e) {
                console.error(e)
            }

            provide('runMap', runByWorkflowMap)
            provide('savedQueryMetaMap', savedQueryMetaMap)

            return {
                isLoading,
                queryText,
                runByWorkflowMap,
                list,
                handleLoadMore,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>
<style lang="less" module>
    .inputSearch {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fff !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }
</style>

<style lang="less" scoped>
    .filterButton {
        background: #ffffff;
        border: 1px solid #e6e6eb;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }
    .item-border {
        border-bottom: 1px solid #f3f3f3;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
