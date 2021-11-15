import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePurposeService from './usePurposeService'

// Main Persona List, fetched from API
const { listPurposes } = usePurposeService()
const {
    data: personaList,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPurposes()
export { reFetchList, personaList, isPersonaListReady }
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = computed(() => {
    if (selectedPersonaId.value) {
        const t = personaList.value.find(
            (ps) => ps.id === selectedPersonaId.value
        )
        // console.log(t, 'selected Purpose')
        /* Hardcoding classification */
        t.tag = 'TyT6ITTnmwzIe74TMEE4r5'
        t.dataPolicies = []
        t.metadataPolicies = []
        return t
    }
    return undefined
})

// Filtered Persona List
export const searchTerm = ref('')
export const filteredPersonas = computed(() => {
    if (searchTerm.value) {
        return personaList.value.filter((ps) =>
            ps
                .displayName!.toLowerCase()
                .includes(searchTerm.value.toLowerCase())
        )
    }
    return personaList.value
})

invoke(async () => {
    await until(isPersonaListReady).toBe(true)
    if (personaList.value?.length) {
        selectedPersonaId.value = personaList.value[0].id!
    }
})
