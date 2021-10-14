import { Ref, ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import {
    isNewPersona,
    discardNewPersona,
    saveNewPersona,
} from './useNewPersona'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export function savePersona() {
    isEditing.value = false

    if (isNewPersona.value) {
        saveNewPersona()
    }
}

export function discardPersona() {
    isEditing.value = false

    if (isNewPersona.value) {
        discardNewPersona()
    }
}
