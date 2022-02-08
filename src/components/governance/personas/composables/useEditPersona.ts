import { Ref, ref, watch, toRaw } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'
import usePersonaService from './usePersonaService'
import { usePersonaStore } from '~/store/persona'
import {
    reFetchList,
    selectedPersona,
    personaList,
    selectedPersonaId,
    handleUpdateList
} from './usePersonaList'

const {
    updatePersona,
    deletePersona,
    enableDisablePersona,
    createPolicy,
    updateDataPolicy,
    deleteDataPolicy,
} = usePersonaService()

export const newIdTag = 'new_'
export type PolicyType = 'meta' | 'data'
export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

export const policyEditMap = ref({
    dataPolicies: {} as Record<string, boolean>,
    metadataPolicies: {} as Record<string, boolean>,
})

const store = usePersonaStore()
const { updatePersona: updatePersonaStoreList } = store

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
    () => selectedPersona,
    () => {
        if (selectedPersona.value)
            selectedPersonaDirty.value = JSON.parse(
                JSON.stringify(toRaw(selectedPersona.value))
            )
        else selectedPersonaDirty.value = undefined
    },
    { immediate: true, deep: true }
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
    const payload = { ...persona }
    if (!payload.attributes) {
        payload.attributes = {}
    }
    if (!payload.resources) {
        payload.resources = {}
    }
    if (payload.readme === null) {
        delete payload.readme
    }
    return updatePersona(payload)
}

export function updatedSelectedData(persona) {
    selectedPersonaDirty.value = { ...selectedPersonaDirty.value, ...persona }
    handleUpdateList(selectedPersonaDirty.value)
}

export function discardPersona(type: PolicyType, idx: string) {
    isEditing.value = false
}

export function updateSelectedPersona() {
    selectedPersona.value = JSON.parse(
        JSON.stringify(selectedPersonaDirty.value)
    )
    updatePersonaStoreList(selectedPersona.value)
}

export async function addPolicy(type: String, dataPolicyProp: any) {
    const dataPolicy = dataPolicyProp
    delete dataPolicy?.isNew
    if (dataPolicy.actions.includes('entity-update-classification')) {
        dataPolicy.actions.push('entity-add-classification')
        dataPolicy.actions.push('entity-remove-classification')
    }
    if (type === 'data') {
        dataPolicy.actions = ['select']
    }
    const payload = {
        type: type === 'meta' ? 'metadataPolicy' : 'dataPolicy',
        policy: dataPolicy,
    }
    return createPolicy(payload, selectedPersona.value.id)
}

export async function updatePolicy(type: String, dataPolicyProp: any) {
    const dataPolicy = dataPolicyProp
    const idPolicy = dataPolicyProp.id
    delete dataPolicy?.id
    if (dataPolicy.actions.includes('entity-update-classification')) {
        dataPolicy.actions.push('entity-add-classification')
        dataPolicy.actions.push('entity-remove-classification')
    }
    if (type === 'data') {
        dataPolicy.actions = ['select']
    }
    const payload = {
        type: type === 'meta' ? 'metadataPolicy' : 'dataPolicy',
        policy: dataPolicy,
    }
    return updateDataPolicy(payload, idPolicy, selectedPersona.value.id)
    // return createPolicy(payload, selectedPersona.value.id)
}

export async function deletePolicyV2(idPolicy: String) {
    return deleteDataPolicy(idPolicy, selectedPersona.value.id)
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

export function savePolicy(type: PolicyType, dataPolicy: Object) {
    const tempPersona = {
        ...JSON.parse(JSON.stringify(toRaw(selectedPersona.value))),
    }
    if (dataPolicy?.isNew) {
        delete dataPolicy?.isNew
        delete dataPolicy?.id
    }
    if (dataPolicy.actions.includes('entity-update-classification')) {
        dataPolicy.actions.push('entity-add-classification')
        dataPolicy.actions.push('entity-remove-classification')
    }
    if (type === 'meta') {
        if (dataPolicy.id) {
            tempPersona.metadataPolicies = tempPersona.metadataPolicies.map(
                (el) => {
                    if (el.id === dataPolicy.id) {
                        return dataPolicy
                    }
                    return el
                }
            )
        } else {
            tempPersona.metadataPolicies.push(dataPolicy)
        }
    }
    if (type === 'data') {
        if (dataPolicy.id) {
            tempPersona.dataPolicies = tempPersona.dataPolicies.map((el) => {
                if (el.id === dataPolicy.id) {
                    return { ...dataPolicy, actions: ['select'] }
                }
                return { ...el, actions: ['select'] }
            })
        } else {
            tempPersona.dataPolicies.push({
                ...dataPolicy,
                actions: ['select'],
            })
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
        }
        if (type === 'data') {
            const policyIndex = selectedPersona.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            )

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

export async function enablePersona(id, isEnabled) {
    selectedPersonaDirty.value!.enabled = isEnabled
    const payload = {
        action: isEnabled ? 'enable' : 'disable',
    }
    await enableDisablePersona(id, payload)
}
export function isSavedPolicy() { }

export async function deletePersonaById(id: string) {
    const personaStore = usePersonaStore()
    const { removePersona } = personaStore
    await deletePersona(id)
    removePersona(id)
    selectedPersonaId.value = personaList.value[0]?.id || ''
}
