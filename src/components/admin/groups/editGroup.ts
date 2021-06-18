import { fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";
import swrvState from "~/composables/utils/swrvState";

export default function editGroup(group: any) {
  const {
    error,
    mutate: editGroupDetails,
    isValidating,
  } = useSWRV(
    [getAPIPath("auth", `/groups/${group.id}`), { ...group }],
    fetcherPost
  );
  return {
    error,
    editGroupDetails,
    isValidating,
  };
}
