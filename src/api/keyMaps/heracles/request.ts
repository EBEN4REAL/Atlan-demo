import { getAPIPath } from '~/api'

export const LIST_REQUESTS = 'LIST_REQUESTS'
export const ACT_ON_REQUEST = 'ACT_ON_REQUEST'

const requestsMap: Record<string, (...params: any) => string> = {
    [LIST_REQUESTS]: () => getAPIPath('service', '/requests'),
    [ACT_ON_REQUEST]: ({ id }) =>
        getAPIPath('service', `/requests/${id}/action`),
}

export default requestsMap
