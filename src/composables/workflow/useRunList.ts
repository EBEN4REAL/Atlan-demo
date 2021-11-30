import { computed, Ref, ref, watch } from "vue";
// Composables
import {
    getRunList,
    getArchivedRunList,
} from '~/composables/workflow/useWorkflowList'
import { LiveRun, ArchivedRuns } from '~/types/workflow/runs.interface'



const useRunList = (wf_name) => {
    const list: Ref<(ArchivedRuns | LiveRun)[]> = ref([])
    const { liveList, error: liveError, isLoading: liveLoading, execute: executeLive, isReady: liveReady } = getRunList(wf_name)



    // getArchivedRunList
    const {
        archivedList,
        error: archiveError,
        isLoading: archiveLoading,
        filter_record: archiveFilterRecord,
        loadMore,
        isReady: archiveReady,
        execute: executeArchive
    } = getArchivedRunList(wf_name)

    const isLoadMore = computed(
        () => archiveFilterRecord.value > (archivedList.value?.length ?? 0)
    )
    const isReady = computed(
        () => archiveReady?.value && liveReady?.value
    )
    const isLoading = computed(
        () => archiveLoading?.value || liveLoading?.value
    )
    const error = computed(
        () => liveError?.value || archiveError?.value
    )

    const execute = (n) => {
        executeLive(n)
        executeArchive(n)
    }


    // watcher
    watch([liveList, archivedList], ([newX, newY]) => {
        if (newX && newY) {
            let liveRunItems: any = []
            let archivedRunItems: ArchivedRuns[] = []
            if (newX?.items?.length) {
                const mappedItems = newX.items.map((x) => {
                    const { status, metadata, spec } = x
                    const { name, uid } = metadata
                    const {
                        startedAt: started_at,
                        finishedAt: finished_at,
                        phase,
                    } = status
                    const obj = {
                        name,
                        uid,
                        started_at,
                        finished_at,
                        phase,
                        workflow: {}
                    }
                    obj.workflow = { status, metadata, spec }
                    return obj
                })

                const orderedItems = mappedItems.sort(
                    (a, b) =>
                        new Date(b.finished_at) -
                        new Date(a.finished_at)
                )

                liveRunItems = orderedItems
            }

            if (newY?.length) {
                const orderedRecords = newY.sort(
                    (a, b) =>
                        new Date(b.finished_at) -
                        new Date(a.finished_at)
                )

                archivedRunItems = orderedRecords
            }

            list.value = [...liveRunItems, ...archivedRunItems]



        }
    })

    return {
        list, liveList, archivedList, loadMore, isLoadMore, execute, error, isLoading, isReady
    }
}

export default useRunList;