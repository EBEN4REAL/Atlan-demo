import { Logs } from '~/services/service/es-logs'
import { Ref } from 'vue'
export default function useQueryHistory() {
    function listQueryHistory(body: Ref<any>) {
        return Logs.listQueryLogs(body)
    }
    return {
        listQueryHistory,
    }
}
