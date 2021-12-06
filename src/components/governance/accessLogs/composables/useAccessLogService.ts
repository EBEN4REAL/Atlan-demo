import { Ref } from 'vue'
import { Logs } from '~/services/service/es-logs'

export default function useLogsService() {
    function listAccessLogs(body: Ref<any>) {
        return Logs.listAccessLogs(body)
    }

    return {
        listAccessLogs,
    }
}
