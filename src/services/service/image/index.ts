/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'
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

const Upload = (body?: Ref<any>, options?: useOptions) =>
    useAPI<uploadImageData>(map.UPLOAD_IMAGE, 'POST', { body }, options || {})

export const Image = {
    Upload,
}
