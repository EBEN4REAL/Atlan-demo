import { ref } from 'vue'

import { Image } from '~/services/service/image/index'

export default function useUploadImage() {
    const formData = ref()

    const { data, isLoading, error, mutate, isReady } = Image.Upload(formData, {
        asyncOptions: { immediate: false },
    })

    const upload = async (image: File, name?: string) => {
        const formDataObject = new FormData()
        formDataObject.append('file', image)
        formDataObject.append('name', name ?? 'image')
        formData.value = formDataObject
        await mutate()
    }

    return {
        data,
        isLoading,
        error,
        upload,
        isReady,
    }
}
