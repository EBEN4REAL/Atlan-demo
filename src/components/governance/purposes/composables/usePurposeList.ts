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
        let t = personaList.value.find((ps) => ps.id == selectedPersonaId.value)
        if (!t) return undefined
        /* Hardcoding classification */
        if (t) {
            t.tag = 'TyT6ITTnmwzIe74TMEE4r5'
            t.dataPolicies = []
            t.metadataPolicies = [
                {
                    actions: ['entity-create', 'entity-update'],
                    allow: true,
                    description: '',
                    id: 'cee15bea-dfbe-4c93-81cc-d2a9fa8ce643',
                    name: 'test',
                    type: 'metadata',
                    groups: ['123', 'abc', 'cde'],
                    users: ['chawlatanya31', 'admin1', 'admin'],
                },
                {
                    actions: ['entity-create', 'entity-update'],
                    allow: true,
                    description: '',
                    id: 'cee15bea-dfbe-4c93-81cc-d2a9fa8ce646',
                    name: 'test',
                    type: 'metadata',
                    groups: ['123', 'abc', 'cde'],
                    users: ['chawlatanya31', 'admin1', 'admin'],
                },
            ]
        }
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
