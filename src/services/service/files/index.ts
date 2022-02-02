/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const GetFile = (
    {id, name}: any,
    options?: useOptions
) => useAPI(map.GET_FILE, 'GET', {pathVariables: {id, name}}, {})

const CreateFile = (body) => useAPI(map.CREATE_FILE, 'POST', {body}, {})

export const Files = {
    GetFile,
    CreateFile
}
