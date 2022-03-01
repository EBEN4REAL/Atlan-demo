import { ref, computed, watch, toRefs } from 'vue'
import { usePurposeStore } from '~/store/purpose'
import usePurpose from '~/composables/purpose/usePurpose'
import { Purpose } from '~/services/service/purpose'

const purposeStore = usePurposeStore()
const { updatePurpose: handleUpdateList } = purposeStore
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
    if (searchTerm.value) {
        return purposeList.value.filter((ps) =>
            ps.displayName
                ?.toLowerCase()
                .includes(searchTerm.value?.toLowerCase())
        )
    }
    return purposeList.value || []
})
