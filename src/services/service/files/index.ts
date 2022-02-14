/* eslint-disable import/prefer-default-export */
import {  ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const GetFile = (
    {id}: any,
    options?: useOptions
) => useAPI(map.GET_FILE, 'GET', {pathVariables: {id}}, {
    asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
})

const CreateFile = (editorValue) => {
    const body = new FormData()
    body.append('name', 'name')
    body.append('prefix', 'purpose_readme')
    body.append('force', false)
    body.append('excludePrefix', false)
    const htmlRaw = decodeURIComponent(editorValue)
    const fileHtml = new Blob([htmlRaw], { type: 'text/html' })
    body.append('file', fileHtml)
    return useAPI(map.CREATE_FILE, 'POST', {body}, {})
}

const UpdateFile = (editorValue, id) => {
    const body = new FormData()
    body.append('name', 'name')
    body.append('prefix', 'purpose_readme')
    body.append('force', false)
    body.append('excludePrefix', false)
    const htmlRaw = decodeURIComponent(editorValue)
    const fileHtml = new Blob([htmlRaw], { type: 'text/html' })
    body.append('file', fileHtml)
    return useAPI(map.UPDATE_FILE, 'POST', {body, pathVariables: {id}}, {})
}

export const Files = {
    GetFile,
    CreateFile,
    UpdateFile
}
