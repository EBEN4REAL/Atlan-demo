import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Persona } from '~/services/service/persona'
import { usePersonaStore } from '~/store/persona'

export default function usePersona() {
    const { data } = Persona.listPersonas()
    const personaStore = usePersonaStore()
    watch(data, () => {
        personaStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
