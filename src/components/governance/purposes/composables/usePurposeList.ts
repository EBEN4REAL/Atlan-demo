import { ref, computed, watch, toRefs } from 'vue'
import { usePurposeStore } from '~/store/purpose'
import usePurpose from '~/composables/purpose/usePurpose'
import { Purpose } from '~/services/service/purpose'

const purposeStore = usePurposeStore()
const { updatePurpose: handleUpdateList, errorPurpose } = purposeStore
const { getList: purposeList } = toRefs(purposeStore)

const {
    mutate: reFetchList,
    isLoading: isPurposeLoading,
    error: isPurposeError,
    isReady: isPurposeListReady,
} = usePurpose(false)

const refetchPurpose = (id) => {
    const { data, isLoading, isReady, error, mutate } =
        Purpose.getPurposeByID(id)
    watch([data, error], () => {
        if (data?.value) {
            handleUpdateList(data.value)
        }
    })
}

export {
    reFetchList,
    refetchPurpose,
    purposeList,
    isPurposeListReady,
    isPurposeLoading,
    isPurposeError,
    handleUpdateList,
    errorPurpose
}

// Selected purpose Details
export const selectedPurposeId = ref('')
export const selectedPurpose = ref()
watch(
    [selectedPurposeId, purposeList],
    () => {
        if (selectedPurposeId.value) {
            const t = purposeList.value?.find(
                (ps) => ps.id == selectedPurposeId.value
            )
            if (!t) selectedPurpose.value = undefined
            selectedPurpose.value = { ...t }
            return
        }
        selectedPurpose.value = undefined
    },
    { immediate: true, deep: true }
)
// Filtered Purpose List
export const searchTerm = ref('')
export const facets = ref({})
export const filteredPurposes = computed(() => {
    let result = purposeList.value
    const { owners, classifications } = facets.value
    const hasFilters =
        !!searchTerm.value ||
        !!(owners?.ownerUsers?.length || owners?.ownerGroups?.length) ||
        !!classifications?.classifications?.length
    if (searchTerm.value) {
        result = purposeList.value.filter((purpose) => {
            // search term
            const match = purpose.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
            return match
        })
    }

    if (classifications?.classifications?.length) {
        result = result.filter((purpose) => {
            // classifications
            const match = purpose.tags?.filter((tag) =>
                classifications.classifications.includes(tag)
            ).length
            return match
        })
    }

    if (owners?.ownerUsers?.length || owners?.ownerGroups?.length) {
        const { ownerUsers, ownerGroups } = owners
        result = result.filter((purpose) => {
            const metadataPolicies = purpose?.metadataPolicies || []
            const dataPolicies = purpose?.dataPolicies || []
            const policies = [...metadataPolicies, ...dataPolicies]
            const users = []
            const groups = []
            policies.forEach((policy) => {
                if (policy.users.length) {
                    users.push(...policy.users)
                }
                if (policy.groups.length) {
                    groups.push(...policy.groups)
                }
            })
            console.log('users', users)
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

    if (!hasFilters) {
        result = purposeList.value || []
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
