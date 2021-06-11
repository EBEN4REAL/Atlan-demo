import { fetcherPost, getAPIPath } from "~/api";
import { useAsyncState } from "@vueuse/core";
import enumDef from "../enum.interface";
import { ref } from "vue";

const serviceAlias = "auth/atlas";
const enumTypedef = "ENUM";

export default function useAddEnums() {
  const newEnum = ref<enumDef>();
  const addEnum = useAsyncState(
    () => {
      console.log("NEW ENUM", newEnum.value);
      return Promise.reject({ enumDefs: ["hi"] });
      // fetcherPost(
      //   getAPIPath(serviceAlias, "/types/typedefs"),
      //   { enumDefs: [newEnum] },
      //   { params: { type: enumTypedef } }
      // );
    },
    { enumDefs: [] },
    { immediate: false, resetOnExecute: true }
  );

  return { newEnum, addEnum };
}
