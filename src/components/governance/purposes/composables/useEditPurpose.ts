import { Ref, ref, watch } from 'vue'
import { IPersona } from '~/types/accessPolicies/purposes'
import usePurposeService from './usePurposeService'
import { message } from 'ant-design-vue'
import {
    selectedPersona,
    reFetchList,
    personaList,
    selectedPersonaId,
} from './usePurposeList'

const { updatePersona, deletePersona, createPersona } = usePurposeService()

export type PolicyType = 'meta' | 'data'

export const isEditing = ref(false)
export const selectedPersonaDirty: Ref<IPersona | undefined> = ref(undefined)

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
    resourcePolicies: {} as Record<string, boolean>,
})

watch(selectedPersona, () => {
    policyEditMap.value = {
        dataPolicies:
            selectedPersona.value?.dataPolicies?.reduce((acc, curr) => {
                acc[curr.id!] = false
                return acc
            }, {}) || {},
        resourcePolicies:
            selectedPersona.value?.resourcePolicies?.reduce((acc, curr) => {
                acc[curr.id!] = false
                return acc
            }, {}) || {},
    }
})

export function setEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.resourcePolicies[idx] = true
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = true
}

export function removeEditFlag(type: PolicyType, idx: string) {
    if (type === 'meta') policyEditMap.value.resourcePolicies[idx] = false
    else if (type === 'data') policyEditMap.value.dataPolicies[idx] = false
}

export async function savePersona(persona: IPersona) {
    return updatePersona(persona)
}

export function discardPersona(type: PolicyType, idx: string) {
    isEditing.value = false
}

export function addPolicy(type: PolicyType) {
    const id = `new_${Date.now()}`
    if (type === 'meta') {
        selectedPersonaDirty.value?.resourcePolicies?.push({
            id,
            actions: [],
            users: [],
            groups: [],
            allow: true,
            name: '',
            description: '',
            isNew: true,
        })
        policyEditMap.value.resourcePolicies[id] = true
    }
    if (type === 'data') {
        selectedPersonaDirty.value?.dataPolicies?.push({
            id,
            actions: ['select'],
            users: [],
            groups: [],
            maskingOption: 'MASK_NONE',
            allow: true,
            name: '',
            description: '',
            isNew: true,
        })
        policyEditMap.value.dataPolicies[id] = true
    }
}

export async function addFirstPolicy(type: string, id) {
    try {
        const purposeOb = Object.assign({}, selectedPersonaDirty.value)
        delete purposeOb[id]

        const purpose = await createPersona(purposeOb)
        const tempPersona = { ...purposeOb }
        if (type === 'meta') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.resourcePolicies?.findIndex(
                    (pol) => pol.id === id
                )

            if (dirtyPolicyIndex > -1) {
                const policy =
                    selectedPersonaDirty.value?.resourcePolicies?.[
                        dirtyPolicyIndex
                    ]
                if (policy?.isNew) {
                    delete policy?.isNew
                    delete policy?.id
                    tempPersona?.resourcePolicies?.push(policy!)
                    if (tempPersona?.resourcePolicies.length > 1)
                        tempPersona?.resourcePolicies.splice(0, 1)
                } else {
                    const policyIndex =
                        selectedPersona.value?.resourcePolicies?.findIndex(
                            (pol) => pol.id === id
                        )
                    tempPersona.resourcePolicies![policyIndex!] = policy
                }
            }
            policyEditMap.value.resourcePolicies[id] = false
        }
        if (type === 'data') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.dataPolicies?.findIndex(
                    (pol) => pol.id === id
                )

            if (dirtyPolicyIndex > -1) {
                const policy =
                    selectedPersonaDirty.value?.dataPolicies?.[dirtyPolicyIndex]
                if (policy?.isNew) {
                    delete policy?.isNew
                    delete policy?.id
                    tempPersona?.dataPolicies?.push(policy!)
                    if (tempPersona?.dataPolicies.length > 1)
                        tempPersona?.dataPolicies.splice(0, 1)
                } else {
                    const policyIndex =
                        selectedPersona.value?.dataPolicies?.findIndex(
                            (pol) => pol.id === id
                        )
                    tempPersona.dataPolicies![policyIndex!] = policy
                }
            }
            policyEditMap.value.dataPolicies[id] = false
        }
        message.success({
            content: ` purpose updated`,
            duration: 1.5,
            key: '1',
        })
        reFetchList().then(() => {
            selectedPersonaId.value = purpose.id!
        })
    } catch (error) {
        console.log(error, 'error')
        message.error({
            content: 'Failed to create purpose',
            duration: 1.5,
            key: '2',
        })
    }
}

