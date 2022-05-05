import { Ref, ref, watch } from 'vue'
import axios, { CancelTokenSource } from 'axios'
import { Tenant } from '~/services/service/tenant'

export default function uploadOrgLogo() {
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

    const { data, mutate, isReady, error } = Tenant.UploadLogo(
        formData,
        options.value
    )

    watch(data, () => {
        uploadKey.value = Date.now().toString()
    })

    const upload = async (imageData: any) => {
        const formDataObject = new FormData()
        formDataObject.append('image', imageData)
        formData.value = formDataObject

        await mutate()

    }

    return {
        upload,
        error,
        isReady,
        data,
        uploadKey,
    }
}
