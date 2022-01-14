import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

// Integration & IntegrationTypes
const getLicense = () => useAPI(map.GET_LICENSE, 'GET', {}, {})

export const Replicated = {
    getLicense,
}
