import { getAPIPath } from '~/api'

export const GET_API_KEYS = 'GET_API_KEYS'
export const DELETE_API_KEY = 'DELETE_API_KEY'

const apiKeysMap: any = {
    [GET_API_KEYS]: () => getAPIPath('service', '/accesstokens'),
    [DELETE_API_KEY]: ({ id }: Record<string, string>) =>
        getAPIPath('service', `/accesstokens/${id}/delete`),
}

export default apiKeysMap
