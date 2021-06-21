import { ref, onMounted, watch, computed, toRefs } from "vue";
import swrvState from "~/composables/utils/swrvState";
import { useAPI } from "~/api/useAPI";
import { pluralizeString } from "~/composables/utils/string-operations.ts";
import { roleMap } from "~/constant/role";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";

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
      color: "red",
      icon: "close-circle",
      status: "Disabled",
    };
  } else if (user.isLocked) {
    return {
      color: "red",
      icon: "lock",
      status: "Locked",
    };
  }
  return {
    color: "green",
    icon: "check-circle",
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
  };
  return localUser;
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
    params: userListAPIParams,
    options: {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    },
  });
  //   const {
  //     data,
  //     error,
  //     mutate: getUserList,
  //     isValidating,
  //   } = useSWRV(
  //     [getAPIPath("auth", "/users"), userListAPIParams, {}],
  //     fetcher,
  //     {
  //       revalidateOnFocus: false,
  //       dedupingInterval: 1,
  //     }
  //   );
  const { state, STATES } = swrvState(data, error, isValidating);

  let userList = computed(() => {
    if (data.value && data?.value?.records)
      return data?.value.records.map((user: any) => getFormattedUser(user));
    return [];
  });
  let totalUserCount = computed(() => data?.value?.total_record ?? 0);
  let filteredUserCount = computed(() => data?.value?.filter_record ?? 0);

  return {
    userList,
    totalUserCount,
    filteredUserCount,
    getUserList,
    state,
    STATES,
  };
}
