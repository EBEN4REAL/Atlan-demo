import { ref, onMounted, watch, computed, Ref, ComputedRef } from "vue";
import useSWRV from "swrv";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import swrvState from "~/composables/utils/swrvState";
import { getFormattedGroup } from "~/composables/group/formatGroup";

export default function getUserGroups(groupListAPIParams: {
  userId: string;
  params: { limit: number; offset: number; filter: any; sort: string };
}) {
  const localGroupsList: Ref<any[]> = ref([]);
  const {
    data,
    error,
    mutate: getUserGroupList,
    isValidating,
  } = useSWRV(
    [
      getAPIPath("auth", `/users/${groupListAPIParams.userId}/groups`),
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
        ...(data?.value?.records?.map((group: any) =>
          getFormattedGroup(group)
        ) ?? []),
      ];
    } else {
      localGroupsList.value =
        data?.value?.records?.map((group: any) => getFormattedGroup(group)) ??
        [];
    }
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const groupList: ComputedRef<any> = computed(() => localGroupsList.value || []);
  const totalGroupCount = computed(() => data?.value?.total_record ?? 0);
  const filteredGroupCount = computed(() => data?.value?.filter_record ?? 0);
  return {
    groupList,
    totalGroupCount,
    filteredGroupCount,
    getUserGroupList,
    state,
    STATES,
  };
}