export async function deletePolicy(type: PolicyType, id: string) {
    const tempPersona = { ...selectedPersona.value }
    if (type === 'meta') {
        const policyIndex =
            selectedPersonaDirty.value?.resourcePolicies?.findIndex(
                (pol) => pol.id === id
            )
        if (policyIndex > -1)
            tempPersona?.resourcePolicies?.splice(policyIndex, 1)

        await savePersona(tempPersona)
        selectedPersonaDirty.value?.resourcePolicies?.splice(policyIndex, 1)
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
    const tempPersona = { ...selectedPersona.value }
    if (type === 'meta') {
        const dirtyPolicyIndex =
            selectedPersonaDirty.value?.resourcePolicies?.findIndex(
                (pol) => pol.id === id
            )

        if (dirtyPolicyIndex > -1) {
            const policy =
                selectedPersonaDirty.value?.resourcePolicies?.[dirtyPolicyIndex]
            if (policy?.isNew) {
                delete policy?.isNew
                delete policy?.id
                tempPersona?.resourcePolicies?.push(policy!)
            } else {
                const policyIndex =
                    selectedPersona.value?.resourcePolicies?.findIndex(
                        (pol) => pol.id === id
                    )
                tempPersona.resourcePolicies![policyIndex!] = policy
            }
        }
        policyEditMap.value.resourcePolicies[id] = false
    }
    if (type === 'data') {
        const dirtyPolicyIndex =
            selectedPersonaDirty.value?.dataPolicies?.findIndex(
                (pol) => pol.id === id
            )

        if (dirtyPolicyIndex > -1) {
            const policy =
                selectedPersonaDirty.value?.dataPolicies?.[dirtyPolicyIndex]
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
        policyEditMap.value.dataPolicies[id] = false
    }
    return savePersona(tempPersona)
}

export function discardPolicy(type: PolicyType, id: string) {
    if (id?.includes('new')) {
        if (type === 'meta') {
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.resourcePolicies?.findIndex(
                    (pol) => pol.id === id
                )
            if (dirtyPolicyIndex > -1) {
                selectedPersonaDirty.value?.resourcePolicies?.splice(
                    dirtyPolicyIndex,
                    1
                )
                delete policyEditMap.value.resourcePolicies[id]
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
                selectedPersona.value?.resourcePolicies?.findIndex(
                    (pol) => pol.id === id
                )
            const dirtyPolicyIndex =
                selectedPersonaDirty.value?.resourcePolicies?.findIndex(
                    (pol) => pol.id === id
                )

            if (dirtyPolicyIndex > -1 && policyIndex > -1) {
                const policy =
                    selectedPersona.value?.resourcePolicies?.[policyIndex]
                selectedPersonaDirty.value.resourcePolicies[dirtyPolicyIndex] =
                    policy
            }

            policyEditMap.value.resourcePolicies[id] = false
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
export function deletePersonaByIdLocally(id: string) {
    const personaIdx = personaList.value.findIndex((prs) => prs.id === id)
    if (personaIdx > -1) personaList.value.splice(personaIdx, 1)

    selectedPersonaId.value = personaList.value[0]?.id || ''
}
