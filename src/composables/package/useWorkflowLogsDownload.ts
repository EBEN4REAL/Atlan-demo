import { ref, inject, toRaw, Ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSSE } from '~/modules/useSSE'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'
import { map } from '~/services/service/workflows/key'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useWorkflowLogsDownload(
    path,
    params,
    immediate: boolean = true
) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate,
    })
    const { data, error, isLoading, isReady, mutate } =
        Workflows.getArchivedRunLogs(path, params, options)

    return {
        data,
        error,
        isLoading,
        isReady,
        mutate,
    }
}
