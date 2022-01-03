// useGroups

import { ref, watch, computed, ComputedRef, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import axios from 'axios'
import swrvState from '~/utils/swrvState'
import { getFormattedGroup } from '~/composables/group/formatGroup'

import { Groups } from '~/services/service/groups'
import { LIST_GROUPS, LIST_GROUP } from '~/services/service/groups/key'
import { useOptions } from '~/services/api/common'

export const useGroup = (groupListAPIParams, immediate = true) => {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    options.asyncOptions = ref({
        resetOnExecute: false,
        immediate,
    })

    const { data, mutate, isLoading, isValidating, error } = Groups.List(
        groupListAPIParams,
        options
    )

    const groupList = computed(() => {
        if (data.value && data?.value?.records)
            return data?.value.records.map((group: any) =>
                getFormattedGroup(group)
            )
        return []
    })
    const totalGroupCount = computed(() => data?.value?.totalRecord ?? 0)
    const filteredGroupCount = computed(() => data?.value?.filterRecord ?? 0)

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const getGroupList = () => {
        cancelRequest()
        mutate()
    }

    return {
        groupList,
        totalGroupCount,
        filteredGroupCount,
        isValidating,
        isLoading,
        error,
        getGroupList,
        cancelRequest,
    }
}
const defaultCacheOption = {
    cacheOptions: {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        cache: new LocalStorageCache(),
        dedupingInterval: 1,
    },
}
export default function useGroups(
    groupListAPIParams: {
        limit: number
        offset: number
        filter?: any
        sort?: string
    },
    cacheKey?: string,
    cacheOption = defaultCacheOption
) {
    // API to get groups based on params groupListAPIParams
    const {
        data,
        error,
        isValidating,
        isLoading,
        mutate: getGroupList,
    } = Groups.List(groupListAPIParams, {
        ...cacheOption,
        cacheKey: cacheKey ?? LIST_GROUPS,
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
    const totalGroupsCount = computed(() => data?.value?.totalRecord ?? 0)
    const filteredGroupsCount = computed(() => data?.value?.filterRecord ?? 0)
    return {
        groupList,
        totalGroupsCount,
        filteredGroupsCount,
        getGroupList,
        state,
        STATES,
        isLoading,
        error,
        groupListConcatenated,
        isValidating
    }
}
