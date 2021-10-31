import { Ref, ref, watch } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import { Persona } from '~/services/service/persona'
import { selectedPersona } from './usePersonaList'

type PolicyType = 'meta' | 'data'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

watch(
    () => selectedPersona.value?.id,
    () => {
        selectedPersonaDirty.value = { ...selectedPersona.value }
    },
    { immediate: true }
)

export const policyEditMap = ref({
    dataPolicies: [] as Boolean[],
    metadataPolicies: [] as Boolean[],
})

watch(selectedPersonaDirty, () => {
    policyEditMap.value = {
        dataPolicies:
            selectedPersonaDirty.value?.datapolicies?.map(() => false) || [],
        metadataPolicies:
            selectedPersonaDirty.value?.metadataPolicies?.map(() => false) ||
            [],
    }
})

export function setEditFlag(type: PolicyType, idx: number) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = true
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = true
}

export function removeEditFlag(type: PolicyType, idx: number) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = false
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = false
}

export async function savePersona(persona: IPersona) {
    return Persona.Update(persona)
}

export function discardPersona() {
    isEditing.value = false
}

export function addPolicy(type: PolicyType) {
    if (type === 'meta') {
        selectedPersonaDirty.value?.metadataPolicies?.push({
            actions: [],
            assets: [],
            connectionId: '',
            allow: true,
            name: '',
            description: '',
        })
        policyEditMap.value.metadataPolicies.push(true)
    }
    if (type === 'data') {
        selectedPersonaDirty.value?.datapolicies?.push({
            actions: ['select'],
            assets: [],
            connectionName: '',
            maskingOption: 'MASK_NONE',
            allow: true,
            name: '',
            description: '',
        })
        policyEditMap.value.dataPolicies.push(true)
    }
}

export function deletePolicy(type: PolicyType, idx: number) {
    const tempPersona = { ...selectedPersona.value }
    if (type === 'meta') {
        policyEditMap.value.metadataPolicies?.splice(idx, 1)
        selectedPersonaDirty.value?.metadataPolicies?.splice(idx, 1)

        tempPersona?.metadataPolicies?.splice(idx, 1)
    }
    if (type === 'data') {
        selectedPersonaDirty.value?.datapolicies?.splice(idx, 1)
        policyEditMap.value.dataPolicies?.splice(idx, 1)

        tempPersona?.datapolicies?.splice(idx, 1)
    }
    savePersona(tempPersona)
}

export function savePolicy() {
    // Restore previous policy state from the actual persona
}

export function discardPolicy() {
    // Restore previous policy state from the actual persona
}

export function enablePersona(isEnabled: Boolean) {
    // selectedPersonaDirty.value!.enabled = isEnabled
}
