import { Components } from '~/api/atlas/client'
import { Ref, computed, ComputedRef } from 'vue'

export default function useFilterUtils(filters: Ref<Record<string, any>>) {
  function isFilterApplied(id: string) {
    if (id === 'connector') {
      return (
        filters.value[id]?.attributeValue &&
        filters.value[id]?.attributeName
      )
    } else if (id === 'owners') {
      const onrFltr = filters.value[id]
      return (
        onrFltr?.noOwnerAssigned ||
        onrFltr?.groupValue?.length ||
        onrFltr?.userValue?.length
      )
    } else if (
      ['workflowCategory', 'workflowType'].includes(id)
    ) {
      if (filters.value[id]?.checked?.length) return true
    } else if (filters.value[id]?.applied) {
      if (Object.keys(filters.value[id]?.applied).length) return true
    }
    return false
  }

  const totalAppliedFiltersCount = computed(() =>
    Object.keys(filters.value)?.reduce((acc, key) => {
      return isFilterApplied(key) ? acc + 1 : acc
    }, 0)
  )

  function generateFacetConfigForRouter() {
    return Object.keys(filters.value).reduce((acc, key) => {
      if (isFilterApplied(key)) acc[key] = filters.value[key]
      return acc
    }, {})
  }

  return {
    isFilterApplied,
    totalAppliedFiltersCount,
    generateFacetConfigForRouter,
  }
}
