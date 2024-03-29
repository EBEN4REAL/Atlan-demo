/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const Upload = (body?: Ref<any>, options?: useOptions) =>
    useAPI(map.UPLOAD_AVATAR, 'POST', { body }, options || {})

export const Avatar = {
    Upload,
}
