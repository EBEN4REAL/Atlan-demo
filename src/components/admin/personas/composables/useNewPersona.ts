import { computed } from 'vue'
import { isEditing } from './useEditPersona'
import { personaList, selectedPersonaId, reFetchList } from './usePersonaList'
import usePersonaService from '~/services/heracles/composables/personas'

const { createPersona } = usePersonaService()

export const newPersonaIndex = computed(() =>
    personaList.value.findIndex((persona) => persona.id === 'new')
)

export const isNewPersona = computed(() => newPersonaIndex.value !== -1)

export function createNewPersona() {
    // Only add the new Persona if no existing new persona is present
    if (!isNewPersona.value)
        personaList.value = [
            {
                id: 'new',
                admins: [] as string[],
                displayName: 'New Persona',
                description: '',
                personaName: '',
                metadataPolicies: [
                    { actions: [] as string[], assets: [] as string[] },
                ],
                orgPolicies: [],
            },
            ...personaList.value,
        ]
    selectedPersonaId.value = 'new'
    isEditing.value = true
}

export async function saveNewPersona() {
    if (isNewPersona.value) {
        const newPersona = personaList.value[newPersonaIndex.value]
        newPersona.personaName = newPersona.displayName
        await createPersona(newPersona)
        reFetchList()
    }
}

export function discardNewPersona() {
    if (isNewPersona.value) {
        const tempList = [...personaList.value]
        tempList.splice(newPersonaIndex.value, 1)
        personaList.value = tempList

        selectedPersonaId.value = personaList.value[0]?.id
    }
}
