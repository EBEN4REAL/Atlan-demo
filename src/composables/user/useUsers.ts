import { ref, watch, computed, ComputedRef, Ref } from "vue";
import { useTimeAgo } from "@vueuse/core";
import swrvState from "~/composables/utils/swrvState";
import { useAPI } from "~/services/api/useAPI";
import { pluralizeString } from "~/composables/utils/string-operations";
import { roleMap } from "~/constant/role";

const getUserName = (user: any) => {
  const { first_name } = user;
  const { last_name } = user;
  if (first_name) {
    return `${first_name} ${last_name || ""}`;
  }
  return user.email;
};
const getUserRole = (user: any) => {
  const { roles } = user;
  if (roles && roles.length > 0) {
    if (roles.length > 0) {
      const atlanRole = roles.find((role: string) => role.startsWith("$"));

      return {
        name: roleMap[atlanRole] ? roleMap[atlanRole] : "",
        code: roleMap[atlanRole] ? atlanRole : "",
      };
    }
  }
  return {
    name: "",
    code: "",
  };
};
const getUserStatus = (user: any) => {
  if (!user.enabled) {
    return {
      color: "text-error",
      icon: "fal times-circle",
      status: "Disabled",
    };
  } if (user.isLocked) {
    return {
      color: "text-error",
      icon: "fa lock",
      status: "Locked",
    };
  }
  return {
    color: "text-success",
    icon: "fas check-circle",
    status: "Active",
  };
};
const getFormattedUser = (user: any) => {
  const localUser = {
    ...user,
    name: getUserName(user),
    group_count_string: pluralizeString("group", user.group_count || 0),
    status_object: getUserStatus(user),
    role_object: getUserRole(user),
    created_at_time_ago: user.created_timestamp
      ? useTimeAgo(user.created_timestamp).value
      : "",
  };
  return localUser;
};
export const useUser = (userListAPIParams: {
  limit: number;
  offset: number;
  filter: any;
  sort: string;
}) => {
  const {
    data,
    error,
    isValidating,
    isLoading,
    mutate: getUser,
  } = useAPI("GET_USER", "GET", {
    cache: "",
    params: userListAPIParams,
    options: ref({
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }),
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const userList = computed(() => {
    if (data.value && data?.value?.records)
      return data?.value.records.map((user: any) => getFormattedUser(user));
    return [];
  });
  const totalUserCount = computed(() => data?.value?.total_record ?? 0);
  const filteredUserCount = computed(() => data?.value?.filter_record ?? 0);
  return {
    userList,
    totalUserCount,
    filteredUserCount,
    isValidating,
    getUser,
    state,
    STATES,
    isLoading,
  };
};
export default function useUsers(userListAPIParams: {
  limit: number;
  offset: number;
  filter: any;
  sort: string;
}) {
  const {
    data,
    error,
    isValidating,
    mutate: getUserList,
  } = useAPI("LIST_USERS", "GET", {
    cache: "true",
    params: userListAPIParams,
    options: ref({
      revalidateOnFocus: false,
      dedupingInterval: 1,
    }),
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const userList = computed(() => {
    if (data.value && data?.value?.records)
      return data?.value.records.map((user: any) => getFormattedUser(user));
    return [];
  });
  const localUsersList: Ref<any[]> = ref([]);
  watch(data, () => {
    if (data && data.value) {
      if (userListAPIParams.offset > 0) {
        localUsersList.value = [
          ...localUsersList.value,
          ...data?.value?.records?.map((user: any) => getFormattedUser(user)),
        ];
      } else {
        localUsersList.value =
          data?.value?.records?.map((user: any) => getFormattedUser(user)) ??
          [];
      }
    }
  });
  const usersListConcatenated: ComputedRef<any> = computed(
    () => localUsersList.value || []
  );
  const totalUserCount = computed(() => data?.value?.total_record ?? 0);
  const filteredUserCount = computed(() => data?.value?.filter_record ?? 0);

  return {
    userList,
    totalUserCount,
    filteredUserCount,
    getUserList,
    state,
    STATES,
    usersListConcatenated,
  };
}
