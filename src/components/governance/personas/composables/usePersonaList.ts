// import { invoke, until } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
// import { useRoute } from 'vue-router'
import usePersonaService from './usePersonaService'
import { safeArray } from '~/utils/array'


// Main Persona List, fetched from API
const { listPersonas } = usePersonaService()
const {
    data: list,
    isLoading: isPersonaLoading,
    error: isPersonaError,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPersonas()

// export const modifyPersona()
const personaList = computed(() => safeArray(list.value?.records))
export {
    reFetchList,
    personaList,
    isPersonaListReady,
    isPersonaLoading,
    isPersonaError,
}
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = ref()
watch(
    [selectedPersonaId, personaList],
    () => {
        if (selectedPersonaId.value) {
            const t = personaList.value?.find(
                (ps) => ps.id == selectedPersonaId.value
            )
            if (!t) selectedPersona.value = undefined
            selectedPersona.value = t
            return
        }
        selectedPersona.value = undefined
        
    },
    { immediate: true }
)
// Filtered Persona List
export const searchTerm = ref('')
export const filteredPersonas = computed(() => {
    let result = []
    if (searchTerm.value) {
        result =  personaList.value.filter((ps) =>
            ps.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
        )
    } else {
        result =  personaList.value
    }
    return result.sort((a, b) => {
        const current = a.displayName.toLowerCase()
        const last = b.displayName.toLowerCase()
        if (current < last) {
            return -1
        }
        if (current > last) {
            return 1
        }
        return 0
    })
})

// invoke(async () => {
//     await until(isPersonaListReady).toBe(true)
//     if (personaList.value?.length)
//         selectedPersonaId.value = personaList.value[0].id!
// })
