import { ref, onMounted, watch, computed, Ref, ComputedRef } from "vue";
import swrvState from "~/utils/swrvState";
import { getFormattedGroup } from "~/composables/group/formatGroup";
import { Users } from '~/services/service/users'
import { GET_USER_GROUPS } from '~/services/service/users/key'


export default function getUserGroups(groupListAPIParams: {
  userId: string;
  params: { limit: number; offset: number; filter: any; sort: string };
}, cacheProp = "") {
  const localGroupsList: Ref<any[]> = ref([]);
  const {
    data,
    mutate: getUserGroupList,
    isValidating,
    error,
    isLoading,
  } = Users.ListUserGroups(groupListAPIParams.params, groupListAPIParams.userId, {
    cacheKey: cacheProp || GET_USER_GROUPS,
    cacheOptions: {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }
  })

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
    error, isLoading,
  };
}
