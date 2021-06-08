//useGroups

import { ref, onMounted, watch } from 'vue'
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import useSWRV from "swrv";


export default function useGroups(groupListAPIParams) {

  //API to get groups based on params groupListAPIParams
  const { data:groupList, mutate: getGroupList } = useSWRV(
    [getAPIPath("auth", "/groups/v2"), groupListAPIParams, {}],
    fetcher
  );

  return {
    groupList,
    getGroupList,
  }
}
