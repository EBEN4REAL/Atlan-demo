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
    const {
        data,
        isLoading,
        mutate: reFetchList,
    } = Persona.List(params, { asyncOptions: { resetOnExecute: false } })

    const localPersonasList: Ref<any[]> = ref([])
    const personaList: Ref<any[]> = ref([])

    watch(data, () => {
        if (data?.value?.records) {
            personaList.value = [...(data?.value?.records ?? [])]
            if (params?.value?.offset > 0) {
                localPersonasList.value = [
                    ...(localPersonasList.value || []),
                    ...(data?.value?.records ?? []),
                ]
            } else {
                localPersonasList.value = data?.value?.records ?? []
            }
        } else {
            localPersonasList.value = []
            personaList.value = []
        }
    })
    const personaListConcatenated = computed(
        () => localPersonasList.value || []
    )
    const filteredPersonasCount = computed(() => data?.value?.filterRecord)
    const totalPersonasCount = computed(
        () => data?.value?.totalRecord
        // return 0
    )

    return {
        isLoading,
        reFetchList,
        totalPersonasCount,
        filteredPersonasCount,
        filteredPersonas: personaListConcatenated,
    }
}
