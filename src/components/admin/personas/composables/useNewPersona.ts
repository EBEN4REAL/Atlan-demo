import { computed } from 'vue'
import { isEditing } from './useEditPersona'
import { personaList, selectedPersonaId } from './usePersonaList'

const newPersonaIndex = computed(() =>
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

export function saveNewPersona() {
    console.log('NEW PERSONA', personaList.value[newPersonaIndex.value])
}

export function discardNewPersona() {
    if (isNewPersona.value) {
        const tempList = [...personaList.value]
        tempList.splice(newPersonaIndex.value, 1)
        personaList.value = tempList

        selectedPersonaId.value = personaList.value[0]?.id
    }
}
