import { computed, ref, Ref } from 'vue'
// import { useAPI } from '~/services/api/useAPI';
import genericAPI from '~/services/api/generic'

export default function useShareSlack(reqConfig, emit, csvFile) {
    const uploading = ref(false)

    const error = ref(false)
    const success = ref(false)
    const handleUpload = async () => {
        const { url, formDataFormat } = reqConfig.value
        const formData = new FormData()
        let parsedUrl = url
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        Object.entries(formDataFormat).forEach(([key, val]) => {
            if (val === '{{file}}') formData.append(key, csvFile)
            else formData.append(key, val as string)
        })
        uploading.value = true
        try {
            success.value = false
            error.value = false
            const res = await genericAPI(
                parsedUrl,
                'POST',
                { body: formData },
                {
                    headers: {
                        'Content-Type': `multipart/form-data boundary=${formData._boundary}`,
                    },
                }
            )
            emit('change', res)

            success.value = true
        } catch {
            error.value = true
        }
        uploading.value = false
    }

    const init = () => {}

    return {
        handleUpload,
        init,
        uploading,
        error,
        success,
    }
}
