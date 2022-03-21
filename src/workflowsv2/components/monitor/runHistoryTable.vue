<template>
    <div class="px-5 bg-white rounded-lg">
        <div class="flex items-center h-16">
            <span class="text-sm font-bold leading-6 tracking-widest"
                >WORKFLOW RUN HISTORY</span
            >
            <IconButton icon="Retry" class="ml-auto" />
        </div>
        <div
            class="flex flex-col overflow-hidden divide-y divide-gray-300 rounded-lg"
        >
            <div class="flex items-center h-10 px-3 bg-gray-100">
                <span
                    v-for="head in tableHeaders"
                    :key="head.title"
                    class="text-xs tracking-wider uppercase"
                    :style="head.style"
                >
                    {{ head.title }}
                </span>
            </div>
            <!-- <AtlanLoader v-if="isLoading" /> -->
            <div
                v-if="runs?.length"
                class="overflow-y-scroll divide-y divide-gray-300"
                style="height: 45vh"
            >
                <RunListItem
                    v-for="run in runs"
                    :key="run.metadata.uid"
                    :run="run"
                />
            </div>
            <!-- <template v-else>
                <EmptyLogsIllustration />
            </template> -->
            <span>Pagination</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import RunListItem from '~/workflowsv2/components/monitor/runListItem.vue'
    import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'

    export default defineComponent({
        name: 'RunHistoryTable',
        components: { RunListItem },
        props: {},
        emits: [],
        setup() {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const {
                list: runs,
                quickChange,
                isLoading,
            } = useRunDiscoverList({
                facets,
                limit,
                offset,
                queryText,
                preference,
                source: ref({ excludes: ['spec'] }),
            })

            // If changed this should be manually synced with the flex-grow properties of <RunListItem/>
            const tableHeaders = [
                { title: 'Workflow Run', style: 'flex-grow: 5' },
                { title: 'Status', style: 'flex-grow: 1' },
                { title: 'Started', style: 'flex-grow: 1' },
                { title: 'Duration', style: 'flex-grow: 1' },
                { title: 'Output', style: 'flex-grow: 2' },
            ]
            return { runs, tableHeaders, isLoading, EmptyLogsIllustration }
        },
    })
</script>
