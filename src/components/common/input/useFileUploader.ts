import { computed, ref, Ref } from 'vue'
// import { useAPI } from '~/services/api/useAPI';
import genericAPI from '~/services/api/generic'
import { message } from 'ant-design-vue'
import { getStringFromPath, genParams, keyIDs } from './asyncSelect.utils'

interface FileItem {
    uid: string
    name?: string
    status?: string
    response?: string
    url?: string
    preview?: string
    originFileObj?: any
    file: string | Blob
    type?: string
}

export default function useFileUploader(reqConfig, emit) {
    const fileList: Ref<FileItem> = ref([])
    const uploading = ref(false)
    const handleRemove = (file: FileItem) => {
        const index = fileList.value.indexOf(file)
        const newFileList = fileList.value.slice()
        newFileList.splice(index, 1)
        fileList.value = newFileList
    }

    const beforeUpload = (file: FileItem) => {
        if (file?.type === 'text/csv') {
            console.log("yes")
            fileList.value = [...fileList.value, file]
            return false
        }
    }


    const error = ref(false)
    const success = ref(false)
    const handleUpload = async () => {
        const { url, formDataFormat } = reqConfig.value
        const formData = new FormData()
        let parsedUrl = url
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        Object.entries(formDataFormat).forEach(([key, val]) => {
            if (val === '{{file}}')
                formData.append(key, fileList.value[0].originFileObj)
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
            fileList.value = []
            success.value = true
        } catch {
            error.value = true
        }
        uploading.value = false
    }

    const init = () => {}

    return {
        handleUpload,
        beforeUpload,
        handleRemove,
        init,
        uploading,
        fileList,
        error,
        success,
    }
}
