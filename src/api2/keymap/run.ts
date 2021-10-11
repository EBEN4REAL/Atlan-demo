import { getAPIPath } from '~/api'

export const RUN_ARCHIVED_LIST = 'RUN_ARCHIVED_LIST'
export const RUN_STOP = 'RUN_STOP'

const runmap: Record<string, (...params: any) => string> = {
    [RUN_ARCHIVED_LIST]: () => getAPIPath('service', `/runs/archived`),
    [RUN_STOP]: ({ id }) => getAPIPath('service', `/runs/${id}/stop`),
}

export default runmap
