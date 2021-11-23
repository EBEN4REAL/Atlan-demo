import { IPurpose } from '~/types/accessPolicies/purposes'
import { invoke, until } from '@vueuse/core'
import { ref, computed } from 'vue'
import usePurposeService from './usePurposeService'
import { generateUUID } from '~/utils/helper/generator'

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
        /* Hard coded values */
        t?.dataPolicies?.forEach((policy, i) => {
            const id = generateUUID()
            if (!policy?.id) policy.id = id
            if (!policy?.name) policy.name = `Untitled ${i}`
            if (!policy?.maskingOption) policy.maskingOption = 'MASK_NONE'
        })
        t?.metadataPolicies?.forEach((policy, i) => {
            const id = generateUUID()
            if (!policy?.id) policy.id = id
            if (!policy?.name) policy.name = `Untitled ${i}`
        })
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

export const addPurposeLocally = (purpose: IPurpose) => {
    personaList.value?.push(purpose)
}
invoke(async () => {
    await until(isPersonaListReady).toBe(true)
    if (personaList.value?.length) {
        const uniqueId = generateUUID()
        // const ob = {
        //     description: 'test description',
        //     displayName: 'Hello World',
        //     tag: 'gN9SsazdCV2bp6Vs8EOIl6',
        //     metadataPolicies: [
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
