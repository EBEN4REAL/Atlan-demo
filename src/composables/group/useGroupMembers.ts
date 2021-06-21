import { ref, onMounted, watch, computed, Ref, ComputedRef } from "vue";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";
import swrvState from "~/composables/utils/swrvState";

export default function useGroupsMembers(memberListParams: {
  groupId: string;
  params: { limit: number; offset: number; filter: any; sort: string };
}) {
  let localMembersList: Ref<any[]> = ref([]);
  const {
    data,
    error,
    mutate: getGroupMembersList,
    isValidating,
  } = useSWRV(
    [
      getAPIPath("auth", `/groups/${memberListParams.groupId}/members`),
      memberListParams.params,
      {},
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }
  );
  watch(data, () => {
    if (memberListParams.params.offset > 0) {
      localMembersList.value = [
        ...localMembersList.value,
        ...(data?.value?.records ?? []),
      ];
    } else {
      localMembersList.value = data?.value?.records;
    }
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const memberList: ComputedRef<any> = computed(() => localMembersList || []);
  let totalMembersCount = computed(() => data?.value?.total_record ?? 0);
  let filteredMembersCount = computed(() => data?.value?.filtered_record ?? 0);
  return {
    memberList,
    totalMembersCount,
    filteredMembersCount,
    getGroupMembersList,
    state,
    STATES,
  };
}
