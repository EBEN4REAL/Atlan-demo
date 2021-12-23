import { Ref, ref, watch } from 'vue'
import axios, { CancelTokenSource } from 'axios'

import { Avatar } from '~/services/service/avatar'

export default function uploadAvatar() {
    const cancelTokenSource: Ref<CancelTokenSource> = ref(
        axios.CancelToken.source()
    )
    const options = ref({
        options: {
            cancelToken: cancelTokenSource?.value.token,
        },
        asyncOptions: {
            immediate: false,
            revalidateOnFocus: false,
            dedupingInterval: 1,
            resetOnExecute: false,
        },
    })
    const formData = ref()

    const uploadKey = ref(Date.now().toString())

    const { data, mutate, isReady, error } = Avatar.Upload(
        formData,
        options.value
    )

    watch([data, isReady], () => {
        if (isReady?.value) {
            uploadKey.value = Date.now().toString()
        }
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
        refreshImage: mutate,
    }
}
