import { ref, onMounted, watch, computed, Ref, ComputedRef } from "vue";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";
import swrvState from "~/composables/utils/swrvState";

export default function getUserGroups(groupListAPIParams: {
  userId: string;
  params: { limit: number; offset: number; filter: any; sort: string };
}) {
  let localGroupsList: Ref<any[]> = ref([]);
  const {
    data,
    error,
    mutate: getUserGroupList,
    isValidating,
  } = useSWRV(
    [
      getAPIPath("auth", `/user/${groupListAPIParams.userId}/groups`),
      groupListAPIParams.params,
      {},
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }
  );
  watch(data, () => {
    if (groupListAPIParams.params.offset > 0) {
      localGroupsList.value = [
        ...localGroupsList.value,
        ...(data?.value?.records ?? []),
      ];
    } else {
      localGroupsList.value = data?.value?.records;
    }
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const groupList: ComputedRef<any> = computed(() => localGroupsList || []);
  let totalGroupCount = computed(() => data?.value?.total_record ?? 0);
  let filteredGroupCount = computed(() => data?.value?.filter_record ?? 0);
  return {
    groupList,
    totalGroupCount,
    filteredGroupCount,
    getUserGroupList,
    state,
    STATES,
  };
}
