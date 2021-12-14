import { ref, onMounted, watch, computed, Ref, ComputedRef } from 'vue'
// import useSWRV from 'swrv'
// import { fetcher, getAPIPath, getAxiosClient } from '~/api'
import swrvState from '~/utils/swrvState'
import { Groups } from '~/services/service/groups/index'

export default function useGroupsMembers(memberListParams: {
    groupId: string
    params: { limit: number; offset: number; filter: any; sort: string }
}) {
    const localMembersList: Ref<any[]> = ref([])
    const {
        data,
        error,
        mutate: getGroupMembersList,
        isValidating,
        isLoading,
    } = Groups.getGroupMembers(
        memberListParams.groupId,
        memberListParams.params,
        {
            revalidateOnFocus: false,
            dedupingInterval: 1,
        }
    )

    watch(data, () => {
        if (memberListParams.params.offset > 0) {
            localMembersList.value = [
                ...localMembersList.value,
                ...(data?.value?.records ?? []),
            ]
        } else {
            localMembersList.value = data?.value?.records ?? []
        }
    })
    const { state, STATES } = swrvState(data, error, isValidating)

    const memberList: ComputedRef<any> = computed(
        () => localMembersList.value || []
    )
    const totalMembersCount = computed(() => data?.value?.total_record ?? 0)
    const filteredMembersCount = computed(() => data?.value?.filter_record ?? 0)
    return {
        memberList,
        totalMembersCount,
        filteredMembersCount,
        getGroupMembersList,
        state,
        STATES,
        isLoading,
        error,
    }
}
