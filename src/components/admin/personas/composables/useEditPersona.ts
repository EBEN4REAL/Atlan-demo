import { Ref, ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import usePersonaService from '~/services/heracles/composables/personas'

export const isEditing = ref(true)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export async function savePersona() {
    isEditing.value = false
    const { updatePersona } = usePersonaService()
    return updatePersona(selectedPersonaDirty.value!)
}

export function discardPersona() {
    isEditing.value = false
}
