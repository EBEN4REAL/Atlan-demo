import { useAPI } from '~/services/api/useAPI'
import { map } from './key'
import { LiveRunsResponse } from '~/types/workflow/runs.interface'
import { useOptions } from '~/services/api/common'

const getLiveRuns = ({ options, params }) =>
    useAPI<LiveRunsResponse>(
        map.RUN_LIST,
        'GET',
        {
            params,
        },
        options || {}
    )

const getLiveRun = (pathVariables?, options?: useOptions) =>
    useAPI<LiveRunsResponse>(
        map.GET_RUN,
        'GET',
        {
            pathVariables,
        },
        options || {}
    )

export const Runs = {
    // List,
    getLiveRuns,
    getLiveRun,
}
