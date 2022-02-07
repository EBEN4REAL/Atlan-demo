// import { invoke, until } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import usePurposeService from './usePurposeService'
import { safeArray } from '~/utils/array'
import { usePurposeStore } from '~/store/purpose'
// !! THESE ARE ALL PURPOSES, VARIABLE NAMES ARE NEED TO BE CHANGED FROM PERSONA REF TO PURPOSE
// TODO make use of store for list
const { listPurposes } = usePurposeService()
const {
    data: list,
    isLoading: isPersonaLoading,
    error: isPersonaError,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPurposes()

const purposeStore = usePurposeStore()
const personaList = ref([])

watch(list, () => {
    purposeStore.setList(list.value?.records)
    personaList.value = safeArray(list.value?.records)
})

const handleUpdateList = (newVal) => {
    personaList.value = personaList.value.map((el) => {
        if(el.id === newVal.id){
            return newVal
        }
            return el
        
    })
}

export {
    reFetchList,
    personaList,
    isPersonaListReady,
    isPersonaLoading,
    isPersonaError,
    handleUpdateList
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
            selectedPersona.value = { ...t }
            return
        }
        selectedPersona.value = undefined

    },
    { immediate: true }
)
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

// invoke(async () => {
//     await until(isPersonaListReady).toBe(true)
//     if (personaList.value?.length)
//         selectedPersonaId.value = personaList.value[0].id!
// })
