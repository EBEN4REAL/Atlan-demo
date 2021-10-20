import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePersonaService from '~/services/heracles/composables/personas'

// Main Persona List, fetched from API
const { listPersonas } = usePersonaService()
const { data: personaList, isReady, mutate: reFetchList } = listPersonas()
export { reFetchList, personaList }
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = computed(() => {
    if (selectedPersonaId.value)
        return personaList.value.find((ps) => ps.id === selectedPersonaId.value)
    else return undefined
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
    else return personaList.value
})

invoke(async () => {
    await until(isReady).toBe(true)
    if (personaList.value?.length)
        selectedPersonaId.value = personaList.value[0].id!
})
