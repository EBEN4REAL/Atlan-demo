import { fetcher, getAPIPath } from "~/api";
import useSWRV from "swrv";
import { computed, ref } from "vue";

const serviceAlias = "auth/atlas";
const enumTypedef = "ENUM";

export default function useEnums() {
  const { data: enumListResponse, mutate } = useSWRV(
    [getAPIPath(serviceAlias, "/types/typedefs"), { type: enumTypedef }],
    fetcher,
    { revalidateOnFocus: false }
  );

  const currentEnumId = ref("");

  const enumListData = computed(() => enumListResponse.value?.enumDefs || []);

  const selectedId = computed({
    get: () => currentEnumId.value || enumListData.value?.[0]?.guid,
    set: (val) => {
      currentEnumId.value = val;
    },
  });

  const selectedEnum = computed({
    get: () =>
      enumListData.value?.find((enumObj) => enumObj.guid === selectedId.value),
    set: (updatedEnum) => {
      const idx = enumListData.value.findIndex(
        (enumObj) => enumObj.guid === updatedEnum.guid
      );
      enumListData.value[idx] = updatedEnum;
    },
  });

  return {
    selectedId,
    enumListData,
    selectedEnum,
    refetchEnumList: mutate,
  };
}
