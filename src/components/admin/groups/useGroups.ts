//useGroups

import { ref, onMounted, watch, computed, toRefs } from "vue";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";
import swrvState from "~/composables/utils/swrvState";
import { useTimeAgo } from "@vueuse/core";

export const pluralizeString = (
  string: string,
  count: number,
  includeCountInString: boolean = true
) => {
  if (includeCountInString)
    return count === 1 ? `${count} ${string}` : `${count} ${string}s`;
  else return count === 1 ? `${string}` : `${string}s`;
};
export const getNameInTitleCase = (name: string, delimiter = " ") => {
  return name
    .split(delimiter)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
    )
    .join(" ");
};
export const getNameInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};
const getFormattedGroup = (group: any) => {
  //deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
  let formattedGroup = {
    id: group.id,
    name: group.alias,
    alias: group.name,
    createdAt: group?.attributes?.created_at ?? "-",
    createdAtTimeAgo: group.attributes.created_at
      ? useTimeAgo(group.attributes.created_at).value
      : "",
    createdBy: group?.attributes?.created_by ?? "-",
    image: group.attributes.image || "",
    description: group.attributes.description || "",
    memberCount: group.user_count || 0,
    memberCountString: pluralizeString("member", group.user_count || 0),
  };
  return formattedGroup || {};
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
  let totalGroupsCount = computed(() => data?.value?.total_record ?? 0);
  let filteredGroupsCount = computed(() => data?.value?.filtered_record ?? 0);
  return {
    groupList,
    totalGroupsCount,
    filteredGroupsCount,
    getGroupList,
    state,
    STATES,
  };
}
