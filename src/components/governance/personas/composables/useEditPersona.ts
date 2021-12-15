import { Ref, ref, watch, toRaw } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import usePersonaService from './usePersonaService'
import {
    reFetchList,
    selectedPersona,
    personaList,
    selectedPersonaId,
} from './usePersonaList'

const { updatePersona, deletePersona } = usePersonaService()

export const newIdTag = 'new_'
export type PolicyType = 'meta' | 'data'
export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export const policyEditMap = ref({
    dataPolicies: {} as Record<string, boolean>,
    metadataPolicies: {} as Record<string, boolean>,
})

/* ------------------------------------------ */
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
/* ------------------------------------------ */

export function setEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = true
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = true
}

export function removeEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.metadataPolicies[idx] = false
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = false
}

export async function savePersona(persona: IPersona) {
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
    const id = `${newIdTag}${Date.now()}`
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

export function savePolicy(type: PolicyType, dataPolicy: string) {
    const tempPersona = {
        ...JSON.parse(JSON.stringify(toRaw(selectedPersona.value))),
    }
    if (dataPolicy?.isNew) {
        delete dataPolicy?.isNew
        delete dataPolicy?.id
    }
    if (type === 'meta') {
        tempPersona.metadataPolicies.push(dataPolicy)
    }
    if (type === 'data') {
        tempPersona.dataPolicies.push(dataPolicy)
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
        console.log('else')
        if (type === 'meta') {
            const policyIndex =
                selectedPersona.value?.metadataPolicies?.findIndex(
                    (pol) => pol.id === id
                )
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
            const policyIndex = selectedPersona.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            )

            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                ) ?? -1
            console.log(policyIndex, dirtyPolicyIndex, '-1')

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
