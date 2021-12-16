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
    const { data, isLoading, mutate: reFetchList } = Persona.List()

    const personaList = computed(
        () =>
            data?.value?.records?.map((persona) => ({
                ...persona,
            })) ?? []
    )

    const filteredPersonas = computed(() => {
        if (params?.value?.searchString)
            return personaList.value.filter((ps) =>
                ps
                    .name!.toLowerCase()
                    .includes(params.value.searchString.toLowerCase())
            )
        return personaList.value
    })
    const filteredPersonasCount = computed(() => data?.value?.filterRecord)
    const totalPersonasCount = computed(
        () => data?.value?.totalRecord
        // return 0
    )

    return {
        filteredPersonas,
        isLoading,
        reFetchList,
        totalPersonasCount,
        filteredPersonasCount,
        personaList,
    }
}
