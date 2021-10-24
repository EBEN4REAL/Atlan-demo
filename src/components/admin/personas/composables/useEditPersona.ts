import { Ref, ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import usePersonaService from '~/services/heracles/composables/personas'

type PolicyType = 'meta' | 'data'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

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
