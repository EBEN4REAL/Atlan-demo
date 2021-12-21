import { Ref, ref, watch, toRaw } from 'vue'
import { IPurpose } from '~/types/accessPolicies/purposes'
import usePurposeService from './usePurposeService'
import {
    reFetchList,
    selectedPersona,
    personaList,
    selectedPersonaId,
} from './usePurposeList'

const { updatePersona, deletePersona, enableDisablePurpose } =
    usePurposeService()

export type PolicyType = 'meta' | 'data'
export const newIdTag = 'new_'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPurpose | undefined> = ref(undefined)

watch(
    () => selectedPersona.value?.id,
    () => {
        if (selectedPersona.value)
            selectedPersonaDirty.value = JSON.parse(
                JSON.stringify(toRaw(selectedPersona.value))
            )
        else selectedPersonaDirty.value = undefined
    },
    { immediate: true }
)

export const policyEditMap = ref({
    dataPolicies: {} as Record<string, boolean>,
    metadataPolicies: {} as Record<string, boolean>,
})

watch(selectedPersona, () => {
    policyEditMap.value = {
        dataPolicies:
            selectedPersona.value?.dataPolicies?.reduce((acc, curr) => {
                acc[curr.id!] = false
                return acc
            }, {}) || {},
        metadataPolicies:
            selectedPersona.value?.metadataPolicies?.reduce((acc, curr) => {
                acc[curr.id!] = false
                return acc
            }, {}) || {},
    }
})

export function setEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = true
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = true
}

export function removeEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = false
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = false
}

export async function savePersona(persona: IPurpose) {
    return updatePersona(persona)
}

export function discardPersona(type: PolicyType, idx: string) {
    isEditing.value = false
}

export function updateSelectedPersona() {
    selectedPersona.value = JSON.parse(
        JSON.stringify(selectedPersonaDirty.value)
    )
    reFetchList()
}
export async function enablePurpose(id, isEnabled) {
    selectedPersonaDirty.value!.enabled = isEnabled
    const payload = {
        action: isEnabled ? 'enable' : 'disable',
    }
    await enableDisablePurpose(id, payload)
}

export function addPolicy(type: PolicyType) {
    const id = `${newIdTag}${Date.now()}`
    if (type === 'meta') {
        selectedPersonaDirty.value?.metadataPolicies?.push({
            id,
            actions: [],
            users: [],
            groups: [],
            allow: true,
            name: '',
            type: 'metadata',
            description: '',
            isNew: true,
        })
        policyEditMap.value.metadataPolicies[id] = true
    }
    if (type === 'data') {
        selectedPersonaDirty.value?.dataPolicies?.push({
            id,
            actions: ['select'],
            users: [],
            groups: [],
            mask: 'null',
            allow: true,
            name: '',
            type: 'data',
            description: '',
            isNew: true,
        })
        policyEditMap.value.dataPolicies[id] = true
    }
}

export async function deletePolicy(type: PolicyType, id: string) {
    const tempPersona = { ...JSON.parse(JSON.stringify(selectedPersona.value)) }
    if (type === 'meta') {
        const policyIndex =
            selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                (pol) => pol.id === id
            ) ?? -1
        if (policyIndex > -1)
            tempPersona?.metadataPolicies?.splice(policyIndex, 1)
        await savePersona(tempPersona)
        selectedPersonaDirty.value?.metadataPolicies?.splice(policyIndex, 1)
    }
    if (type === 'data') {
        const policyIndex =
            selectedPersonaDirty.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            ) ?? -1
        if (policyIndex > -1) tempPersona?.dataPolicies?.splice(policyIndex, 1)
        await savePersona(tempPersona)
        selectedPersonaDirty.value?.dataPolicies?.splice(policyIndex, 1)
    }
}

