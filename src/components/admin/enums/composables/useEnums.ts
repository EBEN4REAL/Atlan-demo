import useSWRV from "swrv";
import { computed, ref } from "vue";
import { fetcher, getAPIPath } from "~/api";
import enumDef from "../enum.interface";

const serviceAlias = "metastore";
const enumTypedef = "ENUM";

export default function useEnums() {
  const { data: enumListResponse, mutate } = useSWRV(
    [getAPIPath(serviceAlias, "/types/typedefs"), { type: enumTypedef }],
    fetcher,
    { revalidateOnFocus: false }
  );

  const currentEnumId = ref("");

  const enumListData = computed<enumDef[]>(
    () => enumListResponse.value?.enumDefs || []
  );

  const selectedId = computed<string>({
    get: () => currentEnumId.value || enumListData.value?.[0]?.guid,
    set: (val) => {
      currentEnumId.value = val;
    },
  });

  const selectedEnum = computed({
    get: () =>
      enumListData.value?.find((enumObj) => enumObj.guid === selectedId.value),
    set: (updatedEnum) => {
      if (updatedEnum) {
        const idx = enumListData.value.findIndex(
          (enumObj) => enumObj.guid === updatedEnum.guid
        );
        enumListData.value[idx] = updatedEnum;
      }
    },
  });

  function addToList(newEnum: enumDef) {
    const newEnumList = [newEnum, ...enumListData.value];
    mutate(() => ({ enumDefs: newEnumList }));
    selectedEnum.value = newEnum;
  }

  return {
    selectedId,
    enumListData,
    selectedEnum,
    refetchEnumList: mutate,
    addToList,
  };
}
