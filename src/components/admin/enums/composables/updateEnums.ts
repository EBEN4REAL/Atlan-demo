import { updater, getAPIPath } from "~/api";
import { useAsyncState } from "@vueuse/core";
import enumDef from "../enum.interface";

const serviceAlias = "auth/atlas";
const enumTypedef = "ENUM";

export default function updateEnums(updatedEnumDef: enumDef) {
  return useAsyncState(
    () => {
      console.log(updatedEnumDef);
      return updater(
        getAPIPath(serviceAlias, "/types/typedefs"),
        { enumDefs: [updatedEnumDef] },
        { params: { type: enumTypedef } }
      );
    },
    { enumDefs: [] },
    { immediate: false, resetOnExecute: true }
  );
}
