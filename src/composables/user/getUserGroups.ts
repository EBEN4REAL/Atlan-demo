import { ref, onMounted, watch, computed, Ref, ComputedRef } from 'vue'
import swrvState from '~/utils/swrvState'
import { getFormattedGroup } from '~/composables/group/formatGroup'
import { Users } from '~/services/service/users'
import { GET_USER_GROUPS } from '~/services/service/users/key'

export default function getUserGroups(
    groupListAPIParams: ComputedRef<{
        userId: string
        params: {
            limit: number
            offset: number
            filter: any
            sort: string
        }
        immediate: boolean | false
    }>
) {
    const localGroupsList: Ref<any[]> = ref([])
    const userId = computed(() => groupListAPIParams.value.userId)
    const params = computed(() => groupListAPIParams.value.params)
    const {
        data,
        mutate: getUserGroupList,
        isValidating,
        error,
        isLoading,
    } = Users.ListUserGroups(params, userId, {
        asyncOptions: {
            immediate: groupListAPIParams.value.immediate,
        },
        cacheKey: groupListAPIParams.value.userId,
        cacheOptions: {
            refreshInterval: 0,
            dedupingInterval: 2000,
        },
    })

    watch(data, () => {
        if (params.value.offset > 0) {
            localGroupsList.value = [
                ...localGroupsList.value,
                ...(data?.value?.records?.map((group: any) =>
                    getFormattedGroup(group)
                ) ?? []),
            ]
        } else {
            localGroupsList.value =
                data?.value?.records?.map((group: any) =>
                    getFormattedGroup(group)
                ) ?? []
        }
    })
    const { state, STATES } = swrvState(data, error, isValidating)
    const groupList: ComputedRef<any> = computed(
        () => localGroupsList.value || []
    )
    const totalGroupCount = computed(() => data?.value?.totalRecord ?? 0)
    const filteredGroupCount = computed(() => data?.value?.filterRecord ?? 0)
    return {
        groupList,
        totalGroupCount,
        filteredGroupCount,
        getUserGroupList,
        state,
        STATES,
        error,
        isLoading,
    }
}
