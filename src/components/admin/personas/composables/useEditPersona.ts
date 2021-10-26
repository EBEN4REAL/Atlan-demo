import { Ref, ref, watch } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import usePersonaService from '~/services/heracles/composables/personas'

type PolicyType = 'meta' | 'data'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

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

export async function savePersona() {
    isEditing.value = false
    const { updatePersona } = usePersonaService()
    return updatePersona(selectedPersonaDirty.value!)
}

export function discardPersona() {
    isEditing.value = false
}

export function addPolicy(type: PolicyType) {
    if (type === 'meta')
        selectedPersonaDirty.value?.metadataPolicies?.push({
            actions: [],
            assets: [],
            connectionId: '',
            allow: true,
            name: '',
            description: '',
        })
    if (type === 'data')
        selectedPersonaDirty.value?.datapolicies?.push({
            actions: [],
            assets: [],
            connectionName: '',
            maskingOption: 'MASK_NONE',
            allow: true,
            name: '',
            description: '',
        })
}

export function deletePolicy(type: PolicyType, idx: number) {
    if (type === 'meta')
        selectedPersonaDirty.value?.metadataPolicies?.splice(idx, 1)
    if (type === 'data')
        selectedPersonaDirty.value?.datapolicies?.splice(idx, 1)
}

export function discardPolicy() {
    // Restore previous policy state from the actual persona
}
