import { Ref, ref, watch, toRaw } from 'vue'
import { IPurpose } from '~/types/accessPolicies/purposes'
import usePersonaService from './usePersonaService'
import {
    reFetchList,
    selectedPersona,
    personaList,
    selectedPersonaId,
} from './usePersonaList'

const { updatePersona, deletePersona } = usePersonaService()

export type PolicyType = 'meta' | 'data'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPurpose | undefined> = ref(undefined)

watch(
    () => selectedPersona.value?.id,
    () => {
        if (selectedPersona.value)
            selectedPersonaDirty.value = JSON.parse(
                JSON.stringify(selectedPersona.value)
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

export function addPolicy(type: PolicyType) {
    const id = `new_${Date.now()}`
    if (type === 'meta') {
        selectedPersonaDirty.value?.metadataPolicies?.push({
            id,
            actions: [],
            assets: [],
            connectionId: '',
            allow: true,
            name: '',
            description: '',
            isNew: true,
        })
        policyEditMap.value.metadataPolicies[id] = true
    }
    if (type === 'data') {
        selectedPersonaDirty.value?.dataPolicies?.push({
            id,
            actions: ['select'],
            assets: [],
            connectionName: '',
            connectionId: '',
            maskType: 'null',
            allow: true,
            name: '',
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
            )
        if (policyIndex > -1)
            tempPersona?.metadataPolicies?.splice(policyIndex, 1)
        await savePersona(tempPersona)
        selectedPersonaDirty.value?.metadataPolicies?.splice(policyIndex, 1)
    }
    if (type === 'data') {
        const policyIndex = selectedPersonaDirty.value?.dataPolicies?.findIndex(
            (pol) => pol.id === id
        )
        if (policyIndex > -1) tempPersona?.dataPolicies?.splice(policyIndex, 1)
        await savePersona(tempPersona)
        selectedPersonaDirty.value?.dataPolicies?.splice(policyIndex, 1)
    }
}

export function savePolicy(type: PolicyType, id: string) {
    const tempPersona = { ...JSON.parse(JSON.stringify(selectedPersona.value)) }
    if (type === 'meta') {
        const dirtyPolicyIndex =
            selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                (pol) => pol.id === id
            )

        if (dirtyPolicyIndex > -1) {
            const policy = {
                ...selectedPersonaDirty.value?.metadataPolicies?.[
                    dirtyPolicyIndex
                ],
            }
            if (policy?.isNew) {
                delete policy?.isNew
                delete policy?.id
                tempPersona?.metadataPolicies?.push(policy!)
            } else {
                const policyIndex =
                    selectedPersona.value?.metadataPolicies?.findIndex(
                        (pol) => pol.id === id
                    )
                tempPersona.metadataPolicies![policyIndex!] = policy
            }
        }
    }

    if (type === 'data') {
        const dirtyPolicyIndex =
            selectedPersonaDirty.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            )

        if (dirtyPolicyIndex > -1) {
            const policy = {
                ...selectedPersonaDirty.value?.dataPolicies?.[dirtyPolicyIndex],
            }

            if (policy?.isNew) {
                delete policy?.isNew
                delete policy?.id
                tempPersona?.dataPolicies?.push(policy!)
            } else {
                const policyIndex =
                    selectedPersona.value?.dataPolicies?.findIndex(
                        (pol) => pol.id === id
                    )
                tempPersona.dataPolicies![policyIndex!] = policy
            }
        }
    }
    debugger
    return savePersona(tempPersona)
}

export function discardPolicy(type: PolicyType, id: string) {
    if (id?.includes('new')) {
        if (type === 'meta') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                )
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
                )
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
                )
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                )

            if (dirtyPolicyIndex > -1 && policyIndex > -1) {
                const policy =
                    selectedPersona.value?.metadataPolicies?.[policyIndex]
                selectedPersonaDirty.value.metadataPolicies[dirtyPolicyIndex] =
                    policy
            }

            policyEditMap.value.metadataPolicies[id] = false
            console.log(type, id, policyEditMap.value)
        }
        if (type === 'data') {
            const policyIndex = selectedPersona.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            )

            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                )

            if (
                dirtyPolicyIndex &&
                dirtyPolicyIndex > -1 &&
                policyIndex &&
                policyIndex > -1
            ) {
                const policy =
                    selectedPersona.value?.dataPolicies?.[policyIndex]
                selectedPersonaDirty.value.dataPolicies[dirtyPolicyIndex] =
                    policy
            }
            policyEditMap.value.dataPolicies[id] = false
        }
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
