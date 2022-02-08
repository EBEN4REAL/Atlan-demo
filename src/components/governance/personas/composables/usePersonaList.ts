import { ref, computed, watch, toRefs } from 'vue'
import { safeArray } from '~/utils/array'
import { usePersonaStore } from '~/store/persona'
import usePersona from '~/composables/persona/usePersona'
import { Persona } from '~/services/service/persona'

// TODO make use of store for persona list

const personaStore = usePersonaStore()
const { updatePersona: handleUpdateList } = personaStore
const { getList: personaList } = toRefs(personaStore)
const { mutate: reFetchList, isLoading: isPersonaLoading, error: isPersonaError, isReady: isPersonaListReady } = usePersona(false)

const refetchPersona = (id) => {
    const { data, isLoading, isReady, error, mutate } = Persona.getPersonaByID(id)
    watch([data, error], () => {
        if (data?.value) {
            handleUpdateList(data.value)
        }
    })
}

export {
    reFetchList,
    refetchPersona,
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
            selectedPersona.value = t
            return
        }
        selectedPersona.value = undefined

    },
    { immediate: true, deep: true }
)
// Filtered Persona List
export const searchTerm = ref('')
export const filteredPersonas = computed(() => {
    let result = []
    if (searchTerm.value) {
        result = personaList.value.filter((ps) =>
            ps.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
        )
    } else {
        result = personaList.value
    }
    return result.sort((a, b) => {
        const current = a?.displayName?.toLowerCase()
        const last = b?.displayName?.toLowerCase()
        if (current < last) {
            return -1
        }
        if (current > last) {
            return 1
        }
        return 0
    })
})
