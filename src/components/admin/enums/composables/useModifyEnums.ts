import { useAsyncState } from "@vueuse/core";
import { ref } from "vue";
import { fetcherPost, getAPIPath, updater } from "~/api";
import enumDef from "../enum.interface";

const serviceAlias = "metastore";
const enumTypedef = "ENUM";

export function useAddEnums() {
  const newEnum = ref<enumDef>();
  const addEnum = useAsyncState(
    () => fetcherPost(
        getAPIPath(serviceAlias, "/types/typedefs"),
        { enumDefs: [newEnum.value] },
        { params: { type: enumTypedef } }
      ),
    { enumDefs: [] },
    { immediate: false }
  );
  // Setting the ready value to true as it works as our loading indicator
  // See: https://github.com/vueuse/vueuse/blob/main/packages/core/useAsyncState/index.ts
  function reset() {
    addEnum.isReady.value = true;
    addEnum.error.value = undefined;
  }
  reset();

  return { newEnum, addEnum, reset };
}

export function useUpdateEnums() {
  const updatedEnumDef = ref<enumDef>();

  const updateEnums = useAsyncState(
    () => {
      console.log(updatedEnumDef);
      return updater(
        getAPIPath(serviceAlias, "/types/typedefs"),
        { enumDefs: [updatedEnumDef.value] },
        { params: { type: enumTypedef } }
      );
    },
    { enumDefs: [] },
    { immediate: false, resetOnExecute: true }
  );

  function reset() {
    updateEnums.isReady.value = true;
    updateEnums.error.value = undefined;
  }
  reset();

  return { updateEnums, updatedEnumDef, reset };
}
