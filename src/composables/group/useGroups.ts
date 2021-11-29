// useGroups

import { ref, watch, computed, ComputedRef, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import swrvState from '~/utils/swrvState'
import { getFormattedGroup } from '~/composables/group/formatGroup'

import { Groups } from '~/services/service/groups'
import { LIST_GROUPS, LIST_GROUP } from '~/services/service/groups/key'

export const useGroup = (groupListAPIParams, cacheKeyProp = "") => {
    const {
        data,
        error,
        isValidating,
        mutate: getGroup,
    } = Groups.List(groupListAPIParams, {
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
        cacheKey: cacheKeyProp || LIST_GROUP,
    })

    const { state, STATES } = swrvState(data, error, isValidating)
    const groupList = computed(() => {
        if (data.value && data?.value?.records)
            return data?.value.records.map((group: any) =>
                getFormattedGroup(group)
            )
        return []
    })
    const totalGroupCount = computed(() => data?.value?.total_record ?? 0)
    const filteredGroupCount = computed(() => data?.value?.filter_record ?? 0)

    return {
        groupList,
        totalGroupCount,
        filteredGroupCount,
        isValidating,
        getGroup,
        state,
        STATES,
    }
}
export default function useGroups(groupListAPIParams: {
    limit: number
    offset: number
    filter?: any
    sort?: string
}) {
    // API to get groups based on params groupListAPIParams
    const {
        data,
        error,
        isValidating,
        isLoading,
        mutate: getGroupList,
    } = Groups.List(groupListAPIParams, {
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
        cacheKey: LIST_GROUPS,
    })

    const { state, STATES } = swrvState(data, error, isValidating)
    const groupList = computed(() => {
        if (data.value && data.value.records)
            return data.value.records.map((group: any) =>
                getFormattedGroup(group)
            )
        return []
    })
    const localGroupsList: Ref<any[]> = ref([])
    watch(
        data,
        () => {
            const escapedData = data?.value?.records
                ? data?.value?.records?.map((group: any) =>
                    getFormattedGroup(group)
                )
                : []

            if (data && data.value) {
                if (groupListAPIParams.offset > 0) {
                    localGroupsList.value = [
                        ...localGroupsList.value,
                        ...escapedData,
                    ]
                } else {
                    localGroupsList.value = escapedData
                }
            }
        },
        { immediate: true }
    )
    const groupListConcatenated: ComputedRef<any> = computed(
        () => localGroupsList.value || []
    )
    const totalGroupsCount = computed(() => data?.value?.total_record ?? 0)
    const filteredGroupsCount = computed(() => data?.value?.filter_record ?? 0)
    return {
        groupList,
        totalGroupsCount,
        filteredGroupsCount,
        getGroupList,
        state,
        STATES,
        isLoading, error,
        groupListConcatenated,
    }
}
