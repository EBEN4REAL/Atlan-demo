import { computed } from 'vue'
import scopeAPI from '../apis/scopes'

export default function scopeService() {
    function listScopes() {
        const { data, error, isLoading } = scopeAPI.getScopes()
        const scopeList = computed(() => data.value?.scopes)

        return { scopeList, error, isLoading }
    }

    return { listScopes }
}
