import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePurposeService from './usePurposeService'

// Main Persona List, fetched from API
const { listPurposes } = usePurposeService()
const {
    data: list,
    isReady: isPersonaListReady,
    mutate: reFetchList,
} = listPurposes()

const personaList = computed(() => list.value?.records)

export { reFetchList, personaList, isPersonaListReady }
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = computed(() => {
    if (selectedPersonaId.value) {
        let t = personaList.value.find((ps) => ps.id == selectedPersonaId.value)
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
        // const ob = {
        //     description: 'test description',
        //     displayName: 'Hello World',
        //     tag: 'gN9SsazdCV2bp6Vs8EOIl6',
        //     resourcePolicies: [
        //         {
        //             actions: ['entity-create'],
        //             groups: ['testing', 'admin'],
        //             users: ['chawlatanya31', 'admin1'],
        //             allow: true,
        //         },
        //     ],
        // }
        // personaList.value = [...personaList.value, ob]
        selectedPersonaId.value = personaList.value[0].id!
    }
})
