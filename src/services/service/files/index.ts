/* eslint-disable import/prefer-default-export */
import {  ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const GetFile = (
    {id, name}: any,
    options?: useOptions
) => useAPI(map.GET_FILE, 'GET', {pathVariables: {id, name}}, {
    asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
})

const CreateFile = (body) => useAPI(map.CREATE_FILE, 'POST', {body}, {})

export const Files = {
    GetFile,
    CreateFile
}
