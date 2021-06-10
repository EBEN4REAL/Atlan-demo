import { fetcherPost, getAPIPath } from "~/api";
import { useAsyncState } from "@vueuse/core";
import enumDef from "../enum.interface";

const serviceAlias = "auth/atlas";
const enumTypedef = "ENUM";

export default function addEnums(newEnum: enumDef) {
  return useAsyncState(
    () => {
      console.log("NEW ENUM", newEnum);
      return Promise.resolve({ enumDefs: ["hi"] });
      // fetcherPost(
      //   getAPIPath(serviceAlias, "/types/typedefs"),
      //   { enumDefs: [newEnum] },
      //   { params: { type: enumTypedef } }
      // );
    },
    { enumDefs: [] },
    { immediate: false, resetOnExecute: true }
  );
}
