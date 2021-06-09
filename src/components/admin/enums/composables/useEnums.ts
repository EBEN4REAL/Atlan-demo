import { fetcher, getAPIPath } from "~/api";
import useSWRV from "swrv";
import { computed } from "vue";

const serviceAlias = "auth/atlas";
const enumTypedef = "ENUM";

export default function useEnums() {
  const { data: enumListResponse, mutate } = useSWRV(
    [getAPIPath(serviceAlias, "/types/typedefs"), { type: enumTypedef }],
    fetcher,
    { revalidateOnFocus: false }
  );

  const enumListData = computed(() => enumListResponse.value?.enumDefs || []);

  return {
    enumListData,
    refetchEnumList: mutate,
  };
}
