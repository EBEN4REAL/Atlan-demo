
import { watch, ref } from 'vue'
import { useAsyncState } from "@vueuse/core";
import { getAPIPath, fetcherPost, updater } from '~/services/api/common'
import { Types } from '~/services/meta/types'
import { useTypedefStore } from '~/store/typedef'

const serviceAlias = "meta";


export function useUpdateCustomMetatdata(newCM) {
  const store = useTypedefStore()
  const updatedCMDef = ref();

  const { state: data, isReady, error, execute: update } = useAsyncState(
    () => updater(
      getAPIPath(serviceAlias, "/types/typedefs"),
      { businessMetadataDefs: [updatedCMDef.value] },
      { params: { type: 'BUSINESS_METADATA' } }
    )
    ,
    { businessMetadataDefs: [] },
    { immediate: false, resetOnExecute: true }
  );

  function reset() {
    isReady.value = true;
    error.value = undefined;
  }
  reset();


  watch(
    () => data.value,
    () => {
      if (
        data.value?.businessMetadataDefs
          ?.length
      ) {
        store.updateCustomMetadata(data.value.businessMetadataDefs[0])
      }
    }
  )

  return { data, error, isReady, update, reset }
}