import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Persona } from '~/services/service/persona'
import { usePersonaStore } from '~/store/persona'

export default function usePersona() {
    const { data } = Persona.listPersonas({
        columns: ["displayName", "name", "createdAt", "createdBy", "updatedAt", "updatedBy", "type", "level", "description", "metadataPolicies", "dataPolicies", "users", "groups", "version", "enabled", "resources", "attributes"]
    })
    const personaStore = usePersonaStore()
    watch(data, () => {
        personaStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
