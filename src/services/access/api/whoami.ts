import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '../access_keyMaps'

interface WhoAmIResponse {
    permissions: string[]
    roles: {
        id: string
        name: string
    }[]
    userId: string
    uername: string
}

export const whoAmI = () => {
    return useAPIAsyncState<WhoAmIResponse>(KeyMaps.WHO_AM_I, 'GET', {})
}