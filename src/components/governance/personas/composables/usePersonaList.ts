import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePersonaService from './usePersonaService'

// Main Persona List, fetched from API
const { listPersonas } = usePersonaService()
const {
    data: personaList,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPersonas()
export { reFetchList, personaList, isPersonaListReady }
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = computed(() => {
    if (selectedPersonaId.value)
        return personaList.value.find((ps) => ps.id === selectedPersonaId.value)
    return undefined
})

// Filtered Persona List
export const searchTerm = ref('')
export const filteredPersonas = computed(() => {
    if (searchTerm.value)
        return personaList.value.filter((ps) =>
            ps
                .displayName!.toLowerCase()
                .includes(searchTerm.value.toLowerCase())
        )
    return personaList.value
})

invoke(async () => {
    await until(isPersonaListReady).toBe(true)
    if (personaList.value?.length)
        selectedPersonaId.value = personaList.value[0].id!
})
