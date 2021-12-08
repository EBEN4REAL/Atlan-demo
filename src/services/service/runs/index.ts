import { useAPI } from '~/services/api/useAPI'
import { map } from './key'
import { LiveRunsResponse } from '~/types/workflow/runs.interface'

const getLiveRuns = ({ options, params }) =>
    useAPI<LiveRunsResponse>(
        map.RUN_LIST,
        'GET',
        {
            params,
        },
        options || {}
    )

export const Runs = {
    // List,
    getLiveRuns,
}
