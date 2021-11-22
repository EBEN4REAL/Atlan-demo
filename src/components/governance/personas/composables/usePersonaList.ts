import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePersonaService from './usePersonaService'

// Main Persona List, fetched from API
const { listPersonas } = usePersonaService()
const {
    data: list,
    isLoading: isPersonaLoading,
    error: isPersonaError,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPersonas()

const personaList = computed(() => list.value?.records)
export {
    reFetchList,
    personaList,
    isPersonaListReady,
    isPersonaLoading,
    isPersonaError,
}
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = computed(() => {
    if (selectedPersonaId.value) {
        let t = personaList.value?.find(
            (ps) => ps.id == selectedPersonaId.value
        )
        if (!t) return undefined
        return t
    }
    return undefined
})

// Filtered Persona List
export const searchTerm = ref('')
export const filteredPersonas = computed(() => {
    if (searchTerm.value) {
        return personaList.value.filter((ps) =>
            ps.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
        )
    }
    return personaList.value
})

invoke(async () => {
    await until(isPersonaListReady).toBe(true)
    if (personaList.value?.length)
        selectedPersonaId.value = personaList.value[0].id!
})
