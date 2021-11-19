import { Logs } from '../../../../services/service/es-logs'
import { Ref } from 'vue'
export default function useLogsService() {
    function listQueryLogs(body: Ref<any>) {
        return Logs.listQueryLogs(body)
    }

    return {
        listQueryLogs,
    }
}
