
import { ref } from 'vue';

import { UPLOAD_IMAGE } from '~/api/keyMaps/auth/image';
import { useAPI } from '~/api/useAPIv2';

interface uploadImageData {
    id: string;
    version: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    file_name: string;
    raw_name: string;
    key: string;
    extension: string;
    content_type: string;
    file_size: number;
    is_encrypted: boolean;
    redirect_url: string;
    is_uploaded: boolean;
    uploaded_at: string;
    is_archived: boolean;
}


export default function useUploadImage() {

    let formData = ref();

    const { data, isLoading, error, mutate } = useAPI<uploadImageData>(UPLOAD_IMAGE, "POST", {
        cache: 'image',
        body: formData,
        dependantFetchingKey: formData
    })

    const upload = (image: File, name?: string) => {
        const formDataObject = new FormData();
        formDataObject.append("file", image)
        formDataObject.append("name", name ?? 'image')

        formData.value = formDataObject;
        mutate()
    };

    return {
        data,
        isLoading,
        error,
        upload
    }
}