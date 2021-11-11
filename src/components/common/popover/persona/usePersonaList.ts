import { ref, computed, Ref, watch } from 'vue'
import { Persona } from '~/services/service/persona'

interface PersonaParams {
    offset?: number
    limit?: number
    sort?: string
    filter?: string
    searchString?: string
}
export default function usePersonaList(params?: Ref<PersonaParams>) {
    const { data: personaList, isLoading, mutate: reFetchList } = Persona.List()

    const filteredPersonas = computed(() => {
        if (params?.value?.searchString)
            return personaList.value.filter((ps) =>
                ps
                    .name!.toLowerCase()
                    .includes(params.value.searchString.toLowerCase())
            )
        return personaList.value
    })

    return { filteredPersonas, isLoading, reFetchList }
}
