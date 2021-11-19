import { ref, Ref, computed } from 'vue'
import useLogsService from './useQueryLogService'
import useBody from './useBody'

const { listQueryLogs } = useLogsService()

export function useQueryLogs(gte: Ref<string>, lt: Ref<string>) {
    const body = ref<Record<string, any>>({})
    const from = ref(0)
    const limit = ref(100)

    const dsl = useBody({
        from: from.value,
        limit: limit.value,
        gte: gte.value,
        lt: lt.value,
    })

    body.value = dsl
    const { data, mutate: refetchList, isLoading } = listQueryLogs(body)

    const list = computed(() => data.value?.hits?.hits)
    const totalCount = computed(() => limit.value + from.value)

    function mutateBody({ gte, lt }) {
        body.value = useBody({
            from: from.value,
            limit: limit.value,
            gte,
            lt,
        })
    }

    return {
        list,
        mutateBody,
        refetchList,
        totalCount,
        isLoading,
    }
}
