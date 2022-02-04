import { watch } from 'vue'
import { Persona } from '~/services/service/persona'
import { usePersonaStore } from '~/store/persona'
import Qs from 'qs'
export default function usePersona() {
    const { data } = Persona.listPersonas({
        columns: ["displayName", "name", "createdAt", "createdBy", "updatedAt", "updatedBy", "type", "level", "description", "metadataPolicies", "dataPolicies", "users", "groups", "version", "enabled", "resources", "attributes"]
    }, { 
      
            paramsSerializer:  (params) => Qs.stringify(params, {arrayFormat: 'repeat'})

            }
        )
    const personaStore = usePersonaStore()
    watch(data, () => {
        personaStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
