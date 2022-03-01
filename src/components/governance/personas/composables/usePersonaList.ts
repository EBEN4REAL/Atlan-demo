import { ref, computed, watch, toRefs } from 'vue'
import { usePersonaStore } from '~/store/persona'
import usePersona from '~/composables/persona/usePersona'
import { Persona } from '~/services/service/persona'

const personaStore = usePersonaStore()
const { updatePersona: handleUpdateList } = personaStore
const { getList: personaList } = toRefs(personaStore)
const {
    mutate: reFetchList,
    isLoading: isPersonaLoading,
    error: isPersonaError,
    isReady: isPersonaListReady,
} = usePersona(false)

const refetchPersona = (id) => {
    const { data, isLoading, isReady, error, mutate } =
        Persona.getPersonaByID(id)
    watch([data, error], () => {
        if (data?.value) {
            handleUpdateList(data.value)
        }
    })
}

export {
    reFetchList,
    refetchPersona,
    personaList,
    isPersonaListReady,
    isPersonaLoading,
    isPersonaError,
    handleUpdateList,
}
// Selected Persona Details
export const selectedPersonaId = ref('')
export const selectedPersona = ref()
watch(
    [selectedPersonaId, personaList],
    () => {
        if (selectedPersonaId.value) {
            const t = personaList.value?.find(
                (ps) => ps.id == selectedPersonaId.value
            )
            if (!t) selectedPersona.value = undefined
            selectedPersona.value = t
            return
        }
        selectedPersona.value = undefined
    },
    { immediate: true, deep: true }
)
// Filtered Persona List
export const searchTerm = ref('')
export const facets = ref({})
export const filteredPersonas = computed(() => {
    let result = personaList.value
    const { hierarchy, owners, permissions } = facets.value
    const hasFilters =
        !!searchTerm.value ||
        !!Object.keys(hierarchy || {}).length ||
        !!(owners?.ownerUsers?.length || owners?.ownerGroups?.length) ||
        !!permissions?.length
    if (searchTerm.value) {
        result = personaList.value.filter((persona) => {
            // search term
            const match = persona.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
            return match
        })
    }

    if (hierarchy) {
        console.log(
            'usePersonaList hierarchy',
            { ...hierarchy },
            hierarchy?.connectorName
        )
        result = result.filter((persona) => {
            const metadataPolicies = persona?.metadataPolicies || []
            const dataPolicies = persona?.dataPolicies || []
            const policies = [...metadataPolicies, ...dataPolicies]
            const assets = policies.map((policy) => policy.assets[0])
            let found = false
            if (hierarchy?.attributeValue) {
                found =
                    found ||
                    assets.some((asset) =>
                        asset.includes(hierarchy?.attributeValue)
                    )
            } else if (hierarchy?.connectionQualifiedName) {
                found =
                    found ||
                    assets.some((asset) =>
                        asset.includes(hierarchy?.connectionQualifiedName)
                    )
            } else if (hierarchy?.connectorName) {
                found =
                    found ||
                    assets.some((asset) =>
                        asset.includes(hierarchy?.connectorName)
                    )
            }
            return found
        })
    }

    if (owners?.ownerUsers?.length || owners?.ownerGroups?.length) {
        const { ownerUsers, ownerGroups } = owners
        result = result.filter((persona) => {
            const users = persona?.users || []
            const groups = persona?.groups || []
            let found = false
            if (ownerUsers && ownerUsers.length) {
                found = found || users.some((user) => ownerUsers.includes(user))
            }
            if (ownerGroups && ownerGroups.length) {
                found =
                    found || groups.some((group) => ownerGroups.includes(group))
            }
            return found
        })
    }

    if (permissions && permissions.length) {
        result = result.filter((persona) => {
            const metadataPolicies = persona?.metadataPolicies || []
            let personaPerms = []
            metadataPolicies.forEach((policy) => {
                personaPerms = [...personaPerms, ...policy.actions]
            })
            console.log('personaPerms', personaPerms)
            let found = personaPerms.some((permission) =>
                permissions.includes(permission)
            )
            return found
        })
    }

    if (!hasFilters) {
        result = personaList.value || []
    }
    return result.sort((a, b) => {
        const current = a?.displayName?.toLowerCase()
        const last = b?.displayName?.toLowerCase()
        if (current < last) {
            return -1
        }
        if (current > last) {
            return 1
        }
        return 0
    })
})
