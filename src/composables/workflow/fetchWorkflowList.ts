import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';
import { Workflows, URL } from '~/api/argo/workflow';

export default function fetchWorkflowList(dependent: any, paramsdefault: any) {
    const { data, error, mutate, isValidating } = useSWRV([URL.WorkflowList, paramsdefault.value, {}], () => {
        if (dependent.value) {
            return Workflows.List(paramsdefault.value);
        }
        else {
            return {}
        }
    }, {
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });
    const { state, STATES } = swrvState(data, error, isValidating);
    return {
        data,
        error,
        state,
        STATES,
        mutate
    }
}