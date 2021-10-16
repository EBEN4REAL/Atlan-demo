import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import axios, { CancelTokenSource } from 'axios'
import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '~/api/keyMap'

export default function uploadOrgLogo() {
    const cancelTokenSource: Ref<CancelTokenSource> = ref(
        axios.CancelToken.source()
    )
    const options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
        resetOnExecute: false,
    })
    const formData = ref()

    const uploadKey = ref(Date.now().toString())

    const { data, mutate, isReady, error } = useAPIAsyncState(
        KeyMaps.auth.tenant.CREATE_LOGO,
        'POST',
        {
            body: formData,
            options,
        }
    )

    watch(data, () => {
        uploadKey.value = Date.now().toString()
    })
    const upload = (imageData: any) => {
        const formDataObject = new FormData()
        formDataObject.append('image', imageData)
        formData.value = formDataObject
        mutate()
    }

    return {
        upload,
        error,
        isReady,
        data,
        uploadKey,
    }
}
