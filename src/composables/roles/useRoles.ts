import { watch, computed } from "vue";
import swrvState from "~/composables/utils/swrvState";
import { useAPI } from "~/services/api/useAPI";

let memberCountList = [];

const getMemberCount = (id) => {
  if (memberCountList && memberCountList.length > 0) {
    const details = memberCountList.find((role) => role.roleId === id);
    return details ? details.count : 0;
  }
  return 0;
};
const getFormattedRole = (role: any) => {
  const localRole = {
    id: role.roleId,
    name: role.roleName.substring(1), // remove $ from name
    memberCount: getMemberCount(role.roleId),
  };
  return localRole;
};
export default function useRoles() {
  const {
    data,
    error,
    isValidating,
    mutate: getRoleList,
  } = useAPI("LIST_ROLES", "GET", {
    params: {},
    options: {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    },
  });
  const { state, STATES } = swrvState(data, error, isValidating);
  const roleList = computed(() => {
    if (data.value && data.value.length) {
      const roles = data.value.filter((role) =>
        role.roleName.startsWith("$")
      );
      return roles.map((role: any) => getFormattedRole(role));
    }
    return [];
  });
  watch(data, () => {
    if (data && data.value && data.value.memberCount)
      memberCountList = data.value.memberCount;
  });
  return {
    roleList,
    getRoleList,
    state,
    STATES,
  };
}
