import { Ref, ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import {
    isNewPersona,
    discardNewPersona,
    saveNewPersona,
    newPersonaIndex,
} from './useNewPersona'
import { personaList } from './usePersonaList'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export function savePersona() {
    isEditing.value = false

    if (isNewPersona.value && selectedPersonaDirty.value) {
        personaList.value[newPersonaIndex.value] = selectedPersonaDirty.value
        saveNewPersona()
    }
}

export function discardPersona() {
    isEditing.value = false

    if (isNewPersona.value) {
        discardNewPersona()
    }
}
