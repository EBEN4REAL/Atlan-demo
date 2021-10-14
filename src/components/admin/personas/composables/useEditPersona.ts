import { Ref, ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export function savePersona() {
    isEditing.value = false
}

export function discardPersona() {
    isEditing.value = false
}
