import { watch, computed, ref, Ref, watch } from 'vue'
import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

export function useRunningWf({ WFName, guid }) {
    const limit = ref(30)
    const offset = ref(0)
    const isPolling = ref(false)
    let nIntervId
        clearInterval(nIntervId)

   const facets = computed(() => ({
        prefix: `atlan-gtc-bulk-upload-${guid?.slice(-8)}`,
        filterOut: [
            'atlan-typedef-seeder',
            'atlan', // atlan-upadate
            'cloud-es-log-policy',
            'cloud-backups',
        ],
        runName: WFName,
    }))
    const { displayName, name, phase } = useWorkflowInfo()

    const preference = ref({
        sort: 'metadata.creationTimestamp-desc',
    })

    const { list, quickChange, resetState, isLoading, data } =
        useRunDiscoverList({
            facets,
            limit,
            offset,
            preference,
        })
    const checkForRunningWf = (runs) => {
        const isFirstWfRunning = ['Running','Pending'].includes(phase(runs[0]))
        return isFirstWfRunning
    }

    const stopPolling = () => {
        clearInterval(nIntervId)
        nIntervId = null
    }
    const handlePolling = () => {
        isPolling.value = true
        console.log('start polling here', nIntervId)
        if (!nIntervId) {
            nIntervId=setInterval(() => {
                console.log('call again')
                if (checkForRunningWf(list.value)) quickChange()
                else stopPolling()
            }, 30000)
        }
    }

    watch(list, () => {
        if (
            list.value?.length &&
            checkForRunningWf(list.value) &&
            !isPolling.value
        )
            handlePolling()
    })

    return { runningWfList: list }
}
