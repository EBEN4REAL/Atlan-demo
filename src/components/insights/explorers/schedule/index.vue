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
        </div>
        <div class="flex justify-center w-full h-full px-4" v-else>
            <p class="text-gray-500">No scheduled workflows!</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, provide } from 'vue'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import { debouncedWatch, until } from '@vueuse/core'
    import whoami from '~/composables/user/whoami'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'
    import { invoke, until } from '@vueuse/core'

    import WorkflowCard from './workflowCard.vue'
    export default defineComponent({
        components: { WorkflowCard },
        props: {},
        setup(props) {
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
            const { list, quickChange } = useWorkflowDiscoverList({
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
                facetRun.value = {
                    workflowTemplates: map,
                }
                debugger
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

            const facetPackage = ref({})
            const packageLimit = ref(5)
            const isWorkflowTemplateFetched = ref(false)
            const workflowTemplate = ref({})

            const {
                isLoading: isLoadingPackage,
                refresh,
                error: errorPackage,
                list: packageList,
            } = usePackageDiscoverList({
                facets: facetPackage,
                limit: packageLimit,
            })
            refresh()

            try {
                invoke(async () => {
                    await until(isLoadingPackage).toBe(true)
                    if (errorPackage.value) {
                        console.error(
                            errorPackage.value,
                            'Error in fetching schedule query template'
                        )
                    } else if (list.value) {
                        watch(list, () => {
                            if (list.value?.length > 0) {
                                isWorkflowTemplateFetched.value = true
                                workflowTemplate.value = list.value[0]
                            }
                        })
                    }
                })
            } catch (e) {
                console.error(e)
            }

            provide('runMap', runByWorkflowMap)
            provide('isWorkflowTemplateFetched', isWorkflowTemplateFetched)
            provide('workflowTemplate', workflowTemplate)

            return {
                isWorkflowTemplateFetched,
                queryText,
                runByWorkflowMap,
                list,
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
