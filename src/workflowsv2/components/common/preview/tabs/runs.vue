<template>
    <div class="flex flex-col h-full overflow-y-hidden text-sm bg-white">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon :icon="tab.icon" height="h-4" class="mb-0.5" />
                <span class="ml-1 font-semibold text-gray-500">Runs</span>
            </span>
        </div>
        <div class="px-3 mt-2">
            <SearchAndFilter v-model:value="runQuery" size="minimal" />
        </div>
        <AtlanLoader
            v-if="isLoading"
            class="h-10 mx-auto mt-auto mb-auto place-self-center"
        />
        <div
            v-else-if="runs?.length"
            class="flex flex-col py-2 overflow-y-scroll"
        >
            <SidebarRunItem v-for="run in runs" :run="run" />
        </div>
        <div
            v-else
            class="flex flex-col items-center justify-center h-full mx-auto text-center gap-y-3 w-72"
        >
            <component :is="EmptyLogsIllustration" />
            <span class="text-sm text-gray">
                No runs found for selected workflow
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import SidebarRunItem from '~/workflowsv2/components/common/preview/sidebarRunItem.vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'

    export default defineComponent({
        name: 'WorkflowRuns',
        components: { PreviewTabsIcon, SearchAndFilter, SidebarRunItem },
        props: {
            tab: {
                type: Object,
                default: () => ({}),
            },
            workflow: {
                type: Object,
                default: () => {},
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const runQuery = ref(undefined)
            const limit = ref(30)
            const offset = ref(0)

            const facets = computed(() => ({
                workflowTemplate: workflow.value?.metadata.name,
            }))

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            // FIXME: queryText is not used to generate the DSL in useRunBody.ts
            const {
                list: runs,
                quickChange,
                isLoading,
            } = useRunDiscoverList({
                facets,
                limit,
                offset,
                queryText: runQuery,
                preference,
                source: ref({ excludes: ['spec'] }),
            })

            watch(workflow, () => quickChange())

            return {
                runQuery,
                runs,
                isLoading,
                EmptyLogsIllustration,
                quickChange,
            }
        },
    })
</script>
