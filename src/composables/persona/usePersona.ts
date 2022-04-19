import { watch } from 'vue'
import Qs from 'qs'
import { Persona } from '~/services/service/persona'
import { usePersonaStore } from '~/store/persona'

export default function usePersona(immediate = true) {
    const { data, isLoading, isReady, error, mutate } = Persona.listPersonas(
        {
            columns: [
                'displayName',
                'readme',
                'name',
                'createdAt',
                'createdBy',
                'updatedAt',
                'updatedBy',
                'type',
                'level',
                'description',
                'metadataPolicies',
                'dataPolicies',
                'users',
                'groups',
                'version',
                'enabled',
                'resources',
                'attributes',
                'glossaryPolicies',
            ],
            apikeys: true,
        },
        {
            immediate,
            paramsSerializer: (params) =>
                Qs.stringify(params, { arrayFormat: 'repeat' }),
        }
    )
    const personaStore = usePersonaStore()
    watch(data, () => {
        personaStore.setList(data.value?.records || [])
        // console.log(tenantStore.tenantRaw)
    })
    watch(error, (newErr) => {
        if (newErr) {
            personaStore.setList([])
            personaStore.setErrorPersona(newErr)
        }
    })
    return {
        data,
        isLoading,
        isReady,
        error,
        mutate,
    }
}
