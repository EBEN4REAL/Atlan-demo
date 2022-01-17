/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const GetFile = (
    body?: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.GET_FILE, 'GET', {}, {})

export const Files = {
    GetFile,
}
