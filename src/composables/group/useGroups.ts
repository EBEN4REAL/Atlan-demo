//useGroups

import { ref, watch, computed, ComputedRef, Ref } from "vue";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";
import swrvState from "~/composables/utils/swrvState";
import { getFormattedGroup } from "~/composables/group/formatGroup";
import { useAPI } from "~/api/useAPI";

export const useGroup = (groupListAPIParams: {
  limit: number;
  offset: number;
  filter: any;
  // sort: string;
}) => {
  const {
    data,
    error,
    isValidating,
    mutate: getGroup,
  } = useAPI("GET_GROUP", "GET", {
    params: groupListAPIParams,
    options: {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    },
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  let groupList = computed(() => {
    if (data.value && data?.value?.records)
      return data?.value.records.map((group: any) => getFormattedGroup(group));
    return [];
  });
  let totalGroupCount = computed(() => data?.value?.total_record ?? 0);
  let filteredGroupCount = computed(() => data?.value?.filter_record ?? 0);
  return {
    groupList,
    totalGroupCount,
    filteredGroupCount,
    isValidating,
    getGroup,
    state,
    STATES,
  };
};
export default function useGroups(groupListAPIParams: {
  limit: number;
  offset: number;
  filter: any;
  sort: string;
}) {
  //API to get groups based on params groupListAPIParams
  const {
    data,
    error,
    mutate: getGroupList,
    isValidating,
  } = useSWRV(
    [getAPIPath("auth", "/groups"), groupListAPIParams, {}],
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }
  );
  const { state, STATES } = swrvState(data, error, isValidating);
  let groupList = computed(() => {
    if (data.value && data.value.records)
      return data.value.records.map((group: any) => getFormattedGroup(group));
    return [];
  });
  let localGroupsList: Ref<any[]> = ref([]);
  watch(data, () => {
    if (data && data.value && data.value.records) {
      if (groupListAPIParams.offset > 0) {
        localGroupsList.value = [
          ...localGroupsList.value,
          ...data.value.records.map((group: any) => getFormattedGroup(group)),
        ];
      } else {
        localGroupsList.value = data.value.records.map((group: any) =>
          getFormattedGroup(group)
        );
      }
    }
  });
  const groupListConcatenated: ComputedRef<any> = computed(
    () => localGroupsList || []
  );
  let totalGroupsCount = computed(() => data?.value?.total_record ?? 0);
  let filteredGroupsCount = computed(() => data?.value?.filter_record ?? 0);
  return {
    groupList,
    totalGroupsCount,
    filteredGroupsCount,
    getGroupList,
    state,
    STATES,
    groupListConcatenated,
  };
}
