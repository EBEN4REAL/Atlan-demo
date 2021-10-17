// useGroups

import { ref, watch, computed, ComputedRef, Ref } from 'vue'
import useSWRV from 'swrv'
import { fetcher, getAPIPath } from '~/api'
import swrvState from '~/composables/utils/swrvState'
import { getFormattedGroup } from '~/composables/group/formatGroup'
import { useAPI } from '~/services/api/useAPI'

export const useGroup = (groupListAPIParams: {
    limit: number
    offset: number
    filter: any
    // sort: string;
}) => {
    const {
        data,
        error,
        isValidating,
        mutate: getGroup,
    } = useAPI('GET_GROUP', 'GET', {
        params: groupListAPIParams,
        options: {
            revalidateOnFocus: false,
            dedupingInterval: 1,
        },
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
    filter: any
    sort: string
}) {
    console.log('apiapth', getAPIPath('service', '/groups'))
    // API to get groups based on params groupListAPIParams
    const {
        data,
        error,
        mutate: getGroupList,
        isValidating,
    } = useSWRV(
        [getAPIPath('service', '/groups'), groupListAPIParams, {}],
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 1,
        }
    )
    const { state, STATES } = swrvState(data, error, isValidating)
    const groupList = computed(() => {
        if (data.value && data.value.records)
            return data.value.records.map((group: any) =>
                getFormattedGroup(group)
            )
        return []
    })
    const localGroupsList: Ref<any[]> = ref([])
    watch(data, () => {
        if (data && data.value) {
            if (groupListAPIParams.offset > 0) {
                localGroupsList.value = [
                    ...localGroupsList.value,
                    ...data.value.records.map((group: any) =>
                        getFormattedGroup(group)
                    ),
                ]
            } else {
                localGroupsList.value = data.value.records.map((group: any) =>
                    getFormattedGroup(group)
                )
            }
        }
    })
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
        groupListConcatenated,
    }
}