export function saveClassifications() {
    const tempPersona = { ...JSON.parse(JSON.stringify(selectedPersona.value)) }
    tempPersona.tags = [...toRaw(selectedPersonaDirty.value).tags]
    return savePersona(tempPersona)
}
export function savePolicy(type: PolicyType, dataPolicy: Object) {
    const tempPersona = {
        ...JSON.parse(JSON.stringify(toRaw(selectedPersona.value))),
    }
    if (dataPolicy?.isNew) {
        delete dataPolicy?.isNew
        delete dataPolicy?.id
    } 
    if(dataPolicy.actions.includes('entity-update-classification')){
        dataPolicy.actions.push('entity-add-classification')
        dataPolicy.actions.push('entity-remove-classification')
    }
    if (type === 'meta') {
        if(dataPolicy.id){
            tempPersona.metadataPolicies = tempPersona.metadataPolicies.map((el) => {
                if(el.id === dataPolicy.id){
                    return dataPolicy
                }
                    return el
            })
        } else {
            tempPersona.metadataPolicies.push({...dataPolicy, type: 'metadata'})
        }
    }
    if (type === 'data') {
        if(dataPolicy.id){
            tempPersona.dataPolicies = tempPersona.dataPolicies.map((el) => {
                if(el.id === dataPolicy.id){
                    return {...dataPolicy, type: 'masking'}
                }
                    return { ...el, type: 'masking'}
            })
        } else {
            tempPersona.dataPolicies.push({...dataPolicy, type: 'masking'})
        }
    }
    return savePersona(tempPersona)
}

export function discardPolicy(type: PolicyType, id: string) {
    if (id?.includes('new')) {
        if (type === 'meta') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1
            if (dirtyPolicyIndex > -1) {
                selectedPersonaDirty.value?.metadataPolicies?.splice(
                    dirtyPolicyIndex,
                    1
                )
                delete policyEditMap.value.metadataPolicies[id]
            }
        } else if (type === 'data') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1
            if (dirtyPolicyIndex > -1) {
                selectedPersonaDirty.value?.dataPolicies?.splice(
                    dirtyPolicyIndex,
                    1
                )
                delete policyEditMap.value.dataPolicies[id]
            }
            console.log(
                type,
                id,
                policyEditMap.value,
                selectedPersonaDirty.value
            )
        }
    } else {
        if (type === 'meta') {
            const policyIndex =
                selectedPersona.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1

            if (dirtyPolicyIndex > -1 && policyIndex > -1) {
                const policy = toRaw(selectedPersona.value)?.metadataPolicies?.[
                    policyIndex
                ]

                const copySelectedPersonaDirty = JSON.parse(
                    JSON.stringify(toRaw(selectedPersonaDirty.value))
                )
                copySelectedPersonaDirty.metadataPolicies[dirtyPolicyIndex] = {
                    ...policy,
                }
                selectedPersonaDirty.value = copySelectedPersonaDirty
            }
            console.log(type, id, policyEditMap.value)
        }
        if (type === 'data') {
            const policyIndex =
                selectedPersona.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ??
                -1 ??
                -1

            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1

            if (dirtyPolicyIndex > -1 && policyIndex > -1) {
                const policy = toRaw(selectedPersona.value)?.dataPolicies?.[
                    policyIndex
                ]
                const copySelectedPersonaDirty = JSON.parse(
                    JSON.stringify(toRaw(selectedPersonaDirty.value))
                )
                copySelectedPersonaDirty.dataPolicies[dirtyPolicyIndex] = {
                    ...policy,
                }
                selectedPersonaDirty.value = copySelectedPersonaDirty
            }
            policyEditMap.value.dataPolicies[id] = false
        }
        policyEditMap.value.metadataPolicies[id] = false
    }
}

export function enablePersona(isEnabled) {
    selectedPersonaDirty.value!.enabled = isEnabled
}
export function isSavedPolicy() {}

export async function deletePersonaById(id: string) {
    await deletePersona(id)

    const personaIdx = personaList.value.findIndex((prs) => prs.id === id)
    if (personaIdx > -1) personaList.value.splice(personaIdx, 1)

    selectedPersonaId.value = personaList.value[0]?.id || ''
}
